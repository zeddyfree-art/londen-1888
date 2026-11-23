# Te doen

Deze lijst werken we aan het einde van elk gesprek bij. Zet bij elke update die spelers merken een nieuw bericht bovenaan `data/nieuws.json` (met een hoger `id`): dat verschijnt één keer als "Wat is er nieuw" als de app opent.

*Laatst bijgewerkt: 23 november 2026 (zestiende sessie)*

## Gemeten na de zestiende sessie (zeven nieuwe goden)

Met `GODEN=ommeth,karathos,ulvereth,sirrhae,ouroch,yth-nemora,gul-marrach node tools/testbot.js 80` en hetzelfde met `MODUS=lang`. De oude vijf goden zijn niet opnieuw gemeten. De uitslagen staan in `ontwerp/balans.json` en `ontwerp/balans-lang.json`, en de basis in het klokkenmodel (`data/klokken.json`).

| God | Mist | Gewoon normaal 2 / 4 | Lange Nacht normaal 2 / 4 | Gewoon genadeloos 2 / 4 |
|---|---|---|---|---|
| Ommeth | 14 | 65% / 63% | 54% / 65% | 16% / 13% |
| Karathos | 12 | 68% / 88% | 60% / 83% | 29% / 24% |
| Ulvereth | 12 | 79% / 78% | 65% / 78% | 25% / 21% |
| Sirrhae | 12 | 75% / 75% | 71% / 69% | 40% / 21% |
| Ouroch | 12 | 55% / 74% | 70% / 78% | 30% / 15% |
| Yth-Nemora | 11 | 71% / 80% | 83% / 81% | 11% / 15% |
| Gul-Marrach | 12 | 64% / 80% | 60% / 71% | 25% / 24% |

Onderweg bijgesteld: een ritueel van Ommeth opende eerst ook een Scheur (dat werd een spiraal: normaal 35% met 2 helden); nu kost het alleen 1 Mist. *De processie volgen* van Waarneming 9 naar 8, *Koop het werkhuis vrij* van 8 naar 6 Pond, en de Uurwerkman windt zich om de ronde op in plaats van elke ronde. De testbot weigert alle gunsten van Sirrhae en leent nooit bij de Hand; echte spelers spelen die goden anders.

## Gemeten na de vijftiende sessie (voorstel voor De Lange Nacht ingebouwd)

Met `node tools/testbot.js 80` en `MODUS=lang node tools/testbot.js 80`. De Lange Nacht: Mist +7 met 2 helden en +4 met 4; geen dubbele Geest-straf (uitputting telt niet op bij Ysmara en Nebet-Ankhu); Azh-Ilareth Mist 11; *Het getij keren* en *Het verbroken wiegelied* vragen eerst 2 Aanwijzingen. Het klokkenmodel heeft nu ook een basis voor De Lange Nacht (`basisLang`), die het startscherm gebruikt.

| God | Gewoon normaal 2 / 4 | Lange Nacht normaal 2 / 4 | Gewoon genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 70% / 83% | 71% / 81% | 19% / 18% |
| Azh-Ilareth | 59% / 89% | 74% / 78% | 25% / 23% |
| Nebet-Ankhu | 83% / 86% | 68% / 80% | 36% / 43% |
| Ysmara | 71% / 83% | 56% / 79% | 16% / 16% |
| Morghast | 73% / 65% | 76% / 76% | 19% / 10% |

Gemiddeld: gewoon normaal 76%, Lange Nacht normaal 74% (2 helden 69%, 4 helden 79%; was 51% en 82%), genadeloos ~22%. Nebet-Ankhu is op genadeloos makkelijk (36 tot 43%); eventueel 1 Mist lager.

## Gemeten na de veertiende sessie (vijfde mysterie, ontmoetingen 1 zwaarder, uitputting, Arjan Singh)

Met `node tools/testbot.js 80` en `MODUS=lang node tools/testbot.js 80`, plus het analysescript (50 potjes per vakje, normaal). Ontmoetingstests 1 zwaarder; Mist ontspannen +1, normaal −1, genadeloos −3; Vathrûn Mist 11; vijf mysteries per god; De Lange Nacht 2 mysteries meer en Mist +5; uitputting vanaf de helft van de Mist. Daarna nog *Het aftelrijmpje* naar Charisma 8 (niet opnieuw gemeten).

| God | Gewoon normaal 2 / 4 | Lange Nacht normaal 2 / 4 | Gewoon genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 65% / 76% | 66% / 79% | 28% / 15% |
| Azh-Ilareth | 70% / 64% | 44% / 78% | 19% / 9% |
| Nebet-Ankhu | 65% / 81% | 55% / 64% | 36% / 30% |
| Ysmara | 64% / 78% | 38% / 85% | 21% / 15% |
| Morghast | 68% / 70% | 64% / 83% | 24% / 9% |

