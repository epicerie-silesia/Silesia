#!/usr/bin/env python3
"""
Synchronisation de la galerie Instagram de Silesia
==================================================

Méthode officielle et autorisée : « Instagram API with Instagram Login » (Meta).
Aucun scraping. Le script est exécuté automatiquement par GitHub Actions
(voir .github/workflows/publier-site.yml), toutes les 6 heures.

Ce qu'il fait :
  1. lit les dernières publications du compte via l'API (jeton IG_ACCESS_TOKEN) ;
  2. télécharge chaque image, la redimensionne et la convertit en WebP
     dans assets/instagram/  -> les visiteurs ne se connectent jamais à Instagram
     (meilleure confidentialité, pas de cookies, et pas d'images qui « expirent ») ;
  3. écrit data/instagram.json (cache des publications) ;
  4. réécrit la galerie dans index.html, entre les marqueurs
     <!-- INSTAGRAM:DEBUT --> et <!-- INSTAGRAM:FIN -->.

En cas d'erreur (jeton expiré, Instagram indisponible…), AUCUN fichier n'est modifié :
le site continue d'afficher les dernières photos connues, et le script se termine
avec un code d'erreur pour que GitHub vous prévienne par e-mail.

Variables d'environnement :
  IG_ACCESS_TOKEN   (obligatoire) jeton d'accès longue durée Instagram
  IG_MAX_POSTS      (facultatif)  nombre de publications affichées, 9 par défaut
  IG_API_BASE       (facultatif)  https://graph.instagram.com par défaut (tests)

Prérequis : Python 3.9+ et Pillow (pip install pillow).
"""
from __future__ import annotations

import html
import io
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "index.html"
DATA_FILE = ROOT / "data" / "instagram.json"
IMG_DIR = ROOT / "assets" / "instagram"
START, END = "<!-- INSTAGRAM:DEBUT -->", "<!-- INSTAGRAM:FIN -->"

PROFILE_URL = "https://www.instagram.com/silesia_epicerie_polonaise_/"
API_BASE = os.environ.get("IG_API_BASE", "https://graph.instagram.com").rstrip("/")
MAX_POSTS = int(os.environ.get("IG_MAX_POSTS", "9"))
IMG_WIDTH = 720
FIELDS = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}"
MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet",
        "août", "septembre", "octobre", "novembre", "décembre"]


class SyncError(Exception):
    pass


def http_get(url: str, timeout: int = 30) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "silesia-site-sync/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", "replace")
        try:  # message d'erreur lisible de l'API, sans jamais afficher le jeton
            msg = json.loads(body)["error"]["message"]
        except Exception:
            msg = body[:300]
        raise SyncError(f"HTTP {e.code} : {msg}") from None
    except urllib.error.URLError as e:
        raise SyncError(f"connexion impossible : {e.reason}") from None


def fetch_media(token: str) -> list[dict]:
    def call(fields: str) -> dict:
        params = urllib.parse.urlencode({"fields": fields, "limit": str(MAX_POSTS * 2), "access_token": token})
        return json.loads(http_get(f"{API_BASE}/me/media?{params}"))

    try:
        data = call(FIELDS)
    except SyncError as e:
        if "HTTP 400" not in str(e) or "token" in str(e).lower():
            raise
        # Repli : sans le détail des carrousels (la 1re image reste disponible via media_url)
        data = call(FIELDS.split(",children")[0])
    if "data" not in data:
        raise SyncError(f"réponse inattendue de l'API : {str(data)[:300]}")
    return data["data"]


def image_url(media: dict) -> str | None:
    """URL de l'image à afficher : photo, 1re photo d'un carrousel, ou miniature d'une vidéo."""
    kind = media.get("media_type")
    if kind == "IMAGE":
        return media.get("media_url")
    if kind == "VIDEO":
        return media.get("thumbnail_url")
    if kind == "CAROUSEL_ALBUM":
        for child in (media.get("children") or {}).get("data", []):
            url = child.get("media_url") if child.get("media_type") == "IMAGE" else child.get("thumbnail_url")
            if url:
                return url
        return media.get("media_url")
    return None


def clean_caption(caption: str) -> str:
    text = re.sub(r"[#@]\w[\w.]*", "", caption or "")      # retire hashtags et mentions
    text = re.sub(r"\s+", " ", text).strip(" .-–—|\n")
    return text


def alt_text(caption: str, date_fr: str) -> str:
    text = clean_caption(caption)
    if not text:
        return f"Publication Instagram de l'épicerie Silesia du {date_fr}"
    first = re.split(r"(?<=[.!?…])\s", text, maxsplit=1)[0]
    return first if len(first) <= 140 else first[:137].rsplit(" ", 1)[0] + "…"


