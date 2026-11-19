# Beeldopdracht: Londen 1888

Dit document is een opdracht voor een AI die afbeeldingen maakt. Het bevat alles wat nodig is voor de eerste speelbare versie van een eigen coöperatief bordspel in Victoriaans Londen, 1888. Alle personages, monsters en voorwerpen zijn origineel.

## Instructies voor de AI

1. Maak elke afbeelding hieronder, één per prompt, precies in het opgegeven formaat (beeldverhouding en pixelmaat).
2. Gebruik bij elke afbeelding de volledige prompt zoals hij er staat. De stijlregel aan het eind is steeds hetzelfde, zodat alles één geheel wordt. Verander die regel niet.
3. Zet nooit tekst, letters of cijfers in een afbeelding. Namen en waarden plaatst het spel er zelf overheen.
4. Lever PNG-bestanden op, met precies de bestandsnaam die bij de prompt staat.
5. Werk per groep, in de volgorde van dit document. Kijk na elke groep of de stijl gelijk blijft: dezelfde olieverftoets, hetzelfde palet en hetzelfde licht.
6. Kan je generator de exacte pixelmaat niet maken? Kies dan de juiste beeldverhouding in de grootste maat die wel kan. Opschalen mag.

## Herkenbare stijl

Het hele spel ziet eruit als een verzameling **laat-Victoriaanse olieverfschilderijen**: donker, sfeervol en een tikje onheilspellend. Denk aan schilderijen van straten bij maanlicht en gaslicht uit de jaren 1880, aan academische portretten uit die tijd en aan museumstillevens.

**Stijlregel** (staat aan het eind van elke prompt):

> Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting

**Vermijden** (staat ook in elke prompt):

> no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore

**Palet**

| Kleur | Gebruik |
|---|---|
| Roetzwart en diep teal | Achtergronden, schaduw, nacht |
| Amber gaslicht | Warme lichtbronnen, gezichten |
| Groengrijze mist | Lucht, verte, sfeer |
| Ossenbloedrood | Accenten, gevaar |
| Ziekelijk violet | Alleen voor het bovennatuurlijke: scheuren, spreuken, de ster |

## Formaten

| Soort | Verhouding | Pixels |
|---|---|---|
| Heldenkaarten, staand portret | 3:4 | 1536 × 2048 |
| Grote kaart van de oude god, breed | 16:9 | 2560 × 1440 |
| Monsterfiches en -kaarten, rond uit te snijden | 1:1 | 1536 × 1536 |
| Spullen en artefacten, klein op kaart | 1:1 | 1024 × 1024 |
| Spreukkaarten | 1:1 | 1024 × 1024 |
| Plekkaart en ontmoetingsachtergrond | 3:2 | 2048 × 1365 |
| Het speelbord, past op laptop en iPad | 10:7 | 3000 × 2100 |
| Achterkant van een kaartstapel | 3:4 | 1024 × 1365 |
| Rond speelfiche, wordt uitgesneden | 1:1 | 512 × 512 |
| Titelscherm | 16:9 | 2560 × 1440 |

## Mappen voor Google Drive

Zet alles in één map `Londen1888-art` met deze submappen. Het spel leest de bestanden op naam in, dus houd de namen precies aan.

```
Londen1888-art/
  bord/
  scherm/
  helden/
  goden/
  monsters/
  plekken/
  spullen/
  spreuken/
  artefacten/
  achterkanten/
  fiches/
```

## 1. Speelbord

### Het bord van Londen

- Bestand: `bord/londen.png`
- Formaat: 10:7, 3000 × 2100 px

Het spel tekent de plekken en wegen er zelf overheen. Het bord is dus een sfeervolle, lege kaart. Belangrijk: de Theems loopt van **linksonder** (ongeveer 95% van de hoogte) via het **midden** (rond 70% van de hoogte, bij ongeveer 40% van de breedte) naar **rechts** (rond 65% van de hoogte). Boven de rivier ligt de stad, onder de rivier een smalle zuidoever.

```
An antique hand-painted map of Victorian London seen from directly above, the river Thames as a dark teal band entering at the bottom-left, curving up through the centre and flowing out to the right side at about two thirds of the height, dense rooftops and streets suggested with loose brushwork, parks as dark green patches, fog drifting over the city, aged varnish and paper texture, top-down view. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no labels, no compass rose text, no legend.
```

### Titelscherm

- Bestand: `scherm/titel.png`
- Formaat: 16:9, 2560 × 1440 px

