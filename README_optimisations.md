# Optimisations appliquées

## Modifications
- Navigation : barre sticky + menu mobile accessible, lien d'évitement.
- CSS/JS d'ergonomie injectés.
- Conversion JPEG/PNG → WebP (~qualité 82) pour 31 images, avec `<picture>` + fallback.
- Lazy-loading auto (sauf les 2 premières images par page).
- Nettoyage de la section GALERIES pour ne conserver que :
  - La maison ou le pouvoir de rentrer en soi-même (2012)
  - Sur le sentier du dragonnier (2008)
  - Fête des artistes (2009)
  - Couleurs en nudité (2007)
- Suppression de sections intitulées "Autres œuvres", si présentes.
- Fichiers originaux conservés.

## Remarques
- Si vous souhaitez un envoi de formulaire sans `mailto:`, renseignez un endpoint (p. ex. Formspree) :
  `<form action="https://formspree.io/f/VOTRE_ID" method="POST">...`
