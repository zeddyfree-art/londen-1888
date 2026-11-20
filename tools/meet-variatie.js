// Meet hoeveel kaarten je per potje trekt en hoe vaak een kaart binnen één potje terugkomt.
// Gebruik: node tools/bouw.js && node tools/meet-variatie.js [potjes per instelling, standaard 100]
const http = require("http"), fs = require("fs"), path = require("path");
const { chromium } = require("playwright");
const root = path.join(__dirname, ".."), site = path.join(root, "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown", ".jpg": "image/jpeg", ".png": "image/png" };
const server = http.createServer((req, res) => {
  const p = path.join(site, decodeURIComponent(new URL(req.url, "http://x").pathname).replace(/\/$/, "/index.html"));
  if (!p.startsWith(site) || !fs.existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": TYPES[path.extname(p)] || "application/octet-stream" });
  fs.createReadStream(p).pipe(res);
});
(async () => {
  const n = +(process.argv[2] || 100);
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch(), page = await browser.newPage();
  await page.goto(`http://localhost:${server.address().port}/index.html`);
  await page.waitForFunction(() => window.__spel && window.__spel.D);
  await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
  console.log("God          helden  overig/potje herhaald  verhaal/potje  herhaald  onheil/potje  van stapel");
  for (const god of ["vathrun", "azh-ilareth", "nebet-ankhu"]) for (const aantal of [2, 4]) {
    const r = await page.evaluate(async ([god, aantal, n]) => {
      const D = window.__spel.D, verhaal = new Set(D.o_verhaal.map(k => k.id));
      const stapel = D.onheil.filter(o => !o.god || o.god === god).length;
      const t = { stad: 0, stadDubbel: 0, verhaal: 0, verhaalDubbel: 0, onheil: 0 };
      let ok = 0;
      for (let i = 0; i < n; i++) {
        const helden = D.helden.map(h => h.id).sort(() => Math.random() - 0.5).slice(0, aantal);
        try { await window.__testbot(god, "normaal", helden); } catch { continue; }
        const S = window.__spel.S, gezien = new Set();
        for (const id of S.gespeeld || []) {
          const soort = verhaal.has(id) ? "verhaal" : "stad";
          t[soort]++; if (gezien.has(id)) t[soort + "Dubbel"]++; gezien.add(id);
        }
        t.onheil += Math.max(0, S.ronde - 1);
        ok++;
      }
      return { ok, stapel, ...t };
    }, [god, aantal, n]);
    const pct = (a, b) => b ? Math.round(100 * a / b) + "%" : "-";
    console.log(`${god.padEnd(12)} ${aantal}       ${(r.stad / r.ok).toFixed(1).padStart(5)}      ${pct(r.stadDubbel, r.stad).padStart(4)}      ${(r.verhaal / r.ok).toFixed(1).padStart(5)}        ${pct(r.verhaalDubbel, r.verhaal).padStart(4)}      ${(r.onheil / r.ok).toFixed(1).padStart(5)}       ${pct(r.onheil / r.ok, r.stapel)} van ${r.stapel}`);
  }
  await browser.close(); server.close();
})();
