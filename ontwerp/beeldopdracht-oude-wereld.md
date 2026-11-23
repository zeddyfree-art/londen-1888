# Beeldopdracht: Kaarten van de Oude Wereld

De beelden voor de uitbreiding: de plekken op de drie regiokaarten (Thebe, de Himalaya en Yucatán), de zes schatten, de drie nieuwe helden en hun persoonlijke spullen. Zolang een beeld ontbreekt, toont het spel een kleurvlak of initialen.

## Instructies voor de AI

Je maakt schilderijen voor een bordspel uit 1888. Werk de lijst hieronder beeld voor beeld af.

1. Maak elk beeld precies in het opgegeven formaat (verhouding en pixels).
2. Gebruik de prompt in het codeblok volledig en letterlijk. De stijlregel staat er al achter; verander die niet.
3. Zet nooit tekst, letters of cijfers in een afbeelding.
4. Lever elk beeld als PNG, met precies de bestandsnaam die erbij staat, in de map die erbij staat.
5. Lever niets anders op dan de beelden zelf.

## Waar elk beeld heen moet

Alle mappen staan in de Drive-map `Londen1888-art`. Maak een map aan als die nog niet bestaat.

| Map | Wat erin komt | Formaat |
|---|---|---|
| `oude-wereld/` | De plekken op de regiokaarten | 3:2, 2048 × 1365 px |
| `artefacten/` | De zes schatten | 1:1, 1024 × 1024 px |
| `helden/` | De drie nieuwe helden | 3:4, 1536 × 2048 px |
| `persoonlijk/` | Hun persoonlijke spullen | 1:1, 1024 × 1024 px |

## Afvinklijst

