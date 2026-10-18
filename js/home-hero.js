/*
  Accueil : « œuvre en vedette » à côté du titre.

  Une toile encadrée change toutes les 8 secondes (fondu), avec sa légende
  (titre de l'œuvre · exposition, année) et un lien vers la galerie de
  l'exposition. Les titres restent en français (règle du site).

  Pour changer les œuvres mises en avant : modifier le tableau WORKS.
  Les chemins d'images sont relatifs à la racine du site ; le préfixe « ../ »
  est ajouté automatiquement dans les dossiers de langue (en, es, de, zh).

  Respecte « prefers-reduced-motion » : dans ce cas la première œuvre reste
  affichée, sans rotation, sans inclinaison ni apparition au défilement.

  Effets (sobres, désactivables en retirant la fonction correspondante) :
  - tilt()   : la toile s'incline légèrement et reflète la lumière en suivant
               la souris (souris uniquement, jamais sur tactile) ;
  - barre    : un fin trait sous la toile se remplit pendant les 8 s ;
  - reveal() : les panneaux de la page apparaissent en montant quand ils
               entrent à l'écran (classe .reveal, posée ici en JS pour que la
               page reste entièrement visible sans JavaScript).
*/
(function () {
  'use strict';

  var WORKS = [
    { src: 'img/SalonVersailles2026/epiderme-ana-ruiz.webp', title: 'Épiderme',         expo: '161ᵉ Salon de Versailles, 2026',                        href: 'salon-versailles-2026.html' },
    { src: 'img/PeauDAne/nekem-ana-ruiz.webp',                title: 'Nekem',            expo: 'Peau d’âne, 2024',                                      href: 'peau-dane.html' },
    { src: 'img/Icone/visage-2-ana-ruiz.webp',                title: 'Éternel féminin',  expo: 'Icône ou le pouvoir de soi, 2024',                      href: 'icone-ou-le-pouvoir-de-soi.html' },
    { src: 'img/la-maison/maison-sacree.jpg',                 title: 'Maison sacrée',    expo: 'La maison ou le pouvoir de rentrer en soi-même, 2012',  href: 'la-maison-ou-le-pouvoir-de-rentrer-en-soi-meme-2012.html' },
    { src: 'img/AnglesDeVie/angles-de-vie-1-ana-ruiz.webp',   title: 'Angles de vie I',  expo: 'Angles de vie, 2005',                                   href: 'angles-de-vie-2005.html' },
    { src: 'img/SalonVersailles2026/hypoderme-ana-ruiz.webp', title: 'Hypoderme',        expo: '161ᵉ Salon de Versailles, 2026',                        href: 'salon-versailles-2026.html' }
  ];
  var INTERVAL_MS = 8000;

  // Dossiers de langue (ajouter ici toute nouvelle langue).
  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var prefix = /\/(en|es|de|zh)\//.test(path) ? '../' : '';

  function init() {
    var frame = document.getElementById('hero-frame');
    var caption = document.getElementById('hero-caption');
    var link = document.getElementById('hero-art');
    if (!frame || !caption || !link) return;

    var imgs = WORKS.map(function (w) {
      var img = document.createElement('img');
      img.src = prefix + w.src;
      img.alt = w.title + ' — ' + w.expo;
      img.decoding = 'async';
      frame.appendChild(img);
      return img;
    });

    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Barre de progression (fin trait sous la toile)
    var bar = document.createElement('span');
    bar.className = 'hero-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.style.setProperty('--hero-interval', INTERVAL_MS + 'ms');
    frame.appendChild(bar);

    function show(n) {
      imgs.forEach(function (img, k) { img.classList.toggle('on', k === n); });
      caption.textContent = WORKS[n].title + ' · ' + WORKS[n].expo;
      link.href = WORKS[n].href;
      // relance l'animation de la barre
      bar.classList.remove('run');
      void bar.offsetWidth;
      if (!reduced) bar.classList.add('run');
    }

    var current = 0;
    show(current);

    if (!reduced && WORKS.length > 1) {
      setInterval(function () {
        current = (current + 1) % WORKS.length;
        show(current);
      }, INTERVAL_MS);
      tilt(link, frame);
    }
    if (!reduced) reveal();
  }

  // Inclinaison 3D et reflet qui suivent la souris (souris seulement).
  function tilt(area, frame) {
    if (!window.matchMedia || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var MAX = 6; // degrés
    var sheen = document.createElement('span');
    sheen.className = 'hero-sheen';
    sheen.setAttribute('aria-hidden', 'true');
    frame.appendChild(sheen);
    var raf = null;
    area.addEventListener('mousemove', function (e) {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = frame.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width;   // 0..1
        var y = (e.clientY - r.top) / r.height;   // 0..1
        frame.style.transform = 'perspective(900px) rotateY(' + ((x - 0.5) * 2 * MAX).toFixed(2) + 'deg) rotateX(' + ((0.5 - y) * 2 * MAX).toFixed(2) + 'deg) translateY(-3px)';
        sheen.style.setProperty('--sx', (x * 100).toFixed(1) + '%');
        sheen.style.setProperty('--sy', (y * 100).toFixed(1) + '%');
        sheen.style.opacity = '1';
      });
    });
    area.addEventListener('mouseleave', function () {
      frame.style.transform = '';
      sheen.style.opacity = '0';
    });
  }

  // Apparition au défilement des panneaux de l'accueil (IntersectionObserver).
  function reveal() {
    if (!('IntersectionObserver' in window)) return;
    var items = document.querySelectorAll('.home-panel, .home-works li');
    if (!items.length) return;
    items.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (i % 8) * 70 + 'ms');
    });
    var list = Array.prototype.slice.call(items);
    function showUpTo(k) {
      // Les éléments sont dans l'ordre de la page : tout ce qui précède un
      // élément visible est au-dessus de lui, donc déjà passé -> visible.
      for (var i = 0; i <= k; i++) {
        if (!list[i].classList.contains('is-visible')) { list[i].classList.add('is-visible'); io.unobserve(list[i]); }
      }
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || en.boundingClientRect.top < 0) showUpTo(list.indexOf(en.target));
      });
    }, { threshold: 0 });
    list.forEach(function (el) { io.observe(el); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
