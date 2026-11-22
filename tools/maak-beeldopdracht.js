// Bouwt ontwerp/beeldopdracht.md: de volledige opdracht voor een beeld-LLM, uit de speldata.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const lees = f => JSON.parse(fs.readFileSync(path.join(root, "data", f), "utf8"));

const STIJL = "Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting";
const NEG = "no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore";

const FORMATEN = {
  held:      { r: "3:4",  px: "1536 × 2048", tekst: "half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges" },
  god:       { r: "16:9", px: "2560 × 1440", tekst: "wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third" },
  monster:   { r: "1:1",  px: "1536 × 1536", tekst: "full figure centred, readable silhouette, dark vignetted background" },
  object:    { r: "1:1",  px: "1024 × 1024", tekst: "single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette" },
  spreuk:    { r: "1:1",  px: "1024 × 1024", tekst: "close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background" },
  plek:      { r: "3:2",  px: "2048 × 1365", tekst: "establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most" },
  bord:      { r: "10:7", px: "3000 × 2100", tekst: "top-down view" },
  achterkant:{ r: "3:4",  px: "1024 × 1365", tekst: "symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective" },
  fiche:     { r: "1:1",  px: "512 × 512",   tekst: "single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out" },
  scherm:    { r: "16:9", px: "2560 × 1440", tekst: "wide atmospheric scene with an empty calm area in the centre-left for the game title" }
};

