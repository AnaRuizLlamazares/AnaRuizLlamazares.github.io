/*
  Mosaïque de fond (Ana Ruiz)
  - Grille de tuiles en plein écran, derrière le contenu, à partir des œuvres du site
  - Mosaïque FIXE : aucune animation (le mouvement et les fondus ont été jugés
    perturbants) — STATIC = true
  - Disposition DÉTERMINISTE : même ordre de tuiles sur toutes les pages et à chaque
    visite (mélange à graine fixe).
  - STABILITÉ SUR TÉLÉPHONE (18/10/2026) : la grille est dimensionnée d'après la taille
    réelle de l'élément .mosaic-bg (hauteur fixée en CSS à 100lvh, le plus grand
    viewport). La barre d'adresse qui apparaît/disparaît au défilement ne change donc
    ni la taille de la mosaïque ni le nombre de lignes : plus de reconstruction, plus
    de clignotement. La grille n'est reconstruite que si le nombre de colonnes ou de
    lignes change réellement (rotation de l'écran, redimensionnement de la fenêtre).
  - Les tuiles ne sont pas en lazy-loading (elles sont toutes dans l'écran) ; la
    mosaïque est invisible (CSS) puis apparaît en un seul fondu (classe .is-ready)
    quand ses images sont chargées, au lieu de tuiles qui s'allument une à une.
  - STATIC = false réactive la dérive lente et les fondus (respecte prefers-reduced-motion)
  Activation : <div class="mosaic-bg" aria-hidden="true"></div> juste après <body>
*/
(function () {
  var root = document.querySelector('.mosaic-bg');
  if (!root) return;

  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  // Pages traduites : un sous-dossier de langue (en, es, de, zh) -> remonter d'un niveau.
  // Penser à ajouter ici tout nouveau dossier de langue.
  var prefix = /\/(en|es|de|zh)\//.test(path) ? '../' : '';

  var WORKS = [
    'img/mosaique/hypoderme-ana-ruiz.webp',
    'img/mosaique/epiderme-ana-ruiz.webp',
    'img/mosaique/deuxieme-peau-ana-ruiz.webp',
    'img/mosaique/peau-dane-2026-ana-ruiz.webp',
    'img/mosaique/nekem-ana-ruiz.webp',
    'img/mosaique/ben-ana-ruiz.webp',
    'img/mosaique/remine-ana-ruiz.webp',
    'img/mosaique/icone-visage-1-ana-ruiz.webp',
    'img/mosaique/icone-visage-2-ana-ruiz.webp',
    'img/mosaique/icone-visage-3-ana-ruiz.webp',
    'img/mosaique/icone-visage-4-ana-ruiz.webp',
    'img/mosaique/icone-visage-5-ana-ruiz.webp',
    'img/mosaique/peau-dane-je-me-suis-assis-au-milieu-de-la-terre-ana-ruiz.webp',
    'img/mosaique/maison-sacree.webp',
    'img/mosaique/maison-floride.webp',
    'img/mosaique/maison-temple.webp',
    'img/mosaique/maison-palais-prison.webp',
    'img/mosaique/maison-de-thyphee.webp',
    'img/mosaique/maison-paradis-perdu.webp',
    'img/mosaique/gizeh-2009-ana-ruiz.webp',
    'img/mosaique/naples-2009-ana-ruiz.webp',
    'img/mosaique/nepal-2009-ana-ruiz.webp',
    'img/mosaique/athenes-2009-ana-ruiz.webp',
    'img/mosaique/le-vieux-dragonnier.webp',
    'img/mosaique/le-vieux-volcan.webp',
    'img/mosaique/sable-noir.webp',
    'img/mosaique/sur-la-terre.webp',
    'img/mosaique/couleurs-a-nues-2007-ana-ruiz.webp',
    'img/mosaique/el-rayo-de-luna-2007-ana-ruiz.webp',
    'img/mosaique/angles-de-vie-1-ana-ruiz.webp',
    'img/mosaique/angles-de-vie-2-ana-ruiz.webp',
    'img/mosaique/angles-de-vie-3-ana-ruiz.webp',
    'img/mosaique/angles-de-vie-4-ana-ruiz.webp'
  ];

  var STATIC = true;
  var reduceMotion = STATIC;
  try { if (!STATIC) reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  // Délai maximal d'attente du chargement des tuiles avant d'afficher quand même la mosaïque
  var REVEAL_TIMEOUT_MS = 2500;

  // Générateur pseudo-aléatoire à graine fixe : même mélange partout, toujours.
  var seed = 20261018;
  function rand() { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(rand() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var order = shuffle(WORKS.slice());
  var next = 0;
  function nextWork() { var w = order[next % order.length]; next++; return prefix + w; }

  function makeImg(src) {
    var img = document.createElement('img');
    img.alt = '';
    img.decoding = 'async';
    // Priorité basse : les œuvres de la page passent avant le fond (attribut ignoré si non supporté)
    img.setAttribute('fetchpriority', 'low');
    if (src) img.src = src;
    return img;
  }

  // Affiche la mosaïque en un seul fondu (classe .is-ready) une fois toutes les
  // tuiles chargées, ou au bout de REVEAL_TIMEOUT_MS si le réseau est lent.
  function revealWhenLoaded(imgs) {
    var pending = imgs.length, done = false;
    function reveal() { if (done) return; done = true; root.classList.add('is-ready'); }
    function one() { pending--; if (pending <= 0) reveal(); }
    imgs.forEach(function (img) {
      if (img.complete) { one(); return; }
      img.addEventListener('load', one);
      img.addEventListener('error', one);
    });
    setTimeout(reveal, REVEAL_TIMEOUT_MS);
  }

  var tiles = [];
  var lastGrid = '';
  function build() {
    // Dimensions de l'élément lui-même (hauteur 100lvh fixée en CSS), et non de la
    // fenêtre : stables au défilement sur téléphone.
    var w = root.clientWidth || window.innerWidth || 1200;
    var h = root.clientHeight || window.innerHeight || 800;
    var size = w < 600 ? 170 : (w < 1100 ? 230 : 290);
    var cols = Math.max(2, Math.ceil(w / size)), rows = Math.max(2, Math.ceil(h / size));
    var grid = cols + 'x' + rows;
    if (grid === lastGrid) return; // même grille : on ne touche à rien
    lastGrid = grid;

    root.classList.remove('is-ready');
    root.innerHTML = '';
    tiles = [];
    next = 0; // repart du début de l'ordre fixe : les premières tuiles restent les mêmes
    root.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    root.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';

    var imgs = [];
    for (var i = 0; i < cols * rows; i++) {
      var tile = document.createElement('div');
      tile.className = 'mosaic-tile';
      var a = makeImg(nextWork());
      a.className = 'is-on';
      tile.appendChild(a);
      imgs.push(a);
      var tileImgs = [a];
      if (!reduceMotion) {
        // Mode animé : seconde image pour le fondu croisé
        var b = makeImg(null);
        var dur = 40 + Math.random() * 40, delay = -Math.random() * dur;
        a.style.animationDuration = dur.toFixed(1) + 's'; a.style.animationDelay = delay.toFixed(1) + 's';
        b.style.animationDuration = (40 + Math.random() * 40).toFixed(1) + 's'; b.style.animationDelay = (-Math.random() * 40).toFixed(1) + 's';
        tile.appendChild(b);
        tileImgs.push(b);
      }
      root.appendChild(tile);
      tiles.push({ el: tile, imgs: tileImgs, on: 0 });
    }
    revealWhenLoaded(imgs);
  }

  function swapOne() {
    if (!tiles.length) return;
    var t = tiles[Math.floor(Math.random() * tiles.length)];
    if (t.imgs.length < 2) return;
    var off = t.imgs[1 - t.on];
    var src = nextWork();
    var done = false;
    function show() {
      if (done) return; done = true;
      off.classList.add('is-on');
      t.imgs[t.on].classList.remove('is-on');
      t.on = 1 - t.on;
    }
    off.onload = show;
    off.src = src;
    if (off.complete && off.naturalWidth) show();
  }

  var timer = null;
  function start() { if (reduceMotion || timer) return; timer = setInterval(swapOne, 3200); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  build();
  start();

  var rt = null;
  window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(build, 300); });
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
})();
