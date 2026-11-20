# Beeldopdracht: app-icoon en favicon

Twee beelden: één app-icoon voor het beginscherm van de iPad en de telefoon, en één vereenvoudigde versie voor de favicon (het tabblad in de browser). Uit deze twee maakt `tools/maak-iconen.py` alle maten.

## Instructies voor de AI

1. Maak beide beelden **vierkant**, precies in de opgegeven maat, als PNG zonder transparantie.
2. Zet nooit tekst, letters of cijfers in het beeld.
3. Houd het onderwerp **in het midden, binnen de middelste 80%**. iOS rondt de hoeken af en Android snijdt het icoon soms uit tot een cirkel; wat aan de rand staat, valt dan weg.
4. Eén duidelijk onderwerp met een sterk silhouet, dat ook op 60 px nog herkenbaar is. Geen kleine details, geen rand en geen kader.
5. De achtergrond loopt door tot in alle hoeken, in één donkere kleur, zodat de afgeronde hoeken netjes zijn.

## 1. App-icoon

- **Bestand:** `icoon-1024.png`
- **Formaat:** 1:1, **1024 × 1024 px**

```
App icon for a Victorian horror board game: a single ornate cast-iron gas street lamp seen from slightly below, its glass lantern glowing warm amber, wrapped in swirling cold green-grey fog, one small pale violet star shining in the dark sky just above the lamp. Bold centred composition, the lamp fills about 70 percent of the height and stays inside the central 80 percent of the square, strong readable silhouette, solid deep teal-black background (#0d1416) reaching all four corners. Late-Victorian oil painting style, rich dark palette of soot black, deep teal and oxblood, warm amber gaslight, visible brushstrokes, dramatic chiaroscuro, slightly uncanny. Avoid: no text, no letters, no numbers, no frame, no border, no rounded corners drawn in, no transparency, no watermark, no photograph look, no 3D render, no small details near the edges.
```

## 2. Favicon (vereenvoudigd)

Op 16 en 32 pixels verdwijnen mist en penseelstreken. Deze versie is daarom veel eenvoudiger: alleen het silhouet van de lantaarn met het licht.

- **Bestand:** `favicon-512.png`
- **Formaat:** 1:1, **512 × 512 px**

```
Minimal flat icon of a Victorian gas street lamp: a bold dark silhouette of the lamp post and lantern with a bright glowing amber flame in the glass, a soft round amber glow around the lantern, one small pale violet star above it, on a solid deep teal-black background (#0d1416) filling the whole square. Very simple bold shapes, high contrast, centred, the lamp fills about 80 percent of the height, readable at 16 pixels. Avoid: no text, no letters, no fog, no fine details, no brush texture, no frame, no border, no transparency, no gradients except the glow.
```

## Aanleveren

Zet beide PNG-bestanden in de Drive-map `Londen1888-art` in een submap **`icoon`**, of stuur ze in het gesprek. Daarna maakt Claude alle maten met:

```bash
python3 -I tools/maak-iconen.py icoon-1024.png favicon-512.png
```

Dat levert in `app/icoon/` op:

| Bestand | Maat | Gebruik |
|---|---|---|
| `icoon-180.png` | 180 × 180 | iPad en iPhone: Zet op beginscherm |
| `icoon-192.png` | 192 × 192 | Android en Chrome |
| `icoon-512.png` | 512 × 512 | Installeren als app, opstartscherm |
| `icoon-maskable-512.png` | 512 × 512 | Android, met extra rand zodat niets wegvalt |
| `favicon-32.png`, `favicon-16.png` | 32 en 16 | Tabblad in de browser |
| `favicon.ico` | 16, 32 en 48 | Oudere browsers en Windows |

Let op: een iPad die het spel al op het beginscherm heeft, toont het nieuwe icoon vaak pas nadat je het spel van het beginscherm verwijdert en opnieuw toevoegt.
