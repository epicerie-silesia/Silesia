# Guide : publier et mettre à jour le site de Silesia

Ce guide s'adresse à une personne qui n'est pas développeuse. Comptez environ **30 minutes** pour la mise en ligne (parties 1 à 3), puis environ 30 minutes pour chacune des options automatiques : galerie Instagram (partie 4) et avis Google (partie 5).

---

## Sommaire

1. [Le choix de l'hébergement gratuit](#1-le-choix-de-lhébergement-gratuit)
2. [Les informations du site](#2-les-informations-du-site)
3. [Mettre le site en ligne gratuitement (GitHub Pages)](#3-mettre-le-site-en-ligne-gratuitement-github-pages)
4. [Activer la galerie Instagram automatique](#4-activer-la-galerie-instagram-automatique)
5. [Activer les avis Google en direct](#5-activer-les-avis-google-en-direct)
6. [Entretien et résolution des problèmes](#6-entretien-et-résolution-des-problèmes)
7. [Mettre à jour le site](#7-mettre-à-jour-le-site)
8. [Nom de domaine personnalisé (facultatif, payant)](#8-nom-de-domaine-personnalisé-facultatif-payant)
9. [Être bien trouvé sur Google (référencement local)](#9-être-bien-trouvé-sur-google-référencement-local)

---

## 1. Le choix de l'hébergement gratuit

Le site est un **site statique** : de simples fichiers HTML, CSS et images, sans base de données ni serveur à louer. Il peut donc être hébergé gratuitement.

| Hébergeur | Offre gratuite | Usage commercial | Synchronisation Instagram automatique | Verdict |
|---|---|---|---|---|
| **GitHub Pages** + GitHub Actions | Oui, pour un dépôt public. Site jusqu'à 1 Go, environ 100 Go de trafic par mois (limite souple), HTTPS inclus | Toléré pour un site vitrine sans vente en ligne. Les conditions de GitHub excluent les sites dont l'objet principal est le commerce en ligne | **Oui**, gratuite et illimitée pour un dépôt public | ✅ **Retenu** |
| Netlify | Oui, avec des quotas mensuels. Si le quota est dépassé, le site est suspendu jusqu'au mois suivant | Accepté | Possible, mais plus complexe (il faut quand même GitHub) | Bonne alternative |
| Cloudflare Pages | Oui, trafic illimité, 500 publications par mois | Accepté | Possible en le reliant à GitHub | Bonne alternative |
| Vercel (offre « Hobby ») | Oui | **Non** : réservé à un usage personnel et non commercial | — | ❌ Inadapté pour un commerce |

> Les conditions des offres gratuites changent de temps en temps : vérifiez-les sur le site de chaque hébergeur.

**Pourquoi GitHub Pages ?** Tout se fait au même endroit et sans frais : l'hébergement, le HTTPS (le cadenas dans le navigateur), et l'automate (« GitHub Actions ») qui récupère les nouvelles photos Instagram toutes les 6 heures.

**Adresse du site :** gratuitement, ce sera une adresse du type `https://votre-compte.github.io/silesia/`. Un nom de domaine personnalisé, par exemple `silesia-morangis.fr`, est **facultatif et payant**, environ 7 à 15 € par an chez un bureau d'enregistrement (voir la partie 8).

---

## 2. Les informations du site

Le site ne contient **aucune information inventée**. État des informations pratiques :

| Information | Valeur sur le site | Statut |
|---|---|---|
| Adresse | 67 avenue Gabriel Péri, 91420 Morangis | ✅ Confirmée |
| Téléphone | 01 60 92 12 94 | ✅ Confirmé par l'épicerie |
| Horaires | Mardi à samedi, 10 h – 19 h 30 ; fermé le dimanche et le lundi | ✅ Confirmés par l'épicerie |
| E-mail | silesia91380@gmail.com | ✅ Confirmé par l'épicerie |
| Facebook | https://www.facebook.com/p/Silesia-61571059755196/ | ✅ Confirmé par l'épicerie |
| Directrice de la publication | Izabela Kalus-Laz, présidente | ✅ Confirmé par l'épicerie |
| Année de création | 2024 | ✅ D'après le logo officiel (« EST. 2024 ») |

> ⚠️ Le site de la mairie de Morangis indique encore l'ancien numéro, **09 54 30 74 74**. Demandez-lui de le corriger (voir la partie 9).

### Comment modifier ces informations

Les informations se trouvent dans plusieurs pages (en-tête, pied de page, page Contact). Pour ne rien oublier, des **repères** ont été placés dans le code :

- **Téléphone** : cherchez `01 60 92 12 94` **et** `+33160921294` dans tous les fichiers `.html`. Remplacez **les deux formats** partout. Le format `+33…` sert au bouton « Appeler ».
- **Horaires** : cherchez le repère `HORAIRES` dans les fichiers HTML. Pensez aussi au bloc `"openingHoursSpecification"` en haut de `index.html` et de `contact.html` : c'est ce que lit Google.
- **E-mail et Facebook** : cherchez les repères `E-MAIL` et `FACEBOOK`, ainsi que les lignes `"email"` et `"sameAs"` en haut de `index.html` et de `contact.html`.
- **Votre histoire** (facultatif) : dans `histoire.html`, cherchez `À COMPLÉTER`. Un paragraphe y est prévu pour raconter, avec vos mots, l'histoire de l'épicerie.
- **Produits** : les neuf familles de produits de la page d'accueil utilisent vos photos de rayon. Trois photos d'illustration restent à remplacer si vous avez les vôtres : pierogi, żurek et pierniki (voir la partie 7).
- **Kwapisz** : la présentation du boulanger de Bytom se trouve dans `index.html`, au repère `KWAPISZ`. Elle s'appuie sur des annuaires professionnels polonais : fondation en 1937 par Tadeusz Kwapisz, entreprise familiale menée par la 3ᵉ génération. N'hésitez pas à la compléter avec ce que la famille Kwapisz vous a raconté.

> 💡 Un éditeur de texte gratuit comme **Visual Studio Code** ou **Notepad++** permet de rechercher et remplacer un texte dans tous les fichiers en une seule fois.

---

## 3. Mettre le site en ligne gratuitement (GitHub Pages)

### Étape 1 — Créer un compte GitHub
1. Allez sur <https://github.com/signup> et créez un compte gratuit.
2. Le nom du compte apparaîtra dans l'adresse du site (`nomducompte.github.io`) : choisissez-le en conséquence, par exemple `silesia-morangis`.

### Étape 2 — Créer le dépôt (le « dossier » du site)
1. En haut à droite, cliquez sur **+** puis **New repository**.
2. **Repository name** : `silesia`. Si vous voulez l'adresse la plus courte, `https://nomducompte.github.io/`, nommez plutôt le dépôt exactement `nomducompte.github.io`.
3. Cochez **Public** (obligatoire pour l'offre gratuite).
4. Cliquez sur **Create repository**.

### Étape 3 — Activer GitHub Pages
1. Dans le dépôt : **Settings** → **Pages** (menu de gauche).
2. Dans **Build and deployment** → **Source**, choisissez **GitHub Actions**.

### Étape 4 — Envoyer les fichiers du site

**Méthode recommandée : GitHub Desktop**, qui simplifie aussi les mises à jour.
1. Installez **GitHub Desktop** (<https://desktop.github.com>) et connectez-vous.
2. **File** → **Clone repository** → choisissez `silesia` → **Clone**. Un dossier vide est créé sur votre ordinateur.
3. Copiez **tout le contenu** du dossier `Site_Silesia` dans ce nouveau dossier, y compris le dossier `.github`, qui contient les automatismes.
4. Dans GitHub Desktop, écrivez un résumé (par exemple « Première version du site »), cliquez sur **Commit to main**, puis sur **Push origin**.

> Les dossiers de photos originales `Photos_Local`, `Photos_Produits` et `Logo_Silesia` ne sont **pas envoyés** (fichier `.gitignore`) : ils sont lourds, et les photos d'iPhone contiennent la position GPS de la prise de vue. Le site utilise leurs versions optimisées, rangées dans `assets/img/`. Gardez les originaux sur votre ordinateur.

*Autre méthode, sans logiciel :* sur la page du dépôt, cliquez sur **uploading an existing file** et glissez-déposez le contenu du dossier `Site_Silesia`, **sauf** les trois dossiers de photos originales. Vérifiez que le dossier `.github` a bien été envoyé.

### Étape 5 — Vérifier la publication
1. Ouvrez l'onglet **Actions** du dépôt : l'automate **« Publier le site »** tourne pendant environ une minute.
2. Quand il est vert ✅, cliquez dessus : l'adresse du site s'affiche sous l'étape « publier ».
3. Si l'étape 3 a été oubliée et que l'automate est rouge ❌, activez Pages, puis cliquez sur **Re-run all jobs**.

🎉 **Le site est en ligne**, en HTTPS, gratuitement.

> Tant que les parties 4 et 5 ne sont pas faites, le site fonctionne déjà. La section Instagram invite à suivre le compte, et la page Avis propose des liens vers votre fiche Google. Le site n'affiche jamais de faux contenu.

---

## 4. Activer la galerie Instagram automatique

### Comment ça marche, et pourquoi cette méthode

- Le site utilise l'**API officielle de Meta**, « Instagram API with Instagram Login ». Il n'y a **aucun scraping** et aucune méthode interdite.
- Toutes les 6 heures, l'automate GitHub demande à Instagram les dernières publications, télécharge les photos, les optimise et met à jour la galerie de l'accueil. **Vous n'avez rien à faire** quand vous publiez sur Instagram.
- Les photos sont ensuite servies **depuis le site lui-même** : les visiteurs ne sont pas pistés par Meta, et aucun bandeau de cookies n'est nécessaire.
- Chaque photo renvoie vers sa publication d'origine sur Instagram.
- **Coût : 0 €.** Aucun abonnement ni service tiers.

> ℹ️ L'ancienne « Instagram Basic Display API », citée dans beaucoup de tutoriels, a été **arrêtée par Meta en décembre 2024**. Ne suivez pas ces anciens tutoriels.

### Ce qu'il faut savoir avant de commencer
- Le compte Instagram doit être un **compte professionnel** (« Entreprise » ou « Créateur »). C'est gratuit : dans l'application Instagram, **Paramètres** → **Type de compte et outils** → **Passer à un compte professionnel**.
- Il faut un compte Facebook pour accéder à l'espace développeurs de Meta. Ce compte n'apparaît pas sur le site.
- Les écrans de Meta changent souvent : les intitulés ci-dessous peuvent légèrement différer.

### Étape 1 — Créer une application Meta (gratuite)
1. Allez sur <https://developers.facebook.com> → **Mes apps** → **Créer une app**.
2. Choisissez le cas d'usage lié à **Instagram** (par exemple « Gérer les messages et le contenu sur Instagram »). Si on vous demande un type d'app, choisissez **Entreprise**.
3. Donnez-lui un nom, par exemple `Site Silesia`, et validez.

### Étape 2 — Relier le compte Instagram et générer le jeton
1. Dans l'app, ouvrez le produit **Instagram**, rubrique **Configuration de l'API avec connexion Instagram** (*API setup with Instagram login*).
2. Dans **Générer des jetons d'accès**, cliquez sur **Ajouter un compte** et connectez-vous avec le compte **silesia_epicerie_polonaise_**.
   - Si Meta le demande, ajoutez d'abord ce compte comme **testeur Instagram** (**Rôles de l'app** → **Rôles**). Acceptez ensuite l'invitation dans l'application Instagram : **Paramètres** → **Apps et sites web** → **Invitations de testeur**.
3. Cliquez sur **Générer le jeton** et **copiez-le**. C'est une longue suite de caractères qui commence en général par `IG…`.
   ⚠️ **Ce jeton est confidentiel** : ne le publiez jamais, ne l'envoyez pas par e-mail, ne le collez dans aucun fichier du site.
4. L'app peut rester en mode **Développement** : lire les publications de votre propre compte ne nécessite normalement pas de validation par Meta.

### Étape 3 — Confier le jeton à GitHub (en toute sécurité)
1. Dans votre dépôt GitHub : **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
2. **Name** : `IG_ACCESS_TOKEN`. **Secret** : collez le jeton. Cliquez sur **Add secret**.
   Les secrets GitHub sont chiffrés et invisibles, même dans un dépôt public.

### Étape 4 — Lancer une première synchronisation
1. Onglet **Actions** → **Publier le site** (à gauche) → **Run workflow** → **Run workflow**.
2. Au bout d'une à deux minutes, la galerie de la page d'accueil affiche les 9 dernières publications.
3. Si l'automate est rouge, ouvrez-le : l'étape « Synchroniser Instagram » explique le problème en français (voir aussi la partie 6).

### Étape 5 — Le renouvellement automatique du jeton
Un jeton Instagram est valable **60 jours**. Il peut être prolongé tant qu'il est encore valide. L'automate **« Renouveler le jeton Instagram »** le fait chaque lundi.

### Étape 6 — (Recommandé) Autoriser GitHub à enregistrer le jeton renouvelé
Instagram peut renvoyer un **nouveau** jeton lors d'un renouvellement. Pour que l'automate puisse l'enregistrer lui-même :
1. Sur GitHub : votre photo de profil → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**.
2. Nom : `Silesia - jeton Instagram`. Expiration : **1 an**. Accès : **Only select repositories** → `silesia`.
3. **Permissions** → **Repository permissions** → **Secrets** : **Read and write**. C'est la seule permission nécessaire.
4. Générez le jeton, copiez-le, puis créez un secret de dépôt nommé **`GH_PAT`** (comme à l'étape 3).
5. Notez dans votre agenda de le renouveler dans un an. GitHub vous préviendra aussi par e-mail.

### Si vous ne pouvez pas utiliser l'API de Meta
Par exemple, si Meta exige une vérification que vous ne souhaitez pas faire, deux solutions restent possibles :
- **Rester ainsi** : la section Instagram invite les visiteurs à suivre le compte, avec un lien direct. Rien n'est cassé.
- **Un widget tiers** utilisant l'API officielle, comme Behold ou LightWidget. Leurs offres gratuites sont limitées, et ils chargent un script externe qui peut nécessiter un bandeau de consentement. C'est pour cela qu'ils n'ont pas été retenus par défaut.

---

## 5. Activer les avis Google en direct

### Comment ça marche
- La page **Avis** (`avis.html`) affiche la **note moyenne**, le **nombre d'avis** et les **avis** de votre fiche Google, par l'API officielle de Google.
- **Les conditions de Google interdisent de recopier les avis sur un site.** La page les lit donc **en direct** chez Google à chaque affichage : ils sont toujours à jour, sans aucune intervention de votre part.
- Google ne transmet que les **5 avis les plus pertinents** (son propre tri). Un bouton « Voir tous les avis » renvoie vers votre fiche Google Maps, et un bouton « Laisser un avis » ouvre directement le formulaire de Google.
- Pour respecter la vie privée des visiteurs, **rien n'est chargé depuis Google avant leur clic** sur « Afficher les avis Google ». Ils peuvent demander à mémoriser ce choix.
- **Tant que ce n'est pas configuré**, la page affiche simplement des liens vers votre fiche Google. Elle est donc utilisable dès la mise en ligne.

### ⚠️ À savoir sur le coût (en clair)
- Google exige un **compte de facturation avec une carte bancaire**, même si l'usage reste gratuit.
- Chaque affichage des avis compte pour une requête de type « Place Details Enterprise + Atmosphere ». Google en offre **1 000 gratuites par mois**, puis facture **25 $ les 1 000**. Ce sont les tarifs publiés en 2026 : vérifiez-les sur <https://developers.google.com/maps/billing-and-pricing/pricing>.
- **Pour être certain de ne jamais payer**, plafonnez l'usage à **30 requêtes par jour** (étape 5 ci-dessous), soit environ 900 par mois, sous le seuil gratuit. Si le plafond est atteint, la page affiche simplement un lien vers vos avis sur Google Maps : rien ne casse.

### Étape 1 — Créer un projet Google Cloud
1. Allez sur <https://console.cloud.google.com> avec le compte Google de l'épicerie.
2. Créez un projet nommé par exemple `Site Silesia`.
3. **Facturation** : associez un compte de facturation (carte bancaire).

### Étape 2 — Activer les deux API nécessaires
**API et services** → **Bibliothèque** : activez **Maps JavaScript API** et **Places API (New)**.

### Étape 3 — Créer une clé d'API protégée
1. **API et services** → **Identifiants** → **Créer des identifiants** → **Clé API**.
2. Modifiez la clé :
   - **Restrictions relatives aux applications** → **Sites web** → ajoutez l'adresse de votre site suivie de `/*`, par exemple `https://votre-compte.github.io/*`, et votre nom de domaine s'il existe ;
   - **Restrictions relatives aux API** → cochez **Maps JavaScript API** et **Places API (New)**.
3. Copiez la clé. Elle sera visible dans le code de la page, comme sur tous les sites qui utilisent Google Maps : c'est normal, les restrictions ci-dessus empêchent quiconque de l'utiliser ailleurs.

### Étape 4 — Trouver l'identifiant Google de l'épicerie (« Place ID »)
1. Ouvrez l'outil officiel <https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder>.
2. Tapez « Silesia Morangis » et choisissez l'épicerie dans la liste.
3. Copiez le **Place ID** affiché. Il commence souvent par `ChIJ`.

### Étape 5 — Plafonner l'usage (pour rester à 0 €)
1. **API et services** → **Places API (New)** → onglet **Quotas et limites système**.
2. Repérez la limite **par jour** des requêtes de détails de lieu (*Place Details*), cliquez sur le crayon ✏️ et indiquez **30**.
3. Par sécurité, ajoutez aussi une alerte : **Facturation** → **Budgets et alertes** → budget de **1 €**, alerte par e-mail.

### Étape 6 — Renseigner la page Avis
1. Ouvrez `avis.html` et cherchez `CONFIGURATION DES AVIS GOOGLE`.
2. Remplissez les deux valeurs : `data-place-id="ChIJ…"` et `data-api-key="AIza…"`.
3. Publiez la modification (partie 7), puis ouvrez la page **Avis** du site et cliquez sur **Afficher les avis Google**.

> Si les avis ne s'affichent pas, ouvrez la page puis la console du navigateur (touche F12) : le message commençant par `[Silesia] Avis Google` indique la cause, le plus souvent une restriction de clé qui ne correspond pas à l'adresse du site.

**Pour aller plus loin :** l'API Google Business Profile, réservée aux propriétaires de fiches, peut fournir **tous** les avis gratuitement et sans carte bancaire. Elle demande cependant une demande d'accès auprès de Google et une mise en place plus technique : c'est une évolution possible.

---

## 6. Entretien et résolution des problèmes

GitHub vous **envoie un e-mail** dès qu'un automate échoue. Dans tous les cas, **le site reste en ligne** et garde les dernières photos connues.

| Symptôme | Cause probable | Solution |
|---|---|---|
| E-mail « Publier le site : failed », étape « Signaler un problème Instagram » | Jeton Instagram expiré ou révoqué (mot de passe Instagram changé, par exemple) | Refaites la partie 4, étape 2, puis remplacez le secret `IG_ACCESS_TOKEN` : **Settings** → **Secrets** → crayon ✏️ |
| E-mail « Renouveler le jeton Instagram : failed » + mention de `GH_PAT` | Le secret `GH_PAT` est absent ou expiré | Refaites la partie 4, étape 6 |
| Plus aucune mise à jour automatique depuis longtemps | Sur un dépôt public, GitHub met en pause les automates programmés après **60 jours sans activité** sur le dépôt. Il vous prévient par e-mail | Onglet **Actions** → choisissez l'automate → **Enable workflow**. Toute modification du site relance aussi l'activité |
| Une publication Instagram n'apparaît pas | La synchronisation a lieu toutes les 6 heures | Attendez, ou lancez **Run workflow** (partie 4, étape 4) |
| Page Avis : « Les avis n'ont pas pu être chargés » | Plafond quotidien atteint, clé mal restreinte ou facturation désactivée | Voir la partie 5, et la console du navigateur (F12) |

---

## 7. Mettre à jour le site

Chaque modification envoyée sur GitHub est **publiée automatiquement en une minute environ**.

### Modifier un texte directement sur GitHub (le plus simple)
1. Ouvrez le fichier dans le dépôt, par exemple `contact.html`.
2. Cliquez sur le crayon ✏️ (**Edit this file**), modifiez le texte et faites attention à ne pas effacer les balises `< >`.
3. **Commit changes…** → **Commit changes**. C'est en ligne une minute plus tard.

### Avec GitHub Desktop
Modifiez les fichiers sur votre ordinateur, puis dans GitHub Desktop : résumé → **Commit to main** → **Push origin**.

### Remplacer ou ajouter une photo
- Les photos du site se trouvent dans `assets/img/`, et vos photos de la boutique et des produits dans `assets/img/boutique/`. Elles sont au format WebP, en plusieurs tailles, pour un chargement rapide.
- Pour préparer de nouvelles photos automatiquement, y compris des photos d'iPhone au format **HEIC** :
  ```
  pip install pillow pillow-heif
  python scripts/optimiser_images.py "C:\chemin\vers\mes-photos"
  ```
  Le script crée `nom-640.webp`, `nom-1280.webp` (et `nom-1920.webp` si la photo est grande) dans `assets/img/`. Il **supprime les métadonnées**, dont la position GPS.
- Sans Python : convertissez la photo en WebP (par exemple avec <https://squoosh.app>, gratuit, qui fonctionne dans le navigateur), largeur 1280 px, moins de 300 Ko.
- Pensez à mettre à jour le texte `alt="…"` : la description de la photo, utile pour l'accessibilité et pour Google.
- Si vous remplacez une photo d'illustration (pierogi, żurek, pierniki, ou celles de la page Histoire), retirez sa ligne des crédits dans `mentions-legales.html`.

### Voir le site sur son ordinateur avant de publier
Dans le dossier du site, ouvrez un terminal et tapez :
```
python -m http.server 8000
```
Ouvrez ensuite <http://localhost:8000> dans le navigateur.

---

## 8. Nom de domaine personnalisé (facultatif, payant)

1. Achetez un nom, par exemple `silesia-morangis.fr`, chez un bureau d'enregistrement : OVHcloud, Gandi, IONOS… Comptez **environ 7 à 15 € par an**.
2. Dans GitHub : **Settings** → **Pages** → **Custom domain** → saisissez le nom → **Save**.
3. Chez le bureau d'enregistrement, dans la zone DNS du domaine :
   - quatre enregistrements **A** pour le domaine principal (`@`) : `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` ;
   - un enregistrement **CNAME** pour `www` → `nomducompte.github.io`.
4. Après quelques heures, cochez **Enforce HTTPS** dans GitHub.
5. Si les avis Google sont activés, ajoutez le nouveau domaine aux restrictions de la clé d'API (partie 5, étape 3).

Les liens internes, le plan du site et les données pour Google s'adaptent **automatiquement** à la nouvelle adresse lors de la publication suivante.

---

## 9. Être bien trouvé sur Google (référencement local)

Le site est déjà optimisé : titres et descriptions de chaque page, données structurées « épicerie », plan du site, pages rapides et adaptées au mobile, villes voisines mentionnées. Ce qui compte **le plus** pour une recherche comme « épicerie polonaise Essonne », c'est la cohérence des informations sur le web :

1. **Fiche Google (Google Business Profile)**, gratuite : vérifiez l'adresse, le numéro de téléphone (01 60 92 12 94) et les horaires. Ajoutez le lien du site, des photos, et répondez aux avis. La page Avis du site invite aussi vos clients à en laisser.
2. **Google Search Console** (<https://search.google.com/search-console>), gratuit : ajoutez le site, puis soumettez le plan du site `https://votre-adresse/sitemap.xml`.
3. Faites de même sur **Bing Places** et **Apple Business Connect** (Plans d'Apple).
4. Demandez à la **mairie de Morangis** de remplacer, dans sa liste des commerces, l'ancien numéro (09 54 30 74 74) par le 01 60 92 12 94, et d'ajouter le lien du site.
5. Mettez le lien du site dans la **bio Instagram** et sur la **page Facebook**.

Les mêmes nom, adresse et téléphone partout : c'est le premier critère du référencement local.
