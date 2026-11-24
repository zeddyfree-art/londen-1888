// Meet per gerucht hoe vaak de testspeler het op tijd haalt. Elk gerucht wordt in gewone potjes
// (stand normaal) aan het begin van ronde 2, 3 of 4 klaargezet, zoals een onheilskaart dat doet.
// De testspeler gaat erachteraan (de dichtstbijzijnde held; bij Aanwijzingen ophalen meer helden).
//
// Gebruik: node tools/bouw.js && node tools/meet-geruchten.js [potjes per gerucht en aantal helden, standaard 200] [extra rondes, standaard 0]
// Met extra rondes 1 meet je wat er gebeurt als elk gerucht een ronde langer duurt.
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
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const goden = lees("oude-goden.json").map(g => g.id), onheil = lees("onheil.json"), plekken = new Set(lees("bord.json").plekken.map(p => p.id));
const geruchten = onheil.flatMap(c => (c.acties || []).filter(a => a.type === "gerucht" && plekken.has(a.plek)).map(a => ({ id: c.id, naam: c.naam, god: c.god || null, actie: a })));

(async () => {
  const n = +(process.argv[2] || 200), extra = +(process.argv[3] || 0), PAGINAS = 4;
  await new Promise(r => server.listen(0, r));
  const browser = await chromium.launch();
  const opdrachten = [];
  for (const g of geruchten) for (const aantal of [2, 4]) for (let i = 0; i < n; i++) opdrachten.push({ g: g.id, aantal, god: g.god || goden[Math.floor(Math.random() * goden.length)], ronde: 2 + Math.floor(Math.random() * 3) });
  const uit = {};
  await Promise.all(Array.from({ length: PAGINAS }, async (_, p) => {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${server.address().port}/index.html`);
    await page.waitForFunction(() => window.__spel && window.__spel.D);
    await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, "testbot-strategie.js"), "utf8") });
    const mijn = opdrachten.filter((_, i) => i % PAGINAS === p);
    for (let i = 0; i < mijn.length; i += 100) {
      const blok = mijn.slice(i, i + 100).map(o => ({ ...o, gerucht: geruchten.find(x => x.id === o.g) }));
      const r = await page.evaluate(async ([blok, extra]) => {
        const helden = window.__spel.D.helden.filter(h => !h.uitbreiding).map(h => h.id), out = [];
        for (const o of blok) {
          window.__gerucht = { ronde: o.ronde, naam: "Testgerucht", actie: { ...o.gerucht.actie, rondes: o.gerucht.actie.rondes + extra } };
          try { const u = await window.__testbot(o.god, "normaal", helden.slice().sort(() => Math.random() - 0.5).slice(0, o.aantal)); out.push(u.gerucht); } catch (e) { out.push(null); }
        }
        window.__gerucht = null;
        return out;
      }, [blok, extra]);
      blok.forEach((o, j) => { if (r[j] == null) return; const k = `${o.g}|${o.aantal}`; (uit[k] ??= { gelukt: 0, n: 0 }); uit[k].n++; if (r[j] === "gelukt") uit[k].gelukt++; });
    }
  }));
  await browser.close(); server.close();
  const pct = (k) => uit[k] ? Math.round(100 * uit[k].gelukt / uit[k].n) + "%" : "–";
  console.log(`Geruchten, ${n} potjes per gerucht en aantal helden, normaal, ${extra ? `${extra} ronde extra` : "zoals in data/onheil.json"}\n`);
  console.log("| Gerucht | Opdracht | Rondes | 2 helden | 4 helden |"); console.log("|---|---|---|---|---|");
  const doel = a => ({ bezoek: `bezoek ${a.plek}`, ophalen: `${a.aantal} Aanwijzingen in ${a.plek}`, sluiten: `Scheur sluiten in ${a.plek}`, verslaan: `${a.id} verslaan in ${a.plek}` }[a.soort]);
  for (const g of geruchten) console.log(`| ${g.naam.replace("Gerucht: ", "")} | ${doel(g.actie)} | ${g.actie.rondes - 1 + extra} | ${pct(`${g.id}|2`)} | ${pct(`${g.id}|4`)} |`);
})();
