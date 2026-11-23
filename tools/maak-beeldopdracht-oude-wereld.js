// Bouwt ontwerp/beeldopdracht-oude-wereld.md: de beelden voor de uitbreiding Kaarten van de Oude Wereld
// (de plekken van de drie regio's, de schatten, de drie nieuwe helden en hun spullen).
// Gebruik: node tools/maak-beeldopdracht-oude-wereld.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const ow = JSON.parse(fs.readFileSync(path.join(root, "data", "oude-wereld.json"), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const F = {
  plek: ["3:2", "2048 × 1365", "establishing view of the place, no people in the foreground, a few distant figures at most"],
  held: ["3:4", "1536 × 2048", "half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges"],
  object: ["1:1", "1024 × 1024", "single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette"]
};
/* Een prompt per plek: de aankomst, de zeven tegels en het hart van elke regio */
const PLEK = {
  "thebe-aankomst": "the riverside quay of Luxor on the Nile in 1888, feluccas with white sails, donkeys, merchants selling antiquities under awnings, the columns of Luxor temple behind, warm evening light",
  "thebe-vallei-der-koningen": "the Valley of the Kings near Thebe, sun-scorched limestone cliffs with dark tomb entrances cut into the rock, one entrance with fresh scratches around an old lock, long shadows",
  "thebe-karnak": "the great hypostyle hall of Karnak, a forest of enormous carved columns in deep shadow, shafts of light falling between them, hieroglyphs that seem to shift",
  "thebe-deir-el-bahari": "the terraced temple of Deir el-Bahari below towering cliffs, and nearby a dark shaft in the rock with ropes and a wooden winch, the royal mummy cache, dusk",
  "thebe-medinet-habu": "the fortress-like temple of Medinet Habu with colossal reliefs of a sea battle, one carved enemy without a face, harsh afternoon sun and deep shadows",
  "thebe-gurna": "the village of Gurna built on top of ancient tombs on the hillside of Thebe, mud-brick houses with dark cellar openings leading underground, smoke from cooking fires",
  "thebe-kamp-harrowgate": "an abandoned Victorian excavation camp in the Egyptian desert, white canvas tents, a British flag, crates stamped with a collector's mark, a dinner table still set, no one in sight",
  "thebe-woestijnweg": "an ancient processional road leading into the desert lined with half-buried sphinxes, and at its end a lonely hermit's tent under a vast starry sky",
  "thebe-hart": "a hidden burial chamber deep under the Theban hills, a black basalt guardian statue in a niche with eyes beginning to glow, an untouched sarcophagus with grave goods, a single lamp",
  "himalaya-aankomst": "Darjeeling in 1888, tea gardens on steep green slopes, the little hill railway, porters waiting with baskets, snow peaks of Kangchenjunga glowing above the clouds",
  "himalaya-hoge-pas": "a narrow high mountain pass between two rock walls in the Himalaya, ice on the stones, a sheer drop to one side, prayer cairns, wind-driven snow",
  "himalaya-klooster-witte-wolken": "a white Tibetan monastery on a mountain ridge above the clouds, prayer flags, golden roofs, a bronze bell in an open tower, monks in maroon robes far away",
  "himalaya-hol-kluizenaar": "a cave above the tree line in the Himalaya with a small fire at its mouth, a hermit's prayer wheel and bowl, snow peaks outside under a cold sky",
  "himalaya-brug-gebedsvlaggen": "a swaying rope bridge across a deep Himalayan gorge, hung with hundreds of colourful prayer flags, a thread-like river far below",
  "himalaya-verlaten-fort": "an abandoned Himalayan dzong fortress on a rock spur, its great hall lined with rows of old armour and banners, dust and cold light",
  "himalaya-gletsjer": "a crevassed blue glacier in the Himalaya, and deep in the clear ice the dim shape of a frozen traveller with outstretched arms",
  "himalaya-dorp-dragers": "a small Sherpa village of low stone houses with smoke from butter lamps, yaks in a walled yard, prayer flags, mountains behind in evening light",
  "himalaya-hart": "a lone stone gate without walls standing on a snowy summit above the clouds, before it a towering guardian figure made of snow and prayer flags with the eyes of an old woman, a storm swirling",
  "yucatan-aankomst": "the harbour of Progreso in Yucatan in 1888, a long wooden pier, bales of sisal on the quay, steamships in the rain, palm trees and warehouses",
  "yucatan-cenote": "a round sinkhole lake in the Yucatan jungle with steep limestone walls and hanging roots, clear turquoise water with something glinting gold on the bottom",
  "yucatan-sterrenhuis": "a round Maya observatory tower with narrow windows aimed at the stars, inside the floor covered with red painted tables of numbers, night sky",
  "yucatan-kamp-chicleros": "a jungle camp of chicle tappers in Yucatan, palm-leaf shelters, sapodilla trees with zigzag cuts dripping white sap, men around a fire",
  "yucatan-verlaten-hacienda": "an abandoned henequen hacienda overgrown by jungle, a grand veranda, a dining room with a table still set for twelve, vines through the windows",
  "yucatan-rivier-onder-de-grond": "an underground river in a limestone cave in Yucatan, still dark water, the walls covered with red painted handprints, a single torch",
  "yucatan-veld-steles": "a field of carved Maya stone stelae half-swallowed by the jungle, each showing a king and glyph dates, the last stela blank but for one date",
  "yucatan-ruine-slang": "a collapsed Maya palace with a huge feathered serpent carved across its facade, a stairway descending into the serpent's open mouth, rain and mist",
  "yucatan-hart": "a hidden temple chamber beneath a Maya pyramid, a stone altar with a carved round calendar, and coiled before it a great serpent with feathers of jade, torchlight"
};
const r = ["# Beeldopdracht: Kaarten van de Oude Wereld", "",
  "De beelden voor de uitbreiding: de plekken op de drie regiokaarten (Thebe, de Himalaya en Yucatán), de zes schatten, de drie nieuwe helden en hun persoonlijke spullen. Zolang een beeld ontbreekt, toont het spel een kleurvlak of initialen.", "",
  "## Instructies voor de AI", "",
  "Je maakt schilderijen voor een bordspel uit 1888. Werk de lijst hieronder beeld voor beeld af.", "",
  "1. Maak elk beeld precies in het opgegeven formaat (verhouding en pixels).",
  "2. Gebruik de prompt in het codeblok volledig en letterlijk. De stijlregel staat er al achter; verander die niet.",
  "3. Zet nooit tekst, letters of cijfers in een afbeelding.",
  "4. Lever elk beeld als PNG, met precies de bestandsnaam die erbij staat, in de map die erbij staat.",
  "5. Lever niets anders op dan de beelden zelf.", "",
  "## Waar elk beeld heen moet", "",
  "Alle mappen staan in de Drive-map `Londen1888-art`. Maak een map aan als die nog niet bestaat.", "",
  "| Map | Wat erin komt | Formaat |", "|---|---|---|",
  "| `oude-wereld/` | De plekken op de regiokaarten | 3:2, 2048 × 1365 px |",
  "| `artefacten/` | De zes schatten | 1:1, 1024 × 1024 px |",
  "| `helden/` | De drie nieuwe helden | 3:4, 1536 × 2048 px |",
  "| `persoonlijk/` | Hun persoonlijke spullen | 1:1, 1024 × 1024 px |", "",
  "## Afvinklijst", "", "/*LIJST*/", "",
  "## Daarna (voor de maker van het spel, niet voor de AI)", "",
  "Zet de Drive-id's in `tools/art-drive.json` en haal de beelden op met `python3 -I tools/haal-art.py tools/art-drive.json`.", "",
  "## De prompts", ""];
