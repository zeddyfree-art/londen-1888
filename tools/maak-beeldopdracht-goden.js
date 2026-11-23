// Bouwt ontwerp/beeldopdracht-nieuwe-goden.md: de beelden voor de zeven nieuwe oude goden
// (Ommeth, Karathos, Ulvereth, Sirrhae, Ouroch, Yth-Nemora en Gul-Marrach): de goden zelf,
// hun Scheurbeeld, de epische monsters, de nieuwe monsters en de personages.
// Gebruik: node tools/maak-beeldopdracht-goden.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const GODEN = ["ommeth", "karathos", "ulvereth", "sirrhae", "ouroch", "yth-nemora", "gul-marrach"];
const F = {
  god: ["16:9", "2560 × 1440", "wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third"],
  scheur: ["1:1", "1024 × 1024", "circular composition, everything important within the central circle, the edges fading into near-black violet"],
  monster: ["1:1", "1536 × 1536", "full figure centred, readable silhouette, dark vignetted background"],
  persoon: ["3:4", "1536 × 2048", "half-length portrait, figure centred, head in upper third, background fades into darkness at the edges"]
};
/* De blik door de Scheur naar de andere kant, per god (zie ook beeldopdracht-scheur.md) */
const SCHEUR = {
  ommeth: "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet. Through the tear: an endless plain filled with rows of silent people standing shoulder to shoulder, all facing a bare hill under a violet sky, candles in their hands, and on the hill only an empty shepherd's crook planted in the earth. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  karathos: "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and splintered like broken black glass. Through the tear: an endless gallery of glass display cases under a violet sky, each holding one shard of something enormous, faint threads of light joining the shards toward a dark centre. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  ulvereth: "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and rimed with frost. Through the tear: a frozen plain of clear ice with an upside-down London visible beneath it, and above it a vast wheel of weather turning in the violet sky, half golden sunshine and half black storm with lightning. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  sirrhae: "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and trimmed with black lace. Through the tear: an endless candlelit ballroom where masked couples dance, every mask the same pale face, and at the far end a throne with a woman hidden behind a huge black fan. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  ouroch: "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and edged with turning brass gears. Through the tear: a cathedral-sized hall of countless clocks and swinging pendulums under a violet sky, all showing thirteen hours, a single raindrop and a bird frozen in mid-air. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  "yth-nemora": "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and curling like burnt newspaper. Through the tear: an immense printing hall where a thousand presses roll out sheets showing different versions of London, the sheets drifting up into a violet sky like snow. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale",
  "gul-marrach": "A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and dripping molten gold. Through the tear: a bottomless vault piled with gold coins under a violet sky, people buried to their necks in the gold writing in ledgers, and a giant pale ringed hand writing in an open ledger. A tiny Victorian figure in a long coat stands on the threshold, seen from behind, for scale"
};
const r = ["# Beeldopdracht: zeven nieuwe oude goden", "",
  "Een aanvulling op `beeldopdracht.md`, voor Ommeth, Karathos, Ulvereth, Sirrhae, Ouroch, Yth-Nemora en Gul-Marrach. Gebruik dezelfde stijlregel en dezelfde formaten, zodat de nieuwe beelden in de reeks passen. Zolang een beeld ontbreekt, toont het spel initialen of een kleurvlak.", "",
  "Per god zijn er tien beelden: de god zelf, het Scheurbeeld, het epische monster, drie monsters en drie personages (en Ommeth heeft er één meer: de cultist). Begin met de goden en de epische monsters: die zie je het eerst.", "",
  "## Instructies voor de AI", "",
  "Je maakt schilderijen voor een bordspel over Victoriaans Londen in 1888. Werk de lijst hieronder beeld voor beeld af.", "",
  "1. Maak elk beeld precies in het opgegeven formaat (verhouding en pixels).",
  "2. Gebruik de prompt in het codeblok volledig en letterlijk. De stijlregel staat er al achter; verander die niet.",
  "3. Zet nooit tekst, letters of cijfers in een afbeelding.",
  "4. Een Scheurbeeld wordt in het spel rond uitgesneden en klein getoond: zet het onderwerp in het midden, de rand loopt over in bijna zwart violet.",
  "5. Lever elk beeld als PNG, met precies de bestandsnaam die erbij staat, in de map die erbij staat.",
  "6. Lever niets anders op dan de beelden zelf.", "",
  "## Waar elk beeld heen moet", "",
  "Alle mappen staan in de Drive-map `Londen1888-art`. Maak een map aan als die nog niet bestaat.", "",
  "| Map | Wat erin komt | Formaat |", "|---|---|---|",
  "| `goden/` | De oude god zelf, een breed schilderij | 16:9, 2560 × 1440 px |",
  "| `scheur/` | De blik door de Scheur, rond uitgesneden | 1:1, 1024 × 1024 px |",
  "| `monsters/` | Epische monsters en gewone monsters | 1:1, 1536 × 1536 px |",
  "| `personen/` | Personages, portret tot het middel | 3:4, 1536 × 2048 px |", "",
  "Voorbeeld: het beeld van de god Ommeth heet `ommeth.png` en hoort in de map `goden/`, dus `Londen1888-art/goden/ommeth.png`.", "",
  "## Afvinklijst", "", "/*LIJST*/", "",
  "## Daarna (voor de maker van het spel, niet voor de AI)", "",
  "Zet de Drive-id's in `tools/art-drive.json` en haal de beelden op met `python3 -I tools/haal-art.py tools/art-drive.json`. Het script verkleint ze en zet ze als JPG in `art/`.", "",
  "## De prompts", ""];
