// Bouwt ontwerp/beeldopdracht-nieuwe-helden.md: de portretten en persoonlijke spullen van
// Pema Lhamo, Khalil Nasr en Benedict Ashcombe (twaalfde sessie).
// Gebruik: node tools/maak-beeldopdracht-nieuwe-helden.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const HELDEN = ["pema-lhamo", "khalil-nasr", "benedict-ashcombe"];
const F = {
  held: ["3:4", "1536 × 2048", "half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges"],
  persoon: ["3:4", "1536 × 2048", "half-length portrait, figure centred, head in upper third, background fades into darkness at the edges"],
  god: ["16:9", "2560 × 1440", "wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third"],
  monster: ["1:1", "1536 × 1536", "full figure centred, readable silhouette, dark vignetted background"],
  object: ["1:1", "1024 × 1024", "single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette"],
};
const r = ["# Beeldopdracht: drie nieuwe helden", "",
  "Een aanvulling op `beeldopdracht.md` voor Pema Lhamo (de droomziener uit Lhasa), Professor Khalil Nasr (de leraar uit Cairo) en Benedict Ashcombe (de genezer en oud-exorcist). Gebruik dezelfde stijlregel en dezelfde formaten, zodat de nieuwe beelden in de reeks passen. Zolang een beeld ontbreekt, toont het spel initialen of een kleurvlak.", "",
  "## Instructies voor de AI", "",
  "1. Maak elk beeld precies in het opgegeven formaat.", "2. Gebruik de volledige prompt, inclusief de stijlregel aan het eind.", "3. Zet nooit tekst in een afbeelding.",
  "4. Lever PNG-bestanden op met precies de bestandsnaam die erbij staat, in de juiste submap van de Drive-map `Londen1888-art`.",
  "5. Zet daarna de Drive-id's in `tools/art-drive.json` en haal ze op met `python3 -I tools/haal-art.py tools/art-drive.json`.", ""];
const blok = (titel, bestand, soort, prompt) => { const [v, px, t] = F[soort]; r.push(`### ${titel}`, "", `- Bestand: \`${bestand}\``, `- Formaat: ${v}, ${px} px`, "", "```", `${prompt}, ${t}. ${STIJL}. Avoid: ${NEG}.`, "```", ""); };
r.push("## Helden", "");
for (const h of lees("helden.json").filter(h => HELDEN.includes(h.id))) blok(h.naam, `helden/${h.id}.png`, "held", h.prompt);
r.push("## Persoonlijke spullen", "");
for (const p of lees("persoonlijk.json").filter(p => HELDEN.includes(p.held))) blok(p.naam, `persoonlijk/${p.id}.png`, "object", p.prompt);
fs.writeFileSync(path.join(root, "ontwerp", "beeldopdracht-nieuwe-helden.md"), r.join("\n"));
console.log(`ontwerp/beeldopdracht-nieuwe-helden.md: ${r.filter(x => x.startsWith("### ")).length} beelden`);
