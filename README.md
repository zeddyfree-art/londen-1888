# Londen 1888

Een eigen coöperatief horrorspel voor 2 of 4 helden, gespeeld in Victoriaans Londen. Het draait als webapp op laptop en iPad.

## Mappen

| Map | Inhoud |
|---|---|
| `app/` | De broncode van de app: `spel.js`, `stijl.css`, `pagina.html`, manifest, service worker en iconen |
| `data/` | Alle speldata: helden, bord, oude goden, monsters, kaarten, ontmoetingen en de handleiding |
| `art/` | Afbeeldingen, gemaakt met `ontwerp/beeldopdracht.md` |
| `ontwerp/` | Ontwerpkeuzes, spelregels, de wereld en de beeldopdracht |
| `tools/` | Scripts voor bouwen, afbeeldingen ophalen en de beeldopdracht |

## Lore-boek

De wereld, facties, verhaallijnen en personen staan in [`lore/`](lore/README.md). Online: https://zeddyfree-art.github.io/londen-1888/lore/

## Te doen

Zie [`ontwerp/te-doen.md`](ontwerp/te-doen.md).

## Bouwen

```bash
node tools/bouw.js
```

Dit maakt de map `site/`, met de complete webapp, klaar om online te zetten. Lokaal testen:

```bash
cd site && python3 -m http.server 8000
```

Open daarna http://localhost:8000.

## Online zetten met GitHub Pages

Bij elke push bouwt de workflow `.github/workflows/pages.yml` de map `site/` en zet die online. Dat gebeurt op de standaardbranch en op `main`. Eenmalig instellen:

1. Zet de repo op openbaar: **Settings**, dan **General**, helemaal onderaan **Change visibility**, kies **Public**.
2. Ga naar **Settings**, dan **Pages**, en kies bij **Source** de optie **GitHub Actions**.
3. Ga naar **Actions**, kies **Webapp online zetten** en klik op **Run workflow**.

Het spel staat daarna op https://zeddyfree-art.github.io/londen-1888/.

## Alternatief: Cloudflare Pages

Cloudflare Pages kan ook vanuit een privé-repo publiceren en zet de site bij elke push automatisch opnieuw online.

1. Log in op dash.cloudflare.com en ga naar **Workers & Pages**, dan **Create**, dan het tabblad **Pages**, en kies **Connect to Git**.
2. Koppel GitHub en kies de repo `londen-1888`.
3. Vul in:
   - **Project name:** `londen-1888` (dit wordt het adres `londen-1888.pages.dev`)
   - **Production branch:** de branch waarop je wilt publiceren, bijvoorbeeld `main`
   - **Framework preset:** None
   - **Build command:** `node tools/bouw.js`
   - **Build output directory:** `site`
4. Klik op **Save and Deploy**.

Elke push naar die branch zet daarna automatisch een nieuwe versie online. Pushes naar andere branches krijgen een eigen voorbeeldadres.

## Afbeeldingen toevoegen

1. Maak de afbeeldingen met `ontwerp/beeldopdracht.md` en zet ze in de gedeelde Drive-map.
2. Zet de Drive-bestands-ID's in `tools/art-drive.json`.
3. Haal ze op en verklein ze:

   ```bash
   python3 -I tools/haal-art.py tools/art-drive.json
   ```

4. Bouw opnieuw en push.

## Op de iPad

Open de site in Safari, tik op het deelicoon en kies **Zet op beginscherm**. Het spel opent dan schermvullend als een eigen app, en het werkt ook offline.
