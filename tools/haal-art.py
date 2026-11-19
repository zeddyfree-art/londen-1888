"""Haalt afbeeldingen uit de gedeelde Drive-map en zet ze om naar lichte JPG's.

Gebruik: python3 -I tools/haal-art.py tools/art-drive.json
art-drive.json bevat {"helden/hu-yiping": "<drive-bestands-id>", ...}.
Elke afbeelding wordt art/<map>/<naam>.jpg, maximaal 1024 px hoog (bord: 2400 px breed).
"""
import io, json, os, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX = {"bord": (2400, 2400), "goden": (1600, 1600), "plekken": (1400, 1400), "scherm": (1600, 1600),
       "monsters": (900, 900), "spullen": (640, 640), "spreuken": (640, 640), "artefacten": (640, 640),
       "achterkanten": (600, 800), "fiches": (256, 256)}

def haal(doel, fid):
        uit = os.path.join(ROOT, "art", doel + ".jpg")
        if os.path.exists(uit):
            return
        url = f"https://drive.usercontent.google.com/download?id={fid}&export=download"
        data = urllib.request.urlopen(url, timeout=120).read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img.thumbnail(MAX.get(doel.split("/")[0], (768, 1024)), Image.LANCZOS)
        os.makedirs(os.path.dirname(uit), exist_ok=True)
        img.save(uit, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{doel}: {img.size[0]}x{img.size[1]}, {os.path.getsize(uit) // 1024} KB", flush=True)

def main(lijst):
    from concurrent.futures import ThreadPoolExecutor
    items = json.load(open(lijst))
    with ThreadPoolExecutor(8) as pool:
        for f in [pool.submit(haal, d, i) for d, i in items.items()]:
            try: f.result()
            except Exception as e: print("MISLUKT:", e, flush=True)

main(sys.argv[1])
