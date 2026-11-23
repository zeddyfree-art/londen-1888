// Genereert de lore-pagina's die uit de speldata komen, plus de inhoudsopgave.
// Handgeschreven pagina's (wereld, facties, verhaallijnen, tijdlijn) blijven ongemoeid.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const schrijf = (f, t) => fs.writeFileSync(path.join(root, "lore", f), t.trim() + "\n");
const KN = { kennis: "Kennis", scherpte: "Waarneming", kracht: "Kracht", overtuiging: "Charisma" };
const ow = lees("oude-wereld.json");
const helden = [...lees("helden.json"), ...ow.helden], personen = lees("personen.json"), bord = lees("bord.json"), goden = lees("oude-goden.json");
const monsters = lees("monsters.json"), epische = lees("epische-monsters.json"), artefacten = [...lees("artefacten.json"), ...ow.schatten], spreuken = lees("spreuken.json");
const verhaal = lees("ontmoetingen/verhaal.json"), stad = lees("ontmoetingen/stad.json"), persoonlijk = [...lees("persoonlijk.json"), ...ow.persoonlijk], onheil = lees("onheil.json");
const gen = "*Deze pagina wordt gegenereerd uit de speldata (`tools/maak-lore.js`). Pas de data aan, niet deze pagina.*";
const godNaam = id => goden.find(g => g.id === id)?.naam || "Alle verhalen";

schrijf("personen.md", `# Personen

${gen}

De vaste personages die in de verhaalkaarten terugkomen.

${personen.map(p => {
  const kaarten = [...verhaal, ...stad, ...onheil].filter(k => k.persoon === p.id).length;
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
- **Uitrusting:** ${h.uitrusting.map(u => { const pk = persoonlijk.find(x => x.held === h.id && x.naam === u); return pk ? `${u} (${pk.tekst.replace(/\.$/, "")})` : u; }).join("; ")}`).join("\n\n")}`);

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

const onheilKaart = o => {
  const p = personen.find(x => x.id === o.persoon);
  const regel = [o.mist ? `Mist −${o.mist}` : "", o.scheur ? `${o.scheur} Scheur${o.scheur > 1 ? "en" : ""}` : "", o.monster ? `${o.monster} monster${o.monster > 1 ? "s" : ""}` : "", o.extra || "", o.gerucht || ""].filter(Boolean).join(" · ");
  return `### ${o.naam}

${p ? `*Met ${p.naam}.* ` : ""}${o.tekst}

**In het spel:** ${regel || "geen extra gevolgen"}`;
};
schrijf("onheil.md", `# Onheil en geruchten

${gen}

Aan het eind van elke ronde trekt het spel een Onheilskaart. Algemene kaarten zitten altijd in de stapel. Kaarten van een verhaallijn doen alleen mee als die god ontwaakt. Een **gerucht** is een opdracht met een deadline: lukt het niet op tijd, dan daalt de Mist.

## Altijd in de stapel

${onheil.filter(o => !o.god).map(onheilKaart).join("\n\n")}

${goden.map(g => `## ${g.naam}\n\n${onheil.filter(o => o.god === g.id).map(onheilKaart).join("\n\n")}`).join("\n\n")}`);

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
| [Helden](helden.md) | De onderzoekers |
| [Plekken](plekken.md) | Twintig plekken in Londen en drie bestemmingen overzee |
| [Monsters](monsters.md) | Alle monsters en de drie epische monsters |
| [Artefacten en spreuken](artefacten-en-spreuken.md) | Wat je onderweg kunt vinden en leren |
| [Onheil en geruchten](onheil.md) | Wat er elke nacht in de stad gebeurt, per verhaallijn |

## Aanpassen

- **Handgeschreven pagina's** (wereld, facties, verhaallijnen, tijdlijn) kun je direct op GitHub aanpassen met het potloodje rechtsboven.
- **Gegenereerde pagina's** (personen, helden, plekken, monsters, artefacten en spreuken, onheil) komen uit de speldata in \`data/\`. Pas daar de tekst aan, of vraag het Claude, en draai daarna \`node tools/maak-lore.js\`.

## In cijfers

- ${goden.length} oude goden, ${helden.length} helden, ${personen.length} vaste personages
- ${stad.length} algemene stadskaarten en ${verhaal.length} verhaalkaarten
- ${onheil.length} onheilskaarten, waarvan ${onheil.filter(o => o.gerucht).length} geruchten
- ${monsters.length} monsters en ${epische.length} epische monsters, ${artefacten.length} artefacten, ${spreuken.length} spreuken`);
console.log("Lore-pagina's gegenereerd");
