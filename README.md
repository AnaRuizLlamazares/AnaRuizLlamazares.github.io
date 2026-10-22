# Ana Ruiz — site (anaruizllamazares.github.io)

Ce fichier **README.md est la source de vérité** pour les choix fonctionnels/UX demandés (instructions "client").

Si une nouvelle instruction contredit ce README, on met à jour ce README (après clarification si nécessaire) puis on modifie le code en conséquence.

---

## Source de vérité — instructions à respecter

### 1) Navigation
- Le menu doit être présent sur toutes les pages.
- "Ana Ruiz" (à gauche dans la navbar) ne doit **pas** être cliquable.
- Le libellé **"Galeries" devient "Oeuvres"**.
- Le libellé **"À propos" devient "Bio"**.
- Le bouton **Clair/Sombre** doit être accessible **sur toutes les pages** (et pas "perdu" dans un sous-menu).
- **Barre de navigation de référence** (18/10/2026) : le bloc `<nav class="navbar">` est strictement identique sur toutes les pages d’une même langue ; il est généré par `outils/navbar-sync.py` (un seul modèle + libellés par langue). Après tout ajout de page ou changement de menu : `python3 outils/navbar-sync.py`, et `python3 outils/navbar-sync.py --check` pour vérifier. **Aucune règle CSS de navbar dans les pages** : tout le style du menu (bureau, hamburger, tactile) est dans `css/theme.css` et `css/style-modern.css`, pour que le rendu soit le même sur toutes les pages à largeur d’écran égale (les différences ordinateur / téléphone sont, elles, voulues).
- **Sous-menu « Œuvres »** (18/10/2026) : le lien Œuvres de la navbar déroule la liste des 8 galeries (survol ou clavier sur ordinateur ; flèche-accordéon dans le menu hamburger et sur tactile). Il est construit par `js/galeries-menu.js`, **seule source de la liste** : rien à toucher dans les pages HTML pour ajouter une galerie.

### 2) Page "Oeuvres" (galeries.html)
- Les œuvres sont listées **par exposition** (et le site reste organisé par pages d’expo/galerie).
- Depuis le 18/10/2026, la page est une **grille de cartes** : une carte par exposition ayant une galerie (image de couverture prise dans `img/mosaique/`, badge année, titre, lieu, une ligne d’accroche, « Voir la galerie → »), précédée d’une phrase d’instruction (« Chaque image ouvre la galerie… »). Les expositions **sans** galerie et les **installations** sont en liste simple sous le titre « Autres expositions ».
- Les 5 versions (`galeries.html`, `en/`, `es/`, `de/`, `zh/`) ont la même structure ; les lieux sont traduits, les titres d’expositions restent en français.
- Ancienne règle (mars 2026, remplacée) : liste texte, item cliquable seulement s’il a une galerie, Peau d’âne en premier.