Ontspannen gewoon 80 tot 99%, Lange Nacht 74 tot 99%. Rondes met 2 helden: gewoon ~8, Lange Nacht 12,5 tot 14. Tests gelukt 78 tot 85% (was 85 tot 88%). Waanzin 1,0 tot 2,3 per potje (was 0,3), gevallen helden 0,1 tot 0,4. Het klokkenmodel is bijgewerkt uit `balans.json`.

## Gemeten na de dertiende sessie (overslag, buit, De Lange Nacht; vóór het samenvoegen met de twaalfde)

Met `node tools/testbot.js 80` en `MODUS=lang node tools/testbot.js 80`. Nieuwe regels: overslag, gewone monsters 1 Leven en 1 Taaiheid meer, buit na elk mysterie, laatste nacht 4 verzet per ontbrekend mysterie. Normaal staat nu op Mist 3 lager, genadeloos op 4 lager. De Lange Nacht heeft 1 mysterie meer en Mist +2. Uitslag in `balans.json` en `balans-lang.json`; het klokkenmodel (`data/klokken.json`, basis) is bijgewerkt uit `balans.json`.

**Gewoon (winkans):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 94% / 99% | 79% / 84% | 20% / 11% |
| Azh-Ilareth | 96% / 100% | 58% / 71% | 14% / 9% |
| Nebet-Ankhu | 95% / 100% | 83% / 75% | 35% / 25% |
| Ysmara | 94% / 100% | 46% / 78% | 8% / 6% |
| Morghast | 98% / 98% | 85% / 76% | 24% / 8% |

**De Lange Nacht (winkans, rondes met 2 helden op normaal):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 | Rondes |
|---|---|---|---|---|
| Vathrûn | 94% / 100% | 65% / 84% | 19% / 11% | 10,9 |
| Azh-Ilareth | 88% / 100% | 58% / 81% | 11% / 9% | 9,6 |
| Nebet-Ankhu | 90% / 98% | 63% / 64% | 33% / 18% | 10,0 |
| Ysmara | 89% / 98% | 39% / 83% | 4% / 6% | 10,9 |
| Morghast | 99% / 99% | 80% / 83% | 18% / 11% | 9,4 |

**Verzamelen per held** (normaal, 2 helden; gemeten met een eigen meetscript): gewoon 4,3 spullen (was 2,3, inclusief 1,8 persoonlijke), 1,1 artefact (was 0,3). De Lange Nacht 3,6 spullen en 2,4 artefacten (de testbot kiest in de beloningsronde vaak een artefact). Groeien blijft rond 0,6 tot 0,8 keer per held.



## Gemeten na de twaalfde sessie (zeven nieuwe onheilskaarten, Scheuren-garantie, 24 helden)

Met `node tools/testbot.js 60` (60 potjes per vakje, dus ongeveer 6 procentpunt meetruis). Het oude `balans.json` (150 potjes) is blijven staan. Normaal ligt gemiddeld op 70% (was 73%), genadeloos op 26% (was 24%): binnen de meetruis. De testbot gebruikt de vermogens van de nieuwe helden (les geven, handoplegging) en de sterrenwacht niet.

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 98% / 100% | 82% / 75% | 33% / 30% |
| Azh-Ilareth | 93% / 100% | 70% / 68% | 28% / 27% |
| Nebet-Ankhu | 95% / 97% | 68% / 75% | 30% / 13% |
| Ysmara | 88% / 97% | 53% / 68% | 27% / 22% |
| Morghast | 98% / 100% | 73% / 72% | 30% / 20% |

## Gemeten na de elfde sessie (met Rondkijken)

Met `node tools/testbot.js 150` en `node tools/meet-klokken.js 100`. Rondkijken maakt het spel naar verwachting 2 tot 3 procentpunt makkelijker; in deze meting valt dat binnen de meetruis.

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 98% / 99% | 75% / 79% | 33% / 23% |
| Azh-Ilareth | 97% / 99% | 75% / 79% | 22% / 17% |
| Nebet-Ankhu | 93% / 99% | 69% / 77% | 29% / 23% |
| Ysmara | 95% / 99% | 52% / 71% | 19% / 18% |
| Morghast | 98% / 99% | 79% / 73% | 37% / 15% |

## Gemeten na de tiende sessie (vijf goden, 21 helden)

