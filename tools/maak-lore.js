// Genereert de lore-pagina's die uit de speldata komen, plus de inhoudsopgave.
// Handgeschreven pagina's (wereld, facties, verhaallijnen, tijdlijn) blijven ongemoeid.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const schrijf = (f, t) => fs.writeFileSync(path.join(root, "lore", f), t.trim() + "\n");
const KN = { kennis: "Kennis", scherpte: "Waarneming", kracht: "Kracht", overtuiging: "Charisma" };
const helden = lees("helden.json"), personen = lees("personen.json"), bord = lees("bord.json"), goden = lees("oude-goden.json");
const monsters = lees("monsters.json"), epische = lees("epische-monsters.json"), artefacten = lees("artefacten.json"), spreuken = lees("spreuken.json");
const verhaal = lees("ontmoetingen/verhaal.json"), stad = lees("ontmoetingen/stad.json");
const gen = "*Deze pagina wordt gegenereerd uit de speldata (`tools/maak-lore.js`). Pas de data aan, niet deze pagina.*";
const godNaam = id => goden.find(g => g.id === id)?.naam || "Alle verhalen";

schrijf("personen.md", `# Personen

${gen}

De vaste personages die in de verhaalkaarten terugkomen.

${personen.map(p => {
  const kaarten = [...verhaal, ...stad].filter(k => k.persoon === p.id).length;
  return `## ${p.naam}

**${p.rol}** · factie: ${p.factie} · verhaal: ${godNaam(p.god)} · komt voor op ${kaarten} kaart${kaarten === 1 ? "" : "en"}

*${p.kort}*

${p.beschrijving}`;
}).join("\n\n")}`);

schrijf("helden.md", `# Helden

${gen}

${helden.map(h => `## ${h.naam}${h.bijnaam ? ` (${h.bijnaam})` : ""}

**${h.rol}** · ${h.leeftijd} jaar · ${h.beroep} · begint in ${h.start}

${h.achtergrond}

| Kennis | Waarneming | Kracht | Charisma | Lichaam | Geest |
|---|---|---|---|---|---|
| ${h.kenmerken.kennis} | ${h.kenmerken.scherpte} | ${h.kenmerken.kracht} | ${h.kenmerken.overtuiging} | ${h.lichaam} | ${h.geest} |

- **${h.vermogen.naam}.** ${h.vermogen.tekst}
${h.bondgenoot ? `- **${h.bondgenoot.naam}** (${h.bondgenoot.soort}). ${h.bondgenoot.tekst}\n` : ""}- **Eigenaardigheid:** ${h.eigenaardigheid}
- **Uitrusting:** ${h.uitrusting.join(", ")}`).join("\n\n")}`);

const DL = { sterrenwacht: "Sterrenwacht", seance: "Seance", station: "Station", bibliotheek: "Bibliotheek", "occulte-boekwinkel": "Occulte boekwinkel", salon: "Salon", markt: "Markt", theater: "Theater", club: "Club", universiteit: "Universiteit", ziekenhuis: "Ziekenhuis en bank", gaarkeuken: "Gaarkeuken", logementen: "Logementen", politie: "Politie", kerk: "Abdij", kunstenaars: "Ateliers", haven: "Haven", rivierpolitie: "Rivierpolitie" };
schrijf("plekken.md", `# Plekken

${gen}

## Londen

${bord.plekken.map(p => {
  const algemeen = stad.filter(k => k.plek === p.id).length, verh = verhaal.filter(k => k.plek === p.id);
  return `### ${p.naam}

*${p.sfeer}*

- **Dienst (${DL[p.dienst] || p.dienst}):** ${bord.diensten[p.dienst]}
- ${p.rivier ? "Aan de Theems. " : ""}${["marylebone", "kings-cross", "city", "westminster"].includes(p.id) ? "Station van de Ondergrondse. " : ""}${algemeen} algemene ontmoetingen${verh.length ? `, verhaalkaarten: ${verh.map(k => godNaam(k.god)).join(", ")}` : ""}.`;
}).join("\n\n")}

## Overzee

${bord.overzee.map(o => `### ${o.naam}

*${o.sfeer}*

Bereikbaar vanaf St Katharine Docks met een bootkaartje van ${o.kosten} Pond.`).join("\n\n")}`);