def date_fr(iso: str) -> tuple[str, str]:
    dt = datetime.strptime(iso[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
    return dt.date().isoformat(), f"{dt.day} {MOIS[dt.month - 1]} {dt.year}"


def save_image(url: str, dest: Path) -> tuple[int, int]:
    im = ImageOps.exif_transpose(Image.open(io.BytesIO(http_get(url, timeout=60)))).convert("RGB")
    if im.width > IMG_WIDTH:
        im = im.resize((IMG_WIDTH, round(im.height * IMG_WIDTH / im.width)), Image.LANCZOS)
    tmp = dest.with_suffix(".tmp")
    im.save(tmp, "WEBP", quality=80, method=6)
    tmp.replace(dest)
    return im.width, im.height


def render(posts: list[dict]) -> str:
    """Code HTML de la galerie, inséré dans index.html."""
    if not posts:
        return (
            '        <div class="insta-cta" data-reveal>\n'
            '          <svg class="icon" aria-hidden="true"><use href="#i-instagram"/></svg>\n'
            '          <h3>Suivez-nous sur Instagram</h3>\n'
            "          <p>Arrivages, nouveautés et coups de cœur : retrouvez l'actualité de l'épicerie sur notre compte <strong>@silesia_epicerie_polonaise_</strong>.</p>\n"
            f'          <a class="btn btn--light" href="{PROFILE_URL}" target="_blank" rel="noopener">Voir nos publications</a>\n'
            "        </div>\n"
        )
    items = []
    for p in posts:
        e = html.escape
        items.append(
            "          <li>\n"
            f'            <a class="insta-item" href="{e(p["permalink"])}" target="_blank" rel="noopener">\n'
            f'              <img src="{e(p["image"])}" width="{p["width"]}" height="{p["height"]}" alt="{e(p["alt"])}" loading="lazy" decoding="async">\n'
            '              <span class="insta-item__overlay"><svg class="icon" aria-hidden="true"><use href="#i-instagram"/></svg>'
            f'<span>Voir sur Instagram</span><time datetime="{e(p["date"])}">{e(p["date_fr"])}</time></span>\n'
            "            </a>\n"
            "          </li>\n"
        )
    return (
        '        <ul class="insta-grid" role="list" data-reveal>\n'
        + "".join(items)
        + "        </ul>\n"
        '        <p class="insta-note">Galerie mise à jour automatiquement à partir de notre compte Instagram. '
        "Cliquez sur une photo pour voir la publication.</p>\n"
    )


def write_index(fragment: str) -> None:
    page = INDEX.read_text(encoding="utf-8")
    if START not in page or END not in page:
        raise SyncError("marqueurs INSTAGRAM introuvables dans index.html")
    before, rest = page.split(START, 1)
    _, after = rest.split(END, 1)
    INDEX.write_text(f"{before}{START}\n{fragment}{END}{after}", encoding="utf-8", newline="\n")


def main() -> int:
    token = os.environ.get("IG_ACCESS_TOKEN", "").strip()
    if not token:
        print("IG_ACCESS_TOKEN absent : synchronisation Instagram ignorée (le site garde son contenu actuel).")
        return 0

    try:
        media = fetch_media(token)
        IMG_DIR.mkdir(parents=True, exist_ok=True)
        posts = []
        for m in media:
            if len(posts) >= MAX_POSTS:
                break
            src = image_url(m)
            if not src or not m.get("permalink"):
                continue
            iso, fr = date_fr(m["timestamp"])
            dest = IMG_DIR / f"{re.sub(r'[^0-9A-Za-z_]', '', m['id'])}.webp"
            if dest.exists():  # déjà téléchargée lors d'une synchronisation précédente
                with Image.open(dest) as im:
                    w, h = im.size
            else:
                w, h = save_image(src, dest)
            posts.append({
                "id": m["id"], "permalink": m["permalink"], "date": iso, "date_fr": fr,
                "caption": (m.get("caption") or "")[:500], "alt": alt_text(m.get("caption", ""), fr),
                "media_type": m.get("media_type"), "image": f"assets/instagram/{dest.name}", "width": w, "height": h,
            })
    except SyncError as e:
        print(f"::error::Synchronisation Instagram impossible — {e}")
        print("Aucun fichier n'a été modifié : le site garde les dernières photos connues.")
        return 1

    # Nettoyage : suppression des images qui ne sont plus affichées
    keep = {Path(p["image"]).name for p in posts}
    for f in IMG_DIR.glob("*.webp"):
        if f.name not in keep:
            f.unlink()

    old = {}
    if DATA_FILE.exists():
        old = json.loads(DATA_FILE.read_text(encoding="utf-8"))
    if [p["id"] for p in old.get("posts", [])] == [p["id"] for p in posts] and old.get("posts") == posts:
        print(f"Aucune nouvelle publication ({len(posts)} affichées).")
        return 0

    DATA_FILE.parent.mkdir(parents=True, exist_ok=True)
    DATA_FILE.write_text(json.dumps({
        "source": PROFILE_URL,
        "updated_at": datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
        "posts": posts,
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    write_index(render(posts))
    print(f"Galerie mise à jour : {len(posts)} publication(s).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