Met `node tools/testbot.js 150` en `node tools/meet-klokken.js 100`. De Mist van Ysmara staat op 12 en die van Morghast op 11; met 11 en 12 was Ysmara te zwaar (normaal 49 tot 57%) en Morghast te makkelijk (normaal 83 tot 85%).

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 93% / 99% | 73% / 83% | 31% / 31% |
| Azh-Ilareth | 95% / 99% | 69% / 74% | 21% / 13% |
| Nebet-Ankhu | 95% / 100% | 76% / 79% | 29% / 17% |
| Ysmara | 91% / 98% | 57% / 75% | 11% / 9% |
| Morghast | 96% / 99% | 77% / 75% | 31% / 13% |

De meetruis is ongeveer 4 tot 5 procentpunt per vakje. Ysmara op genadeloos zat in een eerdere meting op 16 tot 18%; nu op 9 tot 11%. Echte spelers hebben tegen Ysmara een voordeel dat de testbot niet benut: bij elkaar blijven.

## Gemeten na de negende sessie (Voorbereiden, bijna zeventig nieuwe kaarten)

Met `node tools/testbot.js 150`, `node tools/meet-tests.js 60`, `node tools/meet-variatie.js 100` en `node tools/meet-klokken.js 100`.

**Balans (winkans):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 93% / 100% | 72% / 74% | 26% / 29% |
| Azh-Ilareth | 96% / 100% | 75% / 71% | 23% / 15% |
| Nebet-Ankhu | 95% / 99% | 73% / 77% | 31% / 19% |

Normaal ligt nu tussen 71 en 77% (was 68 tot 83%). Genadeloos ligt tussen 15 en 31%, een paar punt hoger dan het doel van 10 tot 20%. Ontspannen blijft makkelijk; daarvoor zijn de klokken er.

**Gevechten en verbanning** (zie `tests-en-geluk.md`): een gevecht lukt 70% bij de eerste worp en 80% na herworpen (was 69% en 72%). Voorbereiden en de zwakke plek maken het verschil, monsters zijn 1 taaier. Verbanning lukt ongeveer 80% (was 95%).

**Herhaling:** binnen één potje komt bijna niets meer terug (0 tot 2% bij de stadskaarten, 0 tot 6% bij de verhaalkaarten). De drukste plek heeft nu per potje 0,2 trekking per kaart (Southwark), waar dat eerst 0,5 was (Spitalfields). Per potje zie je 3,3 scheurkaarten uit 20 (was 4 uit 14) en 3,3 aanwijzingen uit 16 (was 3 uit 7). Vervolgverhalen komen in ongeveer 2 van de 3 potjes voor, late kaarten in ongeveer de helft.

## Gemeten na de achtste sessie (twee keer reizen, genadeloos Mist 1 lager)

Met `node tools/testbot.js 150`. Tests, vaardigheid en geluk, en wat er gebeurt als elke test 1 hoger vraagt: zie [`tests-en-geluk.md`](tests-en-geluk.md).

**Balans (winkans), met de Ondergrondse (1 Pond tussen stations):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 98% / 97% | 70% / 83% | 25% / 26% |
| Azh-Ilareth | 94% / 99% | 68% / 77% | 17% / 19% |
| Nebet-Ankhu | 92% / 99% | 67% / 76% | 19% / 15% |

De Ondergrondse maakt het spel een paar procentpunt makkelijker, binnen de meetruis van ongeveer 4 procentpunt. Vathrûn zit op normaal met 4 helden (83%) en op genadeloos (25 en 26%) net boven het doel. De anderen zitten erbinnen. Zonder Ondergrondse, met genadeloos Mist 1 lager: genadeloos 13 tot 27%, normaal 60 tot 81%.

## Gemeten na de zevende sessie

**Herhaling binnen één potje:**

| God | Helden | Overige ontmoetingen | Herhaald | Verhaalkaarten | Herhaald | Onheilskaarten | Deel van de stapel |
|---|---|---|---|---|---|---|---|
| Vathrûn | 2 / 4 | 13,5 / 21,3 | 1% / 6% | 4,1 / 6,3 | 2% / 9% | 9,3 / 6,8 | 39% / 28% |
| Azh-Ilareth | 2 / 4 | 13,6 / 17,6 | 0% / 3% | 3,8 / 5,1 | 2% / 8% | 8,1 / 5,1 | 34% / 21% |
| Nebet-Ankhu | 2 / 4 | 14,7 / 20,7 | 3% / 9% | 2,7 / 4,4 | 2% / 11% | 9,3 / 6,5 | 39% / 27% |

## Waar extra kaarten het meest nodig waren (meting derde sessie)

Gemeten met de testbot: 300 potjes in de normale stand, met 2 en met 4 helden.

**Per potje trek je ongeveer:**