```
a lone figure with a lantern on a foggy Thames embankment at night, gas lamps fading into yellow mist, a strange violet star low over the dome of a cathedral. wide atmospheric scene with an empty calm area in the centre-left for the game title. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 2. Helden

### Hu Yiping

- Bestand: `helden/hu-yiping.png`
- Formaat: 3:4, 1536 × 2048 px

```
young Chinese woman in her mid-twenties, 1888 East London, practical dark padded jacket and trousers, hair tightly braided, holding a worn bamboo fighting staff, calm watchful expression, steam and lantern light of a basement laundry behind her. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Professor Ambrose Pell

- Bestand: `helden/ambrose-pell.png`
- Formaat: 3:4, 1536 × 2048 px

```
elderly English astronomer, sixty years old, white mutton-chop whiskers, rumpled tweed coat and woollen scarf, brass telescope under one arm, standing in a domed observatory at night, cold starlight from the open roof slit. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Hester Quayle

- Bestand: `helden/hester-quayle.png`
- Formaat: 3:4, 1536 × 2048 px

```
woman in her thirties, 1888, high-collared dark grey dress, spectacles, hair pinned up, carrying a stack of leather-bound books, a large tabby cat on the reading desk beside her, the great domed reading room of a Victorian library glowing in the background. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Bridie Kavanagh

- Bestand: `helden/bridie-kavanagh.png`
- Formaat: 3:4, 1536 × 2048 px

```
Irish washerwoman around thirty, 1888 London, rolled-up sleeves and patched apron, auburn hair escaping a headscarf, reading tea leaves in a chipped cup, a magpie perched on a washtub, steam and candlelight in a cramped kitchen. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Albert Gosling

- Bestand: `helden/albert-gosling.png`
- Formaat: 3:4, 1536 × 2048 px

```
Victorian music-hall stage magician in his forties, waxed moustache, black tailcoat with red-lined cape, holding a fan of playing cards, a white dove on his shoulder, footlights glowing from below, red velvet theatre curtain behind. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Dr. Septimus Crane

- Bestand: `helden/septimus-crane.png`
- Formaat: 3:4, 1536 × 2048 px

```
frail English professor near seventy, bald with long white side whiskers, academic gown over a black frock coat, examining a clay tablet under a magnifying glass, cluttered study full of books and maps, warm oil-lamp light. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Madame Odile Fairweather

- Bestand: `helden/odile-fairweather.png`
- Formaat: 3:4, 1536 × 2048 px

```
Victorian spiritualist medium in her forties, dark velvet gown with jet beads, lace shawl, kohl-rimmed eyes, hands resting on a crystal ball, a darkened seance parlour lit by a single candle, faint ghostly mist at the edges. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Lady Cordelia Vane

- Bestand: `helden/cordelia-vane.png`
- Formaat: 3:4, 1536 × 2048 px

```
elegant aristocratic widow in her early thirties, 1888, black silk mourning gown with a high lace collar, pearl earrings, holding a ship's logbook, a tall Mayfair drawing room with a ship painting above the fireplace, cool window light. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Silas Rook

- Bestand: `helden/silas-rook.png`
- Formaat: 3:4, 1536 × 2048 px

```
weathered former police detective around fifty, 1888 Whitechapel, grey stubble, bowler hat and long rain-soaked overcoat, notebook in one hand, standing in a foggy cobbled alley under a single gas lamp, chalk symbol on the brick wall behind. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Winifred "Winnie" Lusk

- Bestand: `helden/winnie-lusk.png`
- Formaat: 3:4, 1536 × 2048 px

```
bright young woman in her early twenties, 1888, white shirtwaist blouse and dark skirt, ink-stained fingers, pencil behind her ear, sitting at an early typewriter surrounded by index card drawers and a pinned map of London with string lines. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Esme Valentine

- Bestand: `helden/esme-valentine.png`
- Formaat: 3:4, 1536 × 2048 px

```
music-hall singer in her late twenties, 1888, emerald green satin gown with feathers in dark curled hair, singing on a small stage, gas footlights flaring unnaturally bright, smoky audience silhouettes, theatrical warm and green light. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Sergeant Tobias Hale

- Bestand: `helden/tobias-hale.png`
- Formaat: 3:4, 1536 × 2048 px

```
broad-shouldered British army veteran in his late thirties, 1888, scarlet tunic worn open over a work shirt, campaign medal on his chest, rifle slung, scar across his cheek, standing guard at an iron gate at dusk, red brick and wet cobbles. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Dr. Cornelius Bray

- Bestand: `helden/cornelius-bray.png`
- Formaat: 3:4, 1536 × 2048 px

```
rugged explorer-archaeologist in his mid-forties, 1888, sun-browned skin, khaki field jacket and canvas trousers, battered pith helmet under his arm, crowbar in hand, standing beside an opened wooden crate stamped with Egyptian markings in a dim dockside warehouse. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Clementine Ashby

