// Bouwt ontwerp/beeldopdracht-persoonlijk.md: de persoonlijke spullen van de helden uit data/persoonlijk.json.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const items = JSON.parse(fs.readFileSync(path.join(root, "data/persoonlijk.json"), "utf8"));
const helden = JSON.parse(fs.readFileSync(path.join(root, "data/helden.json"), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const r = [
  "# Beeldopdracht: persoonlijke spullen van de helden",
  "",
  "Een aanvulling op `beeldopdracht.md`: de spullen waarmee elke held begint. Ze verschijnen als kaart in het tableau en in het heldenprofiel.",
  "",
  "## Instructies voor de AI",
  "",
  "1. Maak elk plaatje als vierkant stilleven: 1:1, 1024 × 1024 px. Dat is hetzelfde formaat als de andere spullen.",
  "2. Gebruik de volledige prompt, inclusief de vaste stijlregel aan het eind. Verander die stijlregel niet.",
  "3. Zet nooit tekst in een afbeelding.",
  "4. Lever PNG-bestanden op, met precies de bestandsnaam die bij de prompt staat, in de map `persoonlijk/` in de Drive-map `Londen1888-art`.",
  "",
  "**Stijlregel:**",
  "",
  "> " + STIJL,
  ""
];
for (const h of helden) {
  const eigen = items.filter(i => i.held === h.id);
  if (!eigen.length) continue;
  r.push(`## ${h.naam}`, "");
  for (const i of eigen) r.push(`### ${i.naam}`, "", `- Bestand: \`persoonlijk/${i.id}.png\``, `- Functie in het spel: ${i.tekst}`, "- Formaat: 1:1, 1024 × 1024 px", "", "```",
    `${i.prompt}, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. ${STIJL}. Avoid: ${NEG}.`, "```", "");
}
r.push("## Controlelijst", "", `In totaal ${items.length} plaatjes. Zet ze in de map \`persoonlijk/\` in Drive en laat het weten.`, "");
fs.writeFileSync(path.join(root, "ontwerp/beeldopdracht-persoonlijk.md"), r.join("\n"));
console.log("Geschreven:", items.length, "plaatjes");