| Soort | Per potje (2 helden) | Per potje (4 helden) | In het spel | Herhaling binnen één potje |
|---|---|---|---|---|
| Stadskaarten (algemeen) | 7–9 | 12–13 | 40 | 8–26% |
| Verhaalkaarten (per god) | 3 | 5–6 | 10 per god | 7–39% |
| Scheurkaarten | 4–5 | 4–6 | 8 + 2 per god | bijna 0% |
| Aanwijzingsteksten | 1–3 | 2–3 | 6 + 1 per god | bijna 0% |
| Expeditiekaarten | 0–1,5 | 1–1,5 | 3 per bestemming + 3 per god | bijna 0% |
| Onheilskaarten | 9–11 | 7–8 | 16 | geen, maar je ziet elk potje de helft van de stapel |

**De drukste plekken:** The City (16% van de ontmoetingen), Bloomsbury (14%), King's Cross (12%), Soho (9%) en St Katharine Docks (8%). Daar komen helden steeds terug, voor het ziekenhuis, de bibliotheek, de trein, de spreuken en de boot. Juist op deze plekken liggen maar 2 algemene kaarten.

**Prioriteit voor nieuwe kaarten:**

1. ~~**Onheilskaarten (+10) en geruchten (+4).**~~ Gedaan in de vierde sessie. Elk potje trek je 7 tot 11 van de 16 onheilskaarten, dus na twee potjes ken je ze. Er zijn maar 2 geruchten. Dit geeft per potje de meeste nieuwe variatie.
2. ~~**Verhaalkaarten op de drukke plekken (+2 per god).**~~ Gedaan in de vierde sessie. Met 4 helden zie je tegen Nebet-Ankhu 39% herhaling. Extra verhaalkaarten in The City, Bloomsbury en St Katharine Docks verhelpen dat het meest.
3. ~~**Algemene stadskaarten op de 5 drukste plekken (+2 per plek, samen 10).**~~ Gedaan in de vijfde sessie. The City, Bloomsbury, King's Cross, Soho en St Katharine Docks naar 4 kaarten per plek.
4. ~~**Scheurkaarten (+6).**~~ Gedaan in de zesde sessie. Weinig herhaling binnen een potje, maar je kent ze snel na een paar potjes.
5. ~~**Mysteries.**~~ Gedaan in de zesde sessie. Elke god heeft er precies 3, en je speelt er elk potje 2 of 3. Een vierde mysterie per god, waarvan er per potje 3 willekeurig meedoen, maakt elk potje anders.

Minder dringend: expeditiekaarten (je gaat zelden overzee), aanwijzingsteksten (kort en weinig opvallend).

## Open taken

- [ ] Beelden voor Kaarten van de Oude Wereld: 42 stuks in `ontwerp/beeldopdracht-oude-wereld.md` (27 plekken, 6 schatten, 3 helden en 6 persoonlijke spullen). Tot ze er zijn, toont het spel een kleurvlak.
- [ ] Testen met echte potjes: Kaarten van de Oude Wereld. Is de Gevaarstapel spannend? Komen spelers in het hart? Voelt Post naar huis nuttig? Is de Mist-beloning (terug uit de tweede ring +1, het hart +2) te sterk voor spelers die het goed doen?
- [ ] Kaarten van de Oude Wereld in De Lange Nacht op normaal met 2 helden: winkans 8 procentpunt lager dan zonder uitbreiding (testbot, 40 potjes per god). Bij gewoon spel is het hoogstens 4. Na de echte testpotjes kijken of de Mist-beloning of de gevaren hier zachter moeten. Ook nog niet gemeten: de uitbreiding samen met klokken.
- [ ] Sfeergeluiden voor de zeven nieuwe goden: zie `ontwerp/geluidsopdracht.md` (`sfeer-ommeth.mp3` tot `sfeer-gul-marrach.mp3`). Tot ze er zijn, klinkt de sfeer van het startscherm.
- [ ] Het gedeelde scorebord kent de nieuwe goden pas als de Worker opnieuw online staat: `NODE_USE_ENV_PROXY=1 node tools/zet-scorebord-online.js`. Tot dan worden overwinningen tegen de nieuwe goden geweigerd (onbekende god).
- [ ] Het klokkenmodel (versie 2, gefit op 40.000 potjes) kent de zeven nieuwe goden alleen via hun testbotmeting zonder klokken. Bij de volgende meting met `node tools/meet-klokken.js` gaan alle twaalf goden mee.
- [ ] Testen met echte potjes: Sirrhae. Nemen spelers gunsten aan, en is de prijs dan te laag of te hoog? Voelt Betoverd niet als straf zonder uitweg?
- [ ] Testen: Ulvereth. Is de spreiding tussen goede en slechte rondes leuk? Zijn bevroren plekken duidelijk genoeg op het bord?
- [ ] Testen: Yth-Nemora. Wordt natrekken gebruikt, of gokken spelers? Is een op de drie vals niet te frustrerend?
- [ ] Testen: Ommeth. Is het opruimen van cultisten leuk, of wordt het een lange reeks kleine gevechten?
- [ ] Testen: Karathos. Zijn de splinters met +1 niet te sterk, en is het roepen (een op de zes) merkbaar genoeg?
- [ ] Testen: Gul-Marrach. Is de koers van +3 aan het eind van een mysterie te hard? Wordt de lening bij de Hand gebruikt?
- [ ] Testen: Ouroch. Voelt de klokslag eerlijk, of als straf voor iets wat je niet kon tegenhouden?
- [ ] De drie losse ideeën uit de stemronde (de Ondergrondse, twee fronten overzee, de slaper die meedroomt) kregen ook een 4. Uitwerken als de zeven nieuwe goden getest zijn.
### Balans en tests (zie `tests-en-geluk.md`)
- [ ] Klokkenmodel opnieuw meten als de balans verandert: `node tools/meet-klokken.js 40000` (ruim 5 minuten), en daarna `NODE_USE_ENV_PROXY=1 node tools/zet-scorebord-online.js`, zodat de server met hetzelfde model rekent. (Laatst gedaan op 23 november 2026.)
- [ ] Twee klokken zijn het lichtst: *Zware benen* en *Zwijgende getuigen* (op normaal 0,2 logit, ongeveer 4 procentpunt). Ze doen wel iets, maar mogen sterker.
- [ ] Ontspannen (en volgens Dieuwertje ook normaal) is makkelijk. Geparkeerd: de klokken maken het zwaarder.
- [ ] Testen met echte potjes: voelt Voorbereiden nuttig, en is de zwakke plek (Aanwijzing in een gevecht) niet te sterk?
- [ ] Gedeeld scorebord: namen modereren als dat nodig wordt (verwijderen kan in de D1-database `londen1888-scorebord`).

