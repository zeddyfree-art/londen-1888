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
for (const f of lijst("art")) { if (/\.(jpg|png|webp|mp3)$/i.test(f)) { kopieer(f, f); bestanden.push(f); } }
/* lijst van aanwezige geluiden, zodat het spel alleen bestaande bestanden laadt */
const geluiden = lijst("art/geluid").filter(f => f.endsWith(".mp3")).map(f => path.basename(f, ".mp3")).sort();
fs.mkdirSync(path.join(site, "data"), { recursive: true });
fs.writeFileSync(path.join(site, "data/geluiden.json"), JSON.stringify(geluiden) + "\n"); bestanden.push("data/geluiden.json");
for (const f of lijst("app/icoon")) { const doel = f.replace(/^app\//, ""); kopieer(f, doel); bestanden.push(doel); }
kopieer("app/manifest.webmanifest", "manifest.webmanifest");

const kop = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#0d1416"><meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent"><meta name="apple-mobile-web-app-title" content="Londen 1888">
<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="icoon/icoon-180.png"><link rel="icon" href="icoon/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="icoon/favicon-32.png"><link rel="icon" type="image/png" sizes="192x192" href="icoon/icoon-192.png">
<style>:root{padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom)}body{margin:0}</style></head><body>`;
const html = kop + pagina + "</body></html>\n";
fs.writeFileSync(path.join(site, "index.html"), html);

const h = crypto.createHash("sha1").update(html);
for (const f of bestanden) h.update(f).update(fs.readFileSync(path.join(site, f)));
const versie = h.digest("hex").slice(0, 10);
const vooraf = ["./", "index.html", "manifest.webmanifest", ...bestanden.filter(f => !f.startsWith("art/"))];
fs.writeFileSync(path.join(site, "sw.js"), lees("app/sw.js").replace("__VERSIE__", versie).replace("__BESTANDEN__", JSON.stringify(vooraf)));
fs.writeFileSync(path.join(site, "_headers"), "/sw.js\n  Cache-Control: no-cache\n/index.html\n  Cache-Control: no-cache\n/data/*\n  Cache-Control: no-cache\n");
// Lore-boek: lore/*.md wordt site/lore/*.html
const loreDir = path.join(root, "lore");
if (fs.existsSync(loreDir)) {
  const esc = t => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = t => esc(t).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, href) => `<a href="${href.replace(/^README\.md$/, "index.html").replace(/\.md(#|$)/, ".html$1")}">${txt}</a>`);
  const md = src => {
    const out = []; let lijst = null, tabel = null, code = null, para = [];
    const flushPara = () => { if (para.length) { out.push(`<p>${inline(para.join(" "))}</p>`); para = []; } };
    const flush = () => { flushPara(); if (lijst) { out.push(`<${lijst.t}>${lijst.items.map(i => `<li>${i}</li>`).join("")}</${lijst.t}>`); lijst = null; }
      if (tabel) { out.push(`<div class="tabel"><table>${tabel.map((r, i) => `<tr>${r.map(c => i ? `<td>${inline(c)}</td>` : `<th>${inline(c)}</th>`).join("")}</tr>`).join("")}</table></div>`); tabel = null; } };
    for (const line of src.split("\n")) {
      if (code !== null) { if (line.startsWith("```")) { out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`); code = null; } else code.push(line); continue; }
      if (line.startsWith("```")) { flush(); code = []; continue; }
      let m;
      if (/^\|/.test(line)) { flushPara(); if (/^\|[-| :]+\|$/.test(line)) continue; (tabel ??= []).push(line.slice(1, -1).split("|").map(x => x.trim())); continue; }
      if ((m = line.match(/^(#{1,4}) (.*)/))) { flush(); const id = m[2].toLowerCase().replace(/[^a-z0-9à-ÿ]+/g, "-").replace(/^-|-$/g, ""); out.push(`<h${m[1].length} id="${id}">${inline(m[2])}</h${m[1].length}>`); continue; }
      if ((m = line.match(/^> (.*)/))) { flush(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
      if ((m = line.match(/^- (.*)/))) { flushPara(); if (!lijst || lijst.t !== "ul") { flush(); lijst = { t: "ul", items: [] }; } lijst.items.push(inline(m[1])); continue; }
      if ((m = line.match(/^\d+\. (.*)/))) { flushPara(); if (!lijst || lijst.t !== "ol") { flush(); lijst = { t: "ol", items: [] }; } lijst.items.push(inline(m[1])); continue; }
      if (!line.trim()) { flush(); continue; }
      if (lijst || tabel) flush();
      para.push(line.trim());
    }
    flush(); return out.join("\n");
  };
  const paginas = ["README", "wereld", "facties", "verhaallijnen", "personen", "tijdlijn", "helden", "plekken", "monsters", "artefacten-en-spreuken", "onheil"].filter(n => fs.existsSync(path.join(loreDir, n + ".md")));
  const titel = n => (fs.readFileSync(path.join(loreDir, n + ".md"), "utf8").match(/^# (.*)/m) || [, n])[1].replace("Lore-boek: ", "");
  fs.mkdirSync(path.join(site, "lore"), { recursive: true });
  const stijl = `:root{--bg:#e9eeec;--paper:#f6f8f7;--ink:#18242a;--muted:#56656b;--line:#c3cfcc;--accent:#23705f}
@media (prefers-color-scheme:dark){:root{--bg:#0d1416;--paper:#142024;--ink:#dde7e4;--muted:#93a5a3;--line:#2a3b3f;--accent:#5fbfa6;color-scheme:dark}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.6 "Alegreya Sans","Segoe UI",system-ui,sans-serif}
.kader{display:grid;grid-template-columns:240px minmax(0,1fr);gap:28px;max-width:1180px;margin:0 auto;padding:24px max(16px,env(safe-area-inset-right)) 60px max(16px,env(safe-area-inset-left))}
nav{position:sticky;top:80px;align-self:start;display:grid;gap:2px;font-size:15px}nav a{color:var(--ink);text-decoration:none;padding:6px 10px;border-left:3px solid transparent}
nav a[aria-current]{border-left-color:var(--accent);background:var(--paper);font-weight:700}nav .terug{margin-top:12px;color:var(--accent)}
nav .merk{font-family:"IM Fell English SC",Georgia,serif;font-size:22px;padding:0 10px 10px}
article{background:var(--paper);border:1px solid var(--line);padding:clamp(18px,4vw,44px);min-width:0}
h1,h2,h3,h4{font-family:"IM Fell English SC","Iowan Old Style",Georgia,serif;font-weight:400;line-height:1.2;text-wrap:balance}h1{font-size:clamp(30px,4vw,42px);margin-top:0}h2{font-size:27px;margin-top:34px;border-bottom:1px solid var(--line);padding-bottom:4px}h3{font-size:21px;margin-top:24px}
p,li{max-width:70ch}em{font-family:"IM Fell English",Georgia,serif;font-size:1.05em}a{color:var(--accent)}code{font-size:.9em;background:var(--bg);padding:1px 5px}
.tabel{overflow-x:auto}table{border-collapse:collapse;font-size:15px;margin:10px 0}th,td{border:1px solid var(--line);padding:6px 10px;text-align:left;vertical-align:top}
blockquote{margin:12px 0;padding:8px 14px;border-left:3px solid var(--accent);background:var(--bg)}pre{background:var(--bg);padding:12px;overflow-x:auto;font-size:13px}
.balk{position:sticky;top:0;z-index:5;display:flex;align-items:center;gap:16px;padding:10px max(16px,env(safe-area-inset-right)) 10px max(16px,env(safe-area-inset-left));padding-top:max(10px,env(safe-area-inset-top));background:var(--bg);border-bottom:1px solid var(--line)}
.terug-boven{display:inline-flex;align-items:center;min-height:44px;padding:8px 16px;border:1px solid var(--accent);color:var(--accent);font-weight:700;text-decoration:none;background:var(--paper)}.terug-boven:hover{background:var(--accent);color:var(--paper)}
.balk-titel{font-family:"IM Fell English SC",Georgia,serif;font-size:20px;color:var(--muted)}
@media (max-width:800px){.kader{grid-template-columns:1fr}nav{position:static;grid-auto-flow:row}}`;
  for (const n of paginas) {
    const doel = n === "README" ? "index" : n;
    const nav = paginas.map(x => `<a href="${x === "README" ? "index" : x}.html"${x === n ? ' aria-current="page"' : ""}>${esc(x === "README" ? "Inhoud" : titel(x))}</a>`).join("");
    const html = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(titel(n))} · Lore-boek Londen 1888</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IM+Fell+English+SC&family=IM+Fell+English:ital@0;1&family=Alegreya+Sans:wght@400;500;700&display=swap">
<link rel="icon" href="../icoon/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="../icoon/favicon-32.png"><style>${stijl}</style></head><body><header class="balk"><a class="terug-boven" href="../index.html">← Terug naar het spel</a><span class="balk-titel">Lore-boek</span></header><div class="kader"><nav><span class="merk">Lore-boek</span>${nav}<a class="terug" href="https://github.com/zeddyfree-art/londen-1888/tree/claude/charming-franklin-2x9p2x/lore">Bewerken op GitHub</a></nav>
<article>${md(fs.readFileSync(path.join(loreDir, n + ".md"), "utf8"))}</article></div></body></html>\n`;
    fs.writeFileSync(path.join(site, "lore", doel + ".html"), html);
  }
}
console.log(`Gebouwd: site/ (${bestanden.length + 4} bestanden, versie ${versie}) en dist/pagina.html`);
