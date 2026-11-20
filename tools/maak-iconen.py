"""Maakt alle app-iconen en favicons uit twee bronbeelden.

Gebruik: python3 -I tools/maak-iconen.py <icoon-1024.png> [favicon-512.png]
- icoon-1024.png: het app-icoon, 1024 x 1024 px, vierkant, zonder transparantie.
- favicon-512.png (optioneel): een vereenvoudigde versie voor kleine maten (16-48 px).
  Zonder dit bestand wordt het app-icoon ook voor de favicon gebruikt.
Schrijft naar app/icoon/: icoon-180.png (iPhone/iPad), icoon-192.png, icoon-512.png,
icoon-maskable-512.png (Android, met extra rand), favicon-32.png, favicon-16.png en favicon.ico.
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UIT = os.path.join(ROOT, "app", "icoon")

def vierkant(pad):
    img = Image.open(pad).convert("RGB")
    w, h = img.size
    z = min(w, h)
    return img.crop(((w - z) // 2, (h - z) // 2, (w - z) // 2 + z, (h - z) // 2 + z))

def main(icoon, favicon=None):
    os.makedirs(UIT, exist_ok=True)
    groot = vierkant(icoon)
    for n in (180, 192, 512):
        groot.resize((n, n), Image.LANCZOS).save(os.path.join(UIT, f"icoon-{n}.png"), optimize=True)
    # maskable: Android snijdt tot 20% weg. Het bronbeeld heeft al een ruime rand, dus het krimpt maar licht (90%)
    # op de achtergrondkleur van de hoek; verlaag 0.9 naar 0.8 als het onderwerp tot aan de rand loopt.
    rand = groot.getpixel((4, 4))
    m = Image.new("RGB", (512, 512), rand)
    z = int(512 * 0.9)
    m.paste(groot.resize((z, z), Image.LANCZOS), ((512 - z) // 2, (512 - z) // 2))
    m.save(os.path.join(UIT, "icoon-maskable-512.png"), optimize=True)
    klein = vierkant(favicon) if favicon else groot
    for n in (16, 32):
        klein.resize((n, n), Image.LANCZOS).save(os.path.join(UIT, f"favicon-{n}.png"), optimize=True)
    klein.resize((48, 48), Image.LANCZOS).save(os.path.join(UIT, "favicon.ico"), sizes=[(16, 16), (32, 32), (48, 48)])
    print("Iconen geschreven naar app/icoon/")

main(*sys.argv[1:3])