### Geluid
- [ ] Op de iPad controleren: klinkt de sfeer nu zachter als de muziek aan staat? (Gaat via Web Audio, omdat Safari het gewone volume negeert.)

### Beelden
- [ ] Thuisplekkaarten voor Pema, Khalil en Benedict.

### Kaarten en verhaal
- [ ] De teksten beoordelen we gaandeweg, tijdens het spelen.
- [ ] Na een paar potjes: welke ★-keuzes (heldkeuzes) en vervolgverhalen vallen op, en willen we er meer?
- [ ] Ysmara en Morghast hebben 10 verhaalkaarten elk, de oude goden 16 tot 17. Na een paar potjes kijken of er meer nodig zijn.

### Veertiende sessie
- [ ] Testers vragen naar het tikken: `testvraag-klikken.md`.
- [ ] Startplekken: er zijn 25 helden en 20 plekken, dus 5 plekken hebben er twee (Leicester Square, Bloomsbury, Marylebone, Soho, Pall Mall). Geen gelijke profielen meer op één plek.

### De Lange Nacht en de proefregels (dertiende sessie)
- [ ] Analyserapport *Londen 1888 — Speelbaarheid, winkansen en flow* (22 november): na het samenvoegen gemeten, normaal gewoon ~73%, Lange Nacht ~71%, genadeloos ~20% en ~12%. Aanbevelingen: tests 1 zwaarder met Mist 1 ruimer, meer schade aan helden, snelle worpen en buit in één scherm, *Bereken de baan* en *Het aftelrijmpje* versoepelen, een vijfde mysterie voor De Lange Nacht.
- [ ] Testbot leren artefacten en spreuken buiten gevechten te gebruiken (Kam van de Banshee, Horloge, Wekroep laten de Mist stijgen en zijn nu niet gemeten).
- [ ] De Lange Nacht op het gedeelde scorebord: de server kent de modus nog niet, daarom worden zulke overwinningen nu niet gedeeld.
- [ ] De Lange Nacht duurt zo'n 10 rondes (gewoon 7 tot 8). Voor echt 90 tot 120 minuten is een vijfde mysterie per god nodig. Eerst testen of de huidige lengte bevalt.
- [ ] Ysmara met 2 helden op normaal is zwaar (46%, Lange Nacht 39%). Na echte potjes bekijken.
- [ ] Playtest-vragen uit de brief: aantal spullen aan het eind, het moment waarop een item het verschil maakte, trots op je held (1 tot 5), puzzel of avontuur (1 tot 5).
- [ ] Testbot gebruikt artefacten en spreuken buiten gevechten niet; echte spelers halen meer uit de nieuwe kaarten.

