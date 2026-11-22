// Bouwt ontwerp/beeldopdracht-lange-nacht.md: de beelden voor alle spullen, spreuken en artefacten
// die nog geen afbeelding in art/ hebben (de uitbreiding voor De Lange Nacht en de proefregels).
// Gebruik: node tools/maak-beeldopdracht-lange-nacht.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const F = {
  object: ["1:1", "1024 × 1024", "single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette"],
  spreuk: ["1:1", "1024 × 1024", "close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background"],
  episch: ["1:1", "1024 × 1024", "single legendary object still life, centred, filling about 70 percent of the frame, a faint supernatural glow and drifting motes of light around it, dark vignette"],
};
const heeftBeeld = (map, id) => fs.existsSync(path.join(root, "art", map, `${id}.jpg`));
const r = ["# Beeldopdracht: De Lange Nacht en de proefregels", "",
  "Een aanvulling op `beeldopdracht.md`: alle spullen, spreuken en artefacten die nog geen afbeelding hebben. Gebruik dezelfde stijlregel, zodat de nieuwe beelden in de reeks passen. Zolang een beeld ontbreekt, toont het spel een kleurvlak met een ster.", "",
  "## Instructies voor de AI", "",
  "1. Maak elk beeld precies in het opgegeven formaat.", "2. Gebruik de volledige prompt, inclusief de stijlregel aan het eind.", "3. Zet nooit tekst in een afbeelding.",
  "4. Lever PNG-bestanden op met precies de bestandsnaam die erbij staat, in de juiste submap van de Drive-map `Londen1888-art`.",
  "5. Zet daarna de Drive-id's in `tools/art-drive.json` en haal ze op met `python3 -I tools/haal-art.py tools/art-drive.json`.",
  "6. Artefacten met **Episch** in de titel zijn zeldzame, legendarische vondsten: geef ze een iets plechtiger, gloeiender uitstraling dan de rest.", ""];
const blok = (titel, bestand, soort, prompt) => { const [v, px, t] = F[soort]; r.push(`### ${titel}`, "", `- Bestand: \`${bestand}\``, `- Formaat: ${v}, ${px} px`, "", "```", `${prompt}, ${t}. ${STIJL}. Avoid: ${NEG}.`, "```", ""); };
const sp = lees("spullen.json").filter(s => !heeftBeeld("spullen", s.id));
const spr = lees("spreuken.json").filter(s => !heeftBeeld("spreuken", s.id));
const art = lees("artefacten.json").filter(s => !heeftBeeld("artefacten", s.id));
for (const x of [...sp, ...spr, ...art]) if (!x.prompt) throw new Error("Geen prompt voor " + x.id);
r.push(`## Artefacten (${art.length})`, "");
for (const a of art) blok(`${a.naam}${a.episch ? " (Episch)" : ""}`, `artefacten/${a.id}.png`, a.episch ? "episch" : "object", a.prompt);
r.push(`## Spullen (${sp.length})`, "");
for (const s of sp) blok(`${s.naam} (${s.soort})`, `spullen/${s.id}.png`, "object", s.prompt);
r.push(`## Spreuken (${spr.length})`, "");
for (const s of spr) blok(s.naam, `spreuken/${s.id}.png`, "spreuk", s.prompt);
fs.writeFileSync(path.join(root, "ontwerp", "beeldopdracht-lange-nacht.md"), r.join("\n"));
console.log(`ontwerp/beeldopdracht-lange-nacht.md: ${r.filter(x => x.startsWith("### ")).length} beelden`);
