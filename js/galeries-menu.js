/*
  Sous-menu « Œuvres » de la barre de navigation.

  Ce script est la SEULE source de la liste des galeries pour le sous-menu :
  pour ajouter ou retirer une galerie, modifier le tableau GALERIES ci-dessous.
  Rien à changer dans les pages HTML (le sous-menu est construit au chargement
  à partir du lien « Œuvres » déjà présent dans la navbar).

  Comportement :
  - ordinateur (souris) : le sous-menu s'ouvre au survol du lien « Œuvres » ou
    au clavier (Tab) ; le lien lui-même mène toujours à la page Œuvres ;
  - menu hamburger (écran étroit, ou navbar compactée par navbar-load.js) et
    écrans tactiles sans survol : toucher « Œuvres » ou sa flèche ouvre/ferme le
    sous-menu (accordéon) sans quitter la page ; la page Œuvres s'atteint par la
    première entrée « Toutes les œuvres ». Échap referme.
    (Avant le 18/10/2026, « Œuvres » naviguait aussi sur téléphone : un doigt qui
    cherchait la flèche partait vers la page Œuvres sans le vouloir.)
  - Les titres d'expositions restent en français (règle du site) ; seuls les
    libellés d'interface sont traduits.
*/
(function () {
  'use strict';

  // Galeries en ligne, de la plus récente à la plus ancienne.
  // href : nom du fichier (identique dans chaque dossier de langue).
  var GALERIES = [
    { href: 'salon-versailles-2026.html',                          year: '2026', label: 'Salon de Versailles' },
    { href: 'icone-ou-le-pouvoir-de-soi.html',                     year: '2024', label: 'Icône ou le pouvoir de soi' },
    { href: 'peau-dane.html',                                      year: '2024', label: 'Peau d’âne' },
    { href: 'la-maison-ou-le-pouvoir-de-rentrer-en-soi-meme-2012.html', year: '2012', label: 'La maison ou le pouvoir de rentrer en soi-même' },
    { href: 'fete-des-artistes-2009.html',                         year: '2009', label: 'Fête des artistes en cartes postales' },
    { href: 'sur-le-sentier-du-dragonnier-2008.html',              year: '2008', label: 'Sur le sentier du dragonnier' },
    { href: 'couleurs-en-nudite-2007.html',                        year: '2007', label: 'Couleurs en nudité' },
    { href: 'angles-de-vie-2005.html',                             year: '2005', label: 'Angles de vie' },
    { href: 'contre-verse-autour-des-limites-2004.html',           year: '2004', label: 'Contre-verse autour des limites' }
  ];

  // Libellés d'interface par langue.
  var UI = {
    fr: { all: 'Toutes les œuvres', toggle: 'Ouvrir le sous-menu Œuvres' },
    en: { all: 'All works',          toggle: 'Open the Works submenu' },
    es: { all: 'Todas las obras',    toggle: 'Abrir el submenú Obras' },
    de: { all: 'Alle Werke',         toggle: 'Untermenü Werke öffnen' },
    zh: { all: '全部作品',            toggle: '打开作品子菜单' }
  };

  function siteLang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase().slice(0, 2);
    return UI[l] ? l : 'fr';
  }

  function build() {
    var link = document.querySelector('.nav-links a[href$="galeries.html"]');
    if (!link || !link.parentNode || link.parentNode.tagName !== 'LI') return;
    var li = link.parentNode;
    if (li.classList.contains('has-sub')) return; // déjà construit

    var t = UI[siteLang()];
    var currentFile = (location.pathname.split('/').pop() || 'index.html');

    li.classList.add('has-sub');
    link.setAttribute('aria-haspopup', 'true');
    link.setAttribute('aria-expanded', 'false');

    var caret = document.createElement('span');
    caret.className = 'sub-caret';
    caret.setAttribute('aria-hidden', 'true');
    caret.textContent = ' ▾';
    link.appendChild(caret);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'sub-toggle';
    btn.setAttribute('aria-label', t.toggle);
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', 'sub-oeuvres');
    btn.textContent = '▾';

    var ul = document.createElement('ul');
    ul.className = 'sub-menu';
    ul.id = 'sub-oeuvres';

    function item(href, year, label, extraClass) {
      var el = document.createElement('li');
      if (extraClass) el.className = extraClass;
      var a = document.createElement('a');
      a.href = href;
      if (href === currentFile) a.setAttribute('aria-current', 'page');
      if (year) {
        var y = document.createElement('span');
        y.className = 'sub-year';
        y.textContent = year;
        a.appendChild(y);
      }
      var txt = document.createElement('span');
      txt.className = 'sub-label';
      txt.textContent = label;
      a.appendChild(txt);
      el.appendChild(a);
      return el;
    }

    ul.appendChild(item('galeries.html', '', t.all, 'sub-all'));
    GALERIES.forEach(function (g) { ul.appendChild(item(g.href, g.year, g.label)); });

    li.appendChild(btn);
    li.appendChild(ul);

    function setOpen(open) {
      li.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      link.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    // Mode accordéon : menu hamburger (breakpoint CSS ou compactage forcé) ou
    // écran sans survol (tactile). Même critère que css/theme.css.
    function accordionMode() {
      try {
        if (document.documentElement.classList.contains('nav-force-hamburger')) return true;
        if (window.matchMedia('(max-width: 1100px)').matches) return true;
        if (window.matchMedia('(hover: none)').matches) return true;
      } catch (err) {}
      return false;
    }
    function toggle(e) {
      e.preventDefault();
      // stopPropagation : navbar-load.js referme tout le menu hamburger au clic
      // sur un lien ; ici on ne fait qu'ouvrir le sous-menu.
      e.stopPropagation();
      setOpen(!li.classList.contains('open'));
    }
    btn.addEventListener('click', toggle);
    link.addEventListener('click', function (e) {
      if (accordionMode()) toggle(e);
      // sinon (souris, bureau) : le lien mène à la page Œuvres, le survol ouvre la liste
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
    // Clic en dehors : referme le sous-menu ouvert par la flèche.
    document.addEventListener('click', function (e) {
      if (!li.contains(e.target)) setOpen(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
