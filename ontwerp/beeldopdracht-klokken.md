# Beeldopdracht: de Klokken van Westminster

Een aanvulling op `beeldopdracht.md`. Bij een nieuw spel kies je welke van de 13 klokken je laat luiden. Die keuze maak je op een grote wijzerplaat van Big Ben met dertien uren. Deze opdracht maakt de wijzerplaat, een sfeerbeeld van de toren, een achtergrond voor het scorebord en een rond icoon voor elk van de 13 klokken.

Het spel tekent de cijfers (I tot XIII), de wijzers en de oplichtende vakjes zelf over het schilderij heen. Daarom staan er **geen cijfers en geen wijzers** in de beelden.

## Instructies voor de AI

1. Maak elk beeld precies in het opgegeven formaat, als PNG.
2. Gebruik de volledige prompt, inclusief de vaste stijlregel aan het eind. Verander die stijlregel niet.
3. Zet nooit tekst, letters, cijfers of Romeinse cijfers in een afbeelding.
4. Lever de bestanden op met precies de bestandsnaam die bij de prompt staat, in de submap die erbij staat in de Drive-map `Londen1888-art`.
5. Begin met de wijzerplaat (nummer 1). Die bepaalt de sfeer. Kijk daarna of de iconen erbij passen: hetzelfde violet, hetzelfde goud, hetzelfde donker.

**Stijlregel** (staat aan het eind van elke prompt):

> Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting

**Kleur:** goud en gietijzer voor de klok, ziekelijk violet voor alles wat bovennatuurlijk is.

## 1. De wijzerplaat

- Bestand: `scherm/klok.png`
- Formaat: 1:1, 1536 × 1536 px

```
The great clock face of Big Ben seen straight on, perfectly centred and filling the whole square, a perfect circle. An ornate Gothic Revival dial of cast iron and gilded bronze with intricate tracery like a rose window. Around the outer ring sit exactly thirteen evenly spaced empty gilded cartouches where the hour numerals would be, all left blank. The opal glass of the dial is dark and smoky, lit from behind by a faint sickly violet glow that grows stronger towards the centre, as if something on the other side is pressing against the glass. Fine cracks of violet light run through the glass between the tracery. No hands, a plain round boss in the exact centre. Flat frontal view, no perspective, no tower visible, the corners outside the circle are pure black. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no roman numerals, no clock hands, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 2. De toren bij het dertiende uur

- Bestand: `scherm/big-ben.png`
- Formaat: 16:9, 2560 × 1440 px
- Gebruikt bij: de kop van de klokken op het startscherm en het scorebord

```
The clock tower of the Palace of Westminster at night in 1888, seen from the misty Thames embankment, rising into a low churning sky. The clock face glows with an unnatural sickly violet light instead of the usual warm white, and the sky around the tower spirals slowly like a whirlpool. Gas lamps along the embankment glow amber in thick green-grey fog, the dark river reflects the violet glow. A few tiny Victorian figures on the embankment look up in unease. The tower stands in the right third, leaving calm dark sky on the left for a title. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 3. Het scorebord

- Bestand: `scherm/scorebord.png`
- Formaat: 16:9, 2560 × 1440 px
- Gebruikt bij: de achtergrond van het scorebord, zwaar verdonkerd, met de tabel erover

```
An open leather-bound ledger on a dark mahogany desk in a gentlemen's club library at night, the cream pages ruled with faint lines but completely blank, a brass oil lamp casting warm amber light from the left, an inkwell and a dip pen, a small brass bell beside the book. In the dim background, bookshelves and a tall window with violet-tinged fog outside. The ledger fills the centre of the image, seen from slightly above. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no handwriting, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## 4. De dertien klokken

Elke klok krijgt een rond icoon. Het spel toont het klein (ongeveer 56 px) naast de naam van de klok, en groot in het venster met uitleg.

- Formaat: 1:1, 512 × 512 px, voor alle dertien
- Submap: `klokken/`

Voor alle dertien geldt dezelfde vorm, zodat ze één set worden. Die staat in elke prompt hieronder al aan het begin:

> A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size.

### I. Dikke mist

- Bestand: `klokken/dikke-mist.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a single gas street lamp almost swallowed by a thick wall of green-grey fog, its amber flame barely visible. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### II. Lege zakken

- Bestand: `klokken/lege-zakken.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a worn leather coin purse turned inside out and completely empty, one dull copper farthing beside it. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### III. Gesloten lijnen

- Bestand: `klokken/gesloten-lijnen.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: the iron gate of a Victorian underground railway station, chained shut with a heavy padlock, a faint violet glow leaking from the dark stairway behind it. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no signs, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### IV. Zware benen

- Bestand: `klokken/zware-benen.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a pair of muddy Victorian leather boots on wet cobblestones, each ankle shackled to a heavy iron ball by a short chain. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### V. Zwijgende getuigen

- Bestand: `klokken/zwijgende-getuigen.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: three shadowy Victorian figures in a dark alley, faces hidden under hats and shawls, each pressing one finger to their lips. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### VI. Taaie wezens

- Bestand: `klokken/taaie-wezens.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a broken sword blade snapped against thick grey scaled hide, sparks and a faint violet glow at the point of impact. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore, no blood.
```

### VII. Huiveringwekkend

- Bestand: `klokken/huiveringwekkend.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: an enormous shadow with many pale glowing eyes looming over a tiny Victorian figure holding up a lantern. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### VIII. Scheurende stad

- Bestand: `klokken/scheurende-stad.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: wet London cobblestones split open by a jagged glowing violet crack, violet light and mist pouring up from the depth. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### IX. Slapeloze nachten

- Bestand: `klokken/slapeloze-nachten.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a brass candlestick with a candle burnt down to a stub beside a small brass pocket watch lying open, its face glowing faintly violet, on a night table. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no roman numerals, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### X. Geen tweede worp

- Bestand: `klokken/geen-tweede-worp.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: two old ivory dice on green baize, one of them cracked clean in half, a thin wisp of violet smoke rising from the crack. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### XI. Ongeduldige god

- Bestand: `klokken/ongeduldige-god.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: one vast eye opening in the churning night clouds above the silhouetted rooftops and chimneys of London, its iris glowing sickly violet. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### XII. Dertien slagen

- Bestand: `klokken/dertien-slagen.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a great bronze bell in a dark belfry, caught mid-swing, rings of violet sound waves rippling out from its rim. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### XIII. Geen genade

- Bestand: `klokken/geen-genade.png`

```
A round medallion icon, a single bold subject centred inside a thin ring of dark gilded bronze with small Gothic tracery, dark background inside the ring, plain flat neutral grey outside the ring so it can be cut out, readable at small size. Subject: a church candle just snuffed out, a single thin trail of smoke curling up into total darkness, a faint violet glow at the very top. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numbers, no captions, no watermark, no signature, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

## Controlelijst

- [ ] `scherm/klok.png`
- [ ] `scherm/big-ben.png`
- [ ] `scherm/scorebord.png`
- [ ] 13 × `klokken/<naam>.png`: dikke-mist, lege-zakken, gesloten-lijnen, zware-benen, zwijgende-getuigen, taaie-wezens, huiveringwekkend, scheurende-stad, slapeloze-nachten, geen-tweede-worp, ongeduldige-god, dertien-slagen, geen-genade

## Aanleveren

Zet de bestanden in de Drive-map `Londen1888-art`, in de submappen `scherm/` en `klokken/`, en zeg het tegen Claude. Die zoekt ze op, haalt ze op met `tools/haal-art.py` en zet ze in het spel. Tot die tijd tekent het spel de klok zelf.