const lijst = [];
const blok = (titel, bestand, soort, prompt) => {
  const [v, px, t] = F[soort], [map, naam] = bestand.split("/");
  lijst.push(`- [ ] \`${map}/${naam}\` · ${titel}`);
  r.push(`#### ${titel}`, "", `- Map: \`${map}/\``, `- Bestandsnaam: \`${naam}\``, `- Volledig pad: \`Londen1888-art/${map}/${naam}\``, `- Formaat: ${v}, ${px} px`, "", "```", `${prompt}, ${t}. ${STIJL}. Avoid: ${NEG}.`, "```", "");
};
const goden = lees("oude-goden.json"), monsters = lees("monsters.json"), epische = lees("epische-monsters.json"), personen = lees("personen.json");
const bestaand = new Set(goden.filter(g => !GODEN.includes(g.id)).flatMap(g => g.monsters));
let n = 0;
for (const id of GODEN) {
  const g = goden.find(x => x.id === id);
  r.push(`### ${g.naam}, ${g.titel}`, "");
  blok(`${g.naam}`, `goden/${g.id}.png`, "god", g.prompt); n++;
  blok(`De Scheur van ${g.naam}`, `scheur/${g.id}.png`, "scheur", SCHEUR[id]); n++;
  const e = epische.find(x => x.id === g.episch);
  blok(`${e.naam} (episch monster)`, `monsters/${e.id}.png`, "monster", e.prompt); n++;
  const eigen = monsters.filter(m => (g.monsters.includes(m.id) && !bestaand.has(m.id)) || (id === "ommeth" && m.id === "cultist"));
  for (const m of eigen) { blok(m.naam, `monsters/${m.id}.png`, "monster", m.prompt); n++; }
  for (const p of personen.filter(p => p.god === id)) { blok(p.naam, `personen/${p.id}.png`, "persoon", p.prompt); n++; }
}
fs.writeFileSync(path.join(root, "ontwerp", "beeldopdracht-nieuwe-goden.md"), r.join("\n").replace("/*LIJST*/", lijst.join("\n")) + "\n");
console.log(`ontwerp/beeldopdracht-nieuwe-goden.md: ${n} beelden`);