- Bestand: `helden/clementine-ashby.png`
- Formaat: 3:4, 1536 × 2048 px

```
pale young woman of nineteen, 1888, simple lavender dress, long loose fair hair, eyes half-closed, playing the violin by a rain-streaked window in a Soho garret, sheet music scattered on the floor, dreamy blue-grey light. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Detective Sergeant Owen Marsh

- Bestand: `helden/owen-marsh.png`
- Formaat: 3:4, 1536 × 2048 px

```
neat Victorian police detective in his mid-thirties, 1888, trim moustache, dark three-piece suit, overcoat and bowler hat, holding a thick case file tied with string, standing in a lamp-lit stone corridor of a police headquarters. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Miss Violet Thorne

- Bestand: `helden/violet-thorne.png`
- Formaat: 3:4, 1536 × 2048 px

```
composed woman in her early thirties, 1888, dark violet travelling dress and short cape, gloved hands holding a sealed envelope with an unusual wax seal, sharp attentive gaze, a gentlemen's club corridor with brass lamps behind her. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Broeder Ezra Whitlock

- Bestand: `helden/ezra-whitlock.png`
- Formaat: 3:4, 1536 × 2048 px

```
big kind-faced man in his late forties, 1888, sleeves rolled up, stained white apron over a dark waistcoat, wooden cross on a cord, ladling soup from a huge steaming kettle, a crowded East End soup kitchen lit by lanterns, some figures in the queue unnervingly still. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Constable Patrick "Paddy" Flynn

- Bestand: `helden/paddy-flynn.png`
- Formaat: 3:4, 1536 × 2048 px

```
young Irish river police constable in his mid-twenties, 1888, dark caped uniform and helmet, holding a storm lantern, standing in a rowing boat on the night-black Thames, a huge black Newfoundland dog at his side, fog and distant dock lights. half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 3. Oude goden

### Vathrûn, Die onder de rivier ademt

- Bestand: `goden/vathrun.png`
- Formaat: 16:9, 2560 × 1440 px

```
colossal shapeless presence beneath the river Thames at night, a vast pale eye opening in green murky water under a Victorian bridge, yellow fog rising from the surface, tiny gaslamps along the embankment for scale. wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Azh-Ilareth, De ster die te veel is

- Bestand: `goden/azh-ilareth.png`
- Formaat: 16:9, 2560 × 1440 px

```
an impossible white star with a sickly violet halo hanging low over Victorian London rooftops and chimneys at night, its light casting long strange shadows, a lone figure in a top hat staring upward from a rooftop. wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Nebet-Ankhu, De farao zonder gezicht

- Bestand: `goden/nebet-ankhu.png`
- Formaat: 16:9, 2560 × 1440 px

```
a towering robed figure in ancient Egyptian regalia whose face is a smooth featureless golden mask, standing among opened wooden crates in a Victorian dockside warehouse, lantern light and swirling dust, hieroglyphs glowing faintly on the crates. wide cinematic composition, the presence fills the upper two thirds, horizon and tiny human figures for scale in the lower third. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 4. Monsters

### Rivierwiedde

- Bestand: `monsters/rivierwiedde.png`
- Formaat: 1:1, 1536 × 1536 px

```
a tangle of black river weed shaped like a reaching human figure rising from the Thames mud at low tide. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Verdronkene

- Bestand: `monsters/verdronkene.png`
- Formaat: 1:1, 1536 × 1536 px

```
a pale drowned Victorian sailor with milky eyes and dripping clothes standing on stone river steps at night. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Rioolkruiper

- Bestand: `monsters/rioolkruiper.png`
- Formaat: 1:1, 1536 × 1536 px

```
a long eyeless pale creature with too many joints crawling out of a brick Victorian sewer tunnel by lantern light. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Mistdwaler

- Bestand: `monsters/mistdwaler.png`
- Formaat: 1:1, 1536 × 1536 px

```
a tall thin silhouette made of yellow London fog, faintly human, drifting between gas lamps on a cobbled street. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Logebroeder

- Bestand: `monsters/logebroeder.png`
- Formaat: 1:1, 1536 × 1536 px