const SPULLEN = {
  "webley":"a heavy Victorian service revolver with a worn wooden grip and a box of cartridges",
  "olifantengeweer":"a big-game double-barrelled rifle with brass fittings and a leather sling",
  "wandelstokdegen":"an ebony walking cane partly drawn to reveal a slim hidden sword blade",
  "ossenzweep":"a coiled leather bullwhip on a dusty expedition crate",
  "dynamiet":"a single stick of dynamite with a short fuse in a wooden mining box",
  "zilveren-kogels":"a small handful of gleaming silver bullets in a velvet-lined case",
  "stormlantaarn":"a brass storm lantern with a glowing flame and sooty glass",
  "gladstonetas":"a battered brown leather Gladstone bag, half open",
  "camera":"a wooden Victorian field camera on a tripod with brass lens and glass plates",
  "kompas":"an open brass pocket compass with a needle pointing slightly wrong",
  "breekijzer":"a heavy iron crowbar resting against a cracked wooden crate",
  "bradshaw":"a worn railway timetable booklet beside a train ticket and a pocket watch",
  "rijtuig":"a hansom cab fare card and coins on a wet cobblestone",
  "ondergronds":"a small cardboard railway ticket and a gas-lit underground platform sign shape without letters",
  "laudanum":"a small dark-blue glass bottle of laudanum with a cork and a spoon",
  "carbol":"a brown glass bottle of carbolic acid, rolled linen bandages and scissors",
  "vlugzout":"an ornate silver smelling-salts vial",
  "chloroform":"a glass chloroform bottle and a folded white cloth",
  "boek-grimoire":"an ancient leather grimoire with iron clasps and strange sigils embossed",
  "boek-reisverslag":"a water-stained explorer's travel journal with sketches of ruins and a pressed flower",
  "boek-astrologie":"an open book of astronomical tables with star diagrams and a brass divider",
  "boek-egyptisch":"a thick scholarly book open on hieroglyph drawings beside a magnifying glass",
  "bondgenoot-straatjongens":"a cheeky gang of four Victorian street urchins in flat caps on a stone stairway",
  "bondgenoot-journalist":"a sharp-eyed young woman reporter in a straw boater with a notebook and pencil",
  "bondgenoot-koetsier":"a grizzled hansom cab driver in a caped coat holding the reins at night",
  "bondgenoot-agent":"a Victorian police constable in a tall helmet with a bullseye lantern",
  "bondgenoot-gids":"a seasoned expedition guide in desert travel clothes holding a rifle and a rolled map",
  "dier-raaf":"a large glossy raven perched on an old stone battlement",
  "dier-terrier":"a scruffy alert rat-catching terrier with a red collar",
  "dier-kanarie":"a yellow canary in a small brass birdcage",
  "dier-kat":"a sleek black cat with green eyes sitting on a windowsill",
  "dier-paard":"a sturdy chestnut horse with a gentle face, wearing a simple bridle"
};
const SPREUKEN = {
  "zout-en-ijzer":"a circle of white salt and iron nails poured on floorboards, faintly glowing",
  "woord-van-sluiting":"a gloved hand pressing a glowing sigil onto a tear in the air that is sealing shut",
  "verbanning":"a hand raising a brass pentacle that blazes with pale light against a shadow",
  "spiegelgang":"a hand reaching into the rippling surface of a gilded mirror",
  "astrale-reis":"a sleeping figure on a chaise longue with a translucent glowing double rising above",
  "tarot":"three tarot-style cards without letters laid out on a dark cloth beside a candle",
  "theebladeren":"tea leaves in a chipped china cup forming a strange shape",
  "henochiaanse-aanroeping":"a wax tablet with angular occult letters glowing, crystal and candles around it",
  "sympathiepop":"a small cloth and straw poppet stuck with pins, bound with red thread",
  "mesmerisme":"a swinging silver watch on a chain before a pair of hypnotised eyes",
  "kaars-van-terugkeer":"a single tall white candle with a warm healing glow over clasped hands",
  "wake-van-de-wachter":"an open eye drawn in chalk on a door, lantern light, a guardian silhouette",
  "pentagram":"a five-pointed star traced in the air with a dagger, glowing pale blue",
  "doodsmasker":"a pale plaster death mask held up before a face in candlelight"
};
const PLEKKEN = {
  "hampstead":"a domed brass observatory on a misty heath hill above distant London lights",
  "marylebone":"a respectable Georgian terrace at night, one window glowing with seance candlelight behind heavy curtains",
  "kings-cross":"a vast iron and glass railway station with steam locomotives and smoke under gaslight",
  "bloomsbury":"the grand colonnade of a great museum at night, and inside a domed circular reading room",
  "soho":"a narrow Soho street with foreign cafes and a small occult bookshop with a glowing window",
  "mayfair":"a lavish Mayfair drawing room with gilded mirrors, chandeliers and potted palms",
  "covent-garden":"a bustling covered market at night with flower sellers and fruit stalls under lanterns",
  "leicester-square":"the exotic illuminated facade of a Victorian music hall theatre with playbills",
  "pall-mall":"a gentlemen's club library with leather armchairs, globes and expedition trophies",
  "strand":"a college courtyard and newspaper offices along a riverside embankment with gas lamps",
  "city":"the great dome of a cathedral over banks and an old hospital gateway in fog",
  "spitalfields":"a covered market hall and a steaming soup kitchen with a long queue",
  "whitechapel":"crowded lodging houses and narrow alleys of East London in thick fog",
  "whitehall":"stately government buildings and a police headquarters with caped constables",
  "westminster":"the gothic abbey and parliament clock tower by the river under a strange moon",
  "chelsea":"artists' studios on a riverside embankment with barges in moonlight",
  "southwark":"the south bank with breweries, laundries and an old market under railway arches",
  "st-katharine-docks":"enclosed docks with tall ships, warehouses and stacked crates from distant lands",
  "wapping":"river stairs down to the black Thames, a sailors' tavern and a river police station",
  "limehouse":"Limehouse waterfront with Chinese shopfronts, ropewalks and coal barges in lantern light",
  "thebe":"a rocky Egyptian valley with tomb entrances carved into cliffs under a burning sky, expedition tents",
  "himalaya":"a white monastery on a snowy Himalayan ridge with prayer flags and a bronze bell",
  "yucatan":"an overgrown stepped pyramid in a rain-soaked jungle with carved stone heads"
};
const ACHTERKANTEN = [
  ["spullen","Spullen","emblem of a brass key crossed with a revolver, teal and gold"],
  ["spreuken","Spreuken","emblem of a five-pointed star within a circle of sigils, violet and gold"],
  ["artefacten","Artefacten","emblem of a scarab inside an eye, gold on oxblood"],
  ["toestanden","Toestanden","emblem of a cracked mirror, grey and silver"],
  ["onheil","Onheil","emblem of a single staring eye in yellow fog, sickly yellow on black"],
  ["stad","Stadsontmoetingen","emblem of a gas lamp in fog, amber on dark teal"],
  ["expeditie","Expeditieontmoetingen","emblem of a compass rose over a pith helmet, sand and brown"],
  ["scheur","Scheurontmoetingen","emblem of a jagged violet tear in the air, violet on black"],
  ["mysterie","Mysteries","emblem of a magnifying glass over a star map, gold on deep blue"],
  ["monster","Monsterfiches","emblem of a clawed silhouette, oxblood on black"]
];
const FICHES = [
  ["aanwijzing","Aanwijzing","a round green-glass token with an engraved magnifying-glass symbol"],
  ["scheur","Scheur","a round token showing a glowing violet tear in reality with dark depth inside"],
  ["pond","Pond","a gold sovereign coin seen from above, worn and old"],
  ["trofee","Trofee","a round bronze medal token with a laurel wreath"],
  ["mist","Mist","a round pewter token with swirling yellow fog inside"],
  ["gezegend","Gezegend","a round white enamel token with a golden sunburst"],
  ["vervloekt","Vervloekt","a round black enamel token with a cracked violet sigil"],
  ["held","Heldenstandaard","a round brass base plate with an empty dark centre, for a hero portrait"]
];

