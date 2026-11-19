// Bouwt ontwerp/prompts-helden.md uit data/helden.json
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const helden = JSON.parse(fs.readFileSync(path.join(root, "data/helden.json"), "utf8"));
const STIJL = "Oil painting, late Victorian academic portrait style, rich dark palette with warm gaslight highlights, visible brushstrokes, dramatic chiaroscuro, half-length portrait, portrait orientation 3:4, no text, no frame.";
const regels = [
  "# Image-prompts voor de helden",
  "",
  "Plak per held de prompt in je image-generator. Elke prompt eindigt met dezelfde stijlregel, zodat alle portretten bij elkaar passen.",
  "",
  "Stijlregel (zit al in elke prompt):",
  "",
  "> " + STIJL,
  "",
  "Sla elk resultaat op als `art/helden/<id>.jpg` (bijvoorbeeld `art/helden/hester-quayle.jpg`).",
  ""
];
for (const h of helden) {
  regels.push(`## ${h.naam}${h.bijnaam ? ` (${h.bijnaam})` : ""}`, "", `Bestand: \`art/helden/${h.id}.jpg\``, "", "```", `${h.prompt}. ${STIJL}`, "```", "");
}
fs.writeFileSync(path.join(root, "ontwerp/prompts-helden.md"), regels.join("\n"));
console.log("Geschreven:", helden.length, "prompts");
