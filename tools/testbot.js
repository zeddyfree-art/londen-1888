// Laat de slimme testspeler honderden potjes spelen en meet de winkans.
// Gebruik: node tools/bouw.js && node tools/testbot.js [potjes per instelling, standaard 40]
// Experiment: DOELPLUS=1 node tools/testbot.js 100 (elke test 1 moeilijker, uitslag in ontwerp/balans-doelplus1.json)
// Vereist Playwright met Chromium.
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const root = path.join(__dirname, "..");
const site = path.join(root, "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown", ".jpg": "image/jpeg", ".png": "image/png", ".webmanifest": "application/manifest+json" };

const server = http.createServer((req, res) => {
  const p = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  if (!p.startsWith(site) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});

(async () => {
  const n = +(process.argv[2] || 40);
  await new Promise(r => server.listen(0, r));
  const url = `http://localhost:${server.address().port}/index.html`;
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const fouten = [];
  page.on("pageerror", e => fouten.push(e.message));
  page.on("console", m => { if (m.type() === "error" && !/404|Failed to load/.test(m.text())) fouten.push(m.text()); });
  await page.goto(url);
  await page.waitForFunction(() => window.__spel && window.__spel.D);
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
  /* experiment: DOELPLUS=1 maakt elke test 1 moeilijker; de uitslag gaat dan naar een apart bestand */
  const doelPlus = +(process.env.DOELPLUS || 0);
  await page.evaluate(v => { window.__doelPlus = v; }, doelPlus);
  /* MODUS=lang meet De Lange Nacht; de uitslag gaat dan naar ontwerp/balans-lang.json */
  const modus = process.env.MODUS || "gewoon";
  await page.evaluate(v => { window.__modus = v; }, modus);
  /* OUDEWERELD=1 meet met de uitbreiding Kaarten van de Oude Wereld; de uitslag gaat dan naar ontwerp/balans-oude-wereld.json */
  const ow = !!process.env.OUDEWERELD;
  await page.evaluate(v => { window.__oudeWereld = v; }, ow);

  const goden = process.env.GODEN ? process.env.GODEN.split(",") : JSON.parse(fs.readFileSync(path.join(root, "data", "oude-goden.json"), "utf8")).map(g => g.id);
  const standen = process.env.STANDEN ? process.env.STANDEN.split(",") : ["ontspannen", "normaal", "genadeloos"];
  /* BOTOW=0: de testspeler gaat met de uitbreiding niet vrijwillig op expeditie (alleen voor mysteries) */
  await page.evaluate(v => { window.__botOW = v; }, process.env.BOTOW !== "0");
  /* OUDEHELDEN=1: alleen de helden van het basisspel */
  await page.evaluate(v => { window.__oudeHelden = v; }, !!process.env.OUDEHELDEN);
  const rijen = [], mys = {};
  for (const god of goden) for (const stand of standen) for (const aantal of [2, 4]) {
    const uitslagen = await page.evaluate(async ([god, stand, aantal, n]) => {
      const helden = window.__spel.D.helden.filter(h => (window.__oudeWereld && !window.__oudeHelden) || !h.uitbreiding).map(h => h.id);
      const out = [];
      for (let i = 0; i < n; i++) {
        const gekozen = helden.slice().sort(() => Math.random() - 0.5).slice(0, aantal);
        try { out.push(await window.__testbot(god, stand, gekozen)); }
        catch (e) { out.push({ fout: String(e && e.stack || e) }); }
      }
      return out;
    }, [god, stand, aantal, n]);
    const ok = uitslagen.filter(u => !u.fout);
    for (const u of ok) { for (const m of u.opgelostNamen) (mys[m] ??= { opgelost: 0, vast: 0 }).opgelost++; if (u.vastOp) (mys[u.vastOp] ??= { opgelost: 0, vast: 0 }).vast++; }
    const tel = f => ok.filter(f).length;
    rijen.push({
      god, stand, helden: aantal, potjes: ok.length,
      winst: Math.round(100 * tel(u => u.einde === "winst" || u.einde === "nipt") / ok.length),
      nipt: Math.round(100 * tel(u => u.einde === "nipt") / ok.length),
      rondes: +(ok.reduce((s, u) => s + u.ronde, 0) / ok.length).toFixed(1),
      mysteries: +(ok.reduce((s, u) => s + u.opgelost, 0) / ok.length).toFixed(2),
      gevallen: +(ok.reduce((s, u) => s + u.gevallen, 0) / ok.length).toFixed(2),
      vast: tel(u => !u.einde),
      ow: ow ? Object.fromEntries(["expedities", "thuis", "rampen", "harten"].map(k => [k, +(ok.reduce((t, u) => t + (u.owTel?.[k] || 0), 0) / ok.length).toFixed(2)])) : undefined,
      fouten: uitslagen.filter(u => u.fout).map(u => u.fout.split("\n").slice(0, 2).join(" ")).slice(0, 2)
    });
    const r = rijen.at(-1);
    console.log(`${god.padEnd(12)} ${stand.padEnd(11)} ${aantal} helden: winst ${String(r.winst).padStart(3)}% (nipt ${r.nipt}%), ${r.rondes} rondes, ${r.mysteries} mysteries, ${r.gevallen} gevallen${r.vast ? `, ${r.vast} vast` : ""}${r.fouten.length ? "  FOUT: " + r.fouten[0] : ""}`);
  }
  fs.writeFileSync(path.join(root, "ontwerp", doelPlus ? `balans-doelplus${doelPlus}.json` : ow ? `balans-oude-wereld${modus === "lang" ? "-lang" : ""}.json` : modus === "lang" ? "balans-lang.json" : "balans.json"), JSON.stringify({ datum: new Date().toISOString().slice(0, 10), potjesPerInstelling: n, rijen }, null, 2) + "\n");
  console.log("\nPer mysterie (opgelost / bleef op hangen):");
  for (const [m, v] of Object.entries(mys)) console.log(`  ${m.padEnd(28)} ${v.opgelost} / ${v.vast}`);
  if (fouten.length) console.log("Paginafouten:", [...new Set(fouten)].slice(0, 5));
  await browser.close(); server.close();
})();