```
a hooded Victorian cultist in a dark robe over a gentleman's suit, holding a dagger and a lantern, in a candlelit cellar. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Lantaarndrager

- Bestand: `monsters/lantaarndrager.png`
- Formaat: 1:1, 1536 × 1536 px

```
a Victorian occultist in a white ceremonial robe holding a pale violet lantern, standing in an ornate lodge temple with painted pillars. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Sterrenkind

- Bestand: `monsters/sterrenkind.png`
- Formaat: 1:1, 1536 × 1536 px

```
a small glowing childlike figure with a face like a cracked white star, standing barefoot on a rooftop in the moonlight. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Spiegelgast

- Bestand: `monsters/spiegelgast.png`
- Formaat: 1:1, 1536 × 1536 px

```
a distorted reflection of a Victorian lady stepping out of a gilded mirror in a dim drawing room. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kraaienzwerm

- Bestand: `monsters/kraaienzwerm.png`
- Formaat: 1:1, 1536 × 1536 px

```
a swirling flock of black crows forming the shape of a screaming face above Victorian chimneys at dusk. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Shabti-wachter

- Bestand: `monsters/shabti-wachter.png`
- Formaat: 1:1, 1536 × 1536 px

```
a life-sized ancient Egyptian funerary statue of glazed blue faience coming to life among museum crates, cracks glowing gold. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Sluierhond

- Bestand: `monsters/sluierhond.png`
- Formaat: 1:1, 1536 × 1536 px

```
a gaunt jackal-headed hound wrapped in tattered linen veils, eyes like embers, prowling an East London alley. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### De Bisschop van het Slib

- Bestand: `monsters/bisschop-van-het-slib.png`
- Formaat: 1:1, 1536 × 1536 px

```
a bloated drowned medieval bishop in rotting vestments crusted with river mud and shells, mitre dripping, rising from the Thames at Southwark. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### De Dichter zonder Ogen

- Bestand: `monsters/de-dichter-zonder-ogen.png`
- Formaat: 1:1, 1536 × 1536 px

```
a gaunt Victorian poet in a velvet smoking jacket with smooth skin where his eyes should be, writing glowing violet verses in the air with a quill. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### De Gemaskerde Hogepriester

- Bestand: `monsters/gemaskerde-hogepriester.png`
- Formaat: 1:1, 1536 × 1536 px

```
an ancient Egyptian high priest in gold and lapis regalia wearing a mask that shows a different stolen human face, standing in a torchlit tomb. full figure centred, readable silhouette, dark vignetted background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 5. Plekken

Deze beelden verschijnen als je op een plek staat of een ontmoeting hebt.

### Hampstead

- Bestand: `plekken/hampstead.png`
- Formaat: 3:2, 2048 × 1365 px

```
a domed brass observatory on a misty heath hill above distant London lights. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Marylebone

- Bestand: `plekken/marylebone.png`
- Formaat: 3:2, 2048 × 1365 px

```
a respectable Georgian terrace at night, one window glowing with seance candlelight behind heavy curtains. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### King's Cross

- Bestand: `plekken/kings-cross.png`
- Formaat: 3:2, 2048 × 1365 px

```
a vast iron and glass railway station with steam locomotives and smoke under gaslight. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Bloomsbury

- Bestand: `plekken/bloomsbury.png`
- Formaat: 3:2, 2048 × 1365 px

```
the grand colonnade of a great museum at night, and inside a domed circular reading room. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Soho

- Bestand: `plekken/soho.png`
- Formaat: 3:2, 2048 × 1365 px

```
a narrow Soho street with foreign cafes and a small occult bookshop with a glowing window. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Mayfair

- Bestand: `plekken/mayfair.png`
- Formaat: 3:2, 2048 × 1365 px

```
a lavish Mayfair drawing room with gilded mirrors, chandeliers and potted palms. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Covent Garden

- Bestand: `plekken/covent-garden.png`
- Formaat: 3:2, 2048 × 1365 px

```
a bustling covered market at night with flower sellers and fruit stalls under lanterns. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Leicester Square

- Bestand: `plekken/leicester-square.png`
- Formaat: 3:2, 2048 × 1365 px

```
the exotic illuminated facade of a Victorian music hall theatre with playbills. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Pall Mall

- Bestand: `plekken/pall-mall.png`
- Formaat: 3:2, 2048 × 1365 px

```
a gentlemen's club library with leather armchairs, globes and expedition trophies. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Strand

- Bestand: `plekken/strand.png`
- Formaat: 3:2, 2048 × 1365 px

```
a college courtyard and newspaper offices along a riverside embankment with gas lamps. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### The City

