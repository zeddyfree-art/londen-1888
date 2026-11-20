# Voorstel: overal in Londen iets te doen

*Onderzocht op 21 november 2026 (tiende sessie). Nog niet ingebouwd: dit is een voorstel om over te beslissen.*

## Het probleem

Vaak sta je op een plek waar je niets zinnigs kunt doen. De dienst van de plek past niet bij wat je nodig hebt, er ligt geen Aanwijzing en er is geen Scheur. Je reist er alleen doorheen, of je beurt is half leeg.

Gemeten met de testbot (400 potjes per variant, normale stand, alle vijf goden, 2 en 4 helden):

- In **55%** van de beurten doet een held niets anders dan reizen.
- Per beurt blijft gemiddeld **0,17 actie** ongebruikt.
- In **19%** van de beurten eindigt een held in Londen op een plek waar niets te doen is: geen nuttige dienst, geen mysterie, geen Aanwijzing, Scheur of monster.

**Waar het het vaakst leeg is** (deel van de beurten dat een held daar eindigt en er niets te doen is):

| Dienst | Leeg |
|---|---|
| Occulte boekwinkel (Soho) | 42% |
| Ziekenhuis en bank (The City) | 41% |
| Haven (St Katharine Docks) | 37% |
| Station (King's Cross) | 35% |
| Salon (Mayfair) | 26% |
| Gaarkeuken, logementen, sterrenwacht, rivierpolitie | 18–19% |
| Markt, bibliotheek, kerk, club | 2–5% |

De lege plekken zijn juist de knooppunten: The City, de haven en het station. Daar kom je vaak, en daar heb je meestal niets aan de dienst.

## Hoe Eldritch Horror het doet

In Eldritch Horror heeft elke stad dezelfde twee basisacties, naast wat er op de stad zelf staat:

- **Spullen kopen** (*Acquire Assets*): een Invloed-test, en met de successen koop je uit een open rij kaarten.
- **Een reisbewijs kopen** (*Prepare for Travel*): een trein- of bootkaartje, dat je later een gratis extra stap geeft.

Daardoor heb je nooit een lege beurt. Er is altijd iets kleins om voor te bereiden.

## Getest: vijf varianten

Alle varianten zijn een extra actie die op elke plek in Londen kan, naast de dienst. Ze kost een actie.

- **Inkopen**: trek 2 spullen en koop er één voor de gewone prijs plus 1 Pond.
- **Kaartje**: koop voor 1 Pond een rijtuigkaartje (later +2 stappen zonder actie).
- **Rondhoren**: een Waarneming-test (8). Gelukt: 1 Aanwijzing.

| Variant | Winkans normaal | 2 / 4 helden | Ongebruikte acties per beurt | Beurten alleen reizen |
|---|---|---|---|---|
| Zoals nu (twee metingen) | 68,5% en 68,8% | 62–68% / 69–75% | 0,17 | 55% |
| Alleen inkopen | 69,0% | 68% / 70% | 0,15 | 55% |
| Alleen kaartje | 71,5% | 68% / 76% | 0,17 | 54% |
| Alleen rondhoren | 74,2% | 72% / 76% | 0,04 | 48% |
| Alle drie, elk apart | 79,5% | 75% / 84% | 0,04 | 47% |
| **Alle drie, één per beurt** | 76,5% | 74% / 80% | 0,04 | 47% |
| Eén per beurt, Mist 1 lager | 63,0% | 64% / 62% | 0,03 | 47% |
| **Eén per beurt, rondhoren duurder** | **71,0%** | 70% / 72% | 0,04 | 46% |

*"Rondhoren duurder" is een Waarneming-test (9), en mislukt verlies je 1 Geest. De meetruis is ongeveer 4 procentpunt.*

Wat dit laat zien:

- **Inkopen en een kaartje** maken het spel nauwelijks makkelijker (0 tot 3 procentpunt), maar ze vullen ook weinig lege beurten: de testbot gebruikt ze alleen als hij geld over heeft.
- **Rondhoren** vult bijna alle lege acties (0,17 naar 0,04 per beurt), maar is gratis te sterk: +6 procentpunt.
- **Alle drie los** is +11 procentpunt. Dat is te veel.
- **Mist 1 lager als compensatie** gaat te ver: −5,5 procentpunt.
- **Eén per beurt, met een duurder rondhoren** komt uit op +2,5 procentpunt (binnen de meetruis), en haalt toch bijna alle lege acties weg.

## Voorstel

**Een nieuwe knop "Rondkijken" op elke plek in Londen.** Die kost een actie en kan één keer per beurt. Je kiest één van drie:

1. **Inkopen**: trek 2 spullen en koop er één voor de gewone prijs plus 1 Pond. Kan niet als je Gezocht bent.
2. **Een rijtuigkaartje**: 1 Pond. Later in een eigen beurt +2 stappen zonder actie.
3. **Rondhoren**: Waarneming (9). Gelukt: 1 Aanwijzing. Mislukt: −1 Geest, want je hebt de verkeerde mensen gesproken.

Waarom zo:

- Je hebt nooit meer een lege beurt, en de keuze is echt: Pond uitgeven, tempo kopen of een risico nemen voor een spoor.
- De markt blijft beter (3 kaarten, gewone prijs), de boekwinkel blijft de enige plek voor spreuken, en het station en de haven blijven de snelle routes. De diensten verliezen dus niets.
- De winkans stijgt naar verwachting 2 tot 3 procentpunt. Echte spelers kopen waarschijnlijk vaker in dan de testbot, dus het kan iets meer zijn. Het is met de klokken op te vangen, of door de Mist van ontspannen 1 lager te zetten. Ontspannen voelde toch al te makkelijk.

**Kleiner alternatief**: alleen de vier leegste diensten opknappen.

- *Ziekenhuis*: ook "Wachtkamer: hoor wie er binnengebracht is" (Waarneming 8: 1 Aanwijzing).
- *Haven en station*: ook "Rondkijken op de kade/het perron" (Waarneming 8: 1 Aanwijzing).
- *Boekwinkel*: ook "Bladeren" (gratis, bekijk 3 spreuken en ruil er één om met een spreuk die je hebt).

Dat lost het probleem op de drukste plekken op, maar niet overal.

## Wat er nodig is om het te bouwen

- Een knop *Rondkijken* in het actiepaneel, met een keuzevenster voor de drie opties.
- De testbot leren wanneer hij rondkijkt (zoals in het experiment).
- Handleiding, tutorial-tip en "Wat is er nieuw".
- Opnieuw meten: balans, en het klokkenmodel met daarna het scorebord.
