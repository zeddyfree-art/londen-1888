# Tests, vaardigheid en geluk

*Gemeten op 20 november 2026, na de update met twee keer reizen. Met `node tools/meet-tests.js 100`: 100 potjes per instelling (3 goden × 3 standen × 2 en 4 helden), samen 1.800 potjes en 67.938 tests. De ruwe cijfers staan in `ontwerp/tests.json`.*

## Hoe een test werkt

Je gooit 2 dobbelstenen (soms meer, dan tellen de 2 hoogste) en telt je kenmerk en bonussen erbij. Haal je het doel, dan lukt het. In de genadeloze stand ligt elk doel 1 hoger. Na een mislukte worp mag je soms de laagste steen opnieuw gooien, bijvoorbeeld met een Aanwijzing (alleen bij Kennis en Waarneming), Gezegend, een wapen of het vermogen van een held.

Kenmerken lopen van 1 tot 4 bij de start, en tot 5 door te groeien. De meeste doelen liggen tussen 7 en 10.

**Kans met 2 dobbelstenen om minstens dit te gooien:**

| Nodig | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Kans | 100% | 97% | 92% | 83% | 72% | 58% | 42% | 28% | 17% | 8% | 3% |

Een voorbeeld: een Kennis-test met doel 8. Met Kennis 1 moet je 7 gooien: 58%. Met Kennis 4 moet je 4 gooien: 92%.

## Hoe makkelijk zijn de tests?

| Stand | Tests per potje | Lukt bij de eerste worp | Lukt na herworpen |
|---|---|---|---|
| Ontspannen | 30 | 77% | 84% |
| Normaal | 43 | 76% | 84% |
| Genadeloos | 41 | 65% | 74% |

Een test lukt dus meestal: ongeveer 3 van de 4 keer, en in de genadeloze stand 2 van de 3 keer. Wel doe je er veel: zo'n 40 per potje.

**Per soort test** (alle standen samen):

| Soort | Aantal | Gemiddeld doel | Gemiddeld plus | Eerste worp | Na herworpen |
|---|---|---|---|---|---|
| Ontmoetingen | 30.859 | 8,2 | 2,8 | 76% | 83% |
| Gevechten | 10.228 | 8,9 | 3,1 | 69% | 72% |
| Gruwel (Geest) | 9.401 | 8,4 | 2,7 | 74% | 85% |
| Scheur sluiten | 7.451 | 8,9 | 2,6 | 67% | 77% |
| Laatste nacht | 6.055 | 9,9 | 3,4 | 63% | 77% |
| Mysteries en spreuken | 1.381 | 9,0 | 2,8 | 68% | 86% |
| Diensten | 1.096 | 8,7 | 2,9 | 73% | 85% |
| Verbanning (spreuk in gevecht) | 217 | 8,8 | 5,2 | 95% | 99% |

Wat opvalt:
- **Gevechten** zijn de lastigste gewone tests, en herworpen helpen er nauwelijks: van 69% naar 72%. Dat komt doordat Aanwijzingen niet werken bij Kracht.
- **Verbanning** lukt bijna altijd (95%). De spreuk kost wel Geest, maar de test zelf is geen spanning.
- **De laatste nacht** is het moeilijkst (doel 9,9), maar daar helpen herworpen juist veel (63% naar 77%).

## Hoeveel maakt je kenmerk uit?

| Kenmerk | Aantal tests | Eerste worp | Na herworpen |
|---|---|---|---|
| 1 | 10.985 | 47% | 56% |
| 2 | 20.772 | 66% | 77% |
| 3 | 22.855 | 80% | 87% |
| 4 | 13.326 | 89% | 95% |

Elk punt kenmerk is 10 tot 19 procentpunt kans waard. Het verschil tussen een held die er slecht in is (1) en een held die er goed in is (4) is ruim 40 procentpunt: van een muntworp naar bijna zeker. Je held kiezen doet er dus echt toe.

Dat komt door de klokvorm van 2 dobbelstenen. De meeste tests vragen een worp van 5 tot 7, en precies daar is elke +1 het meest waard (11 tot 16 procentpunt). Bij heel makkelijke of heel moeilijke tests is +1 maar 3 tot 6 procentpunt waard. Zo is het spel nu ook afgesteld: twee derde van alle tests vraagt een worp van 5, 6 of 7.

