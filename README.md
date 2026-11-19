# Silesia – Épicerie polonaise à Morangis

Site vitrine statique : HTML, CSS et JavaScript, **sans outil de compilation ni dépendance**. Il est hébergé gratuitement sur GitHub Pages et sa galerie Instagram se synchronise automatiquement par l'API officielle de Meta.

👉 **Mise en ligne, Instagram, mises à jour : voir [GUIDE.md](GUIDE.md).**

## Structure

```
index.html              Présentation (accueil) : spécialités, galerie de la boutique (visionneuse),
                        boulanger Kwapisz, galerie Instagram entre les marqueurs INSTAGRAM:DEBUT/FIN
histoire.html           Histoire de l'épicerie + histoire de la Silésie
avis.html               Avis Google en direct (config : data-place-id / data-api-key)
contact.html            Coordonnées, horaires, carte (chargée au clic), photo de la boutique, réseaux sociaux
mentions-legales.html   Mentions légales, confidentialité, crédits photos
404.html                Page d'erreur (liens absolus)
robots.txt, sitemap.xml, site.webmanifest
assets/css/style.css    Toute la mise en forme (variables de couleurs en tête de fichier)
assets/js/main.js       Menu mobile, animations, carte au clic, horaires du jour, visionneuse photo
assets/js/avis.js       Avis Google : chargement au clic, lecture en direct (classe Place), affichage
assets/fonts/           Fraunces & Source Sans 3, hébergées localement (licence OFL)
assets/img/             Photos d'illustration WebP, logo officiel (logo-silesia-*), favicons, motifs SVG
assets/img/boutique/    Photos de la boutique et des produits (© Silesia), sans métadonnées GPS
assets/instagram/       Photos Instagram optimisées (générées automatiquement)
data/instagram.json     Cache des publications Instagram (généré automatiquement)
scripts/instagram_sync.py    Synchronisation Instagram (Python + Pillow)
scripts/optimiser_images.py  Conversion de photos en WebP multi-tailles
.github/workflows/      Publication + synchronisation (toutes les 6 h) + renouvellement du jeton
```

## Fonctionnement de l'intégration Instagram

1. `publier-site.yml` lance `scripts/instagram_sync.py` à chaque modification et toutes les 6 heures, si le secret `IG_ACCESS_TOKEN` existe.
2. Le script appelle `GET https://graph.instagram.com/me/media` (Instagram API with Instagram Login), télécharge les 9 dernières images (pour une vidéo, sa miniature ; pour un carrousel, sa 1ʳᵉ image), les convertit en WebP de 720 px et réécrit la galerie dans `index.html`.
3. Les changements sont enregistrés dans le dépôt par `github-actions[bot]`, puis le site est republié. Lors d'un passage programmé, rien n'est republié s'il n'y a rien de nouveau.
4. En cas d'erreur, aucun fichier n'est modifié : le site garde la dernière galerie connue et l'automate signale l'échec (e-mail de GitHub).
5. `renouveler-jeton-instagram.yml` prolonge le jeton de 60 jours chaque lundi. Si Instagram en renvoie un nouveau, il le stocke via `gh secret set` (nécessite le secret `GH_PAT`).

Les visiteurs ne chargent **aucune ressource de Meta, de Google ou d'un autre tiers**. La carte OpenStreetMap n'est chargée que sur clic. Le site n'a ni cookie ni traceur, donc pas de bandeau de consentement.

## Fonctionnement des avis Google

Les conditions de Google Maps Platform **interdisent de stocker les avis**. La page `avis.html` les lit donc en direct dans le navigateur du visiteur, via Maps JavaScript API et `Place.fetchFields(['rating', 'userRatingCount', 'reviews', 'googleMapsURI'])`, et seulement après son clic. Google renvoie au plus 5 avis, triés par pertinence. Chaque avis affiche son auteur (nom, photo, lien) et un lien vers Google Maps, comme l'exigent les règles d'attribution. Le contenu est inséré avec `textContent`, jamais en HTML. Sans `data-place-id` ni `data-api-key`, la page affiche des liens vers la fiche Google. Coût et plafond de sécurité : voir GUIDE.md, partie 5.

## Photos originales

`Photos_Local/`, `Photos_Produits/` et `Logo_Silesia/` contiennent les originaux (HEIC avec position GPS). Ils sont exclus du dépôt (`.gitignore`) et de la publication. Leurs versions optimisées sont dans `assets/img/`.

## Adresse du site

Les URL absolues (balise canonical, Open Graph, sitemap, robots.txt, 404) sont écrites avec l'adresse provisoire `https://SITE-URL`. Lors de la publication, le workflow la remplace par l'adresse réelle, fournie par `actions/configure-pages` : `github.io` ou domaine personnalisé.

## Aperçu local

```
python -m http.server 8000      # puis http://localhost:8000
```

## Tester la synchronisation sans Instagram

`IG_API_BASE` permet de pointer le script vers une fausse API locale (un fichier `me/media` contenant du JSON au format de l'API) :

```
set IG_API_BASE=http://127.0.0.1:8766/api
set IG_ACCESS_TOKEN=test
python scripts/instagram_sync.py
```