### Spel
- [ ] Testen met echte potjes: de nieuwe helden. Is Khalil (les geven, Boeken geven Kennis) niet te sterk met 4 helden? Is Pema met alles op 3 te zwak aan het begin? Is handoplegging (2 herstel per actie) te veel naast rusten?
- [ ] Testen: helpt de tutorial-coach (rondes 1 tot 3) echt? Zijn er beurten waarin de suggestie vreemd is?
- [ ] Testen: wordt de sekte in Whitechapel gebruikt, en is het risico (monster, Geest) goed?
- [ ] De spreiding van de onheilskaarten na een paar potjes bekijken: zijn de zware kaarten (Bloedmaan, Een nacht zonder einde: Mist −2) niet te hard?
- [ ] Testen met echte potjes: Aggie (klap opvangen), Lottie (verstoppen) en Julian (Kennis in gevechten). Is Julian niet te sterk met Kennis 4 en een zwaard?
- [ ] Testen met echte potjes: wordt Rondkijken gebruikt, en welke van de drie keuzes? Is rondhoren (Waarneming 9, mislukt −1 Geest) de moeite waard?
- [ ] Testen: voelen de persoonlijke spullen nuttig, zonder te sterk te zijn?
- [ ] Balans met echte potjes controleren, vooral de nieuwe mysteries: Het verloren rapport (Southwark → Whitehall), De Dichter zonder Ogen (Mayfair → Westminster) en Het verhaal van de voorman (Whitechapel → Bloomsbury).
- [ ] Testen: voelen de nieuwe geruchten (Scheur sluiten, monster verslaan) haalbaar?

## Klaar

- [x] Uitbreiding Kaarten van de Oude Wereld (de open kaart, optie B uit de stemming): per regio zeven plekken, Gevaarstapel met paren, kist, het hart met een bewaker en twee schatten, terugtocht, gids, Post naar huis en drie nieuwe helden. Aan of uit op het startscherm. Gemeten op normaal (testbot, 60 potjes per god en aantal): 2 helden 66,9% met tegen 69,4% zonder, 4 helden 75,6% tegen 78,7%.
- [x] Onheilskaarten voor de uitbreiding: Storm op het Kanaal, Een telegram uit Caïro, Grafrovers aan boord en Gerucht: een vermiste expeditie. Alleen in de stapel als de uitbreiding aan staat.
- [x] Geluid voor de uitbreiding: zee, ontdekt, gevaar, ramp en schat, en een eigen sfeer per regio (`sfeer-ow-thebe`, `sfeer-ow-himalaya`, `sfeer-ow-yucatan`). De bestanden staan in `ontwerp/geluidsopdracht.md`; tot ze er zijn klinkt de gewone sfeer.
- [x] Winkans op het startscherm en op het scorebord houdt rekening met de uitbreiding (`oudeWereld` in `data/klokken.json`, uit `balans-oude-wereld.json` en `balans-oude-wereld-lang.json`). Het scorebord kent de drie nieuwe helden.
- [x] Alle 63 beelden van de zeven nieuwe goden staan in het spel (goden, Scheurbeelden, epische monsters, monsters en personages).
- [x] Zeven nieuwe oude goden uit de stemronde: Ommeth, Karathos, Ulvereth, Sirrhae, Ouroch, Yth-Nemora en Gul-Marrach. Elk met regel, vijf mysteries, episch monster, drie monsters, drie personages, tien verhaalkaarten (met vervolg), drie scheurkaarten, twee aanwijzingen, vier onheilskaarten en een expeditie. Bundels in `ontwerp/goden/`, samenvoegen met `node tools/voeg-goden-toe.js`. Verwerkt uit de stemming: geen verbrande Aanwijzingen, bekeren als keuze in het gevecht, splinters die zelf roepen, geen verplichte stap bij Betoverd, open gunsten, elke ronde weer met echte meevallers, en iedereen ziet elkaars onzekere Aanwijzingen.
- [x] Nebet-Ankhu op genadeloos 1 Mist lager (`mistPerStand` in `oude-goden.json`): gewoon 23% / 19% (was 36% / 43%), Lange Nacht 27% / 18%

- [x] De Lange Nacht: Mist naar aantal helden, geen dubbele Geest-straf, Azh-Ilareth Mist 11; twee mysteries met een extra stap; zwaarte per god op het startscherm

- [x] Beelden voor Daffadar Arjan Singh (portret, Tulwar van de Guides, Khaki-tuniek) in het spel en in `tools/art-drive.json`

- [x] Albert Gosling: Charisma 4 en Verdwijntruc (Scheuren sluiten met Charisma); nieuwe held Daffadar Arjan Singh (Kracht 4, Stalen zenuwen); Aggie en Khalil een eigen profiel, Khalil naar Bloomsbury
- [x] Vijfde mysterie per god; De Lange Nacht 2 mysteries meer; ontmoetingen 1 zwaarder; uitputting vanaf de helft van de Mist; flessenhalzen versoepeld
- [x] Morghast-sfeer zonder schrapen; vier nieuwe muzieknummers (muziek-2 uit ElevenLabs, muziek-3 tot 5: Somber Shadows, The Music Box Sleeps, Umbrarum), de muziek speelt als afspeellijst