- Bestand: `plekken/city.png`
- Formaat: 3:2, 2048 × 1365 px

```
the great dome of a cathedral over banks and an old hospital gateway in fog. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Spitalfields

- Bestand: `plekken/spitalfields.png`
- Formaat: 3:2, 2048 × 1365 px

```
a covered market hall and a steaming soup kitchen with a long queue. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Whitechapel

- Bestand: `plekken/whitechapel.png`
- Formaat: 3:2, 2048 × 1365 px

```
crowded lodging houses and narrow alleys of East London in thick fog. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Whitehall

- Bestand: `plekken/whitehall.png`
- Formaat: 3:2, 2048 × 1365 px

```
stately government buildings and a police headquarters with caped constables. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Westminster

- Bestand: `plekken/westminster.png`
- Formaat: 3:2, 2048 × 1365 px

```
the gothic abbey and parliament clock tower by the river under a strange moon. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Chelsea

- Bestand: `plekken/chelsea.png`
- Formaat: 3:2, 2048 × 1365 px

```
artists' studios on a riverside embankment with barges in moonlight. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Southwark

- Bestand: `plekken/southwark.png`
- Formaat: 3:2, 2048 × 1365 px

```
the south bank with breweries, laundries and an old market under railway arches. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### St Katharine Docks

- Bestand: `plekken/st-katharine-docks.png`
- Formaat: 3:2, 2048 × 1365 px

```
enclosed docks with tall ships, warehouses and stacked crates from distant lands. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Wapping

- Bestand: `plekken/wapping.png`
- Formaat: 3:2, 2048 × 1365 px

```
river stairs down to the black Thames, a sailors' tavern and a river police station. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Limehouse

- Bestand: `plekken/limehouse.png`
- Formaat: 3:2, 2048 × 1365 px

```
Limehouse waterfront with Chinese shopfronts, ropewalks and coal barges in lantern light. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Thebe, Egypte

- Bestand: `plekken/thebe.png`
- Formaat: 3:2, 2048 × 1365 px

```
a rocky Egyptian valley with tomb entrances carved into cliffs under a burning sky, expedition tents. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Klooster van de Witte Wolken, Himalaya

- Bestand: `plekken/himalaya.png`
- Formaat: 3:2, 2048 × 1365 px

```
a white monastery on a snowy Himalayan ridge with prayer flags and a bronze bell. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Tempel in het oerwoud, Yucatán

- Bestand: `plekken/yucatan.png`
- Formaat: 3:2, 2048 × 1365 px

```
an overgrown stepped pyramid in a rain-soaked jungle with carved stone heads. establishing view of the place at dusk or night, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 6. Spullen en bondgenoten

### Dienstrevolver (Wapen)

- Bestand: `spullen/webley.png`
- Formaat: 1:1, 1024 × 1024 px

```
a heavy Victorian service revolver with a worn wooden grip and a box of cartridges. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Olifantengeweer (Wapen)

- Bestand: `spullen/olifantengeweer.png`
- Formaat: 1:1, 1024 × 1024 px

```
a big-game double-barrelled rifle with brass fittings and a leather sling. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Wandelstok met degen (Wapen)

- Bestand: `spullen/wandelstokdegen.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ebony walking cane partly drawn to reveal a slim hidden sword blade. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Ossenzweep (Wapen)

- Bestand: `spullen/ossenzweep.png`
- Formaat: 1:1, 1024 × 1024 px

```
a coiled leather bullwhip on a dusty expedition crate. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Staaf dynamiet (Wapen)

- Bestand: `spullen/dynamiet.png`
- Formaat: 1:1, 1024 × 1024 px

```
a single stick of dynamite with a short fuse in a wooden mining box. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Zilveren kogels (Wapen)

- Bestand: `spullen/zilveren-kogels.png`
- Formaat: 1:1, 1024 × 1024 px

```
a small handful of gleaming silver bullets in a velvet-lined case. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Stormlantaarn (Gereedschap)

- Bestand: `spullen/stormlantaarn.png`
- Formaat: 1:1, 1024 × 1024 px

```
a brass storm lantern with a glowing flame and sooty glass. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Gladstonetas (Gereedschap)

- Bestand: `spullen/gladstonetas.png`
- Formaat: 1:1, 1024 × 1024 px

```
a battered brown leather Gladstone bag, half open. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Reiscamera met platen (Gereedschap)

- Bestand: `spullen/camera.png`
- Formaat: 1:1, 1024 × 1024 px

```
a wooden Victorian field camera on a tripod with brass lens and glass plates. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Koperen kompas (Gereedschap)

