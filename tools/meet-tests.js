// Meet hoe tests uitpakken: hoe vaak ze lukken, hoeveel het kenmerk uitmaakt en hoeveel de dobbelstenen.
// Gebruik: node tools/bouw.js && node tools/meet-tests.js [potjes per instelling, standaard 30]
// Schrijft ontwerp/tests.json en drukt een samenvatting af. Vereist Playwright met Chromium.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
const site = path.join(root, "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  if (!p.startsWith(site) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

/* 2d6: kans om minstens n te gooien */
const P2D6 = n => { let k = 0; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b >= n) k++; return k / 36; };
const soortVan = t => /^Gevecht/.test(t) ? "Gevecht" : /^Gruwel/.test(t) ? "Gruwel (Geest)" : /^Verbanning/.test(t) ? "Verbanning (spreuk)"
  : /^(Wat doe je\?|Doorzetten|Een spoor volgen)$/.test(t) ? "Ontmoeting" : /Scheur sluiten/.test(t) ? "Scheur sluiten"
  : /^(Aanval op|De blik van)/.test(t) ? "Laatste nacht" : /^(Studeren|In de salon|Een extra nummer|Afkicken|Een portret|Lezen in)/.test(t) ? "Dienst"
  : /^Zoek /.test(t) || /weg terug/.test(t) ? "Overig" : "Mysterie of spreuk";

(async () => {
  const n = +(process.argv[2] || 30);
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/index.html`);
  await page.waitForFunction(() => window.__spel && window.__spel.D);
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
  /* experiment: DOELPLUS=1 maakt elke test 1 moeilijker; de uitslag gaat dan naar een apart bestand */
  const doelPlus = +(process.env.DOELPLUS || 0);
  await page.evaluate(v => { window.__doelPlus = v; }, doelPlus);

  const alle = [], perStand = {};
  for (const god of JSON.parse(fs.readFileSync(path.join(root, "data", "oude-goden.json"), "utf8")).map(g => g.id)) for (const stand of ["ontspannen", "normaal", "genadeloos"]) for (const aantal of [2, 4]) {
    const r = await page.evaluate(async ([god, stand, aantal, n]) => {
      const helden = window.__spel.D.helden.map(h => h.id), tests = [], potjes = [];
      for (let i = 0; i < n; i++) {
        window.__testlog = [];
        const gekozen = helden.slice().sort(() => Math.random() - 0.5).slice(0, aantal);
        try { const u = await window.__testbot(god, stand, gekozen); potjes.push(u.einde === "winst" || u.einde === "nipt"); tests.push(...window.__testlog.map(t => ({ ...t, stand }))); } catch (e) {}
      }
      window.__testlog = null;
      return { tests, potjes };
    }, [god, stand, aantal, n]);
    alle.push(...r.tests);
    (perStand[stand] ??= { potjes: 0, tests: 0 }).potjes += r.potjes.length; perStand[stand].tests += r.tests.length;
    process.stdout.write(".");
  }
  console.log(`\n${alle.length} tests gemeten\n`);

  const pct = (a, b) => b ? Math.round(100 * a / b) : 0;
  const groep = (f) => { const g = {}; for (const t of alle) { const k = f(t); (g[k] ??= []).push(t); } return g; };
  const rij = ts => ({ aantal: ts.length, eersteWorp: pct(ts.filter(t => t.eerste >= t.doel).length, ts.length), naHerworp: pct(ts.filter(t => t.gelukt).length, ts.length) });

  const uit = { datum: new Date().toISOString().slice(0, 10), potjesPerInstelling: n, totaal: alle.length };
  uit.perStand = Object.fromEntries(Object.entries(groep(t => t.stand)).map(([k, ts]) => [k, { ...rij(ts), perPotje: +(ts.length / perStand[k].potjes).toFixed(1) }]));
  uit.perSoort = Object.fromEntries(Object.entries(groep(t => soortVan(t.titel))).map(([k, ts]) => [k, { ...rij(ts), gemDoel: +(ts.reduce((s, t) => s + t.doel, 0) / ts.length).toFixed(1), gemPlus: +(ts.reduce((s, t) => s + t.kw, 0) / ts.length).toFixed(1) }]).sort((a, b) => b[1].aantal - a[1].aantal));
  uit.perKenmerkwaarde = Object.fromEntries(Object.entries(groep(t => Math.min(t.waarde, 5))).map(([k, ts]) => [k, rij(ts)]));
  /* marge = plus - doel: wat je met 2d6 nog moet gooien is doel - plus */
  uit.perMarge = Object.fromEntries(Object.entries(groep(t => Math.max(-10, Math.min(2, t.kw - t.doel)))).sort((a, b) => a[0] - b[0]).map(([k, ts]) => [k, { ...rij(ts), theorie2d6: Math.round(100 * P2D6(-k)) }]));

  /* Hoeveel bepaalt het kenmerk en hoeveel de dobbelsteen? Variantie van de uitslag (totaal - doel) bij de eerste worp. */
  const v = xs => { const m = xs.reduce((s, x) => s + x, 0) / xs.length; return xs.reduce((s, x) => s + (x - m) ** 2, 0) / xs.length; };
  const tweeSt = alle.filter(t => t.stenen === 2);
  const varWaarde = v(tweeSt.map(t => t.waarde)), varBonus = v(tweeSt.map(t => t.kw - t.waarde)), varPlus = v(tweeSt.map(t => t.kw)), varDoel = v(tweeSt.map(t => t.doel)), varDoelMinPlus = v(tweeSt.map(t => t.kw - t.doel)), varSteen = v(tweeSt.map(t => t.eerste - t.kw));
  uit.variantie = { kenmerkwaarde: +varWaarde.toFixed(2), bonussen: +varBonus.toFixed(2), plusTotaal: +varPlus.toFixed(2), doel: +varDoel.toFixed(2), plusMinDoel: +varDoelMinPlus.toFixed(2), dobbelstenen: +varSteen.toFixed(2),
    aandeelDobbel: pct(varSteen, varSteen + varDoelMinPlus), aandeelKenmerkEnDoel: pct(varDoelMinPlus, varSteen + varDoelMinPlus) };
  /* Hoe vaak keren de stenen de verwachting om? Verwachting = plus + 7 (gemiddelde 2d6) tegen het doel. */
  const omgekeerd = tweeSt.filter(t => (t.kw + 7 >= t.doel) !== (t.eerste >= t.doel)).length;
  uit.dobbelKeertOm = pct(omgekeerd, tweeSt.length);
  uit.zekerOfKansloos = { altijdGelukt: pct(tweeSt.filter(t => t.kw + 2 >= t.doel).length, tweeSt.length), kansloos: pct(tweeSt.filter(t => t.kw + 12 < t.doel).length, tweeSt.length) };
  uit.herworpen = { gebruikt: pct(alle.filter(t => t.herworpen).length, alle.length), gered: pct(alle.filter(t => t.herworpen && t.gelukt && t.eerste < t.doel).length, alle.filter(t => t.eerste < t.doel).length) };
  fs.writeFileSync(path.join(root, "ontwerp", doelPlus ? `tests-doelplus${doelPlus}.json` : "tests.json"), JSON.stringify(uit, null, 2) + "\n");
  console.log(JSON.stringify(uit, null, 2));
  await browser.close(); server.close();
})();
