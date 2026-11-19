"""Haalt afbeeldingen uit de gedeelde Drive-map en zet ze om naar lichte JPG's.

Gebruik: python3 -I tools/haal-art.py tools/art-drive.json
art-drive.json bevat {"helden/hu-yiping": "<drive-bestands-id>", ...}.
Elke afbeelding wordt art/<map>/<naam>.jpg, maximaal 1024 px hoog (bord: 2400 px breed).
"""
import io, json, os, sys, urllib.request
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX = {"bord": (2400, 2400), "goden": (1600, 1600), "plekken": (1400, 1400), "scherm": (1600, 1600)}

def main(lijst):
    items = json.load(open(lijst))
    for doel, fid in items.items():
        uit = os.path.join(ROOT, "art", doel + ".jpg")
        if os.path.exists(uit):
            continue
        url = f"https://drive.usercontent.google.com/download?id={fid}&export=download"
        data = urllib.request.urlopen(url, timeout=120).read()
        img = Image.open(io.BytesIO(data)).convert("RGB")
        img.thumbnail(MAX.get(doel.split("/")[0], (768, 1024)), Image.LANCZOS)
        os.makedirs(os.path.dirname(uit), exist_ok=True)
        img.save(uit, "JPEG", quality=82, optimize=True, progressive=True)
        print(f"{doel}: {img.size[0]}x{img.size[1]}, {os.path.getsize(uit) // 1024} KB")

main(sys.argv[1])