- [ ] `oude-wereld/thebe-aankomst.png` · Luxor, de kade
- [ ] `oude-wereld/thebe-vallei-der-koningen.png` · De Vallei der Koningen
- [ ] `oude-wereld/thebe-karnak.png` · Karnak
- [ ] `oude-wereld/thebe-deir-el-bahari.png` · Deir el-Bahari
- [ ] `oude-wereld/thebe-medinet-habu.png` · Medinet Habu
- [ ] `oude-wereld/thebe-gurna.png` · Gurna
- [ ] `oude-wereld/thebe-kamp-harrowgate.png` · Het kamp van de Harrowgate-expeditie
- [ ] `oude-wereld/thebe-woestijnweg.png` · De woestijnweg
- [ ] `oude-wereld/thebe-hart.png` · Het naamloze graf
- [ ] `oude-wereld/himalaya-aankomst.png` · Darjeeling
- [ ] `oude-wereld/himalaya-hoge-pas.png` · De hoge pas
- [ ] `oude-wereld/himalaya-klooster-witte-wolken.png` · Het Klooster van de Witte Wolken
- [ ] `oude-wereld/himalaya-hol-kluizenaar.png` · Het hol van de kluizenaar
- [ ] `oude-wereld/himalaya-brug-gebedsvlaggen.png` · De brug van gebedsvlaggen
- [ ] `oude-wereld/himalaya-verlaten-fort.png` · Het verlaten fort
- [ ] `oude-wereld/himalaya-gletsjer.png` · De gletsjer
- [ ] `oude-wereld/himalaya-dorp-dragers.png` · Het dorp van de dragers
- [ ] `oude-wereld/himalaya-hart.png` · Boven de wolken
- [ ] `oude-wereld/yucatan-aankomst.png` · Progreso, de haven
- [ ] `oude-wereld/yucatan-cenote.png` · De cenote
- [ ] `oude-wereld/yucatan-sterrenhuis.png` · Het sterrenhuis
- [ ] `oude-wereld/yucatan-kamp-chicleros.png` · Het kamp van de chicleros
- [ ] `oude-wereld/yucatan-verlaten-hacienda.png` · De verlaten haciënda
- [ ] `oude-wereld/yucatan-rivier-onder-de-grond.png` · De rivier onder de grond
- [ ] `oude-wereld/yucatan-veld-steles.png` · Het veld van de stèles
- [ ] `oude-wereld/yucatan-ruine-slang.png` · De ruïne met de slang
- [ ] `oude-wereld/yucatan-hart.png` · De tempel onder de tempel
- [ ] `artefacten/canope-naamloze-farao.png` · Canope van de naamloze farao
- [ ] `artefacten/zonneschijf-aton.png` · Zonneschijf van Aton
- [ ] `artefacten/kristallen-gebedsmolen.png` · Kristallen gebedsmolen
- [ ] `artefacten/sneeuwleeuwmantel.png` · Mantel van de sneeuwleeuw
- [ ] `artefacten/kalendersteen.png` · Kalendersteen
- [ ] `artefacten/obsidiaanspiegel.png` · Obsidiaanspiegel van de Gevederde Slang
- [ ] `helden/mahmoud-fathy.png` · Ra'is Mahmoud Fathy
- [ ] `persoonlijk/opzichtersstok.png` · Opzichtersstok (Ra'is Mahmoud Fathy)
- [ ] `persoonlijk/kaart-vallei.png` · Kaart van de Vallei (Ra'is Mahmoud Fathy)
- [ ] `helden/ang-nima.png` · Ang Nima Sherpa
- [ ] `persoonlijk/kukri.png` · Kukri (Ang Nima Sherpa)
- [ ] `persoonlijk/bergtouw.png` · Bergtouw (Ang Nima Sherpa)
- [ ] `helden/teresa-canul.png` · Teresa Canul
- [ ] `persoonlijk/camera-glasplaten.png` · Camera met glasplaten (Teresa Canul)
- [ ] `persoonlijk/machete.png` · Machete (Teresa Canul)

## Daarna (voor de maker van het spel, niet voor de AI)

Zet de Drive-id's in `tools/art-drive.json` en haal de beelden op met `python3 -I tools/haal-art.py tools/art-drive.json`.

## De prompts

### Thebe, Egypte

#### Luxor, de kade

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-aankomst.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-aankomst.png`
- Formaat: 3:2, 2048 × 1365 px

```
the riverside quay of Luxor on the Nile in 1888, feluccas with white sails, donkeys, merchants selling antiquities under awnings, the columns of Luxor temple behind, warm evening light, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De Vallei der Koningen

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-vallei-der-koningen.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-vallei-der-koningen.png`
- Formaat: 3:2, 2048 × 1365 px

```
the Valley of the Kings near Thebe, sun-scorched limestone cliffs with dark tomb entrances cut into the rock, one entrance with fresh scratches around an old lock, long shadows, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Karnak

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-karnak.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-karnak.png`
- Formaat: 3:2, 2048 × 1365 px

```
the great hypostyle hall of Karnak, a forest of enormous carved columns in deep shadow, shafts of light falling between them, hieroglyphs that seem to shift, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Deir el-Bahari

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-deir-el-bahari.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-deir-el-bahari.png`
- Formaat: 3:2, 2048 × 1365 px

```
the terraced temple of Deir el-Bahari below towering cliffs, and nearby a dark shaft in the rock with ropes and a wooden winch, the royal mummy cache, dusk, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Medinet Habu

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-medinet-habu.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-medinet-habu.png`
- Formaat: 3:2, 2048 × 1365 px

```
the fortress-like temple of Medinet Habu with colossal reliefs of a sea battle, one carved enemy without a face, harsh afternoon sun and deep shadows, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Gurna

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-gurna.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-gurna.png`
- Formaat: 3:2, 2048 × 1365 px

```
the village of Gurna built on top of ancient tombs on the hillside of Thebe, mud-brick houses with dark cellar openings leading underground, smoke from cooking fires, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het kamp van de Harrowgate-expeditie

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-kamp-harrowgate.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-kamp-harrowgate.png`
- Formaat: 3:2, 2048 × 1365 px

```
an abandoned Victorian excavation camp in the Egyptian desert, white canvas tents, a British flag, crates stamped with a collector's mark, a dinner table still set, no one in sight, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De woestijnweg

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-woestijnweg.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-woestijnweg.png`
- Formaat: 3:2, 2048 × 1365 px

```
an ancient processional road leading into the desert lined with half-buried sphinxes, and at its end a lonely hermit's tent under a vast starry sky, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het naamloze graf

- Map: `oude-wereld/`
- Bestandsnaam: `thebe-hart.png`
- Volledig pad: `Londen1888-art/oude-wereld/thebe-hart.png`
- Formaat: 3:2, 2048 × 1365 px

```
a hidden burial chamber deep under the Theban hills, a black basalt guardian statue in a niche with eyes beginning to glow, an untouched sarcophagus with grave goods, a single lamp, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Klooster van de Witte Wolken, Himalaya

#### Darjeeling

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-aankomst.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-aankomst.png`
- Formaat: 3:2, 2048 × 1365 px

```
Darjeeling in 1888, tea gardens on steep green slopes, the little hill railway, porters waiting with baskets, snow peaks of Kangchenjunga glowing above the clouds, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De hoge pas

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-hoge-pas.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-hoge-pas.png`
- Formaat: 3:2, 2048 × 1365 px

```
a narrow high mountain pass between two rock walls in the Himalaya, ice on the stones, a sheer drop to one side, prayer cairns, wind-driven snow, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het Klooster van de Witte Wolken

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-klooster-witte-wolken.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-klooster-witte-wolken.png`
- Formaat: 3:2, 2048 × 1365 px

```
a white Tibetan monastery on a mountain ridge above the clouds, prayer flags, golden roofs, a bronze bell in an open tower, monks in maroon robes far away, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het hol van de kluizenaar

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-hol-kluizenaar.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-hol-kluizenaar.png`
- Formaat: 3:2, 2048 × 1365 px

```
a cave above the tree line in the Himalaya with a small fire at its mouth, a hermit's prayer wheel and bowl, snow peaks outside under a cold sky, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De brug van gebedsvlaggen

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-brug-gebedsvlaggen.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-brug-gebedsvlaggen.png`
- Formaat: 3:2, 2048 × 1365 px

```
a swaying rope bridge across a deep Himalayan gorge, hung with hundreds of colourful prayer flags, a thread-like river far below, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het verlaten fort

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-verlaten-fort.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-verlaten-fort.png`
- Formaat: 3:2, 2048 × 1365 px

```
an abandoned Himalayan dzong fortress on a rock spur, its great hall lined with rows of old armour and banners, dust and cold light, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De gletsjer

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-gletsjer.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-gletsjer.png`
- Formaat: 3:2, 2048 × 1365 px

```
a crevassed blue glacier in the Himalaya, and deep in the clear ice the dim shape of a frozen traveller with outstretched arms, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het dorp van de dragers

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-dorp-dragers.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-dorp-dragers.png`
- Formaat: 3:2, 2048 × 1365 px

```
a small Sherpa village of low stone houses with smoke from butter lamps, yaks in a walled yard, prayer flags, mountains behind in evening light, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Boven de wolken

- Map: `oude-wereld/`
- Bestandsnaam: `himalaya-hart.png`
- Volledig pad: `Londen1888-art/oude-wereld/himalaya-hart.png`
- Formaat: 3:2, 2048 × 1365 px

```
a lone stone gate without walls standing on a snowy summit above the clouds, before it a towering guardian figure made of snow and prayer flags with the eyes of an old woman, a storm swirling, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### Tempel in het oerwoud, Yucatán

#### Progreso, de haven

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-aankomst.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-aankomst.png`
- Formaat: 3:2, 2048 × 1365 px

```
the harbour of Progreso in Yucatan in 1888, a long wooden pier, bales of sisal on the quay, steamships in the rain, palm trees and warehouses, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De cenote

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-cenote.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-cenote.png`
- Formaat: 3:2, 2048 × 1365 px

```
a round sinkhole lake in the Yucatan jungle with steep limestone walls and hanging roots, clear turquoise water with something glinting gold on the bottom, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het sterrenhuis

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-sterrenhuis.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-sterrenhuis.png`
- Formaat: 3:2, 2048 × 1365 px

```
a round Maya observatory tower with narrow windows aimed at the stars, inside the floor covered with red painted tables of numbers, night sky, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het kamp van de chicleros

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-kamp-chicleros.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-kamp-chicleros.png`
- Formaat: 3:2, 2048 × 1365 px

```
a jungle camp of chicle tappers in Yucatan, palm-leaf shelters, sapodilla trees with zigzag cuts dripping white sap, men around a fire, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De verlaten haciënda

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-verlaten-hacienda.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-verlaten-hacienda.png`
- Formaat: 3:2, 2048 × 1365 px

```
an abandoned henequen hacienda overgrown by jungle, a grand veranda, a dining room with a table still set for twelve, vines through the windows, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De rivier onder de grond

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-rivier-onder-de-grond.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-rivier-onder-de-grond.png`
- Formaat: 3:2, 2048 × 1365 px

```
an underground river in a limestone cave in Yucatan, still dark water, the walls covered with red painted handprints, a single torch, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Het veld van de stèles

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-veld-steles.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-veld-steles.png`
- Formaat: 3:2, 2048 × 1365 px

```
a field of carved Maya stone stelae half-swallowed by the jungle, each showing a king and glyph dates, the last stela blank but for one date, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De ruïne met de slang

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-ruine-slang.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-ruine-slang.png`
- Formaat: 3:2, 2048 × 1365 px

```
a collapsed Maya palace with a huge feathered serpent carved across its facade, a stairway descending into the serpent's open mouth, rain and mist, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### De tempel onder de tempel

- Map: `oude-wereld/`
- Bestandsnaam: `yucatan-hart.png`
- Volledig pad: `Londen1888-art/oude-wereld/yucatan-hart.png`
- Formaat: 3:2, 2048 × 1365 px

```
a hidden temple chamber beneath a Maya pyramid, a stone altar with a carved round calendar, and coiled before it a great serpent with feathers of jade, torchlight, establishing view of the place, no people in the foreground, a few distant figures at most. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### De schatten

#### Canope van de naamloze farao

- Map: `artefacten/`
- Bestandsnaam: `canope-naamloze-farao.png`
- Volledig pad: `Londen1888-art/artefacten/canope-naamloze-farao.png`
- Formaat: 1:1, 1024 × 1024 px

```
an ancient Egyptian canopic jar of black alabaster with a lid shaped like a featureless head, faintly glowing hieroglyphs, on a dusty stone shelf in a tomb, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Zonneschijf van Aton

- Map: `artefacten/`
- Bestandsnaam: `zonneschijf-aton.png`
- Volledig pad: `Londen1888-art/artefacten/zonneschijf-aton.png`
- Formaat: 1:1, 1024 × 1024 px

```
a golden sun disc of the pharaoh Akhenaten with rays ending in small hands, radiating warm light, on red linen, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Kristallen gebedsmolen

- Map: `artefacten/`
- Bestandsnaam: `kristallen-gebedsmolen.png`
- Volledig pad: `Londen1888-art/artefacten/kristallen-gebedsmolen.png`
- Formaat: 1:1, 1024 × 1024 px

```
a small Tibetan prayer wheel made of clear rock crystal with silver fittings, a faint light swirling inside, on a monastery altar cloth, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Mantel van de sneeuwleeuw

- Map: `artefacten/`
- Bestandsnaam: `sneeuwleeuwmantel.png`
- Volledig pad: `Londen1888-art/artefacten/sneeuwleeuwmantel.png`
- Formaat: 1:1, 1024 × 1024 px

```
a heavy white fur cloak with a turquoise-studded clasp shaped like a snow lion's head, draped over a carved wooden chest in a mountain monastery, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Kalendersteen

- Map: `artefacten/`
- Bestandsnaam: `kalendersteen.png`
- Volledig pad: `Londen1888-art/artefacten/kalendersteen.png`
- Formaat: 1:1, 1024 × 1024 px

```
a round Maya calendar stone carved with glyphs and a central face, small enough to hold in two hands, glowing faintly green, on a jungle altar, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Obsidiaanspiegel van de Gevederde Slang

- Map: `artefacten/`
- Bestandsnaam: `obsidiaanspiegel.png`
- Volledig pad: `Londen1888-art/artefacten/obsidiaanspiegel.png`
- Formaat: 1:1, 1024 × 1024 px

```
a polished black obsidian mirror in a frame of jade feathers shaped like a serpent, reflecting a faint green light, on a stone altar in the jungle, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

### De nieuwe helden

#### Ra'is Mahmoud Fathy

- Map: `helden/`
- Bestandsnaam: `mahmoud-fathy.png`
- Volledig pad: `Londen1888-art/helden/mahmoud-fathy.png`
- Formaat: 3:4, 1536 × 2048 px

```
a dignified Egyptian man in his fifties, 1888, weathered brown face with a grey trimmed beard, white turban and a dark galabeya under a European tweed jacket, holding a long wooden overseer's staff, standing among wooden crates on a foggy London dock, gas lamps behind him, half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Opzichtersstok (Ra'is Mahmoud Fathy)

- Map: `persoonlijk/`
- Bestandsnaam: `opzichtersstok.png`
- Volledig pad: `Londen1888-art/persoonlijk/opzichtersstok.png`
- Formaat: 1:1, 1024 × 1024 px

```
a long polished wooden overseer's staff with a brass ferrule and a carved palm-leaf handle, leaning against a stack of excavation baskets, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Kaart van de Vallei (Ra'is Mahmoud Fathy)

- Map: `persoonlijk/`
- Bestandsnaam: `kaart-vallei.png`
- Volledig pad: `Londen1888-art/persoonlijk/kaart-vallei.png`
- Formaat: 1:1, 1024 × 1024 px

```
a hand-drawn map of the Valley of the Kings on yellowed paper with Arabic and English notes, folded on a dusty wooden table with a brass compass, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Ang Nima Sherpa

- Map: `helden/`
- Bestandsnaam: `ang-nima.png`
- Volledig pad: `Londen1888-art/helden/ang-nima.png`
- Formaat: 3:4, 1536 × 2048 px

```
a sturdy Sherpa man in his mid-thirties, 1888, wind-burned face and calm dark eyes, long black hair tied back, a thick maroon wool chuba robe under a borrowed English overcoat, a kukri knife in his sash and a coil of rope over his shoulder, standing on Hampstead Heath at dusk in the fog, half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Kukri (Ang Nima Sherpa)

- Map: `persoonlijk/`
- Bestandsnaam: `kukri.png`
- Volledig pad: `Londen1888-art/persoonlijk/kukri.png`
- Formaat: 1:1, 1024 × 1024 px

```
a curved Nepalese kukri knife with a horn handle in a worn leather scabbard, on a folded wool blanket, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Bergtouw (Ang Nima Sherpa)

- Map: `persoonlijk/`
- Bestandsnaam: `bergtouw.png`
- Volledig pad: `Londen1888-art/persoonlijk/bergtouw.png`
- Formaat: 1:1, 1024 × 1024 px

```
a thick coil of hand-twisted hemp climbing rope with an iron hook, lying on a stone step, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Teresa Canul

- Map: `helden/`
- Bestandsnaam: `teresa-canul.png`
- Volledig pad: `Londen1888-art/helden/teresa-canul.png`
- Formaat: 3:4, 1536 × 2048 px

```
a young Mexican woman of Maya descent in her late twenties, 1888, warm brown skin and sharp dark eyes, black hair in a braid, a white embroidered huipil blouse under a dark travelling jacket, holding a brass and mahogany field camera on a tripod, standing in the Covent Garden market colonnade at dawn in the fog, half-length portrait, figure centred, head in upper third, plain dark background that fades out at the edges. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Camera met glasplaten (Teresa Canul)

- Map: `persoonlijk/`
- Bestandsnaam: `camera-glasplaten.png`
- Volledig pad: `Londen1888-art/persoonlijk/camera-glasplaten.png`
- Formaat: 1:1, 1024 × 1024 px

```
a Victorian mahogany and brass field camera with a black bellows and a box of glass photographic plates, on a wooden table, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

#### Machete (Teresa Canul)

- Map: `persoonlijk/`
- Bestandsnaam: `machete.png`
- Volledig pad: `Londen1888-art/persoonlijk/machete.png`
- Formaat: 1:1, 1024 × 1024 px

```
a worn steel machete with a wooden handle wrapped in cord, lying on a jungle leaf, single object still life, centred, filling about 70 percent of the frame, dark velvet or wooden tabletop, soft vignette. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood, warm amber lamplight against cold mist, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore.
```

