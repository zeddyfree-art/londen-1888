// Bouwt de speelbare app: index.html (los te openen via een webserver) en dist/pagina.html (voor de online versie).
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => fs.readFileSync(path.join(root, f), "utf8");
const pagina = lees("app/pagina.html").replace("/*STIJL*/", () => lees("app/stijl.css")).replace("/*SPEL*/", () => lees("app/spel.js"));
fs.mkdirSync(path.join(root, "dist"), { recursive: true });
fs.writeFileSync(path.join(root, "dist/pagina.html"), pagina);
const kop = '<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="apple-mobile-web-app-capable" content="yes"></head><body>';
fs.writeFileSync(path.join(root, "index.html"), kop + pagina + "</body></html>\n");
console.log("Gebouwd: index.html en dist/pagina.html");
