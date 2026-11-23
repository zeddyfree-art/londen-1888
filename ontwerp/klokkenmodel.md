# Klokkenmodel

Gemeten op 2026-11-23 met `node tools/meet-klokken.js 40000`: 39857 potjes van de testspeler met willekeurige god, stand, aantal helden, speelduur en klokken.

## Controle op 7972 potjes die niet voor het fitten zijn gebruikt

Log-loss (lager is beter): nieuw model 0.316, oud model 0.461.

| Klokken | Potjes | Gemeten | Nieuw model | Oud model |
|---|---|---|---|---|
| 0 | 1945 | 62% | 65% | 62% |
| 1 tot 2 | 897 | 51% | 50% | 40% |
| 3 tot 4 | 933 | 35% | 33% | 16% |
| 5 tot 6 | 909 | 24% | 21% | 5% |
| 7 tot 8 | 975 | 11% | 11% | 1% |
| 9 tot 10 | 960 | 5% | 6% | 0% |
| 11 tot 13 | 1353 | 1% | 3% | 0% |

Per voorspelde kans (ijking):

| Model zegt | Potjes | Gemeten |
|---|---|---|
| 0 tot 10% | 3455 | 2% |
| 10 tot 20% | 738 | 14% |
| 20 tot 30% | 894 | 21% |
| 30 tot 40% | 352 | 38% |
| 40 tot 50% | 264 | 50% |
| 50 tot 60% | 234 | 56% |
| 60 tot 70% | 319 | 69% |
| 70 tot 80% | 685 | 73% |
| 80 tot 90% | 602 | 86% |
| 90 tot 100% | 429 | 96% |

## Zwaarte per klok (in logit; hoger is zwaarder)

| Klok | Ontspannen | Normaal | Genadeloos |
|---|---|---|---|
| dikke-mist | 0.48 | 0.72 | 1.32 |
| lege-zakken | 0.35 | 0.45 | 0.90 |
| gesloten-lijnen | 0.29 | 0.34 | 0.74 |
| zware-benen | 0.22 | 0.23 | 0.61 |
| zwijgende-getuigen | 0.19 | 0.21 | 0.66 |
| taaie-wezens | 0.36 | 0.34 | 0.72 |
| huiveringwekkend | 0.37 | 0.28 | 0.73 |
| scheurende-stad | 0.50 | 0.51 | 1.12 |
| slapeloze-nachten | 0.63 | 0.96 | 1.14 |
| geen-tweede-worp | 0.69 | 0.73 | 0.84 |
| ongeduldige-god | 1.04 | 1.22 | 1.69 |
| dertien-slagen | 1.27 | 1.53 | 1.36 |
| geen-genade | 0.39 | 0.46 | 0.00 |

Plafond (hoeveel logit alle klokken samen hoogstens kosten): ontspannen 14.73, normaal 12.56, genadeloos 7.70.