const lijst = [];
const blok = (titel, bestand, soort, prompt) => {
  const [v, px, t] = F[soort], [map, naam] = bestand.split("/");
  lijst.push(`- [ ] \`${map}/${naam}\` · ${titel}`);
  r.push(`#### ${titel}`, "", `- Map: \`${map}/\``, `- Bestandsnaam: \`${naam}\``, `- Volledig pad: \`Londen1888-art/${map}/${naam}\``, `- Formaat: ${v}, ${px} px`, "", "```", `${prompt}, ${t}. ${STIJL}. Avoid: ${NEG}.`, "```", "");
};
for (const g of ow.regios) {
  r.push(`### ${g.naam}`, "");
  blok(g.aankomst.naam, `oude-wereld/${g.id}-aankomst.png`, "plek", PLEK[`${g.id}-aankomst`]);
  for (const t of g.tegels) blok(t.naam, `oude-wereld/${g.id}-${t.id}.png`, "plek", PLEK[`${g.id}-${t.id}`]);
  blok(g.hart.naam, `oude-wereld/${g.id}-hart.png`, "plek", PLEK[`${g.id}-hart`]);
}
r.push("### De schatten", "");
for (const a of ow.schatten) blok(a.naam, `artefacten/${a.id}.png`, "object", a.prompt);
r.push("### De nieuwe helden", "");
for (const h of ow.helden) {
  blok(h.naam, `helden/${h.id}.png`, "held", h.prompt);
  for (const p of ow.persoonlijk.filter(p => p.held === h.id)) blok(`${p.naam} (${h.naam})`, `persoonlijk/${p.id}.png`, "object", p.prompt);
}
const ontbreekt = Object.keys(PLEK).filter(k => !lijst.some(l => l.includes(k)));
if (ontbreekt.length) throw new Error("Geen plek voor: " + ontbreekt.join(", "));
fs.writeFileSync(path.join(root, "ontwerp", "beeldopdracht-oude-wereld.md"), r.join("\n").replace("/*LIJST*/", lijst.join("\n")) + "\n");
console.log(`ontwerp/beeldopdracht-oude-wereld.md: ${lijst.length} beelden`);