const helden = lees("helden.json"), goden = lees("oude-goden.json"), monsters = [...lees("monsters.json"), ...lees("epische-monsters.json")];
const spullen = lees("spullen.json"), spreuken = lees("spreuken.json"), artefacten = lees("artefacten.json"), bord = lees("bord.json");
/* nieuwere kaarten hebben hun prompt in de data en staan in beeldopdracht-lange-nacht.md */
for (const s of spullen) if (!SPULLEN[s.id] && !s.prompt) throw new Error("Geen prompt voor spul " + s.id);
for (const s of spreuken) if (!SPREUKEN[s.id] && !s.prompt) throw new Error("Geen prompt voor spreuk " + s.id);
for (const p of [...bord.plekken, ...bord.overzee]) if (!PLEKKEN[p.id]) throw new Error("Geen prompt voor plek " + p.id);

const r = [];
let n = 0;
const blok = (map, id, titel, onderwerp, f) => {
  n++;
  const F = FORMATEN[f];
  r.push(`### ${titel}`, "", `- Bestand: \`${map}/${id}.png\``, `- Formaat: ${F.r}, ${F.px} px`, "", "```", `${onderwerp}. ${F.tekst}. ${STIJL}. Avoid: ${NEG}.`, "```", "");
};

r.push(
"# Beeldopdracht: Londen 1888",
"",
"Dit document is een opdracht voor een AI die afbeeldingen maakt. Het bevat alles wat nodig is voor de eerste speelbare versie van een eigen coöperatief bordspel in Victoriaans Londen, 1888. Alle personages, monsters en voorwerpen zijn origineel.",
"",
"## Instructies voor de AI",
"",
"1. Maak elke afbeelding hieronder, één per prompt, precies in het opgegeven formaat (beeldverhouding en pixelmaat).",
"2. Gebruik bij elke afbeelding de volledige prompt zoals hij er staat. De stijlregel aan het eind is steeds hetzelfde, zodat alles één geheel wordt. Verander die regel niet.",
"3. Zet nooit tekst, letters of cijfers in een afbeelding. Namen en waarden plaatst het spel er zelf overheen.",
"4. Lever PNG-bestanden op, met precies de bestandsnaam die bij de prompt staat.",
"5. Werk per groep, in de volgorde van dit document. Kijk na elke groep of de stijl gelijk blijft: dezelfde olieverftoets, hetzelfde palet en hetzelfde licht.",
"6. Kan je generator de exacte pixelmaat niet maken? Kies dan de juiste beeldverhouding in de grootste maat die wel kan. Opschalen mag.",
"",
"## Herkenbare stijl",
"",
"Het hele spel ziet eruit als een verzameling **laat-Victoriaanse olieverfschilderijen**: donker, sfeervol en een tikje onheilspellend. Denk aan schilderijen van straten bij maanlicht en gaslicht uit de jaren 1880, aan academische portretten uit die tijd en aan museumstillevens.",
"",
"**Stijlregel** (staat aan het eind van elke prompt):",
"",
"> " + STIJL,
"",
"**Vermijden** (staat ook in elke prompt):",
"",
"> " + NEG,
"",
"**Palet**",
"",
"| Kleur | Gebruik |",
"|---|---|",
"| Roetzwart en diep teal | Achtergronden, schaduw, nacht |",
"| Amber gaslicht | Warme lichtbronnen, gezichten |",
"| Groengrijze mist | Lucht, verte, sfeer |",
"| Ossenbloedrood | Accenten, gevaar |",
"| Ziekelijk violet | Alleen voor het bovennatuurlijke: scheuren, spreuken, de ster |",
"",
"## Formaten",
"",
"| Soort | Verhouding | Pixels |",
"|---|---|---|",
...Object.entries({held:"Heldenkaarten, staand portret",god:"Grote kaart van de oude god, breed",monster:"Monsterfiches en -kaarten, rond uit te snijden",object:"Spullen en artefacten, klein op kaart",spreuk:"Spreukkaarten",plek:"Plekkaart en ontmoetingsachtergrond",bord:"Het speelbord, past op laptop en iPad",achterkant:"Achterkant van een kaartstapel",fiche:"Rond speelfiche, wordt uitgesneden",scherm:"Titelscherm"}).map(([k,v])=>`| ${v} | ${FORMATEN[k].r} | ${FORMATEN[k].px} |`),
"",
"## Mappen voor Google Drive",
"",
"Zet alles in één map `Londen1888-art` met deze submappen. Het spel leest de bestanden op naam in, dus houd de namen precies aan.",
"",
"```",
"Londen1888-art/",
"  bord/", "  scherm/", "  helden/", "  goden/", "  monsters/", "  plekken/", "  spullen/", "  spreuken/", "  artefacten/", "  achterkanten/", "  fiches/",
"```",
""
);