- Bestand: `spullen/kompas.png`
- Formaat: 1:1, 1024 × 1024 px

```
an open brass pocket compass with a needle pointing slightly wrong. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Breekijzer (Gereedschap)

- Bestand: `spullen/breekijzer.png`
- Formaat: 1:1, 1024 × 1024 px

```
a heavy iron crowbar resting against a cracked wooden crate. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Spoorboekje (Reizen)

- Bestand: `spullen/bradshaw.png`
- Formaat: 1:1, 1024 × 1024 px

```
a worn railway timetable booklet beside a train ticket and a pocket watch. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Rijtuigkaart (Reizen)

- Bestand: `spullen/rijtuig.png`
- Formaat: 1:1, 1024 × 1024 px

```
a hansom cab fare card and coins on a wet cobblestone. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kaartje voor de Ondergrondse (Reizen)

- Bestand: `spullen/ondergronds.png`
- Formaat: 1:1, 1024 × 1024 px

```
a small cardboard railway ticket and a gas-lit underground platform sign shape without letters. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Flesje laudanum (Middel)

- Bestand: `spullen/laudanum.png`
- Formaat: 1:1, 1024 × 1024 px

```
a small dark-blue glass bottle of laudanum with a cork and a spoon. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Carbolzuur en verband (Middel)

- Bestand: `spullen/carbol.png`
- Formaat: 1:1, 1024 × 1024 px

```
a brown glass bottle of carbolic acid, rolled linen bandages and scissors. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Vlugzout (Middel)

- Bestand: `spullen/vlugzout.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ornate silver smelling-salts vial. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Chloroform (Middel)

- Bestand: `spullen/chloroform.png`
- Formaat: 1:1, 1024 × 1024 px

```
a glass chloroform bottle and a folded white cloth. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Een Vlaamse grimoire (Boek)

- Bestand: `spullen/boek-grimoire.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ancient leather grimoire with iron clasps and strange sigils embossed. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Reisverslag van een vermiste ontdekker (Boek)

- Bestand: `spullen/boek-reisverslag.png`
- Formaat: 1:1, 1024 × 1024 px

```
a water-stained explorer's travel journal with sketches of ruins and a pressed flower. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Tabellen van de nachthemel (Boek)

- Bestand: `spullen/boek-astrologie.png`
- Formaat: 1:1, 1024 × 1024 px

```
an open book of astronomical tables with star diagrams and a brass divider. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Woordenboek van het oud-Egyptisch (Boek)

- Bestand: `spullen/boek-egyptisch.png`
- Formaat: 1:1, 1024 × 1024 px

```
a thick scholarly book open on hieroglyph drawings beside a magnifying glass. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Bende straatjochies (Bondgenoot)

- Bestand: `spullen/bondgenoot-straatjongens.png`
- Formaat: 1:1, 1024 × 1024 px

```
a cheeky gang of four Victorian street urchins in flat caps on a stone stairway. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Journaliste van de avondkrant (Bondgenoot)

- Bestand: `spullen/bondgenoot-journalist.png`
- Formaat: 1:1, 1024 × 1024 px

```
a sharp-eyed young woman reporter in a straw boater with a notebook and pencil. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Nachtkoetsier (Bondgenoot)

- Bestand: `spullen/bondgenoot-koetsier.png`
- Formaat: 1:1, 1024 × 1024 px

```
a grizzled hansom cab driver in a caped coat holding the reins at night. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Agent op ronde (Bondgenoot)

- Bestand: `spullen/bondgenoot-agent.png`
- Formaat: 1:1, 1024 × 1024 px

```
a Victorian police constable in a tall helmet with a bullseye lantern. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Expeditiegids (Bondgenoot)

- Bestand: `spullen/bondgenoot-gids.png`
- Formaat: 1:1, 1024 × 1024 px

```
a seasoned expedition guide in desert travel clothes holding a rifle and a rolled map. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Raaf uit de Tower (Dier)

- Bestand: `spullen/dier-raaf.png`
- Formaat: 1:1, 1024 × 1024 px

```
a large glossy raven perched on an old stone battlement. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Rattenvanger-terriër (Dier)

- Bestand: `spullen/dier-terrier.png`
- Formaat: 1:1, 1024 × 1024 px

```
a scruffy alert rat-catching terrier with a red collar. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kanarie in een kooitje (Dier)

- Bestand: `spullen/dier-kanarie.png`
- Formaat: 1:1, 1024 × 1024 px

