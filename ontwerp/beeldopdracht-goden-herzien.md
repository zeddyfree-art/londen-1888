# Beeldopdracht: Ouroch, Yth-Nemora en Gul-Marrach opnieuw

De eerste schilderijen van deze drie goden lijken te veel op elkaar. Alle drie tonen een reusachtige gedaante in de bovenste helft, boven een Londense straat of een Londens gebouw. Daarbij komen een groenblauwe mistlucht, oranje gaslantaarns en een menigte met hoge hoeden voor de schaal. Deze opdracht vervangt die drie beelden. Elke god krijgt een eigen standpunt, een eigen plek, eigen licht en een eigen kleur. Waar het past, komt er paars bij: het licht van het bovennatuurlijke.

## Instructies voor de AI

Je maakt schilderijen voor een bordspel over Victoriaans Londen in 1888. Maak de drie beelden hieronder.

1. Maak elk beeld precies in het opgegeven formaat: 16:9, 2560 × 1440 px.
2. Gebruik de prompt in het codeblok volledig en letterlijk. De stijlregel staat er al in; verander die niet.
3. Zet nooit tekst, letters of cijfers in een afbeelding. Krantenpagina's en grootboeken tonen alleen onleesbare grijze regels.
4. Elk beeld moet duidelijk anders zijn dan de andere twee. Niet doen:
   - een reusachtige gedaante boven een straat of gebouw;
   - een groenblauwe mistlucht;
   - een rij gaslantaarns;
   - een menigte met hoge hoeden.
5. Lever elk beeld als PNG, met precies de bestandsnaam die erbij staat, in de map die erbij staat. De oude beelden met dezelfde naam mogen weg of worden overschreven.
6. Lever niets anders op dan de beelden zelf.

## Waar elk beeld heen moet

Alle drie horen in de Drive-map `Londen1888-art/goden/`.

| God | Bestandsnaam | Standpunt | Plek | Licht en kleur |
|---|---|---|---|---|
| Ouroch | `ouroch.png` | Van binnen naar buiten, achter de wijzerplaat | In de klokkentoren | Koud violet tegen messing, de tijd staat stil |
| Yth-Nemora | `yth-nemora.png` | Dichtbij, op ooghoogte, in een ruimte | Een drukkerij in de kelder | Inktzwart, papierwit en mauve inkt |
| Gul-Marrach | `gul-marrach.png` | Van bovenaf, recht naar beneden | Een kluis zonder bodem | Goud en koninklijk purper bij kaarslicht |

## Afvinklijst

- [ ] `goden/ouroch.png` · Ouroch, de Dertiende Slag
- [ ] `goden/yth-nemora.png` · Yth-Nemora, de Leugen die rondgaat
- [ ] `goden/gul-marrach.png` · Gul-Marrach, de Onzichtbare Hand

## Daarna (voor de maker van het spel, niet voor de AI)

Zet de nieuwe Drive-id's in `tools/art-drive.json` en haal de beelden op met `python3 -I tools/haal-art.py tools/art-drive.json`.

## De prompts

#### Ouroch, de Dertiende Slag

- Map: `goden/`
- Bestandsnaam: `ouroch.png`
- Volledig pad: `Londen1888-art/goden/ouroch.png`
- Formaat: 16:9, 2560 × 1440 px

```
Seen from inside the clock room of the Westminster clock tower at night, looking out through the back of a huge translucent milk-glass clock dial that fills most of the frame, the great iron clock hands in black silhouette against it. Time has stopped: raindrops hang motionless in the air inside the room, a pigeon is frozen in mid-flight, a dropped pocket watch hangs in the air above the floorboards, and a swinging pendulum is stuck at the top of its arc. In the space between twelve and one on the dial a thirteenth mark burns with a cold violet light that spills across the room. The brass gears around the dial are slowly growing into the walls like the ribs of a living creature. Through the glass, London is only a faint blur of lights far below. Wide cinematic composition, the dial and the gears fill the frame, the city is distant and small. Late-Victorian oil painting, 1888, palette of cold violet, polished brass and deep shadow, the violet light of the thirteenth hour against the warm metal, no green, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no text, no letters, no numerals, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no exterior view of the tower, no figure looming over a street, no crowd, no green-teal sky.
```

#### Yth-Nemora, de Leugen die rondgaat

- Map: `goden/`
- Bestandsnaam: `yth-nemora.png`
- Volledig pad: `Londen1888-art/goden/yth-nemora.png`
- Formaat: 16:9, 2560 × 1440 px

```
Inside a cramped basement printing room off Fleet Street at night, seen at eye level. A huge iron printing press stands in the middle, and from its rollers a single enormous wet sheet of newsprint curls up toward the ceiling. In the wet mauve ink on that sheet a face is pressing outward from the paper, a different expression on each side of it, as if three faces share one. Hundreds of freshly printed sheets hang drying on lines across the low room, and on every sheet the same columns are arranged slightly differently. A lone young compositor in shirtsleeves and an ink-stained apron stands frozen at a type case in the foreground, seen from behind, holding a composing stick. Ink drips from the ceiling beams. The only light is one oil lamp on the type case and the faint violet glow of the wet ink. Wide cinematic composition, close and claustrophobic, the low ceiling closing in. Late-Victorian oil painting, 1888, palette of ink black, yellowed paper white and Victorian mauve and violet aniline ink, one small warm lamp, no green, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no readable text, no letters, no headlines, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no street scene, no giant figure in the sky, no crowd, no gas lamps, no green-teal sky.
```

#### Gul-Marrach, de Onzichtbare Hand

- Map: `goden/`
- Bestandsnaam: `gul-marrach.png`
- Volledig pad: `Londen1888-art/goden/gul-marrach.png`
- Formaat: 16:9, 2560 × 1440 px

```
Looking straight down from a narrow iron gallery into a bottomless circular vault beneath the Bank of England, a dizzying view from above. The round stone walls descend endlessly, lined with shelves of heavy leather ledgers and iron strongboxes, spiralling down into darkness. Far below, the vault is filled with a slow whirlpool of gold coins, and people are sunk in the gold up to their chests, each still writing in a ledger by candlelight. At the very centre of the whirlpool, deep down, a single pale ringed hand rises from the gold with an old quill pen, signing in an open ledger the size of a room. Royal purple velvet ropes and drips of purple sealing wax run down the walls. On the gallery in the foreground stands one clerk in a black frock coat, seen from behind, holding a candle over the edge. Wide cinematic composition, a strong downward perspective with the spiral leading the eye to the hand. Late-Victorian oil painting, 1888, palette of warm gold, deep royal purple and black, lit only by small candles and the glow of the gold, no green, visible loose brushstrokes and canvas texture, dramatic chiaroscuro, slightly uncanny atmosphere, museum-quality academic painting. Avoid: no readable text, no letters, no numbers, no captions, no watermark, no signature, no frame, no border, no modern objects, no photograph look, no 3D render, no anime, no gore, no exterior of the bank, no street scene, no puppet strings, no hand in the sky, no crowd in the street, no gas lamps, no green-teal sky.
```