### 3) Expositions récentes (mise à jour du 17/10/2026)
- **161ᵉ Salon de la Société versaillaise des artistes d’Île-de-France (2026)**, Carré à la Farine, Versailles, du 2 au 15 novembre 2026 : page `salon-versailles-2026.html`, œuvres Hypoderme, Épiderme, Deuxième peau, Peau d’âne (`img/SalonVersailles2026/`). Annoncée en « Exposition à venir » sur l’accueil et la page Œuvres ; à passer en « Exposition récente » après le 15 novembre.
- **Icône ou le pouvoir de soi (2024)**, exposition collective Géographie(s) du Sacré, crypte d’Orsay, septembre 2024 : page `icone-ou-le-pouvoir-de-soi.html`, les cinq visages (`img/Icone/visage-1..5-ana-ruiz.webp`), titres donnés par Ana.
- **Peau d’âne (2024)**, galerie-restaurant Le Canapé, Gif-sur-Yvette, mai – juillet 2024 : page `peau-dane.html`, les vêtements Nekem, Ben, Remine (`img/PeauDAne/`) ; Mina et Aniga à ajouter quand Ana enverra les photos.
- **Angles de vie (2005)**, château de Belleville : page `angles-de-vie-2005.html`, six tableaux (`img/AnglesDeVie/`) : I à IV (titres provisoires) et, depuis le 22/10/2026, « Air, eau, ciel » et « El Cid à Mogador » (titres donnés par Ana ; tirages rephotographiés puis recadrés).
- **Contre-verse autour des limites (2004)** : page `contre-verse-autour-des-limites-2004.html` (5 langues) créée le 22/10/2026 avec ce qui est connu : le titre, l’année et trois toiles (`img/ContreVerse2004/` : Una noche sin luna, El misere, Le petit Quijote). **Lieu, dates et texte de présentation à compléter** dès la réponse d’Ana (volet `intro-panel` à ajouter avec `outils/intro-panel.py`, ligne de lieu sur la carte Œuvres, ExhibitionEvent du JSON-LD). Pas d’œuvre choisie sur l’accueil (Ana a validé 8 œuvres sur 2 lignes).
- **Publications** (22/10/2026) : le livre **François Beautier, *Commune de Gif, un héritage à partager*, Mairie de Gif-sur-Yvette, 2010** (références : archives de ville-gif.fr ; Gif Infos n° 365, février 2011), p. 125 : tableau d’Ana acquis par la ville (titre inconnu, à demander), légende et texte transcrits (pas de capture de la page) ; couverture du *Carnet de saison 2004/2005* de Gif. Script d’intégration : `outils/ajout-oeuvres-2026-10-22.py`. Photo de 1994 (Ana au château du Montcel ?) reçue mais non publiée en attendant Ana.
- **Fête des artistes en cartes postales (2009)** : Tolède retiré du site, Angles de vie déplacé dans sa propre galerie.
- Les fichiers retirés sont rangés dans `img/Historique/retires-2026-10/` (rien n’est supprimé).

#### Historique : exposition "Peau d’âne" (version de mars 2026)
- Ajout de l’exposition **Peau d’âne**, **Gif-sur-Yvette**, galerie-restaurant **Le Canapé**.
- Sur la page de l’expo, le contenu ne doit pas être masqué par la barre du menu : on utilise l’offset de navbar (`--site-nav-offset`) pour gérer l’espace en haut.
- La galerie **Peau d’âne** est organisée en **2 parties uniquement** :
  1. **Visages**
  2. **Vêtements**
- L’ordre des œuvres dans chaque partie suit l’**ordre de numérotation** des fichiers.
- L’image **"Je me suis assis au milieu de la Terre"** ne figure plus dans la galerie **Peau d’âne**.

