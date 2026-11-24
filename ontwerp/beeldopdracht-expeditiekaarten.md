# Beeldopdracht: de expeditiekaarten van de Oude Wereld

Drie geschilderde achtergronden voor de regiokaarten van de uitbreiding *Kaarten van de Oude Wereld*: Thebe, de Himalaya en Yucatán. Ze horen bij het bord van Londen (`art/bord/londen.jpg`): dezelfde schildertechniek, hetzelfde vogelperspectief en hetzelfde nachtelijke licht. Maar elk land heeft een eigen gezicht.

Het spel tekent de plekken, de paden en de namen er zelf overheen. Zodra een kaart in `art/oude-wereld/` staat, gebruikt het spel hem vanzelf. Tot die tijd blijft de kaart effen.

## Instructies voor de AI

Je maakt schilderijen voor een bordspel uit 1888. Werk de lijst hieronder beeld voor beeld af.

1. Maak elk beeld precies in het opgegeven formaat: **2:1, 2400 × 1200 px**.
2. Gebruik de prompt in het codeblok volledig en letterlijk. De stijlregel staat er al achter; verander die niet.
3. Zet nooit tekst, letters of cijfers in een afbeelding, en teken geen kaartlegenda, kompasroos met letters of rand.
4. Lever elk beeld als PNG, met precies de bestandsnaam die erbij staat, in de map `oude-wereld/` in de Drive-map `Londen1888-art`.
5. Lever niets anders op dan de beelden zelf.

## Afvinklijst

- [ ] `oude-wereld/kaart-thebe.png` · Thebe, Egypte
- [ ] `oude-wereld/kaart-himalaya.png` · Klooster van de Witte Wolken, Himalaya
- [ ] `oude-wereld/kaart-yucatan.png` · Tempel in het oerwoud, Yucatán

## Waar de plekken op de kaart komen

De expeditie loopt van **links naar rechts**: je komt links aan, trekt door twee ringen het binnenland in, en het hart ligt **rechtsboven**. Het spel zet zeven ronde plekken (een cirkel van ongeveer 8% van de beeldbreedte) op deze punten, gemeten vanaf linksboven:

| Plek | Breedte | Hoogte | Wat er in het schilderij moet zijn |
|---|---|---|---|
| Aankomst | 10% | 48% | De haven of het stadje waar je aankomt: warm, bewoond, veilig |
| Eerste ring, boven | 28% | 25% | Het begin van de wildernis |
| Eerste ring, onder | 28% | 72% | Het begin van de wildernis |
| Tweede ring, boven | 53% | 21% | Diep, oud en gevaarlijk terrein |
| Tweede ring, onder | 53% | 76% | Diep, oud en gevaarlijk terrein |
| Tweede ring, midden | 71% | 48% | Diep, oud en gevaarlijk terrein, vlak voor het hart |
| **Het hart** | **89%** | **34%** | **Het meest epische beeld van de kaart** |

De paden tussen de plekken tekent het spel als stippellijnen: van de aankomst naar beide plekken van de eerste ring, van daar verder naar de tweede ring, en via de bovenste en de middelste plek van de tweede ring naar het hart. Een schilderij met vage karavaansporen, bergpaden of jungletrails langs die lijnen helpt het oog.

Welke plek (een tempel, een kamp, een brug) in welke ring ligt, schudt het spel elk potje opnieuw. Schilder daarom op de plekken van de ringen een **landschap**, geen herkenbaar gebouw. Alleen de aankomst en het hart liggen altijd op dezelfde plek, en mogen dus echt herkenbaar zijn.

Houd de plekken zelf rustig genoeg dat een ronde fiche erop leesbaar blijft. Leg de drukste details en het sterkste licht in het hart. De kaart wordt van links naar rechts steeds donkerder, wilder en vreemder, met het hart als lichtpunt waar je oog naartoe getrokken wordt.

## 1. Thebe, Egypte

- Bestand: `oude-wereld/kaart-thebe.png`
- Formaat: 2:1, 2400 × 1200 px

Aankomst: Luxor, de kade aan de Nijl. Het hart: *Het naamloze graf*, een deur zonder cartouche in de rotswand, met een wachter van zwart basalt.

