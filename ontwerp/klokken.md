# Voorstel: de Klokken van Westminster

*Een voorstel, nog niet gebouwd. Geïnspireerd op de Storm Bells van Wildfrost.*

## Hoe Wildfrost het doet

In Wildfrost speel je na je eerste gewonnen run de **Storm Bells** vrij. Bij de start van een run zet je klokken aan. Elke klok maakt de hele run op één manier moeilijker en is een aantal punten waard. Je mag eerst tot 5 punten aanzetten. Win je op dat maximum, dan mag je er de volgende keer één punt meer kiezen, tot 10 punten. Wie met 10 punten wint, krijgt toegang tot het echte eindgevecht. Win je met een klok aan, dan krijgt die klok een gouden rand, en met alle klokken in goud speel je een stand vrij waarin alle klokken tegelijk aanstaan.

Zo kies je zelf welke soort moeilijkheid je wilt, en is er na het winnen altijd een volgende stap.

## Hoe het bij ons kan

**De Klokken van Westminster.** In 1888 slaat Big Ben al bijna dertig jaar. In dit spel slaat hij soms dertien.

- Je speelt ze vrij door één keer te winnen, op welke stand dan ook.
- Bij een nieuw spel kies je, naast god, stand en helden, welke klokken je aanzet. Elke klok heeft 1, 2 of 3 slagen.
- Het aantal slagen dat je mag kiezen begint op 5. Win je met het maximum, dan stijgt het met 1, tot 13 (dertien slagen).
- Win je met een klok aan, dan krijgt die klok een gouden rand. Per oude god onthoudt het spel je hoogste aantal slagen.
- In het potje zie je bovenaan welke klokken luiden.

## Welke knoppen hebben we?

Elke knop is een plek in de code waar het spel moeilijker of makkelijker wordt. Waar staat "gemeten", komt het effect uit de testbot.

| Knop | Waar in het spel | Effect |
|---|---|---|
| Mist bij de start | god, stand, aantal helden | 1 lager: winkans op genadeloos ongeveer 10 procentpunt lager (gemeten) |
| Doel van alle tests | stand (genadeloos +1) | +1: normaal van 60–81% naar 31–47% (gemeten). Zeer grof. |
| Mysteries nodig | stand (2 of 3) | groot: een heel mysterie extra |
| Scheuren bij de start | stand, aantal helden | elke Scheur brengt ook een monster |
| Aanwijzingen bij de start | 3 op het bord | minder sporen, langzamer naar het mysterie |
| Startgeld | 2 Pond plus uitrusting | minder spullen, geen Ondergrondse |
| Monsters | Gruwel, Taaiheid, Schade, Leven | per monster instelbaar |
| Onheilskaarten | Scheuren, monsters, Mist per kaart | hoe snel het misgaat |
| Rusten | +1 Lichaam en +1 Geest | herstel |
| Reizen | 2 keer per beurt, Ondergrondse | tempo |
| Herworpen | Aanwijzingen, Gezegend, wapens | redding na pech |
| Laatste nacht | normaal wel, genadeloos niet | tweede kans |
| Prijzen | markt, boot, trein | economie |

## Voorstel voor klokken

| Klok | Wat hij doet | Slagen |
|---|---|---|
| **Dikke mist** | De Mist begint 2 lager. | 2 |
| **Lege zakken** | Helden beginnen zonder Pond. | 1 |
| **Gesloten lijnen** | De Ondergrondse rijdt niet, en de trein vanaf King's Cross ook niet. | 1 |
| **Zware benen** | Je mag maar één keer per beurt reizen. | 2 |
| **Zwijgende getuigen** | Er liggen bij de start geen Aanwijzingen op het bord. | 1 |
| **Taaie wezens** | Elk monster heeft 1 Taaiheid meer. | 2 |
| **Huiveringwekkend** | Elk monster heeft 1 Gruwel meer. | 1 |
| **Scheurende stad** | Er opent bij de start 1 Scheur meer, met monster. | 1 |
| **Slapeloze nachten** | Rusten geeft +1 Lichaam óf +1 Geest, niet allebei. | 1 |
| **Geen tweede worp** | Aanwijzingen geven geen herworp meer. | 2 |
| **Ongeduldige god** | Je moet 1 mysterie meer oplossen. | 3 |
| **Dertien slagen** | Elke test vraagt 1 meer. | 3 |
| **Geen genade** | Geen laatste nacht: komt de Mist op 0, dan is het voorbij. | 2 |

Bij elke klok kan de testbot meten hoeveel hij de winkans verlaagt. Dan kloppen de slagen met hoe zwaar hij echt is: ongeveer 1 slag per 8 tot 10 procentpunt.

## Wat er gebouwd moet worden

1. De klokken als opties bij `nieuwSpel`, en op de plekken in de code waar ze werken.
2. Een keuzescherm bij een nieuw spel, met de slagen en het maximum.
3. Vrijspelen, het maximum, gouden randen en het record per god bewaren op het apparaat.
4. Een rij klokjes bovenin tijdens het potje.
5. Per klok de winkans meten met de testbot, en daarna de slagen bijstellen.

Een eenvoudigere eerste versie kan zonder vrijspelen en gouden randen: alleen de klokken kiezen en het record per god.

## Bronnen

- [Wildfrost Wiki: Bells](https://wildfrostwiki.com/Bells) (via een zoekmachine, de pagina zelf kon ik vanuit deze omgeving niet openen)
