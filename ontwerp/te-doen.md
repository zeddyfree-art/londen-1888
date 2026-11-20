# Te doen

Deze lijst werken we aan het einde van elk gesprek bij. Zet bij elke update die spelers merken een nieuw bericht bovenaan `data/nieuws.json` (met een hoger `id`): dat verschijnt één keer als "Wat is er nieuw" als de app opent.

*Laatst bijgewerkt: 20 november 2026 (zevende sessie)*

## Gemeten na de zevende sessie

Met `node tools/testbot.js 150` (balans) en `node tools/meet-variatie.js 100` (herhaling, normale stand). In het spel: 50 stadskaarten, 40 verhaalkaarten, 20 scheurkaarten, 30 onheilskaarten (24 per god) en 4 mysteries per god, waarvan er per potje 3 meedoen.

**Balans (winkans):**

| God | Ontspannen 2 / 4 | Normaal 2 / 4 | Genadeloos 2 / 4 |
|---|---|---|---|
| Vathrûn | 97% / 97% | 71% / 79% | 22% / 11% |
| Azh-Ilareth | 94% / 99% | 55% / 75% | 15% / 19% |
| Nebet-Ankhu | 92% / 97% | 57% / 79% | 17% / 13% |

Alles valt binnen het doel.

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

### Geluid
- [ ] Nog 11 geluiden genereren in de ElevenLabs-flow "Londen 1888 geluiden" (alles staat klaar; het gratis plan was druk). Klaar: `dobbel`, `onheil`, `klik`, `reis` en `kaart`.
- [ ] Geluid testen op de iPad: volume, sfeerlus en de eerste tik.

### Beelden
- [ ] De nieuwe portretten van Odile en Cordelia staan in `art/helden/`, maar in Drive staan nog de oude. Vervang ze daar ook. Daarna kunnen ze met hun nieuwe Drive-id terug in `tools/art-drive.json`.
- [ ] Beelden voor nieuwe kaarten (alleen nodig als er nieuwe personages of spullen bijkomen)

### Kaarten en verhaal
- [ ] De nieuwe teksten proeflezen: zijn ze samenhangend genoeg en lang genoeg?

### Spel
- [ ] Testen: voelen de persoonlijke spullen nuttig, zonder te sterk te zijn?
- [ ] Spelen met ieder een eigen scherm (gekozen in de keuzebrief, nog niet gebouwd)
- [ ] Balans met echte potjes controleren, vooral de nieuwe mysteries: Het verloren rapport (Southwark → Whitehall), De Dichter zonder Ogen (Mayfair → Westminster) en Het verhaal van de voorman (Whitechapel → Bloomsbury).
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
