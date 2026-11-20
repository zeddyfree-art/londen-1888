// Bouwt ontwerp/beeldopdracht-personen.md: portretten van de vaste personages uit data/personen.json.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const personen = JSON.parse(fs.readFileSync(path.join(root, "data/personen.json"), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const r = [
  "# Beeldopdracht: vaste personages",
  "",
  "Een aanvulling op `beeldopdracht.md`: portretten van de personages die in de verhaalkaarten terugkomen. Ze verschijnen naast hun kaart in het spel.",
  "",
  "## Instructies voor de AI",
  "",
  "1. Maak elk portret precies in het opgegeven formaat: staand 3:4, 1536 × 2048 px. Dat is hetzelfde formaat als de heldenportretten.",
  "2. Gebruik de volledige prompt, inclusief de vaste stijlregel aan het eind. Verander die stijlregel niet.",
  "3. Zet nooit tekst in een afbeelding.",
  "4. Lever PNG-bestanden op, met precies de bestandsnaam die bij de prompt staat, in de map `personen/` in de Drive-map `Londen1888-art`.",
  "",
  "**Stijlregel:**",
  "",
  "> " + STIJL,
  "",
  "## Portretten",
  ""
];
for (const p of personen) {
  r.push(`### ${p.naam}`, "", `- Bestand: \`personen/${p.id}.png\``, `- Rol: ${p.rol}`, "- Formaat: 3:4, 1536 × 2048 px", "", "```",
    `${p.prompt}, half-length portrait, figure centred, head in upper third, background fades into darkness at the edges. ${STIJL}. Avoid: ${NEG}.`, "```", "");
}
r.push("## Controlelijst", "", `In totaal ${personen.length} portretten. Zet ze in de map \`personen/\` in Drive en laat het weten.`, "");
fs.writeFileSync(path.join(root, "ontwerp/beeldopdracht-personen.md"), r.join("\n"));
console.log("Geschreven:", personen.length, "portretten");