### 4) Thème Clair / Sombre
- Ajouter un thème **Clair** et un thème **Sombre**.
- Le thème **par défaut** est **Clair**.
- Le clair est une couleur **crème très clair** (pas blanc pur).
- En clair, le texte doit être **plus sombre** pour être lisible.
- En clair, éviter les "cartouches"/"box" blanches derrière les textes : **fond crème continu** (pas de démarcation visible entre un bloc texte et le fond).
- Corriger le cas où un **bandeau noir** apparaissait en bas en mode clair : le fond doit rester crème.
- L’icône du bouton doit refléter le thème : **Soleil** en clair, **Lune** en sombre.
- Quand on ouvre une œuvre en plein écran (lightbox), le fond est **noir dans les deux thèmes**, avec une marge d’au moins **2 cm en haut et en bas** (identique), image centrée (demande d’Ana du 17/10/2026 ; remplace l’ancienne règle « blanc en mode clair »).
- Le zoom et le diaporama passent en **vrai plein écran** du navigateur (sans barre d’adresse) avec une croix pour en sortir ; un seul script de zoom pour tout le site : `js/gallery-lightbox.js`.
- Les scripts et styles sont chargés avec un numéro de version (`?v=AAAAMMJJx`) : l’augmenter à chaque modification de `js/` ou `css/` pour contourner le cache des navigateurs.
- En mode clair, le footer (© 2026… | Mentions légales) doit être **suffisamment foncé** pour rester lisible.
- Accueil (18/10/2026) : plus d’image de fond fixe (`img/accueil.jpg` ne sert plus qu’aux aperçus `og:image`) ; la **mosaïque floue** d’œuvres sert de fond comme sur les autres pages. Le bloc d’entrée est un **« hero » en deux colonnes** : à gauche le titre et le paragraphe **validés par Ana (ne pas modifier)** plus deux boutons (Voir les œuvres / Exposition à venir), à droite une **œuvre en vedette** qui change toutes les 8 s (`js/home-hero.js`, tableau `WORKS`), avec légende et lien vers sa galerie. Sur mobile, l’œuvre passe sous le texte.
- Mosaïque de fond (`js/mosaic-bg.js`, toutes les pages) : **fixe et identique partout** — aucune animation, disposition à graine fixe (même ordre de tuiles sur toutes les pages et à chaque visite). Sa hauteur est celle du **plus grand viewport** (`100lvh`) et la grille se calcule sur l’élément lui-même : la barre d’adresse du téléphone ne la redimensionne ni ne la reconstruit (plus de clignotement). Pas de flou sur petit écran/tactile (coûteux et invisible à cette opacité). Elle apparaît en **un seul fondu** une fois ses tuiles chargées (classe `is-ready`).
- Effets discrets (`js/home-hero.js` pour l’accueil, `js/navbar-load.js` et fin de `css/theme.css` pour tout le site) : la toile en vedette s’incline et reflète la lumière en suivant la souris (jamais sur tactile), un fin trait de progression montre le rythme de rotation ; sur toutes les pages, les cartes et panneaux apparaissent en montant au défilement (classe `.reveal`, posée puis retirée par le script) et les cartes d’œuvres/articles s’élèvent légèrement au survol (souris uniquement). Tous respectent `prefers-reduced-motion` et les pages restent complètes sans JavaScript.
- Barre de navigation (`css/theme.css`) : drapeaux dessinés en CSS, centrés en absolu dans leur cercle ; tailles pilotées par les variables `--nav-icon-size`, `--flag-w`, `--flag-h` (ne pas redéfinir de `width/height` ailleurs). Icônes soleil/lune et ☰ en **SVG/CSS** (`js/navbar-load.js`), indépendantes de la police du système ; les caractères du HTML ne servent que de secours sans JavaScript/CSS.
- Menu hamburger (téléphone, ou navbar compactée) : le panneau est opaque, limité à la hauteur de l’écran et **défilable** (il est attaché à la barre fixe, donc ne défile pas avec la page) ; lignes de 44 px ; la page ne défile pas derrière le menu ouvert. Dans ce mode, toucher **« Œuvres »** ouvre/ferme le sous-menu sans naviguer ; la page Œuvres s’atteint par « Toutes les œuvres ». À la souris sur ordinateur, « Œuvres » reste un lien et le survol ouvre la liste. Attention : la règle de base `.nav-links` est en `!important`, les règles du mode hamburger doivent l’être aussi.
- Volets de présentation (18/10/2026) : sur les pages d’exposition à long texte (Peau d’âne, Icône, Angles de vie, Salon de Versailles, La maison), la présentation est repliée dans un `<details class="intro-panel">` (CSS dans `theme.css`, bouton « Replier » géré par `navbar-load.js`) — fermé par défaut pour laisser voir les œuvres, HTML natif donc lisible sans JavaScript et indexé par les moteurs. Script de création (idempotent) : `outils/intro-panel.py`.
- Texte : les paragraphes de présentation (expositions, Œuvres, articles, Bio, Contact, mentions légales) sont **justifiés avec césure automatique** (`hyphens: auto`, langue prise sur l’attribut `lang` de `<html>`) ; titres, sous-titres courts, légendes et boutons restent centrés. Les conteneurs de page font `width: 100%` borné par leur `max-width` (sinon `<main>`, colonne flex, les réduisait à la largeur de leur contenu : largeur variable d’une page à l’autre).
- Une phrase indique que les œuvres sont **disponibles à l’acquisition** (accueil, sous les liens du panneau « peintre à Gif-sur-Yvette » ; Contact, après la phrase d’introduction).

