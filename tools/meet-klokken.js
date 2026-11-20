// Meet de Klokken van Westminster: de winkans zonder klokken (per god, stand en aantal helden)
// en het effect van elke klok apart (op de normale stand). Schrijft data/klokken.json, dat het spel
// gebruikt voor de dreigingsmeter en de score.
// Gebruik: node tools/bouw.js && node tools/meet-klokken.js [potjes per instelling, standaard 60]
// Controle van combinaties: node tools/meet-klokken.js 60 --controle
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
const GODEN = ["vathrun", "azh-ilareth", "nebet-ankhu"], STANDEN = ["ontspannen", "normaal", "genadeloos"];
/* logit met een kleine correctie, zodat 0% en 100% eindig blijven */
const logit = (w, n) => Math.log((w + 0.5) / (n - w + 0.5));

(async () => {
  const n = +(process.argv[2] || 60), controle = process.argv.includes("--controle");
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/index.html`);
  await page.waitForFunction(() => window.__spel && window.__spel.D);
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
  const speel = (god, stand, aantal, klokken, n) => page.evaluate(async ([god, stand, aantal, klokken, n]) => {
    window.__klokken = klokken;
    const helden = window.__spel.D.helden.map(h => h.id); let w = 0, k = 0;
    for (let i = 0; i < n; i++) {
      const gekozen = helden.slice().sort(() => Math.random() - 0.5).slice(0, aantal);
      try { const u = await window.__testbot(god, stand, gekozen); k++; if (u.einde === "winst" || u.einde === "nipt") w++; } catch (e) {}
    }
    window.__klokken = [];
    return { w, n: k };
  }, [god, stand, aantal, klokken, n]);

  const bestand = path.join(root, "data", "klokken.json");
  if (controle) {
    /* vergelijk het model met echte potjes voor een paar combinaties */
    const model = JSON.parse(fs.readFileSync(bestand, "utf8"));
    const combis = [["dikke-mist", "lege-zakken", "zwijgende-getuigen"], ["taaie-wezens", "huiveringwekkend", "geen-tweede-worp"], ["zware-benen", "ongeduldige-god"], model.klokken.map(k => k.id)];
    for (const c of combis) for (const stand of STANDEN) {
      let w = 0, t = 0, verwacht = 0;
      for (const god of GODEN) for (const aantal of [2, 4]) {
        const r = await speel(god, stand, aantal, c, n); w += r.w; t += r.n;
        const b = model.basis[god][stand][aantal];
        const l = Math.log(b / (1 - b)) + c.reduce((s, id) => s + (stand === "genadeloos" && id === "geen-genade" ? 0 : model.klokken.find(k => k.id === id).logit), 0);
        verwacht += r.n / (1 + Math.exp(-l));
      }
      console.log(`${c.length > 5 ? "alle 13" : c.join(" + ")} · ${stand}: gemeten ${Math.round(100 * w / t)}%, model ${Math.round(100 * verwacht / t)}%`);
    }
    await browser.close(); server.close(); return;
  }

  /* --alleen=a,b: meet alleen deze klokken opnieuw, met de bewaarde basis */
  const alleen = (process.argv.find(x => x.startsWith("--alleen=")) || "").slice(9).split(",").filter(Boolean);
  const oud = alleen.length ? JSON.parse(fs.readFileSync(bestand, "utf8")) : null;
  const basis = {}, basisRuw = {};
  for (const god of GODEN) for (const stand of STANDEN) for (const aantal of [2, 4]) {
    if (oud) { const b = oud.basis[god][stand][aantal]; ((basisRuw[god] ??= {})[stand] ??= {})[aantal] = oud.basisRuw?.[god]?.[stand]?.[aantal] || { w: Math.round(b * oud.potjesPerInstelling), n: oud.potjesPerInstelling }; ((basis[god] ??= {})[stand] ??= {})[aantal] = b; continue; }
    const r = await speel(god, stand, aantal, [], n);
    ((basis[god] ??= {})[stand] ??= {})[aantal] = +((r.w + 0.5) / (r.n + 1)).toFixed(3);
    ((basisRuw[god] ??= {})[stand] ??= {})[aantal] = r;
    process.stdout.write(".");
  }
  console.log("\nbasis gemeten");
  const KLOK = await page.evaluate(() => window.__spel.KLOKKEN.map(k => k.id));
  const klokken = oud ? oud.klokken : [];
  for (const id of KLOK) {
    if (oud && !alleen.includes(id)) continue;
    let som = 0, w0 = 0, w1 = 0, t = 0;
    for (const god of GODEN) for (const aantal of [2, 4]) {
      const r = await speel(god, "normaal", aantal, [id], n);
      const b = basisRuw[god].normaal[aantal];
      som += logit(r.w, r.n) - logit(b.w, b.n); w0 += b.w; w1 += r.w; t += r.n;
    }
    const delta = som / 6;
    if (oud) klokken.splice(klokken.findIndex(k => k.id === id), 1);
    klokken.push({ id, logit: +delta.toFixed(3), normaalZonder: Math.round(100 * w0 / t), normaalMet: Math.round(100 * w1 / t) });
    console.log(`${id.padEnd(20)} normaal ${Math.round(100 * w0 / t)}% -> ${Math.round(100 * w1 / t)}%  (logit ${delta.toFixed(2)})`);
  }
  fs.writeFileSync(bestand, JSON.stringify({ datum: new Date().toISOString().slice(0, 10), potjesPerInstelling: oud ? oud.potjesPerInstelling : n, basis, basisRuw, klokken: KLOK.map(id => klokken.find(k => k.id === id)) }, null, 2) + "\n");
  console.log("geschreven: data/klokken.json");
  await browser.close(); server.close();
})();