## Hoeveel bepaalt de dobbelsteen?

Twee manieren om ernaar te kijken:

1. **Spreiding.** Hoe ver een test boven of onder het doel uitkomt, verschilt van test tot test. Ongeveer **70%** van dat verschil komt van de dobbelstenen en ongeveer **30%** van je kenmerk, je bonussen en hoe hoog het doel is.
2. **Omkeren.** Neem aan dat je precies het gemiddelde gooit (7). Dan weet je vooraf of een test "zou moeten" lukken. In **25%** van de tests keren de stenen dat om: een test die zou moeten lukken, mislukt, of andersom.

Per test is het dus vooral geluk. Maar over een heel potje heb je zo'n 40 tests, en dan middelt het geluk grotendeels uit. Wie de goede held de goede tests laat doen, Aanwijzingen spaart en op tijd rust, wint veel vaker. Dat zie je ook aan de testbot: hij speelt voorzichtig maar niet slim, en wint op normaal 61 tot 75%, terwijl echte spelers met een plan het beter doen.

Herworpen: in 11% van de tests gebruikt de speler een herworp. Die redt 29% van de mislukte worpen.

## Wat zeggen ontwerpers en theorie?

**Invoer- en uitvoerwillekeur (Geoff Engelstein).** Engelstein onderscheidt willekeur vóór je keuze (je trekt kaarten en kiest wat je ermee doet) en willekeur ná je keuze (je kiest een aanval en gooit dan). Willekeur vooraf geeft je iets om op te plannen. Willekeur achteraf kan je plan onderuithalen. Onze tests zijn bijna helemaal willekeur achteraf. Wat ze strategisch maakt, zijn de keuzes eromheen: welke held welke test doet, wanneer je een Aanwijzing uitgeeft, of je een Scheur nu sluit of eerst Aanwijzingen haalt. Volgens zijn redenering is het goed om die keuzes zichtbaar en zinvol te houden. Spelers verdragen willekeur vooraf over het algemeen beter dan willekeur achteraf.

**Mensen schatten kansen verkeerd in (Sid Meier).** In zijn keynote op GDC 2010 vertelde Sid Meier dat spelers van Civilization Revolution een gevecht met 3 tegen 1 als zeker gewonnen zagen, en zich bedrogen voelden als ze het verloren, terwijl ze 1 op 4 keer hoorden te verliezen. Het spel is daarom achter de schermen iets gunstiger gemaakt. Voor ons betekent dit: een test met 75% kans voelt voor spelers als "lukt bijna altijd". Een mislukking voelt dan als pech, niet als een risico dat ze namen. Dat is nog sterker bij tests met kenmerk 1 (47%), waar spelers vaak niet doorhebben hoe slecht hun kansen zijn.

**Geluk is een kenmerk dat je instelt, geen fout (Richard Garfield; Elias, Garfield en Gutschera).** Garfield, de ontwerper van Magic, ziet geluk en vaardigheid als een schaal, geen tegenstelling. Geluk laat zwakkere spelers soms winnen, maakt het spel toegankelijker en geeft spelers iets om een verlies op af te schuiven. In zijn boek *Characteristics of Games* (met Elias en Gutschera, 2012) is "luck and skill" een van de kenmerken waarmee je spellen vergelijkt. In een coöperatief spel is het spel zelf de tegenstander. Geluk zorgt daar vooral voor spanning en verhaal, en voor de vraag "redden we het nog?".

**Onzekerheid is de motor (Greg Costikyan).** In *Uncertainty in Games* (2013) laat Costikyan zien dat elk spel onzekerheid nodig heeft, en dat willekeur maar één bron is. Andere bronnen zijn verborgen informatie, de keuzes van medespelers en je eigen uitvoering. In een horrorspel past de dobbelsteen bij het thema: je weet nooit zeker of je het houdt.