```
An antique hand-painted map of ancient Thebes on the Nile at night, seen from a high oblique bird's-eye view, like a Victorian panoramic map. On the far left, the broad dark teal ribbon of the Nile runs from top to bottom, with the lantern-lit quay of Luxor at the middle of the left edge: moored feluccas with folded sails, warm amber windows, smoke from cooking fires. Moving right, a narrow band of black-green palm groves and fields, then the desert begins: pale moonlit sand, scattered mud-brick villages clinging to low hills, a faint caravan track winding inland, half-buried sphinxes and toppled colossi casting long shadows, the broken columns of immense ruined temples rising from the sand in the middle distance. The land grows emptier, colder and stranger towards the right. In the upper right, the climax of the map: the sheer limestone cliffs of the Theban mountains under a pyramid-shaped peak, and cut into the cliff face a single tall doorway with no inscription, glowing from within with an eerie violet and green light that spills down the rocks; a vast black basalt guardian can just be made out in the shadow beside it. A strange violet star hangs low over the peak. Thin desert haze and drifting dust instead of fog, aged varnish and canvas texture. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood with sand ochre, warm amber lamplight against cold moonlit stone, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no hieroglyph text blocks, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no labels, no compass rose, no legend.
```

## 2. Klooster van de Witte Wolken, Himalaya

- Bestand: `oude-wereld/kaart-himalaya.png`
- Formaat: 2:1, 2400 × 1200 px

Aankomst: Darjeeling. Het hart: *Boven de wolken*, een stenen poort zonder muur op de top, met de Wachter van de pas.

```
An antique hand-painted map of the high Himalaya at night, seen from a high oblique bird's-eye view, like a Victorian panoramic map. On the far left, at the middle of the left edge, the hill town of Darjeeling on a green ridge: terraced tea gardens, a little steam train curling up the slope, warm amber lamplight in wooden houses, smoke from chimneys. Moving right, the land climbs: dark rhododendron and pine forests, low stone villages with yaks and butter-lamp smoke, then above the tree line deep gorges spanned by sagging rope bridges hung with faded prayer flags, a ruined fortress on a crag, a white-walled monastery on a knife-edge ridge, and a vast blue-white glacier full of crevasses sweeping across the lower middle. Everything grows colder, higher and lonelier towards the right. In the upper right, the climax of the map: the highest summit rising above a sea of moonlit clouds, and on its snowy crown a lone stone gate standing with no wall around it, glowing with a cold violet light from within; streamers of prayer flags and blown snow swirl around a tall shrouded figure of snow waiting before the gate. A strange violet star hangs above the peak. Drifting cloud and snow haze instead of city fog, aged varnish and canvas texture. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood with glacier blue and snow white, warm amber lamplight against cold moonlit ice, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no script on the prayer flags, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no labels, no compass rose, no legend.
```

## 3. Tempel in het oerwoud, Yucatán

- Bestand: `oude-wereld/kaart-yucatan.png`
- Formaat: 2:1, 2400 × 1200 px

Aankomst: Progreso, de haven. Het hart: *De tempel onder de tempel*, een oudere tempel onder de trappiramide, met de Gevederde Wachter: een slang met veren van jade.

```
An antique hand-painted map of the Yucatán jungle at night, seen from a high oblique bird's-eye view, like a Victorian panoramic map. On the far left, at the middle of the left edge, the small harbour of Progreso on a dark teal sea: a long wooden pier, a steamship with lit portholes, warehouses of henequen bales, warm amber lamplight. Moving right, rows of spiky agave fields and a pale hacienda with an arched veranda give way to an endless black-green jungle canopy, steaming with mist; perfectly round sinkhole lakes like dark eyes in the forest, a river that disappears into the mouth of a cave, overgrown carved stone stelae in a clearing, the collapsed walls of an ancient palace swallowed by roots and vines. The jungle grows denser, wetter and more ominous towards the right. In the upper right, the climax of the map: a colossal stepped pyramid rising above the canopy, its stairway carved as a great feathered serpent, and from a doorway at its foot an unearthly jade-green light pours out, hinting at an older temple beneath; the coils of an enormous serpent with jade feathers can just be seen in the glow. Storm clouds gather over it, lit by a strange violet star and distant sheet lightning. Hot jungle mist and steam instead of city fog, aged varnish and canvas texture. Late-Victorian oil painting, 1888, rich dark palette of soot black, deep teal and oxblood with jungle green and jade, warm amber lamplight against cold green night, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no captions, no glyph text blocks, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no labels, no compass rose, no legend.
```

## Na het maken

1. Zet de Drive-bestands-ID's in `tools/art-drive.json`, onder `oude-wereld/kaart-thebe`, `oude-wereld/kaart-himalaya` en `oude-wereld/kaart-yucatan`.
2. Haal ze op: `python3 -I tools/haal-art.py tools/art-drive.json`. Ze komen als `art/oude-wereld/kaart-<regio>.jpg` in het spel.
3. Controleer in een expeditie of de plekken en namen leesbaar blijven. Het spel legt al een lichte donkere laag over de kaart en zet de namen in licht met een donkere rand.
