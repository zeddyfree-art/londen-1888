// Vult een HTML-sjabloon met alle speldata: node tools/maak-bijbel.js <sjabloon> <uitvoer>
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const D = { bord: lees("bord.json"), helden: lees("helden.json"), goden: lees("oude-goden.json"), monsters: lees("monsters.json"),
  epische: lees("epische-monsters.json"), spullen: lees("spullen.json"), spreuken: lees("spreuken.json"), artefacten: lees("artefacten.json"),
  toestanden: lees("toestanden.json"), onheil: lees("onheil.json"), regels: fs.readFileSync(path.join(root, "ontwerp/spelregels.md"), "utf8") };
const [sjabloon, uit] = process.argv.slice(2);
fs.writeFileSync(uit, fs.readFileSync(sjabloon, "utf8").replace("__DATA__", JSON.stringify(D).replace(/</g, "\\u003c")));
