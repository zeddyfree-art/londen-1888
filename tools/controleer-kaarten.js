// Controleert alle kaarten op tikfouten: onbekende plekken, helden, personen, effecten en tests.
// Gebruik: node tools/controleer-kaarten.js
const fs = require("fs"), path = require("path");
const data = f => JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", f), "utf8"));
const bord = data("bord.json"), helden = data("helden.json"), personen = data("personen.json"), goden = data("oude-goden.json");
const toestanden = data("toestanden.json"), monsters = data("monsters.json");
const plekken = new Set([...bord.plekken.map(p => p.id), ...bord.overzee.map(o => o.id), "overal"]);
const heldIds = new Set(helden.map(h => h.id)), persoonIds = new Set(personen.map(p => p.id)), godIds = new Set(goden.map(g => g.id));
const toestIds = new Set(toestanden.map(t => t.id)), monsterIds = new Set(monsters.map(m => m.id));
const KENMERKEN = new Set(["kennis", "scherpte", "kracht", "overtuiging"]);
const LABEL = { kennis: "Kennis", scherpte: "Waarneming", kracht: "Kracht", overtuiging: "Charisma" };
const EFFECTEN = new Set(["pond", "lichaam", "geest", "aanwijzing", "trofee", "mist", "toestand", "verwijder", "waanzin", "monster", "scheur", "reis", "trek", "vlag", "wisVlag"]);
const TREK = new Set(["artefacten", "spreuken", "spullen", "bondgenoot", "dier"]);
const fouten = [], gezet = new Set(), nodig = new Map();
const fout = (id, t) => fouten.push(`${id}: ${t}`);

function effecten(id, lijst) {
  for (const e of lijst || []) {
    const [k, v] = Object.entries(e)[0];
    if (!EFFECTEN.has(k)) fout(id, `onbekend effect ${k}`);
    if ((k === "toestand" || k === "verwijder") && !toestIds.has(v)) fout(id, `onbekende toestand ${v}`);
    if (k === "trek" && !TREK.has(v)) fout(id, `onbekende trek ${v}`);
    if (k === "reis" && !plekken.has(v)) fout(id, `onbekende reis ${v}`);
    if (k === "vlag") gezet.add(v);
  }
}
function test(id, t, label) {
  if (!t) return;
  if (!KENMERKEN.has(t.kenmerk)) fout(id, `onbekend kenmerk ${t.kenmerk}`);
  if (!(t.moeilijkheid >= 4 && t.moeilijkheid <= 12)) fout(id, `vreemde moeilijkheid ${t.moeilijkheid}`);
  if (label && !label.includes(`(${LABEL[t.kenmerk]} ${t.moeilijkheid})`)) fout(id, `label "${label}" past niet bij de test`);
}
function kaart(k, soort) {
  const id = `${soort}/${k.id}`;
  if (k.plek && !plekken.has(k.plek)) fout(id, `onbekende plek ${k.plek}`);
  if (k.god && !godIds.has(k.god)) fout(id, `onbekende god ${k.god}`);
  if (k.persoon && !persoonIds.has(k.persoon)) fout(id, `onbekend persoon ${k.persoon}`);
  if (k.plek === "overal" && !k.vlag) fout(id, "een kaart voor overal heeft een vlag nodig");
  if (k.vlag) nodig.set(k.vlag, id);
  if (!k.tekst) fout(id, "geen tekst");
  if (k.keuzes) {
    for (const c of k.keuzes) {
      for (const h of c.held || []) if (!heldIds.has(h)) fout(id, `onbekende held ${h}`);
      if (c.test) { test(id, c.test, c.label); effecten(id, c.gelukt?.effect); effecten(id, c.mislukt?.effect); if (!c.gelukt?.tekst || !c.mislukt?.tekst) fout(id, "keuze zonder uitkomsttekst"); }
      else { effecten(id, c.effect); if (!c.tekst) fout(id, "keuze zonder tekst"); }
    }
    if (!k.keuzes.some(c => !c.held && !c.spul)) fout(id, "elke keuze vraagt een held of spul");
  } else if (k.test) { test(id, k.test); effecten(id, k.gelukt?.effect); effecten(id, k.mislukt?.effect); }
  else if (k.effect) effecten(id, k.effect);
  if (k.mislukt && !k.test && soort === "aanwijzing") effecten(id, k.mislukt.effect);
}
const ids = new Set();
for (const f of ["stad", "verhaal", "scheur", "aanwijzing", "expeditie"]) for (const k of data(`ontmoetingen/${f}.json`)) {
  if (ids.has(k.id)) fout(k.id, "dubbel id"); ids.add(k.id);
  if (f === "aanwijzing") { test(k.id, k.test); if (k.mislukt) effecten(k.id, k.mislukt.effect); } else kaart(k, f);
}
for (const o of data("onheil.json")) {
  for (const a of o.acties) {
    if (a.type === "vlag") gezet.add(a.vlag);
    if (a.plek && !plekken.has(a.plek)) fout(o.id, `onbekende plek ${a.plek}`);
    if (a.type === "monsterOp" && a.id && !monsterIds.has(a.id)) fout(o.id, `onbekend monster ${a.id}`);
    if (a.soort === "verslaan" && !monsterIds.has(a.id)) fout(o.id, `gerucht zonder bekend monster: ${a.id}`);
  }
  if (o.persoon && !persoonIds.has(o.persoon)) fout(o.id, `onbekend persoon ${o.persoon}`);
}
for (const [v, id] of nodig) if (!gezet.has(v)) fout(id, `geen kaart zet de vlag ${v}`);
console.log(fouten.length ? fouten.join("\n") : `Alle ${ids.size} ontmoetingen en de onheilskaarten zijn in orde.`);
process.exit(fouten.length ? 1 : 0);
