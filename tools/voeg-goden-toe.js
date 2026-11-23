// Voegt de bundels in ontwerp/goden/*.json samen met de speldata.
// Een bundel bevat alles van één oude god: de god zelf, het epische monster, monsters, personen,
// verhaal-, scheur-, aanwijzing- en expeditiekaarten en onheilskaarten.
// Bestaande kaarten met hetzelfde id worden vervangen, dus het script mag vaker draaien.
// Gebruik: node tools/voeg-goden-toe.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const map = path.join(root, "ontwerp", "goden");
const DOELEN = {
  god: "data/oude-goden.json",
  episch: "data/epische-monsters.json",
  monsters: "data/monsters.json",
  personen: "data/personen.json",
  verhaal: "data/ontmoetingen/verhaal.json",
  scheur: "data/ontmoetingen/scheur.json",
  aanwijzing: "data/ontmoetingen/aanwijzing.json",
  expeditie: "data/ontmoetingen/expeditie.json",
  onheil: "data/onheil.json"
};
const data = Object.fromEntries(Object.entries(DOELEN).map(([k, f]) => [k, JSON.parse(fs.readFileSync(path.join(root, f), "utf8"))]));
const zet = (lijst, item) => { const i = lijst.findIndex(x => x.id === item.id); if (i >= 0) lijst[i] = item; else lijst.push(item); };

const bundels = fs.readdirSync(map).filter(f => f.endsWith(".json")).sort();
for (const f of bundels) {
  const b = JSON.parse(fs.readFileSync(path.join(map, f), "utf8"));
  const god = b.god.id;
  zet(data.god, b.god);
  zet(data.episch, { ...b.episch, oudegod: god });
  for (const m of b.monsters || []) zet(data.monsters, m);
  for (const p of b.personen || []) zet(data.personen, { ...p, god });
  for (const soort of ["verhaal", "scheur", "aanwijzing", "expeditie", "onheil"]) for (const k of b[soort] || []) zet(data[soort], { ...k, god });
  console.log(`${god}: ${(b.verhaal || []).length} verhaal, ${(b.scheur || []).length} scheur, ${(b.aanwijzing || []).length} aanwijzing, ${(b.onheil || []).length} onheil, ${(b.expeditie || []).length} expeditie, ${(b.monsters || []).length} monsters, ${(b.personen || []).length} personen`);
}
for (const [k, f] of Object.entries(DOELEN)) fs.writeFileSync(path.join(root, f), JSON.stringify(data[k], null, 2) + "\n");

/* controle: alles waar een god naar verwijst, moet bestaan */
const fouten = [];
const plekken = new Set([...JSON.parse(fs.readFileSync(path.join(root, "data/bord.json"), "utf8")).plekken.map(p => p.id), "thebe", "himalaya", "yucatan", "overal"]);
const monsterIds = new Set([...data.monsters, ...data.episch].map(m => m.id));
const personen = new Set(data.personen.map(p => p.id));
const helden = new Set(JSON.parse(fs.readFileSync(path.join(root, "data/helden.json"), "utf8")).map(h => h.id));
const toestanden = new Set(JSON.parse(fs.readFileSync(path.join(root, "data/toestanden.json"), "utf8")).map(t => t.id));
for (const soort of ["verhaal", "scheur", "expeditie"]) for (const k of data[soort]) for (const c of k.keuzes || []) {
  for (const h of c.held || []) if (!helden.has(h)) fouten.push(`${k.id}: held ${h} bestaat niet`);
  for (const e of [...(c.effect || []), ...(c.gelukt?.effect || []), ...(c.mislukt?.effect || [])]) for (const t of [e.toestand, e.verwijder].filter(Boolean)) if (!toestanden.has(t)) fouten.push(`${k.id}: toestand ${t} bestaat niet`);
}
for (const g of data.god) {
  for (const m of g.monsters) if (!monsterIds.has(m)) fouten.push(`${g.id}: monster ${m} bestaat niet`);
  if (!monsterIds.has(g.episch)) fouten.push(`${g.id}: episch ${g.episch} bestaat niet`);
  for (const m of g.mysteries) for (const p of [m.plek, m.van, m.naar, ...(m.minstensEen || [])].filter(Boolean)) if (!plekken.has(p)) fouten.push(`${g.id}: mysterie ${m.naam} plek ${p}`);
}
for (const soort of ["verhaal", "expeditie", "onheil"]) for (const k of data[soort]) {
  if (k.plek && !plekken.has(k.plek)) fouten.push(`${k.id}: plek ${k.plek}`);
  if (k.persoon && !personen.has(k.persoon)) fouten.push(`${k.id}: persoon ${k.persoon}`);
}
const ids = {};
for (const [soort, lijst] of Object.entries(data)) for (const x of lijst) { const s = `${soort}:${x.id}`; if (ids[s]) fouten.push(`dubbel id ${s}`); ids[s] = 1; }
if (fouten.length) { console.log("FOUTEN:\n" + fouten.join("\n")); process.exitCode = 1; } else console.log("Alles klopt.");
