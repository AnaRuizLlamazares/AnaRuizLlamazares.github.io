/*
  Mosaïque de fond (Ana Ruiz)
  - Grille de tuiles en plein écran, derrière le contenu, à partir des œuvres du site
  - Mosaïque FIXE : disposition tirée au hasard au chargement, puis aucune animation
    (le mouvement et les fondus ont été jugés perturbants) — STATIC = true
  - STATIC = false réactive la dérive lente et les fondus (respecte prefers-reduced-motion)
  Activation : <div class="mosaic-bg" aria-hidden="true"></div> juste après <body>
*/
(function () {
  var root = document.querySelector('.mosaic-bg');
  if (!root) return;

  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var prefix = /\/(en|es|zh)\//.test(path) ? '../' : '';

  var WORKS = [
    'img/mosaique/peau-dane-visage-1-ana-ruiz.webp', 'img/mosaique/peau-dane-visage-2-ana-ruiz.webp',
    'img/mosaique/peau-dane-visage-3-ana-ruiz.webp', 'img/mosaique/peau-dane-visage-4-ana-ruiz.webp',
    'img/mosaique/peau-dane-visage-5-ana-ruiz.webp', 'img/mosaique/peau-dane-vetement-1-ana-ruiz.webp',
    'img/mosaique/peau-dane-vetement-2-ana-ruiz.webp', 'img/mosaique/peau-dane-vetement-3-ana-ruiz.webp',
    'img/mosaique/peau-dane-vetement-4-ana-ruiz.webp', 'img/mosaique/peau-dane-vetement-5-ana-ruiz.webp',
    'img/mosaique/peau-dane-vetement-6-ana-ruiz.webp', 'img/mosaique/peau-dane-je-me-suis-assis-au-milieu-de-la-terre-ana-ruiz.webp',
    'img/mosaique/maison-sacree.webp', 'img/mosaique/maison-floride.webp', 'img/mosaique/maison-temple.webp',
    'img/mosaique/maison-palais-prison.webp', 'img/mosaique/maison-de-thyphee.webp', 'img/mosaique/maison-paradis-perdu.webp',
    'img/mosaique/gizeh-2009-ana-ruiz.webp', 'img/mosaique/naples-2009-ana-ruiz.webp',
    'img/mosaique/nepal-2009-ana-ruiz.webp', 'img/mosaique/athenes-2009-ana-ruiz.webp',
    'img/mosaique/tolede-2009-ana-ruiz.webp', 'img/mosaique/angles-de-vie-ana-ruiz.webp',
    'img/mosaique/le-vieux-dragonnier.webp', 'img/mosaique/le-vieux-volcan.webp',
    'img/mosaique/sable-noir.webp', 'img/mosaique/sur-la-terre.webp',
    'img/mosaique/couleurs-a-nues-2007-ana-ruiz.webp', 'img/mosaique/el-rayo-de-luna-2007-ana-ruiz.webp',
    'img/mosaique/tableau-angles-de-vie-1.webp', 'img/mosaique/tableau-angles-de-vie-2.webp', 'img/mosaique/tableau-angles-de-vie-3.webp'
  ];

  var STATIC = true;
  var reduceMotion = STATIC;
  try { if (!STATIC) reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }

  var order = shuffle(WORKS.slice());
  var next = 0;
  function nextWork() { var w = order[next % order.length]; next++; if (next % order.length === 0) shuffle(order); return prefix + w; }

  var tiles = [];
  function build() {
    root.innerHTML = '';
    tiles = [];
    var w = window.innerWidth || 1200, h = window.innerHeight || 800;
    var size = w < 600 ? 170 : (w < 1100 ? 230 : 290);
    var cols = Math.max(2, Math.ceil(w / size)), rows = Math.max(2, Math.ceil(h / size));
    root.style.gridTemplateColumns = 'repeat(' + cols + ', 1fr)';
    root.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
    for (var i = 0; i < cols * rows; i++) {
      var tile = document.createElement('div');
      tile.className = 'mosaic-tile';
      var a = document.createElement('img'), b = document.createElement('img');
      a.alt = ''; b.alt = ''; a.decoding = 'async'; b.decoding = 'async'; a.loading = 'lazy'; b.loading = 'lazy';
      a.src = nextWork();
      a.className = 'is-on';
      if (!reduceMotion) {
        var dur = 40 + Math.random() * 40, delay = -Math.random() * dur;
        a.style.animationDuration = dur.toFixed(1) + 's'; a.style.animationDelay = delay.toFixed(1) + 's';
        b.style.animationDuration = (40 + Math.random() * 40).toFixed(1) + 's'; b.style.animationDelay = (-Math.random() * 40).toFixed(1) + 's';
      }
      tile.appendChild(a); tile.appendChild(b);
      root.appendChild(tile);
      tiles.push({ el: tile, imgs: [a, b], on: 0 });
    }
  }

  function swapOne() {
    if (!tiles.length) return;
    var t = tiles[Math.floor(Math.random() * tiles.length)];
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