```
a yellow canary in a small brass birdcage. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Zwarte straatkat (Dier)

- Bestand: `spullen/dier-kat.png`
- Formaat: 1:1, 1024 × 1024 px

```
a sleek black cat with green eyes sitting on a windowsill. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Trouwe ruin (Dier)

- Bestand: `spullen/dier-paard.png`
- Formaat: 1:1, 1024 × 1024 px

```
a sturdy chestnut horse with a gentle face, wearing a simple bridle. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 7. Spreuken

### Kring van zout en ijzer

- Bestand: `spreuken/zout-en-ijzer.png`
- Formaat: 1:1, 1024 × 1024 px

```
a circle of white salt and iron nails poured on floorboards, faintly glowing. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Woord van sluiting

- Bestand: `spreuken/woord-van-sluiting.png`
- Formaat: 1:1, 1024 × 1024 px

```
a gloved hand pressing a glowing sigil onto a tear in the air that is sealing shut. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Hermetische verbanning

- Bestand: `spreuken/verbanning.png`
- Formaat: 1:1, 1024 × 1024 px

```
a hand raising a brass pentacle that blazes with pale light against a shadow. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Spiegelgang

- Bestand: `spreuken/spiegelgang.png`
- Formaat: 1:1, 1024 × 1024 px

```
a hand reaching into the rippling surface of a gilded mirror. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Astrale reis

- Bestand: `spreuken/astrale-reis.png`
- Formaat: 1:1, 1024 × 1024 px

```
a sleeping figure on a chaise longue with a translucent glowing double rising above. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Tarotlegging

- Bestand: `spreuken/tarot.png`
- Formaat: 1:1, 1024 × 1024 px

```
three tarot-style cards without letters laid out on a dark cloth beside a candle. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Lezing van de theebladeren

- Bestand: `spreuken/theebladeren.png`
- Formaat: 1:1, 1024 × 1024 px

```
tea leaves in a chipped china cup forming a strange shape. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Henochiaanse aanroeping

- Bestand: `spreuken/henochiaanse-aanroeping.png`
- Formaat: 1:1, 1024 × 1024 px

```
a wax tablet with angular occult letters glowing, crystal and candles around it. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Sympathiepop

- Bestand: `spreuken/sympathiepop.png`
- Formaat: 1:1, 1024 × 1024 px

```
a small cloth and straw poppet stuck with pins, bound with red thread. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Mesmerisme

- Bestand: `spreuken/mesmerisme.png`
- Formaat: 1:1, 1024 × 1024 px

```
a swinging silver watch on a chain before a pair of hypnotised eyes. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kaars van terugkeer

- Bestand: `spreuken/kaars-van-terugkeer.png`
- Formaat: 1:1, 1024 × 1024 px

```
a single tall white candle with a warm healing glow over clasped hands. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Wake van de wachter

- Bestand: `spreuken/wake-van-de-wachter.png`
- Formaat: 1:1, 1024 × 1024 px

```
an open eye drawn in chalk on a door, lantern light, a guardian silhouette. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Het kleine pentagram

- Bestand: `spreuken/pentagram.png`
- Formaat: 1:1, 1024 × 1024 px

```
a five-pointed star traced in the air with a dagger, glowing pale blue. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Doodsmasker

- Bestand: `spreuken/doodsmasker.png`
- Formaat: 1:1, 1024 × 1024 px

```
a pale plaster death mask held up before a face in candlelight. close-up of hands and ritual objects performing the spell, glowing effect as the focal point, dark background. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 8. Artefacten

### De zwarte spiegel

- Bestand: `artefacten/zwarte-spiegel.png`
- Formaat: 1:1, 1024 × 1024 px

```
a polished black obsidian scrying mirror in a worn leather case, reflecting a faint violet star, on a dark velvet cloth. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Scarabee van de dageraad

- Bestand: `artefacten/scarabee.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ancient green stone scarab amulet with gold-leaf wings, glowing faintly at dawn, resting in a museum specimen tray. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Hand van glorie

- Bestand: `artefacten/hand-van-glorie.png`
- Formaat: 1:1, 1024 × 1024 px

```
a dried withered human hand holding five lit candles on its fingertips, in a dark Victorian cabinet of curiosities. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Bel van de Witte Wolken

- Bestand: `artefacten/klokkenbel.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ornate bronze Himalayan temple bell with a carved dragon handle and prayer inscriptions, snow light from a monastery window. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Jade dodenmasker

- Bestand: `artefacten/jade-masker.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ancient Mesoamerican jade mosaic death mask with shell and obsidian eyes, lying on wet jungle stones in torchlight. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kaart van de verkeerde hemel

