# Te doen

Deze lijst werken we aan het einde van elk gesprek bij.

*Laatst bijgewerkt: 20 november 2026 (vijfde sessie)*

## Gemeten na de vijfde sessie

Met `node tools/testbot.js 150` (balans) en `node tools/meet-variatie.js 100` (herhaling, normale stand). In het spel: 50 stadskaarten, 36 verhaalkaarten, 30 onheilskaarten (24 per god).

**Balans (winkans):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 91% / 99% | 65% / 81% | 16% / 17% |
| Azh-Ilareth | 91% / 100% | 61% / 82% | 9% / 17% |
| Nebet-Ankhu | 95% / 100% | 53% / 79% | 16% / 22% |

Bijna alles valt binnen het doel. Randgevallen: normaal met 4 helden 79–82% (doel tot 80%), Nebet-Ankhu normaal met 2 helden 53% (doel vanaf 55%) en Azh-Ilareth genadeloos met 2 helden 9% (doel vanaf 10%). Dat valt binnen de meetruis van 150 potjes.

**Herhaling binnen één potje:**

| God | Helden | Overige ontmoetingen | Herhaald | Verhaalkaarten | Herhaald | Onheilskaarten | Deel van de stapel |
|---|---|---|---|---|---|---|---|
| Vathrûn | 2 / 4 | 14,3 / 20,9 | 3% / 7% | 3,8 / 5,7 | 4% / 13% | 9,6 / 7,1 | 40% / 30% |
| Azh-Ilareth | 2 / 4 | 14,8 / 20,3 | 1% / 4% | 3,6 / 5,2 | 2% / 14% | 8,7 / 6,0 | 36% / 25% |
| Nebet-Ankhu | 2 / 4 | 13,8 / 19,9 | 1% / 8% | 2,8 / 4,3 | 2% / 18% | 8,9 / 6,5 | 37% / 27% |

Na de vierde en vijfde sessie is de herhaling sterk gedaald. Bij stadskaarten was ze 8–26% en is ze nu 1–8%. Bij verhaalkaarten was ze tot 39% en is ze nu hooguit 18%.

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
4. **Scheurkaarten (+6).** Weinig herhaling binnen een potje, maar je kent ze snel na een paar potjes.
5. **Mysteries.** Elke god heeft er precies 3, en je speelt er elk potje 2 of 3. Een vierde mysterie per god, waarvan er per potje 3 willekeurig meedoen, maakt elk potje anders.

Minder dringend: expeditiekaarten (je gaat zelden overzee), aanwijzingsteksten (kort en weinig opvallend).

## Open taken

### Beelden
- [ ] Nieuwe portretten van Madame Odile Fairweather en Lady Cordelia Vane maken met `ontwerp/beeldopdracht-herzien.md` en in `helden/` in Drive zetten. Daarna ophalen met `tools/haal-art.py`.
- [ ] Beelden voor nieuwe kaarten (alleen nodig als er nieuwe personages of spullen bijkomen)

### Kaarten en verhaal
- [ ] Verhaalkaarten bij Nebet-Ankhu: met 4 helden nog 18% herhaling, het hoogste van de drie. Eén of twee extra op Whitehall of Strand.
- [ ] Extra scheurkaarten (prioriteit 4)
- [ ] Een vierde mysterie per god (prioriteit 5)
- [ ] De nieuwe teksten proeflezen: zijn ze samenhangend genoeg en lang genoeg?

### Spel
- [ ] Testen: voelen de persoonlijke spullen nuttig, zonder te sterk te zijn?
- [ ] Spelen met ieder een eigen scherm (gekozen in de keuzebrief, nog niet gebouwd)
- [ ] Normaal met 4 helden zit op de bovengrens (79–82%). Eventueel bijstellen na echte potjes.
- [ ] Geruchten tellen af in de ronde waarin ze verschijnen, dus "3 rondes" is in de praktijk 2 hele rondes. Bewust zo laten, of de tekst aanpassen?
- [ ] Testen: voelen de nieuwe geruchten (Scheur sluiten, monster verslaan) haalbaar?
- [ ] De balans met echte potjes bijstellen: voelt ontspannen niet te makkelijk?

### Op de iPad controleren
- [ ] Werkt tikken goed: eerste tik toont de plek, Reis hierheen of tweede tik laat je reizen, Ongedaan maken zet het terug?
- [ ] Installeren via Safari, Zet op beginscherm. Opent hij schermvullend?
- [ ] Werken het geluid en de animaties goed op de iPad?

## Klaar

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
- [x] Gecontroleerd: alle 156 afbeeldingen die het spel gebruikt, zijn er
- [x] Legenda compact en inklapbaar; op de iPad eerst bekijken, dan reizen; Ongedaan maken voor reizen en rusten
