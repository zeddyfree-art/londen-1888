# Beeldopdracht: de Scheurkaart

Een aanvulling op `beeldopdracht.md`. Als een held door een Scheur stapt, krijgt hij een violette kaart met bovenaan een rond, draaiend portaal. In dat portaal staat nu de kleine Scheur-fiche. Deze opdracht maakt er een eigen schilderij voor: **de blik door de Scheur naar de andere kant**.

Er is één algemeen beeld en drie varianten, één per oude god. Het spel kiest bij elke kaart het beeld van de god van dat potje, of anders het algemene beeld. Het algemene beeld (nummer 1) is genoeg om te beginnen. De drie andere maken het mooier, maar zijn niet nodig.

## Instructies voor de AI

1. Maak elk beeld **vierkant: 1:1, 1024 × 1024 px**, als PNG.
2. Het beeld wordt in het spel **rond uitgesneden** (een cirkel binnen het vierkant) en klein getoond, ongeveer 200 px breed. Zet het onderwerp dus in het midden. Wat in de hoeken staat, valt weg.
3. Eén duidelijk beeld met een sterk licht-donker contrast. Geen kleine details die op 200 px verdwijnen.
4. De rand van het beeld loopt over in bijna zwart violet, zodat het mooi opgaat in de donkere kaart en de draaiende lichtring eromheen.
5. Gebruik de volledige prompt, inclusief de vaste stijlregel aan het eind. Verander die stijlregel niet.
6. Zet nooit tekst, letters of cijfers in een afbeelding.
7. Lever de bestanden op met precies de bestandsnaam die bij de prompt staat, in de submap **`scheur/`** in de Drive-map `Londen1888-art`.

**Stijlregel** (staat aan het eind van elke prompt):

> Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting

**Kleur:** violet is in het hele spel alleen voor het bovennatuurlijke. Hier mag het dus de hoofdrol spelen, maar houd het ziekelijk en diep, niet roze of neon.

## 1. De andere kant (algemeen)

- Bestand: `scheur/portaal.png`
- Formaat: 1:1, 1024 × 1024 px
- Gebruikt bij: alle Scheurkaarten, en als er geen beeld van de god is

```
A view through a jagged vertical tear in reality, as if the air itself has ripped open like torn canvas. The torn edges glow with sickly violet light and curl outward like burnt paper. Around the tear, at the very edges, a faint wet cobblestone London street at night with one blurred amber gas lamp. Through the tear, filling the centre: an impossible other world, a vast plain of black glass under a violet sky with two pale suns, strange tall towers in the far distance, and a tiny lone Victorian figure in a long coat standing on the threshold, seen from behind, for scale. Circular composition, everything important within the central circle, the corners fade into near-black violet. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no neon colours, no pink.
```

## 2. Vathrûn, die onder de rivier ademt

- Bestand: `scheur/vathrun.png`
- Formaat: 1:1, 1024 × 1024 px
- Gebruikt bij: Scheurkaarten in een potje tegen Vathrûn

```
A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and dripping with river water. Through the tear, filling the centre: the drowned depths beneath the Thames, a round chamber of ancient green-black stones, knee-deep dark water reflecting violet light, a heavy stone door sealed with seven round seals, and beyond it the suggestion of something enormous slowly breathing in the murk, only a vast dim curve of a body visible. A tiny Victorian figure with a lantern stands in the water, seen from behind, for scale. Circular composition, everything important within the central circle, the corners fade into near-black violet and deep teal. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no tentacles, no neon colours, no pink.
```

## 3. Azh-Ilareth, de ster die te veel is

- Bestand: `scheur/azh-ilareth.png`
- Formaat: 1:1, 1024 × 1024 px
- Gebruikt bij: Scheurkaarten in een potje tegen Azh-Ilareth

```
A view through a jagged vertical tear in reality, the torn edges glowing with cold violet-white starlight. Through the tear, filling the centre: a bare heath under a sky where a single enormous pale star fills half the heavens, its colourless light casting no shadows, and below it a long hall of tall gilded mirrors standing in the grass, each mirror reflecting the star larger than the last. A tiny Victorian figure in a long coat stands among the mirrors, seen from behind, shielding their eyes, for scale. Circular composition, everything important within the central circle, the corners fade into near-black violet. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no neon colours, no pink.
```

## 4. Nebet-Ankhu, de farao zonder gezicht

- Bestand: `scheur/nebet-ankhu.png`
- Formaat: 1:1, 1024 × 1024 px
- Gebruikt bij: Scheurkaarten in een potje tegen Nebet-Ankhu

```
A view through a jagged vertical tear in reality, the torn edges glowing sickly violet and flaking like old gold leaf. Through the tear, filling the centre: a long sandstone tomb corridor lit by small oil lamps that no one has lit, the walls lined with hundreds of golden funerary masks, every mask a different face, all turned towards the viewer, and one empty place on the wall where a mask is missing. Fine sand drifts through the tear into the dark London side. A tiny Victorian figure stands at the start of the corridor, seen from behind, for scale. Circular composition, everything important within the central circle, the corners fade into near-black violet and warm sandstone shadow. Late-Victorian oil painting, 1888 London, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight against cold green-grey fog, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no mummies, no neon colours, no pink.
```

## Controlelijst

- [ ] `scheur/portaal.png` (nodig)
- [ ] `scheur/vathrun.png` (mag)
- [ ] `scheur/azh-ilareth.png` (mag)
- [ ] `scheur/nebet-ankhu.png` (mag)

## Aanleveren

Zet de PNG-bestanden in de Drive-map `Londen1888-art/scheur/` en geef Claude de links. Die komen in `tools/art-drive.json`, en daarna haalt Claude ze op met:

```bash
python3 -I tools/haal-art.py tools/art-drive.json
```

Dat maakt `art/scheur/<naam>.jpg`. Het spel gebruikt ze dan vanzelf: zolang een beeld ontbreekt, blijft de oude Scheur-fiche staan.