- Bestand: `artefacten/sterrenkaart.png`
- Formaat: 1:1, 1024 × 1024 px

```
an old hand-drawn celestial chart on yellowed parchment with constellations in ink and one extra star painted in glowing violet. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Verzegelde kruik

- Bestand: `artefacten/verzegelde-kruik.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ancient Egyptian canopic jar with a jackal-headed lid, sealed with intact dark wax and cord, on a dusty wooden crate. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Kristallen schedel

- Bestand: `artefacten/kristallen-schedel.png`
- Formaat: 1:1, 1024 × 1024 px

```
a life-sized human skull carved from clear rock crystal, refracting candlelight into rainbow shards, on a black lacquered table. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Lens van de verloren expeditie

- Bestand: `artefacten/vuurtoren-lens.png`
- Formaat: 1:1, 1024 × 1024 px

```
a heavy brass-framed glass lens covered in frost and cracks, recovered from Arctic ice, glowing pale blue. single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 9. Achterkanten van kaartstapels

Alle achterkanten hebben hetzelfde ontwerp: een donkere, sierlijke Victoriaanse rand met in het midden een embleem. Alleen het embleem en de kleur verschillen per stapel.

### Spullen

- Bestand: `achterkanten/spullen.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a brass key crossed with a revolver, teal and gold. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Spreuken

- Bestand: `achterkanten/spreuken.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a five-pointed star within a circle of sigils, violet and gold. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Artefacten

- Bestand: `achterkanten/artefacten.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a scarab inside an eye, gold on oxblood. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Toestanden

- Bestand: `achterkanten/toestanden.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a cracked mirror, grey and silver. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Onheil

- Bestand: `achterkanten/onheil.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a single staring eye in yellow fog, sickly yellow on black. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Stadsontmoetingen

- Bestand: `achterkanten/stad.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a gas lamp in fog, amber on dark teal. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Expeditieontmoetingen

- Bestand: `achterkanten/expeditie.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a compass rose over a pith helmet, sand and brown. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Scheurontmoetingen

- Bestand: `achterkanten/scheur.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a jagged violet tear in the air, violet on black. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Mysteries

- Bestand: `achterkanten/mysterie.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a magnifying glass over a star map, gold on deep blue. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Monsterfiches

- Bestand: `achterkanten/monster.png`
- Formaat: 3:4, 1024 × 1365 px

```
ornate Victorian card back, dark lacquered background with fine gilded filigree, centred emblem of a clawed silhouette, oxblood on black. symmetrical ornamental card back design, centred emblem, decorative pattern to the edges, flat and even, no perspective. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 10. Fiches

### Aanwijzing

- Bestand: `fiches/aanwijzing.png`
- Formaat: 1:1, 512 × 512 px

```
a round green-glass token with an engraved magnifying-glass symbol. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Scheur

- Bestand: `fiches/scheur.png`
- Formaat: 1:1, 512 × 512 px

```
a round token showing a glowing violet tear in reality with dark depth inside. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Pond

- Bestand: `fiches/pond.png`
- Formaat: 1:1, 512 × 512 px

```
a gold sovereign coin seen from above, worn and old. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Trofee

- Bestand: `fiches/trofee.png`
- Formaat: 1:1, 512 × 512 px

```
a round bronze medal token with a laurel wreath. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Mist

- Bestand: `fiches/mist.png`
- Formaat: 1:1, 512 × 512 px

```
a round pewter token with swirling yellow fog inside. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Gezegend

- Bestand: `fiches/gezegend.png`
- Formaat: 1:1, 512 × 512 px

```
a round white enamel token with a golden sunburst. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Vervloekt

- Bestand: `fiches/vervloekt.png`
- Formaat: 1:1, 512 × 512 px

```
a round black enamel token with a cracked violet sigil. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Heldenstandaard

- Bestand: `fiches/held.png`
- Formaat: 1:1, 512 × 512 px

```
a round brass base plate with an empty dark centre, for a hero portrait. single round token seen straight from above, centred, plain flat neutral grey background so it can be cut out. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## Controlelijst

In totaal 133 afbeeldingen. Kijk na afloop of:

- elk bestand de juiste naam en map heeft;
- er nergens tekst of letters in een afbeelding staan;
- de helden samen als één portretreeks voelen;
- monsters en fiches een rustige, donkere achtergrond hebben, zodat ze rond uitgesneden kunnen worden.

Upload daarna de map `Londen1888-art` naar Google Drive.
