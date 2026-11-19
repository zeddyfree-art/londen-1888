// Laat de slimme testspeler honderden potjes spelen en meet de winkans.
// Gebruik: node tools/bouw.js && node tools/testbot.js [potjes per instelling, standaard 40]
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

  const goden = ["vathrun", "azh-ilareth", "nebet-ankhu"];
  const standen = ["ontspannen", "normaal", "genadeloos"];
  const rijen = [], mys = {};
  for (const god of goden) for (const stand of standen) for (const aantal of [2, 4]) {
    const uitslagen = await page.evaluate(async ([god, stand, aantal, n]) => {
      const helden = window.__spel.D.helden.map(h => h.id);
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
      fouten: uitslagen.filter(u => u.fout).map(u => u.fout.split("\n").slice(0, 2).join(" ")).slice(0, 2)
    });
    const r = rijen.at(-1);
    console.log(`${god.padEnd(12)} ${stand.padEnd(11)} ${aantal} helden: winst ${String(r.winst).padStart(3)}% (nipt ${r.nipt}%), ${r.rondes} rondes, ${r.mysteries} mysteries, ${r.gevallen} gevallen${r.vast ? `, ${r.vast} vast` : ""}${r.fouten.length ? "  FOUT: " + r.fouten[0] : ""}`);
  }
  fs.writeFileSync(path.join(root, "ontwerp", "balans.json"), JSON.stringify({ datum: new Date().toISOString().slice(0, 10), potjesPerInstelling: n, rijen }, null, 2) + "\n");
  console.log("\nPer mysterie (opgelost / bleef op hangen):");
  for (const [m, v] of Object.entries(mys)) console.log(`  ${m.padEnd(28)} ${v.opgelost} / ${v.vast}`);
  if (fouten.length) console.log("Paginafouten:", [...new Set(fouten)].slice(0, 5));
  await browser.close(); server.close();
})();