- [x] Wekroep van de klokken werkt nog maar één keer per potje (was elke beurt herhaalbaar)
- [x] De 64 beelden voor De Lange Nacht staan in het spel en in `tools/art-drive.json`
- [x] Gedeeld scorebord online bijgewerkt met het nieuwe klokkenmodel
- [x] Overslag in gevechten en de laatste nacht, ruim gehaald bij ontmoetingen, monsters taaier
- [x] Buit na elk mysterie; De Lange Nacht met bedrijven en beloningsrondes
- [x] 33 spullen, 13 spreuken en 18 artefacten (5 episch), met algemene velden en controle in `tools/controleer-kaarten.js`
- [x] Tutorial-coach: de eerste 3 rondes per beurt een suggestie met het waarom en de regel; de knop of plek licht op
- [x] Scheuren-mysteries lopen niet meer vast (vaste plek krijgt vanzelf een Scheur); voortgang in het mysteriekader
- [x] Sekte in Whitechapel: zelf een Scheur laten openen, met monster
- [x] Sterrenwacht: één van de twee kaarten onderop, en je ziet het effect van elke kaart; zeven nieuwe onheilskaarten (drie meevallers, vier zware)
- [x] Winkels en keuzes tonen altijd plaatje en effect; kleur per soort kaart
- [x] Drie nieuwe helden: Pema Lhamo, Khalil Nasr en Benedict Ashcombe, met hun 9 beelden (portretten en persoonlijke spullen) in het spel en in `tools/art-drive.json`
- [x] Tips aan/uit wordt onthouden; na Verder spelen staat het paneel op de held die aan de beurt is

- [x] Knop Rondkijken op elke plek in Londen: inkopen, rijtuigkaartje of rondhoren (zie `voorstel-overal-iets-te-doen.md`)
- [x] De 25 nieuwe beelden (helden, spullen, goden, monsters, personages) staan in het spel en in `tools/art-drive.json`
- [x] Sfeerlussen voor Ysmara en Morghast uit de ElevenLabs-flow, op volume gebracht
- [x] Twee nieuwe goden: Ysmara, de Doornkoningin, en Morghast, de Slaper in de knekelputten. Elk met regel, vier mysteries, episch monster, drie nieuwe monsters, drie personages, tien verhaalkaarten (met vervolg), drie scheurkaarten, twee aanwijzingen, vier onheilskaarten en een expeditie
- [x] Drie nieuwe helden: Aggie Pruitt (kogelstootster), Lottie "Muis" Finch (dievegge) en Julian Hartwell (gevlucht uit de Bleke Lantaarn), elk met een eigen vermogen en twee persoonlijke spullen
- [x] Thuisplekkaarten voor alle 21 helden (13 nieuw)
- [x] Meet- en testscripts lezen de goden uit `data/oude-goden.json`; klokkenmodel en scorebord kennen vijf goden

