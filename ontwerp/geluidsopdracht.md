# Geluidsopdracht: geluiden maken met ElevenLabs

Het spel heeft nu ingebouwde, eenvoudige klanken. Zodra er een geluidsbestand met de juiste naam in `art/geluid/` staat, speelt het spel dat bestand af in plaats van de ingebouwde klank. Je kunt dus één geluid tegelijk vervangen: wat ontbreekt, blijft gewoon werken.

## Stap voor stap in ElevenLabs

1. Log in op elevenlabs.io en open in het menu **Sound Effects** (onder *Playground* of *Create*).
2. Plak de Engelse prompt uit de tabel hieronder in het tekstvak. Engels werkt beter dan Nederlands.
3. Open de instellingen (het tandwiel of *Settings*) en zet:
   - **Duration:** de duur uit de tabel. Zet *Auto* uit.
   - **Prompt influence:** ongeveer 60% (hoger is letterlijker, lager is creatiever).
   - **Loop:** alleen aan voor de vier sfeergeluiden (`sfeer-...`). Zie je deze optie niet, laat hem dan uit; het spel herhaalt het geluid toch.
4. Klik op **Generate**. Je krijgt meestal vier varianten. Luister ze en kies er één.
5. Download de gekozen variant als **MP3** en geef hem precies de bestandsnaam uit de tabel, bijvoorbeeld `onheil.mp3`.

Tips:
- Geen misthoorn: een aanhoudende hoorn in een lus wordt snel storend. Zet `no horns` in de prompt.
- Klinkt een effect te modern of te druk? Voeg aan het eind toe: `dry, no music, no reverb tail, 19th century`.
- Effecten moeten snel beginnen: knip eventuele stilte aan het begin weg (bijvoorbeeld met de knip-optie in ElevenLabs).
- Houd korte effecten onder de 100 KB en de sfeerlussen onder de 600 KB. ElevenLabs levert standaard een MP3 van 128 kbps, en dat is prima.
- Let op de gebruiksvoorwaarden van je ElevenLabs-abonnement als je het spel ooit openbaar of commercieel wilt verspreiden.

## Effecten

Ze klinken bij een actie in het spel. Kort en duidelijk.

| Bestand | Wanneer | Duur | Prompt |
|---|---|---|---|
| `klik.mp3` | Je tikt op een plek op de kaart | 0,5 s | `a single soft click of a brass latch, close up, dry, no music` |
| `reis.mp3` | Een held reist naar een andere plek | 1,5 s | `a few quick footsteps on wet cobblestones with a distant horse carriage, Victorian London street at night, short, no music` |
| `kaart.mp3` | Een kaart wordt omgedraaid | 1 s | `an old thick playing card being flipped over on a felt table, paper swish, close up, dry` |
| `dobbel.mp3` | De dobbelstenen rollen | 1 s | `two bone dice rolling and clattering on a wooden table, then stopping, close up, dry` |
| `goed.mp3` | Een test lukt | 1,5 s | `a gentle bright chime from an antique music box, two rising notes, warm, short` |
| `slecht.mp3` | Een test mislukt | 1,5 s | `a low ominous cello note sliding down, short and dry, dark` |
| `monster.mp3` | Een gevecht met een monster begint | 2,5 s | `a wet guttural growl of an unseen creature in a stone sewer tunnel, echo, horror, no music` |
| `onheil.mp3` | Een Onheilskaart wordt getrokken | 3 s | `a single deep church bell toll muffled by thick fog, low drone underneath, ominous` |
| `scheur.mp3` | Er opent een Scheur | 2 s | `a reality tearing open, low rumbling whoosh with a faint eerie whisper and crackle, otherworldly, horror` |
| `mysterie.mp3` | Een mysterie is opgelost | 3 s | `a short hopeful swell of a distant church choir and organ chord, Victorian, resolving` |
| `winst.mp3` | Het spel is gewonnen | 5 s | `church bells ringing at dawn over a waking city, birds, fog lifting, hopeful, no music` |
| `verlies.mp3` | Het spel is verloren | 5 s | `a deep subterranean rumble rising into a vast inhuman groan, city bells stopping one by one, horror ending` |

## Sfeerlussen

Ze spelen zacht op de achtergrond zolang het potje duurt, één per oude god, plus één voor het startscherm. Zet bij deze geluiden **Loop** aan.

