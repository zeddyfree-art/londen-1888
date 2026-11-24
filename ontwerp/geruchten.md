# Geruchten: haalkans

Gemeten met `node tools/meet-geruchten.js 400` (en 300 voor de oude stand): elk gerucht wordt in gewone potjes op normaal aan het begin van ronde 2, 3 of 4 klaargezet, zoals een onheilskaart dat doet. De testspeler stuurt de dichtstbijzijnde held erheen; bij Aanwijzingen ophalen gaan er zoveel helden als er Aanwijzingen liggen.

**Rondes** is hoeveel rondes je echt hebt: het getal dat het spel bij het gerucht toont. In `data/onheil.json` staat er 1 meer, omdat het gerucht in de onheilsfase waarin het verschijnt al één keer aftelt.

Vroeger hadden alle geruchten 2 rondes. Aanwijzingen ophalen kan alleen bij een ontmoeting, één per held per ronde, en een spoor volgen lukt ongeveer 2 van de 3 keer; 3 Aanwijzingen in 2 rondes met 2 helden lukte daardoor maar 1 op de 5 keer. Nu krijgt elk gerucht zoveel rondes dat 2 helden het meestal halen (ongeveer 65 tot 90%). De wachter in het pakhuis (Taaiheid 12, 3 Leven) blijft bewust de zwaarste.

| Gerucht | Opdracht | Rondes (was 2) | 2 helden, was | 2 helden, nu | 4 helden, was | 4 helden, nu |
|---|---|---|---|---|---|---|
| de verzamelaar | bezoek pall-mall | 2 | 83% | 84% | 91% | 88% |
| het lied | 3 Aanwijzingen in covent-garden | 4 | 21% | 75% | 54% | 93% |
| de deur ademt | Scheur sluiten in wapping | 4 | 53% | 79% | 63% | 88% |
| de waarschuwing van Ivy | Scheur sluiten in marylebone | 3 | 82% | 91% | 89% | 97% |
| de wachter in het pakhuis | shabti-wachter verslaan in st-katharine-docks | 4 | 23% | 56% | 30% | 69% |
| de verdwenen agent | 2 Aanwijzingen in spitalfields | 3 | 62% | 83% | 83% | 93% |
| de veiling | bezoek pall-mall | 2 | 72% | 76% | 88% | 84% |
| de koorts van de stad | mistdwaler verslaan in city | 3 | 60% | 75% | 65% | 83% |
| het rijmpje | 2 Aanwijzingen in covent-garden | 4 | 35% | 65% | 68% | 93% |
| de opgraving | Scheur sluiten in city | 3 | 79% | 90% | 91% | 98% |
| de nachtmis | kuddeleider verslaan in limehouse | 4 | 51% | 77% | 53% | 88% |
| de nachtelijke inbraak | reliekjager verslaan in bloomsbury | 3 | 66% | 81% | 70% | 85% |
| de bliksemtoren | Scheur sluiten in hampstead | 3 | 63% | 84% | 77% | 90% |
| het feest in de opera | maskerdanser verslaan in covent-garden | 3 | 46% | 68% | 55% | 74% |
| de opwindnacht | Scheur sluiten in westminster | 3 | 78% | 86% | 80% | 90% |
| de ochtendeditie | leugenaar verslaan in strand | 3 | 61% | 80% | 71% | 92% |
| de stille verkoop | goudworm verslaan in city | 3 | 53% | 75% | 66% | 80% |

Het gerucht van de vermiste expeditie (uitbreiding, bezoek Yucatán) is niet gemeten; dat blijft op 2 rondes.

Effect op de winkans van het hele spel (testbot, 150 potjes per instelling, tegen de meting van 23 november): ontspannen +1 en −0, normaal +1 (2 helden) en +3 (4 helden), genadeloos −1 en +4 procentpunt. Dat valt binnen de meetruis; het klokkenmodel hoeft daarvoor niet opnieuw.