schrijf("monsters.md", `# Monsters

${gen}

## Epische monsters

${epische.map(m => `### ${m.naam}

Hoort bij **${godNaam(m.oudegod)}**. Gruwel ${m.gruwel} · Taaiheid ${m.taaiheid} · Schade ${m.schade} · Leven ${m.leven}

${m.eigenschap}`).join("\n\n")}

## Monsters

| Monster | Gruwel | Taaiheid | Schade | Leven | Bijzonder | Bij welke god |
|---|---|---|---|---|---|---|
${monsters.map(m => `| ${m.naam} | ${m.gruwel} | ${m.taaiheid} | ${m.schade} | ${m.leven} | ${m.eigenschap} | ${goden.filter(g => g.monsters.includes(m.id)).map(g => g.naam).join(", ")} |`).join("\n")}`);

schrijf("artefacten-en-spreuken.md", `# Artefacten en spreuken

${gen}

## Artefacten

${artefacten.map(a => `### ${a.naam}

*${a.herkomst}.*

${a.tekst}`).join("\n\n")}

## Spreuken

| Spreuk | Soort | Test | Prijs | Effect |
|---|---|---|---|---|
${spreuken.map(s => `| ${s.naam} | ${s.soort} | ${KN[s.test]} ${s.moeilijkheid} | ${s.prijs} | ${s.tekst} |`).join("\n")}`);

schrijf("README.md", `# Lore-boek: Londen 1888

Alles over de wereld van ons spel: wat er aan de hand is, wie erbij betrokken is en waar het zich afspeelt. Dit boek is de bron voor de kaarten. Verandert er hier iets, dan passen we de kaarten erop aan.

## Inhoud

| Pagina | Wat erin staat |
|---|---|
| [De wereld](wereld.md) | Londen in 1888, wat er ontwaakt, de Mist en de toon van het spel |
| [Facties](facties.md) | De Orde van de Bleke Lantaarn, het Genootschap van het Zevende Zegel, de expeditie-Harrowgate, Scotland Yard en de pers |
| [Verhaallijnen](verhaallijnen.md) | Het verhaal per oude god, met de mysteries als hoofdstukken |
| [Personen](personen.md) | De vaste personages uit de verhaalkaarten |
| [Tijdlijn](tijdlijn.md) | Van de oudheid tot november 1888 |
| [Helden](helden.md) | De achttien onderzoekers |
| [Plekken](plekken.md) | Twintig plekken in Londen en drie bestemmingen overzee |
| [Monsters](monsters.md) | Alle monsters en de drie epische monsters |
| [Artefacten en spreuken](artefacten-en-spreuken.md) | Wat je onderweg kunt vinden en leren |

## Aanpassen

- **Handgeschreven pagina's** (wereld, facties, verhaallijnen, tijdlijn) kun je direct op GitHub aanpassen met het potloodje rechtsboven.
- **Gegenereerde pagina's** (personen, helden, plekken, monsters, artefacten en spreuken) komen uit de speldata in \`data/\`. Pas daar de tekst aan, of vraag het Claude, en draai daarna \`node tools/maak-lore.js\`.

## In cijfers

- ${goden.length} oude goden, ${helden.length} helden, ${personen.length} vaste personages
- ${stad.length} algemene stadskaarten en ${verhaal.length} verhaalkaarten
- ${monsters.length} monsters en ${epische.length} epische monsters, ${artefacten.length} artefacten, ${spreuken.length} spreuken`);
console.log("Lore-pagina's gegenereerd");