| Bestand | Wanneer | Duur | Prompt |
|---|---|---|---|
| `sfeer-start.mp3` | Startscherm | 20 s | `seamless loop, light rain on cobblestones in Victorian London at night, hiss of gas lamps, distant horse carriage passing, calm and eerie, no music` |
| `sfeer-vathrun.mp3` | Potje tegen Vathrûn | 22 s | `seamless loop, water dripping in an old brick sewer, slow dark river lapping against stone steps, soft hollow echo, faint deep bubbling under the water, damp and ominous, no horns, no music` |
| `sfeer-azh-ilareth.mp3` | Potje tegen Azh-Ilareth | 22 s | `seamless loop, cold night wind over an open heath, a faint high shimmering drone like starlight, an old clock ticking in an empty salon, very faint wordless choir, eerie, no music` |
| `sfeer-nebet-ankhu.mp3` | Potje tegen Nebet-Ankhu | 22 s | `seamless loop, creaking wooden crates in a dark dockside warehouse, ropes and ship timbers groaning, faint desert wind, distant whispering voices, ominous, no music` |
| `sfeer-ysmara.mp3` | Potje tegen Ysmara | 22 s | `seamless loop, wind rustling through leaves and hawthorn branches at night, distant children softly singing a nursery rhyme, faint wooden flute far away, a creaking garden gate, enchanting and eerie, no music` |
| `sfeer-morghast.mp3` | Potje tegen Morghast | 22 s | `seamless loop, a deep underground vault, slow dripping water, a shovel scraping in earth far away, bones shifting softly, a very slow deep breathing below, a distant hospital bell, dread, no music` |
| `sfeer-ommeth.mp3` | Potje tegen Ommeth | 22 s | `seamless loop, a distant crowd of hundreds of people humming the same five slow notes in an East End street at night, shuffling footsteps on wet cobblestones, a single tin bell, hypnotic and eerie, no instruments, no music` |
| `sfeer-karathos.mp3` | Potje tegen Karathos | 22 s | `seamless loop, a vast empty museum gallery at night, faint high ringing of glass, slow footsteps on marble far away, a low resonant hum like a wet finger on a crystal glass, whispering echoes, ominous, no music` |
| `sfeer-ulvereth.mp3` | Potje tegen Ulvereth | 22 s | `seamless loop, wind gusting over rooftops and chimney pots, distant rolling thunder, ice cracking on a river, sleet against window glass, then a moment of calm birdsong, unsettled weather, no music` |
| `sfeer-sirrhae.mp3` | Potje tegen Sirrhae | 22 s | `seamless loop, a distant elegant salon party heard through a closed door, muffled laughter, clinking glasses, a faint waltz on a piano far away, the rustle of silk and a fan opening, seductive and uneasy` |
| `sfeer-ouroch.mp3` | Potje tegen Ouroch | 22 s | `seamless loop, many clocks ticking slightly out of sync in a dark room, a slow heavy pendulum, gears turning, a distant tower bell striking very slowly, tense and mechanical, no music` |
| `sfeer-yth-nemora.mp3` | Potje tegen Yth-Nemora | 22 s | `seamless loop, a printing press thumping rhythmically in a basement, paper rustling, newsboys shouting indistinct words in the street far away, many whispering voices overlapping, uneasy, no music` |
| `sfeer-gul-marrach.mp3` | Potje tegen Gul-Marrach | 22 s | `seamless loop, coins clinking and being counted in a quiet marble banking hall, a pen scratching in a ledger, a heavy vault door creaking far away, a slow deep heartbeat underneath, cold and ominous, no music` |

## Achtergrondmuziek

| Bestand | Wanneer | Duur | Prompt (model: Music) |
|---|---|---|---|
| `muziek.mp3` | Startscherm en tijdens het spel, zacht onder de sfeer | 3 min | `Slow dark Victorian gothic ambient score, eerie and atmospheric, very slow tempo with no drums. A solo cello and muted strings hold long sustained minor chords over a deep drone, with a faint music box melody and a distant harmonium appearing and fading away. The energy stays low and even throughout, subtle swells and quiet passages, so it can loop softly under a game without drawing attention.` |

Kies bij Music voor **instrumental**. Eén take van 3 minuten kost ongeveer 2.700 credits.

## Aanleveren

1. Maak in de Drive-map `Londen1888-art` een submap **`geluid`**.
2. Zet daar de MP3-bestanden in, met precies de namen uit de tabellen (kleine letters, geen spaties).
3. Laat het in het gesprek met Claude weten. Claude zoekt de bestanden op via de Drive-connector, zet ze in `tools/art-drive.json` en haalt ze op met:

   ```bash
   python3 -I tools/haal-art.py tools/art-drive.json
   ```

   Ze komen in `art/geluid/` en gaan met de volgende push online.
4. Een geluid later vervangen: zet het nieuwe bestand met dezelfde naam in Drive en vraag Claude het oude in `art/geluid/` te verwijderen en opnieuw op te halen.

Je hoeft niet alles in één keer te maken. Begin bijvoorbeeld met `onheil`, `monster`, `dobbel` en de vier sfeerlussen: die hoor je het vaakst.

## Hoe het spel ze gebruikt

- **Volume:** effecten spelen op 50–80%, sfeerlussen op 25% en de muziek op 18%. Met de knop *Muziek uit* zet je alleen de muziek uit. Zo komen ze nooit boven de rest uit.
- **Snel:** via de ElevenLabs-connector kan Claude ze ook zelf maken en ophalen, in de flow "Londen 1888 geluiden".
- **Geluid uit:** de knop *Geluid uit* zet alles uit, ook de sfeer.
- **iPad:** Safari laat pas geluid toe na de eerste tik. De sfeer begint dus pas na je eerste tik op het scherm.
- **Offline:** de geluiden worden bewaard, net als de afbeeldingen, zodat het spel ook zonder internet geluid heeft.