r.push("## 1. Speelbord", "");
n++;
r.push("### Het bord van Londen", "", "- Bestand: `bord/londen.png`", `- Formaat: ${FORMATEN.bord.r}, ${FORMATEN.bord.px} px`, "",
"Het spel tekent de plekken en wegen er zelf overheen. Het bord is dus een sfeervolle, lege kaart. Belangrijk: de Theems loopt van **linksonder** (ongeveer 95% van de hoogte) via het **midden** (rond 70% van de hoogte, bij ongeveer 40% van de breedte) naar **rechts** (rond 65% van de hoogte). Boven de rivier ligt de stad, onder de rivier een smalle zuidoever.", "",
"```", `An antique hand-painted map of Victorian London seen from directly above, the river Thames as a dark teal band entering at the bottom-left, curving up through the centre and flowing out to the right side at about two thirds of the height, dense rooftops and streets suggested with loose brushwork, parks as dark green patches, fog drifting over the city, aged varnish and paper texture, ${FORMATEN.bord.tekst}. ${STIJL}. Avoid: ${NEG}, no labels, no compass rose text, no legend.`, "```", "");
blok("scherm", "titel", "Titelscherm", "a lone figure with a lantern on a foggy Thames embankment at night, gas lamps fading into yellow mist, a strange violet star low over the dome of a cathedral", "scherm");

r.push("## 2. Helden", "");
for (const h of helden) blok("helden", h.id, h.naam, h.prompt, "held");
r.push("## 3. Oude goden", "");
for (const g of goden) blok("goden", g.id, `${g.naam}, ${g.titel}`, g.prompt, "god");
r.push("## 4. Monsters", "");
for (const m of monsters) blok("monsters", m.id, m.naam, m.prompt, "monster");
r.push("## 5. Plekken", "", "Deze beelden verschijnen als je op een plek staat of een ontmoeting hebt.", "");
for (const p of [...bord.plekken, ...bord.overzee]) blok("plekken", p.id, p.naam, PLEKKEN[p.id], "plek");
r.push("## 6. Spullen en bondgenoten", "");
for (const s of spullen.filter(s => SPULLEN[s.id])) blok("spullen", s.id, `${s.naam} (${s.soort})`, SPULLEN[s.id], "object");
r.push("## 7. Spreuken", "");
for (const s of spreuken.filter(s => SPREUKEN[s.id])) blok("spreuken", s.id, s.naam, SPREUKEN[s.id], "spreuk");
r.push("## 8. Artefacten", "");
for (const a of artefacten.filter(a => fs.existsSync(path.join(root, "art", "artefacten", `${a.id}.jpg`)))) blok("artefacten", a.id, a.naam, a.prompt, "object");
r.push("## 9. Achterkanten van kaartstapels", "", "Alle achterkanten hebben hetzelfde ontwerp: een donkere, sierlijke Victoriaanse rand met in het midden een embleem. Alleen het embleem en de kleur verschillen per stapel.", "");
for (const [id, t, e] of ACHTERKANTEN) blok("achterkanten", id, t, `ornate Victorian card back, dark lacquered background with fine gilded filigree, centred ${e}`, "achterkant");
r.push("## 10. Fiches", "");
for (const [id, t, e] of FICHES) blok("fiches", id, t, e, "fiche");

r.push("## Controlelijst", "", `In totaal ${n} afbeeldingen. Kijk na afloop of:`, "",
"- elk bestand de juiste naam en map heeft;",
"- er nergens tekst of letters in een afbeelding staan;",
"- de helden samen als één portretreeks voelen;",
"- monsters en fiches een rustige, donkere achtergrond hebben, zodat ze rond uitgesneden kunnen worden.", "",
"Upload daarna de map `Londen1888-art` naar Google Drive.", "");

fs.writeFileSync(path.join(root, "ontwerp/beeldopdracht.md"), r.join("\n"));
console.log("Geschreven:", n, "afbeeldingen");
