// Bouwt ontwerp/prompts.md uit de data: helden, oude goden, monsters en artefacten.
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));
const STIJL = "Oil painting, late Victorian style, rich dark palette with warm gaslight highlights, visible brushstrokes, dramatic chiaroscuro, no text, no frame.";
const groepen = [
  ["Helden", "helden", lees("helden.json"), "half-length portrait, portrait orientation 3:4"],
  ["Oude goden", "goden", lees("oude-goden.json"), "wide cinematic composition, landscape orientation 16:9"],
  ["Monsters", "monsters", lees("monsters.json"), "full figure, square 1:1"],
  ["Epische monsters", "monsters", lees("epische-monsters.json"), "full figure, square 1:1"],
  ["Artefacten", "artefacten", lees("artefacten.json"), "still life, square 1:1"]
];
const r = ["# Image-prompts", "", "Elke prompt eindigt met dezelfde stijlregel, zodat alle afbeeldingen bij elkaar passen.", "", "> " + STIJL, ""];
for (const [titel, map, lijst, formaat] of groepen) {
  r.push(`## ${titel}`, "");
  for (const x of lijst) r.push(`### ${x.naam}`, "", `Bestand: \`art/${map}/${x.id}.jpg\``, "", "```", `${x.prompt}, ${formaat}. ${STIJL}`, "```", "");
}
fs.writeFileSync(path.join(root, "ontwerp/prompts.md"), r.join("\n"));
console.log("Geschreven:", groepen.reduce((n, g) => n + g[2].length, 0), "prompts");