**Klokvorm tegenover één grote dobbelsteen.** Ontwerpers van rollenspellen merken op dat bij 2 of 3 dobbelstenen je kenmerk zwaarder weegt dan bij een twintigzijdige steen. Bij een d20 is elke +1 steeds 5% waard, en verdrinkt een verschil van 3 punten in de spreiding. Dungeon World koos daarom voor 2d6 + kenmerk. Ons spel zit in dezelfde hoek, met kenmerken van 1 tot 4 die samen ongeveer even zwaar wegen als de spreiding van 2 dobbelstenen.

**Vergelijkbare spellen.** Arkham Horror en Eldritch Horror gebruiken een poel dobbelstenen ter grootte van je vaardigheid, waarbij 5 of 6 een succes is, en je kunt met een Aanwijzing een steen opnieuw gooien. Dat is hetzelfde idee als onze Aanwijzingen. Wat zij ook doen: een mislukte test maakt het verhaal anders in plaats van alleen "er gebeurt niets". Veel van onze ontmoetingskaarten doen dat al met een eigen tekst bij mislukken.

## Wat dit betekent voor Londen 1888

1. **De verhouding is gezond.** Per test beslist vooral de dobbelsteen (70%), over een potje vooral de spelers. Het kenmerk maakt een groot, zichtbaar verschil (47% tegen 89%). Dat is ongeveer wat Engelstein, Garfield en de klokvorm-aanhangers aanraden voor een coöperatief avonturenspel.
2. **Laat de kans zien.** Het spel kan bij de knop zetten hoe groot de kans is, bijvoorbeeld *Kennis-test (8) · 72%*. Dan kiezen spelers bewust, en voelt een mislukking als een risico dat ze namen in plaats van als pech (Sid Meier). Het maakt kenmerk 1 ook zichtbaar zwak.
3. **Gevechten krijgen weinig hulp.** Herworpen werken er bijna niet. Overweeg een manier om je op een gevecht voor te bereiden, bijvoorbeeld een Aanwijzing gebruiken voor een herworp tegen een monster waar je eerder over gelezen hebt.
4. **Verbanning is te zeker.** Met 95% is er geen spanning. Het doel kan 1 of 2 omhoog.
5. **Veel tests.** Zo'n 40 tests per potje is veel dobbelen. Dat is geen probleem zolang elke test iets op het spel zet, maar sommige (zoals Verbanning) kunnen weg of automatisch.

## Bronnen

- Geoff Engelstein, over invoer- en uitvoerwillekeur: [Game Developer](https://www.gamedeveloper.com/blogs/the-2-types-of-randomness-and-how-to-apply-them-to-your-board-game), [Skeleton Code Machine](https://www.skeletoncodemachine.com/p/input-output-randomness-part-1), [GDC: White, Brown, and Pink](https://gdcvault.com/play/1024920/contactUs)
- Sid Meier, GDC 2010: [Shacknews](https://shacknews.com/article/62807/sid-meier-and-rob-pardo), [Tom's Hardware](https://www.tomshardware.com/reviews/gdc-2010-borderlands,2580-4.html), [Game Informer](https://gameinformer.com/b/news/archive/2010/03/12/sid-meier-gamers-arent-logical)
- Richard Garfield over geluk: [Board Game Design Lab](https://boardgamedesignlab.com/luck-vs-skill-with-richard-garfield/), [samenvatting](https://talarian.blogspot.com/2014/11/luck-versus-skill.html?m=1); *Characteristics of Games*: [Zimmermans voorwoord](https://www.ericzimmerman.com/assets/pdfs/Characteristics_of_Games_foreword.pdf), [Replay-artikel](https://czasopisma.uni.lodz.pl/Replay/article/download/2005/1631/7855)
- Greg Costikyan, *Uncertainty in Games*: [Jesper Juul](https://www.jesperjuul.net/ludologist/2013/05/30/greg-costikyan-uncertainty-in-games/), [Liz England](https://lizengland.com/blog/review-uncertainty-in-games-by-greg-costikyan/)
- 2d6 en de klokvorm: [Dungeon World-ontwerpers](https://dungeonworld.gplusarchive.online/2013/02/22/i-was-wondering-if-the-creators-or-anyone-else-could-comment-on-the-process-that-went-in-to-choosing-2d6-instead), [EN World](https://www.enworld.org/threads/bell-curve-ramifications.234495/)
