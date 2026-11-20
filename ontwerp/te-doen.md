# Te doen

Deze lijst werken we aan het einde van elk gesprek bij.

*Laatst bijgewerkt: 20 november 2026 (tweede sessie)*

## Waar extra kaarten het meest nodig zijn

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

1. **Onheilskaarten (+10) en geruchten (+4).** Elk potje trek je 7 tot 11 van de 16 onheilskaarten, dus na twee potjes ken je ze. Er zijn maar 2 geruchten. Dit geeft per potje de meeste nieuwe variatie.
2. **Verhaalkaarten op de drukke plekken (+2 per god).** Met 4 helden zie je tegen Nebet-Ankhu 39% herhaling. Extra verhaalkaarten in The City, Bloomsbury en St Katharine Docks verhelpen dat het meest.
3. **Algemene stadskaarten op de 5 drukste plekken (+2 per plek, samen 10).** The City, Bloomsbury, King's Cross, Soho en St Katharine Docks naar 4 kaarten per plek.
4. **Scheurkaarten (+6).** Weinig herhaling binnen een potje, maar je kent ze snel na een paar potjes.
5. **Mysteries.** Elke god heeft er precies 3, en je speelt er elk potje 2 of 3. Een vierde mysterie per god, waarvan er per potje 3 willekeurig meedoen, maakt elk potje anders.

Minder dringend: expeditiekaarten (je gaat zelden overzee), aanwijzingsteksten (kort en weinig opvallend).

## Open taken

### Beelden
- [ ] Portretten van de 11 vaste personages maken met `ontwerp/beeldopdracht-personen.md` en in de Drive-map `personen/` zetten. Daarna haalt Claude ze op.
- [ ] Plaatjes van de 32 persoonlijke spullen maken met `ontwerp/beeldopdracht-persoonlijk.md` en in de Drive-map `persoonlijk/` zetten.

### Kaarten en verhaal
- [ ] Extra onheilskaarten en geruchten (zie prioriteit 1)
- [ ] Extra verhaal- en stadskaarten op de drukke plekken (prioriteit 2 en 3)
- [ ] Extra scheurkaarten (prioriteit 4)
- [ ] Een vierde mysterie per god (prioriteit 5)
- [ ] De nieuwe teksten proeflezen: zijn ze samenhangend genoeg en lang genoeg?

### Spel
- [ ] Testen: voelen de persoonlijke spullen nuttig, zonder te sterk te zijn?
- [ ] Spelen met ieder een eigen scherm (gekozen in de keuzebrief, nog niet gebouwd)
- [ ] De balans opnieuw meten na nieuwe kaarten (`node tools/testbot.js 150`)
- [ ] De balans met echte potjes bijstellen: voelt ontspannen niet te makkelijk?

### Op de iPad controleren
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