### 5) Diaporama (diaporama.html + js/diapo.js)
- Le diaporama tourne avec un rythme de **5 secondes** par image ; bouton **pause / reprise** (⏸ / ▶) et bouton **plein écran** (⛶) avec croix pour en sortir. Le plein écran est **natif** quand le navigateur le permet (ordinateur, Android) et, sinon, un **plein écran CSS** de repli (diaporama en position fixe sur toute la fenêtre, navbar masquée, page bloquée) — c’est le cas de Safari sur iPhone, qui n’autorise le plein écran natif que pour les vidéos ; avant le 18/10/2026 le bouton y était masqué. Le bouton est donc toujours visible. Habillage commun sur `.is-fullscreen`, mode de repli sur `.is-pseudo-fs` (CSS inline de `diaporama.html`, identique dans les 5 langues).
- Par défaut, choisir **4 images maximum par galerie**.
- Exception : pour **Peau d’âne**, le diaporama doit afficher les nouvelles œuvres publiées, en **2 séquences** :
  1. **Visages** (`Vis1` à `Vis5`)
  2. **Vêtements** (`Vet1` à `Vet6`)
- Avant chaque série d’images d’une galerie, afficher une "carte" avec le **nom de la galerie**.
- Sous chaque image, afficher le **titre de l’œuvre**.
- Ajouter la possibilité de **jouer / ne pas jouer** la musique du diaporama (fichier audio `audio/diapo.mp3` et/ou `audio/diapo.mp4`) via un bouton (🎵 / ⏸️).

### 6) Responsive / mobile
- Le site doit être **lisible et utilisable sur mobile** : menu (hamburger), drapeaux de langue, bouton de thème, galeries, diaporama, formulaire de contact.
- Les ajustements responsive se font **sans casser** la version desktop.


### 7) Langues (FR / EN / ES / DE / 中文)
- Le site doit exister en **5 langues**, dans cet ordre dans la barre de menu :
  - **FR** (version par défaut) : à la racine du site (`/`)
  - **EN** : dossier `/en/`
  - **ES** : dossier `/es/`
  - **DE** : dossier `/de/` (ajouté le 18 octobre 2026 ; vouvoiement « Sie »)
  - **ZH (mandarin)** : dossier `/zh/`
- Le changement de langue se fait **uniquement** via des **drapeaux cliquables dans la barre de menu** (navbar), visibles sur **toutes les pages**.
- Les drapeaux doivent être de **vrais petits drapeaux visuels** (pas des acronymes de langue, et pas des emojis pouvant se dégrader en lettres selon le navigateur).
- Il ne doit pas y avoir d’autres sélecteurs de langue ailleurs (pas de bloc "langue" dans le contenu, pas d’autres drapeaux, pas de traductions empilées dans une même page).
- Les pages traduites sont des **pages HTML séparées** (mêmes noms de fichiers) pour conserver une navigation simple.

### 7 bis) Qualité des traductions
- Toutes les pages traduites (`/en`, `/es`, `/de`, `/zh`) doivent être **entièrement** rédigées dans la langue cible.
- Exception : les **noms propres**, les **titres originaux des expositions** et les **titres originaux des œuvres** restent visibles **en français**.
- Si une traduction d’un titre est ajoutée, le **titre original français** doit rester présent lui aussi.
- Les éléments d’interface doivent aussi être localisés : titres de page, formulaires, libellés, boutons, messages d’état et labels d’accessibilité.

