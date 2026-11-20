// Bouwt ontwerp/beeldopdracht-herzien.md: portretten die opnieuw moeten, met een herziene prompt.
// Pas de lijst OPNIEUW aan als er weer een beeld vervangen moet worden.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const helden = JSON.parse(fs.readFileSync(path.join(root, "data/helden.json"), "utf8"));
const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";
const HELD = "half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges";
const OPNIEUW = {
  "odile-fairweather": "Leek bijna gelijk aan Lady Cordelia Vane (twee dames in zwart bij kaarslicht). Nu een Creoolse vrouw uit New Orleans: warme huid, kleurige tignon, goud, paars en roodgouden kaarslicht, zittend aan de seancetafel.",
  "cordelia-vane": "Nu duidelijk anders dan Odile: bleek, rood haar, staand, streng rouwzwart zonder sieraden behalve een camee, koud zilverblauw daglicht bij een raam met scheepsmasten. Geen kaarsen."
};
const r = [
  "# Beeldopdracht: herziene portretten",
  "",
  "Een aanvulling op `beeldopdracht.md`. Deze portretten vervangen een eerder beeld. Gebruik dezelfde stijlregel en hetzelfde formaat als de andere helden, zodat ze in de reeks passen.",
  "",
  "## Instructies voor de AI",
  "",
  "1. Formaat: staand 3:4, 1536 × 2048 px.",
  "2. Gebruik de volledige prompt, inclusief de vaste stijlregel aan het eind.",
  "3. Zet nooit tekst in een afbeelding.",
  "4. Lever PNG-bestanden op met precies de bestandsnaam die erbij staat, in de map `helden/` in de Drive-map `Londen1888-art`. Overschrijf het oude bestand of zet het nieuwe ernaast met dezelfde naam.",
  "5. Let erop dat de twee portretten **duidelijk van elkaar verschillen**: andere huidskleur, haarkleur, kleding, houding (zittend tegenover staand) en licht (warm kaarslicht tegenover koud daglicht).",
  "",
  "## Portretten",
  ""
];
for (const [id, waarom] of Object.entries(OPNIEUW)) {
  const h = helden.find(x => x.id === id);
  if (!h) throw new Error("Onbekende held " + id);
  r.push(`### ${h.naam}`, "", `- Bestand: \`helden/${h.id}.png\``, "- Formaat: 3:4, 1536 × 2048 px", `- Waarom opnieuw: ${waarom}`, "", "```",
    `${h.prompt}. ${HELD}. ${STIJL}. Avoid: ${NEG}.`, "```", "");
}
fs.writeFileSync(path.join(root, "ontwerp/beeldopdracht-herzien.md"), r.join("\n"));
console.log("Geschreven:", Object.keys(OPNIEUW).length, "herziene portretten");
