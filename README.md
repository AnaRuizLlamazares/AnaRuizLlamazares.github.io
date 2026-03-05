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

### 2) Page "Oeuvres" (galeries.html)
- Les œuvres sont listées **par exposition** (et le site reste organisé par pages d’expo/galerie).
- Dans "Oeuvres", lister **Expositions + Installations**.
- Quand une galerie existe, l’item doit être **cliquable** (lien vers la page correspondante). Sinon texte simple.
- La première exposition listée doit être **Peau d’âne (2025)**.

### 3) Exposition "Peau d’âne" (2025)
- Ajout de l’exposition **Peau d’âne** (2025), **Gif-sur-Yvette**, galerie-restaurant **Le Canapé**.
- Sur la page de l’expo, le contenu ne doit pas être masqué par la barre du menu : on utilise l’offset de navbar (`--site-nav-offset`) pour gérer l’espace en haut.
- Le titre du premier tableau est : **"Je me suis assis au milieu de la Terre"**.

### 4) Thème Clair / Sombre
- Ajouter un thème **Clair** et un thème **Sombre**.
- Le thème **par défaut** est **Clair**.
- Le clair est une couleur **crème très clair** (pas blanc pur).
- En clair, le texte doit être **plus sombre** pour être lisible.
- En clair, éviter les "cartouches"/"box" blanches derrière les textes : **fond crème continu** (pas de démarcation visible entre un bloc texte et le fond).
- Corriger le cas où un **bandeau noir** apparaissait en bas en mode clair : le fond doit rester crème.
- L’icône du bouton doit refléter le thème : **Soleil** en clair, **Lune** en sombre.
- Quand on ouvre une œuvre en plein écran (lightbox), le fond doit être :
  - **blanc pur** en mode clair (pas crème)
  - **noir** en mode sombre.
- En mode clair, le footer (© 2025… | Mentions légales) doit être **suffisamment foncé** pour rester lisible.

### 5) Diaporama (diaporama.html + js/diapo.js)
- Le diaporama tourne avec un rythme de **5 secondes** par image.
- Choisir **4 images par galerie** (max 4).
- Avant chaque série d’images d’une galerie, afficher une "carte" avec le **nom de la galerie**.
- Sous chaque image, afficher le **titre de l’œuvre**.
- Ajouter la possibilité de **jouer / ne pas jouer** la musique du diaporama (fichier audio `audio/diapo.mp3` et/ou `audio/diapo.mp4`) via un bouton (🎵 / ⏸️).

### 6) Responsive / mobile
- Le site doit être **lisible et utilisable sur mobile** : menu (hamburger), drapeaux de langue, bouton de thème, galeries, diaporama, formulaire de contact.
- Les ajustements responsive se font **sans casser** la version desktop.


### 7) Langues (FR / EN / ES / 中文)
- Le site doit exister en **4 langues** :
  - **FR** (version par défaut) : à la racine du site (`/`)
  - **EN** : dossier `/en/`
  - **ES** : dossier `/es/`
  - **ZH (mandarin)** : dossier `/zh/`
- Le changement de langue se fait **uniquement** via des **drapeaux cliquables dans la barre de menu** (navbar), visibles sur **toutes les pages**.
- Les drapeaux doivent être de **vrais petits drapeaux visuels** (pas des acronymes de langue, et pas des emojis pouvant se dégrader en lettres selon le navigateur).
- Il ne doit pas y avoir d’autres sélecteurs de langue ailleurs (pas de bloc "langue" dans le contenu, pas d’autres drapeaux, pas de traductions empilées dans une même page).
- Les pages traduites sont des **pages HTML séparées** (mêmes noms de fichiers) pour conserver une navigation simple.

### 7 bis) Qualité des traductions
- Toutes les pages traduites (`/en`, `/es`, `/zh`) doivent être **entièrement** rédigées dans la langue cible.
- Exception : les **noms propres**, les **titres originaux des expositions** et les **titres originaux des œuvres** restent visibles **en français**.
- Si une traduction d’un titre est ajoutée, le **titre original français** doit rester présent lui aussi.
- Les éléments d’interface doivent aussi être localisés : titres de page, formulaires, libellés, boutons, messages d’état et labels d’accessibilité.

### 8) Rubrique "Vidéos"
- L’accès **"Vidéos"** doit être **supprimé partout** (onglet absent du menu) et la rubrique n’existe plus.

### 9) Galerie "La maison..." en mode clair
- En mode clair, le texte ne doit **pas** être blanc sur noir : les blocs de texte (notamment le panneau de description étendu) doivent respecter le thème (**texte sombre sur fond crème**).


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
- **Liste Oeuvres** : `galeries.html`
- **Page Peau d’âne** : `peau-dane.html` (+ image `img/auMilieuTerre.png`)

---

## Notes de maintenance

- Pour ajouter une nouvelle expo avec galerie :
  1. Créer une nouvelle page `mon-expo-AAAA.html` sur le modèle des pages existantes.
  2. Ajouter l’entrée correspondante dans `galeries.html` (section Expositions ou Installations).
  3. Ajouter jusqu’à 4 images dans `js/diapo.js` si on veut l’inclure au diaporama.