### 7 ter) Ajouter une langue (procédure suivie pour l’allemand)
1. `css/theme.css` : ajouter le drapeau `.lang-link[data-lang="xx"]::before` (SVG en base64, 24 × 16).
2. `js/mosaic-bg.js`, `js/diapo.js` et `js/navbar-load.js` : ajouter le dossier dans l’expression `(en|es|de|zh)` qui reconnaît les sous-dossiers de langue (préfixe `../` des images, langue courante du sélecteur).
3. Les quatre scripts à dictionnaire (`js/navbar-load.js`, `js/contact-form.js`, `js/diapo.js`, `js/gallery-lightbox.js`) : ajouter `xx:` dans `I18N` et `if (l.indexOf('xx') === 0) return 'xx';` dans `siteLang()`.
4. Sur **toutes** les pages existantes (et `404.html`) : ajouter le lien `lang-link` à sa place dans l’ordre, et la ligne `<link hreflang="xx">` ; ajouter `"xx"` dans `knowsLanguage` du JSON-LD.
5. Copier `en/*.html` vers `xx/*.html`, puis adapter `lang`, `canonical`, `og:url`, `og:locale`, `inLanguage` et les URL `/en/` des JSON-LD, et les deux liens du sélecteur (langue courante → `X.html`, anglais → `../en/X.html`).
6. Traduire le texte, les méta, les `alt`/`aria-label` et les valeurs textuelles des JSON-LD ; titres d’œuvres et d’expositions en français.
7. `sitemap.xml` : 15 nouvelles entrées `/xx/` et une ligne `hreflang="xx"` dans chaque entrée.
8. Changer le numéro de version `?v=` partout (scripts modifiés), tester 5 langues × 2 thèmes, puis commit.

### 8) Rubrique "Vidéos"
- L’accès **"Vidéos"** doit être **supprimé partout** (onglet absent du menu) et la rubrique n’existe plus.

### 9) Galerie "La maison..." en mode clair
- En mode clair, le texte ne doit **pas** être blanc sur noir : les blocs de texte (notamment le panneau de description étendu) doivent respecter le thème (**texte sombre sur fond crème**).


### 9 bis) Galerie "Couleurs en nudité"
- La galerie **Couleurs en nudité** doit utiliser le **même zoom / lightbox** que les autres galeries.
- Le zoom doit fonctionner sur les versions **FR / EN / ES / 中文**.

### 10) Contact : pas d’e-mail exposé
- La page **Contact** ne doit afficher **qu’un formulaire**.
- L’envoi doit se faire via un **endpoint HTTPS**.

Configuration actuelle (pour rendre le formulaire fonctionnel immédiatement) :
- Endpoint **FormSubmit (AJAX)**.
- Réglage : `js/site-config.js` → `SITE_CONFIG.CONTACT_FORM_ENDPOINT` (base) + `SITE_CONFIG.CONTACT_EMAIL_B64` (destination encodée).

Note : sur un site 100% statique, il est difficile de garantir que l'adresse soit *impossible* à récupérer côté visiteur. Pour une confidentialité stricte, il faudra passer par un endpoint serveur (Cloudflare Worker / Netlify Function, etc.) ou un provider type Formspree avec un identifiant de formulaire.

### 11) Mentions légales : crédit musique diaporama
- Dans **Mentions légales**, ajouter :  
  **Improvisation piano (diaporama) : Sébastien Nadler**.

### 12) Favicon (icône d’onglet)
- Le **favicon** (petite icône de l’onglet du navigateur) doit être déclaré **dans le `<head>` de toutes les pages** (FR / EN / ES / 中文).
- Fichier utilisé : `img/signature.png` (décliné via `rel="icon"`, `rel="shortcut icon"`, `rel="apple-touch-icon"`).

---

## Où sont les modifications clés ?

- **Thème clair/sombre + styles transverses** : `css/theme.css`
- **Menu + gestion du thème + calcul d’offset navbar + langues** : `js/navbar-load.js`
- **Diaporama (séquence, cartons de galerie, 4 images, 5s, sous-titres, audio)** : `js/diapo.js` + `diaporama.html`
- **Page Oeuvres (grille de cartes)** : `galeries.html` (+ styles « Page Œuvres » dans `css/theme.css`)
- **Sous-menu Œuvres de la navbar** : `js/galeries-menu.js` (liste des galeries) + styles « Sous-menu » dans `css/theme.css`
- **Accueil, œuvre en vedette** : `js/home-hero.js` (tableau `WORKS`) + styles « Accueil : hero » dans `css/theme.css`
- **Page Peau d’âne** : `peau-dane.html` (+ œuvres WebP dans `img/PeauDAne/`)

