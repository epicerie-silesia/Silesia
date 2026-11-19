#!/usr/bin/env python3
"""
Optimise des photos pour le site (format WebP, plusieurs tailles).

Utilisation :
    python scripts/optimiser_images.py <dossier_source> [nom1 nom2 ...]

Pour chaque image JPG, PNG ou HEIC (photos d'iPhone) du dossier source, crée dans assets/img/ :
    <nom>-640.webp   (mobiles, vignettes)
    <nom>-1280.webp  (tablettes, ordinateurs)
    <nom>-1920.webp  (uniquement si l'original est assez grand : images plein écran)

Les métadonnées des photos (dont la position GPS enregistrée par les téléphones)
ne sont pas recopiées : les images publiées ne révèlent rien de plus que ce qu'elles montrent.

Prérequis : Python 3 + Pillow  (pip install pillow)
            + pillow-heif pour les photos HEIC d'iPhone  (pip install pillow-heif)
"""
import sys
from pathlib import Path

from PIL import Image, ImageOps

try:  # lecture des photos HEIC d'iPhone, si pillow-heif est installé
    import pillow_heif
    pillow_heif.register_heif_opener()
    EXTENSIONS = {".jpg", ".jpeg", ".png", ".heic", ".heif"}
except ImportError:
    EXTENSIONS = {".jpg", ".jpeg", ".png"}

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / "assets" / "img"
WIDTHS = (640, 1280, 1920)
QUALITY = 78


def optimise(src: Path) -> None:
    im = ImageOps.exif_transpose(Image.open(src)).convert("RGB")
    for w in WIDTHS:
        if w > im.width and w != WIDTHS[0]:
            continue  # pas d'agrandissement inutile
        out = im if im.width <= w else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        dest = DEST / f"{src.stem}-{w}.webp"
        out.save(dest, "WEBP", quality=QUALITY, method=6)
        print(f"  {dest.relative_to(ROOT)}  {out.width}x{out.height}  {dest.stat().st_size // 1024} Ko")


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src_dir = Path(sys.argv[1])
    names = set(sys.argv[2:])
    DEST.mkdir(parents=True, exist_ok=True)
    for f in sorted(src_dir.iterdir()):
        if f.suffix.lower() in EXTENSIONS and (not names or f.stem in names):
            print(f.name)
            optimise(f)


if __name__ == "__main__":
    main()