- [x] Sfeergeluid zachter als de muziek speelt
- [x] Verbanning zonder +2; nieuwe actie Voorbereiden en de zwakke plek (Aanwijzing in gevecht); monsters 1 taaier
- [x] Klokkenmodel opnieuw gemeten en het scorebord online bijgewerkt
- [x] Nieuwe portretten van Odile en Cordelia staan in Drive (zelfde bestanden, zelfde id's terug in `tools/art-drive.json`)
- [x] Geschrapt: ieder een eigen scherm (samen op één scherm werkt goed)
- [x] Op de iPad gecontroleerd: icoon, tikken, schermvullend, geluid en animaties
- [x] 68 nieuwe kaarten in twee rondes: 9 aanwijzingen (met eigen tests), 8 scheurkaarten, 31 stadskaarten (Spitalfields, Southwark, de drukke plekken, thuisplekken van 8 helden, 7 late kaarten, 4 vervolgverhalen), 9 verhaalkaarten, 3 expedities en 8 onheilskaarten
- [x] Nieuwe soorten kaarten: ★-keuzes voor bepaalde helden, aanwijzingen met een eigen test, late kaarten (pas als de Mist op 6 of lager staat), vervolgverhalen die je later overal vinden, en de effecten reizen, schuld aflossen en niet langer gezocht
- [x] `tools/controleer-kaarten.js` controleert alle kaarten op tikfouten (plekken, helden, effecten, tests en vervolgverhalen)

- [x] Beelden voor de klokken, de toren en het scorebord
- [x] Gedeeld scorebord: Cloudflare Worker `londen1888-scorebord` met D1-database (`cloud/scorebord/`)

- [x] De Klokken van Westminster: 13 uitdagingen, dreigingsmeter, punten en scorebord (`klokken.md`)
- [x] Inzoomen op de kaart: scrollwiel, knijpen, slepen en knoppen

- [x] De Ondergrondse: vanaf een station voor 1 Pond naar elk ander station

- [x] Genadeloos: Mist 1 lager, weer 13 tot 27% winst
- [x] Kans bij elke testknop en in het gevecht

- [x] Scheurkaart: vier geschilderde portalen in `art/scheur/` (algemeen en één per oude god), en een nieuwe favicon

- [x] Spelregels, bord, oude goden, monsters, spullen, spreuken, artefacten en toestanden
- [x] Speelbare webapp met tutorial, handleiding, offline en installeerbaar
- [x] Alle 133 afbeeldingen
- [x] Feedback ronde 1: tableau, groeischerm, bord, legenda, beurt, animaties, geluid en namen van de kenmerken
- [x] Lore-boek met 10 pagina's
- [x] 124 ontmoetingen, waarvan 30 verhaalkaarten, met vaste personages en keuzes
- [x] Slimme testbot en balans
- [x] Persoonlijke spullen van de helden: 32 kaarten met een eigen functie, in het tableau en het heldenprofiel
- [x] Portretten van de 11 personages en plaatjes van de 32 persoonlijke spullen (176 afbeeldingen in totaal)
- [x] Herziene portretprompts: Odile is nu een Creoolse vrouw uit New Orleans, Cordelia duidelijk anders (`ontwerp/beeldopdracht-herzien.md`)
- [x] 14 nieuwe onheilskaarten: 4 algemeen, per god 2 gebeurtenissen en 1 gerucht, plus 1 algemeen gerucht. Nieuwe acties en twee nieuwe soorten geruchten. Onheilskaarten tonen het portret van het personage.
- [x] 6 nieuwe verhaalkaarten in The City, Bloomsbury en St Katharine Docks (2 per god)
- [x] Lore-pagina Onheil en geruchten; meetscript `tools/meet-variatie.js` voor herhaling
- [x] 10 nieuwe stadskaarten op The City, Bloomsbury, King's Cross, Soho en St Katharine Docks (nu 4 per plek), met Voss, Nell en de vaste bijfiguren
- [x] Alle 16 geluiden en een achtergrondmuziek van 3 minuten uit ElevenLabs (flow "Londen 1888 geluiden"), met een aparte knop Muziek uit
- [x] App-icoon en favicon (gaslantaarn), in alle maten via `tools/maak-iconen.py`
- [x] Scherm "Wat is er nieuw": verschijnt één keer na een update, en via de knop op het startscherm
- [x] Eerste ElevenLabs-geluiden (dobbelstenen en onheilsklok) via de connector; `tools/normaliseer-geluid.sh` brengt het volume gelijk
- [x] Geruchten zeggen nu "na 2 rondes", zoals ze in het spel ook werken
- [x] 4 verhaalkaarten op de plekken van de nieuwe mysteries: Martha in Southwark, raïs Hamdi in Whitechapel, een rivierloods in Limehouse, Lucan Vey in Westminster
- [x] Het spel speelt geluidsbestanden uit `art/geluid/` af (met de ingebouwde klanken als terugval), plus een sfeerlus per god. Handleiding: `ontwerp/geluidsopdracht.md`
- [x] Nieuwe portretten van Odile (New Orleans) en Cordelia in het spel
- [x] 6 nieuwe scheurkaarten: 3 algemeen (stille brand, theater van je leven, regen omhoog) en 1 per god
- [x] Een vierde mysterie per god, van het type "breng"; elk potje doen er 3 van de 4 mee. Raïs Hamdi is nu in Londen (Whitechapel).
- [x] Gecontroleerd: alle 156 afbeeldingen die het spel gebruikt, zijn er
- [x] Legenda compact en inklapbaar; op de iPad eerst bekijken, dan reizen; Ongedaan maken voor reizen en rusten
- [x] Speltestfeedback 22-11: portret van de held aan het begin van elke beurt en ontmoeting; overzicht van inzetbare middelen bij gevechten en ontmoetingen; verslagen monsters vechten niet nog eens mee; stations bovenop de kaart; grotere plekken en plaatsnamen; helden sorteren op naam of kenmerk op het startscherm
- [x] Alleen nog de donkere modus; de knop voor de lichte modus is weg
- [x] Tas: teller (4 van 6), weggooien met bevestiging, waarschuwing vóór kopen met een volle tas
- [x] Klokkenmodel opnieuw gefit op 40.000 potjes met willekeurige klokcombinaties: zwaarte per stand, klokken samen minder dan los, eigen basis voor De Lange Nacht. Het oude model zat met 3 of meer klokken 15 tot 20 procentpunt te laag (`ontwerp/klokkenmodel.md`)