---

## Notes de maintenance

- Pour ajouter une nouvelle expo avec galerie :
  1. Créer une nouvelle page `mon-expo-AAAA.html` sur le modèle des pages existantes.
  2. Ajouter une carte dans `galeries.html` (et ses 4 traductions), avec une image de couverture dans `img/mosaique/` ; pour une exposition sans galerie ou une installation, une ligne dans la liste « Autres expositions ».
  2 bis. Ajouter la galerie dans le tableau `GALERIES` de `js/galeries-menu.js` (sous-menu) et, si on veut la mettre en avant sur l’accueil, dans `WORKS` de `js/home-hero.js`.
  3. Ajouter les images dans `js/diapo.js` si on veut l’inclure au diaporama (4 par défaut ; `maxSlides` pour en montrer plus, comme Angles de vie ou Icône).
  4. Ajouter la miniature dans `WORKS` de `js/mosaic-bg.js` (fond mosaïque), l’entrée dans `sitemap.xml` (5 URL + images), et vérifier `python3 outils/navbar-sync.py --check`.

### 12 bis) Protection des œuvres (17/10/2026)
- Clic droit, glisser-déposer et sélection désactivés sur les images ; appui long « Enregistrer l’image » désactivé sur mobile ; impression bloquée (Cmd/Ctrl+P et page d’impression vide) : `js/protect.js` + `css/theme.css`.
- Filigrane visible « © Ana Ruiz Llamazares » dans le coin de l’image agrandie et de l’image du diaporama (`.art-watermark`).
- Limite : une capture d’écran reste toujours possible (un site web ne peut pas la rendre noire, contrairement aux vidéos protégées par DRM). La protection est dissuasive, pas absolue.
- Bio et Contact : portrait d’Ana (`img/photo-ana-portrait.webp`, recadré depuis `img/photo-ana.jpg`) à côté du titre, mosaïque d’œuvres en fond.
- Le thème mémorisé est appliqué par un script en tête de chaque page (plus de passage par le clair en naviguant en sombre).

### 13) SEO / référencement
- Renforcer le **référencement naturel** du site sans sur-optimisation ni bourrage de mots-clés.
- Mieux expliciter, dans les pages stratégiques, qu’il s’agit du **site officiel d’Ana Ruiz Llamazares**, **artiste peintre et plasticienne**.
- Renforcer la pertinence locale autour de **Gif-sur-Yvette**, de l’**Essonne** et de la **région parisienne / près de Paris**, quand cela est justifié par le contenu du site.
- Soigner les éléments SEO de base : **titres de pages descriptifs**, **meta descriptions spécifiques**, **H1/H2**, **alt text d’images**, **liens internes**, **données structurées**, **sitemap** et **performance**.
- Conserver `https://anaruizllamazares.com/` comme **domaine canonique principal**.
- Les deux formes du nom doivent fonctionner dans les moteurs : **« Ana Ruiz »** et **« Ana Ruiz Llamazares »** (nom complet dans les titres, forme courte dans le texte de l’accueil, variantes déclarées dans la fiche `Person`).
- Recherches visées : **« Ana Ruiz peintre »** et **« Gif-sur-Yvette artiste »** ; la **page d’accueil** est la page prioritaire.
- Dans `sitemap.xml`, l’accueil est déclaré à l’adresse `/` (et `/en/`, `/es/`, `/de/`, `/zh/`), jamais `index.html`.
- Tout nouveau texte du site est relu en français par Sébastien avant traduction.

### 14) Nettoyage du dossier final
- Supprimer les **images source**, **doublons** et **médias non référencés** dans la version publiée.
- Supprimer les fichiers système inutiles (par ex. `.DS_Store`) et le dossier de versionnage local `.git` dans l’archive finale.
- Conserver uniquement les **images** et les **dossiers utiles** au site final mis en ligne.

