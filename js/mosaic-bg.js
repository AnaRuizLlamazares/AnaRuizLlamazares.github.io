/*
  Mosaïque de fond (Ana Ruiz)
  - Grille de tuiles en plein écran, derrière le contenu, à partir des œuvres du site
  - Chaque tuile bouge très lentement (zoom/dérive) et change d'œuvre par fondu doux
  - Respecte prefers-reduced-motion (image fixe, pas de fondu)
  - S'arrête quand l'onglet est caché
  Activation : <div class="mosaic-bg" aria-hidden="true"></div> juste après <body>
*/
(function () {
  var root = document.querySelector('.mosaic-bg');
  if (!root) return;

  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var prefix = /\/(en|es|zh)\//.test(path) ? '../' : '';

  var WORKS = [
    'img/PeauDAne/peau-dane-visage-1-ana-ruiz.webp', 'img/PeauDAne/peau-dane-visage-2-ana-ruiz.webp',
    'img/PeauDAne/peau-dane-visage-3-ana-ruiz.webp', 'img/PeauDAne/peau-dane-visage-4-ana-ruiz.webp',
    'img/PeauDAne/peau-dane-visage-5-ana-ruiz.webp', 'img/PeauDAne/peau-dane-vetement-1-ana-ruiz.webp',
    'img/PeauDAne/peau-dane-vetement-2-ana-ruiz.webp', 'img/PeauDAne/peau-dane-vetement-3-ana-ruiz.webp',
    'img/PeauDAne/peau-dane-vetement-4-ana-ruiz.webp', 'img/PeauDAne/peau-dane-vetement-5-ana-ruiz.webp',
    'img/PeauDAne/peau-dane-vetement-6-ana-ruiz.webp', 'img/peau-dane-je-me-suis-assis-au-milieu-de-la-terre-ana-ruiz.webp',
    'img/la-maison/maison-sacree.jpg', 'img/la-maison/maison-floride.jpg', 'img/la-maison/maison-temple.jpg',
    'img/la-maison/maison-palais-prison.jpg', 'img/la-maison/maison-de-thyphee.jpg', 'img/la-maison/maison-paradis-perdu.jpg',
    'img/FeteDesArtistes/gizeh-2009-ana-ruiz.webp', 'img/FeteDesArtistes/naples-2009-ana-ruiz.webp',
    'img/FeteDesArtistes/nepal-2009-ana-ruiz.webp', 'img/FeteDesArtistes/athenes-2009-ana-ruiz.webp',
    'img/FeteDesArtistes/tolede-2009-ana-ruiz.webp', 'img/FeteDesArtistes/angles-de-vie-ana-ruiz.webp',
    'img/SurLesSentiersDuDragonnier/le-vieux-dragonnier.jpg', 'img/SurLesSentiersDuDragonnier/le-vieux-volcan.jpg',
    'img/SurLesSentiersDuDragonnier/sable-noir.jpg', 'img/SurLesSentiersDuDragonnier/sur-la-terre.jpg',
    'img/CouleurEnNudite/couleurs-a-nues-2007-ana-ruiz.webp', 'img/CouleurEnNudite/el-rayo-de-luna-2007-ana-ruiz.webp',
    'img/presse/tableau-angles-de-vie-1.jpg', 'img/presse/tableau-angles-de-vie-2.jpg', 'img/presse/tableau-angles-de-vie-3.jpg'
  ];

  var reduceMotion = false;
  try { reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

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
