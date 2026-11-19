// Bouwt de app:
//   site/            de webapp voor Cloudflare Pages (of een andere host): index.html, data, art, iconen, offline-ondersteuning
//   dist/pagina.html de versie voor de online Claude-pagina
// Gebruik: node tools/bouw.js
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const root = path.join(__dirname, "..");
const lees = f => fs.readFileSync(path.join(root, f), "utf8");
const pagina = lees("app/pagina.html").replace("/*STIJL*/", () => lees("app/stijl.css")).replace("/*SPEL*/", () => lees("app/spel.js"));

fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/pagina.html"), pagina);

const site = path.join(root, "site");
fs.rmSync(site, { recursive: true, force: true });
const kopieer = (van, naar) => { fs.mkdirSync(path.dirname(path.join(site, naar)), { recursive: true }); fs.copyFileSync(path.join(root, van), path.join(site, naar)); };
const lijst = dir => fs.existsSync(path.join(root, dir)) ? fs.readdirSync(path.join(root, dir), { recursive: true }).map(f => path.join(dir, f)).filter(f => fs.statSync(path.join(root, f)).isFile()) : [];

const bestanden = [];
for (const f of lijst("data")) { kopieer(f, f); bestanden.push(f); }
for (const f of lijst("art")) { if (/\.(jpg|png|webp)$/i.test(f)) { kopieer(f, f); bestanden.push(f); } }
for (const f of lijst("app/icoon")) { const doel = f.replace(/^app\//, ""); kopieer(f, doel); bestanden.push(doel); }
kopieer("app/manifest.webmanifest", "manifest.webmanifest");

const kop = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0d1416"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Londen 1888">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icoon/icoon-180.png"><link rel="icon" href="icoon/icoon-192.png">
<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0}</style></head><body>`;
const html = kop + pagina + "</body></html>\n";
fs.writeFileSync(path.join(site, "index.html"), html);

const versie = crypto.createHash("sha1").update(html + bestanden.join()).digest("hex").slice(0, 10);
const vooraf = ["./", "index.html", "manifest.webmanifest", ...bestanden.filter(f => !f.startsWith("art/"))];
fs.writeFileSync(path.join(site, "sw.js"), lees("app/sw.js").replace("__VERSIE__", versie).replace("__BESTANDEN__", JSON.stringify(vooraf)));
fs.writeFileSync(path.join(site, "_headers"), "/sw.js\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n/data/*\n  Cache-Control: no-cache\n");
console.log(`Gebouwd: site/ (${bestanden.length + 4} bestanden, versie ${versie}) en dist/pagina.html`);
