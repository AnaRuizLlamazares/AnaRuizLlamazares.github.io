/*
  Slideshow (v4)
  - Default max 4 images per gallery (override with maxSlides when needed)
  - 5 seconds per image
  - Before each gallery/series: a title card with the gallery name
  - Caption under each image = artwork title
  - Optional music playback (diapo.mp4), remember user preference
*/

document.addEventListener('DOMContentLoaded', function () {
  var imgEl = document.getElementById('diapo-img');
  var galleryEl = document.getElementById('diapo-gallery');
  var captionEl = document.getElementById('diapo-caption');
  var indicatorEl = document.getElementById('diapo-indicator');
  var prevBtn = document.getElementById('prev-btn');
  var nextBtn = document.getElementById('next-btn');
  var titleCard = document.getElementById('diapo-titlecard');

  if (!imgEl || !galleryEl || !captionEl || !indicatorEl || !prevBtn || !nextBtn || !titleCard) return;

  function siteLang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.indexOf('en') === 0) return 'en';
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'fr';
  }

  var I18N = {
    fr: {
      altFallback: 'Œuvre Ana Ruiz',
      audioPlay: 'Jouer la musique',
      audioPause: 'Mettre en pause la musique',
      facesSection: 'Visages',
      garmentsSection: 'Vêtements',
      faceLabel: 'Visage',
      garmentLabel: 'Vêtement',
      pause: 'Mettre en pause le défilement',
      play: 'Reprendre le défilement',
      fullscreen: 'Plein écran',
      exitFullscreen: 'Quitter le plein écran'
    },
    en: {
      altFallback: 'Artwork by Ana Ruiz',
      audioPlay: 'Play music',
      audioPause: 'Pause music',
      facesSection: 'Faces',
      garmentsSection: 'Garments',
      faceLabel: 'Face',
      garmentLabel: 'Garment',
      pause: 'Pause the slideshow',
      play: 'Resume the slideshow',
      fullscreen: 'Full screen',
      exitFullscreen: 'Exit full screen'
    },
    es: {
      altFallback: 'Obra de Ana Ruiz',
      audioPlay: 'Reproducir música',
      audioPause: 'Pausar música',
      facesSection: 'Rostros',
      garmentsSection: 'Prendas',
      faceLabel: 'Rostro',
      garmentLabel: 'Prenda',
      pause: 'Pausar el pase',
      play: 'Reanudar el pase',
      fullscreen: 'Pantalla completa',
      exitFullscreen: 'Salir de pantalla completa'
    },
    zh: {
      altFallback: 'Ana Ruiz 的作品',
      audioPlay: '播放音乐',
      audioPause: '暂停音乐',
      facesSection: '面孔',
      garmentsSection: '服饰',
      faceLabel: '面孔',
      garmentLabel: '服饰',
      pause: '暂停播放',
      play: '继续播放',
      fullscreen: '全屏',
      exitFullscreen: '退出全屏'
    }
  };

  function tr(key) {
    var l = siteLang();
    return (I18N[l] && I18N[l][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  function peauDaneSectionTitle(sectionKey) {
    return "Peau d’âne (2025) — " + tr(sectionKey);
  }

  var FACE_TITLES = {1: 'Iel peut vivre aussi longtemps qu’il veut', 2: 'Éternel féminin', 3: 'Et je reprends encore le monde', 4: 'Iel était si belle que tu n’aurais pas osé l’aimer', 5: 'Elle ne parle que la langue de son âme'};
  function peauDaneFaceTitle(index) {
    return FACE_TITLES[index] || (tr('faceLabel') + ' ' + index);
  }

  var GARMENT_TITLES = {2: 'Nekem', 3: 'Hypoderme', 4: 'Ben', 5: 'Remine', 6: 'Épiderme'};
  function peauDaneGarmentTitle(index) {
    return GARMENT_TITLES[index] || (tr('garmentLabel') + ' ' + index);
  }

  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var assetPrefix = /\/((en|es|zh))\//.test(path) ? '../' : '';

  var galleries = [
    {
      name: "161ᵉ Salon de Versailles (2026)",
      maxSlides: 4,
      slides: [
        { src: "img/SalonVersailles2026/hypoderme-ana-ruiz.webp", title: "Hypoderme" },
        { src: "img/SalonVersailles2026/epiderme-ana-ruiz.webp", title: "Épiderme" },
        { src: "img/SalonVersailles2026/deuxieme-peau-ana-ruiz.webp", title: "Deuxième peau" },
        { src: "img/SalonVersailles2026/peau-dane-2026-ana-ruiz.webp", title: "Peau d’âne" }
      ]
    },
    {
      name: "Icône ou le pouvoir de soi (2024)",
      maxSlides: 5,
      slides: [
        { src: "img/Icone/visage-1-ana-ruiz.webp", title: peauDaneFaceTitle(1) },
        { src: "img/Icone/visage-2-ana-ruiz.webp", title: peauDaneFaceTitle(2) },
        { src: "img/Icone/visage-3-ana-ruiz.webp", title: peauDaneFaceTitle(3) },
        { src: "img/Icone/visage-4-ana-ruiz.webp", title: peauDaneFaceTitle(4) },
        { src: "img/Icone/visage-5-ana-ruiz.webp", title: peauDaneFaceTitle(5) }
      ]
    },
    {
      name: "Peau d’âne (2024)",
      maxSlides: 3,
      slides: [
        { src: "img/PeauDAne/nekem-ana-ruiz.webp", title: "Nekem" },
        { src: "img/PeauDAne/ben-ana-ruiz.webp", title: "Ben" },
        { src: "img/PeauDAne/remine-ana-ruiz.webp", title: "Remine" }
      ]
    },
    {
      name: "La maison ou le pouvoir de rentrer en soi-même (2012)",
      slides: [
        { src: "img/la-maison/maison-sacree.jpg", title: "Maison sacrée" },
        { src: "img/la-maison/maison-floride.jpg", title: "Maison Floride" },
        { src: "img/la-maison/maison-temple.jpg", title: "Maison temple" },
        { src: "img/la-maison/maison-palais-prison.jpg", title: "Maison palais prison" },
        { src: "img/la-maison/maison-de-thyphee.jpg", title: "Maison de Typhée" },
        { src: "img/la-maison/maison-paradis-perdu.jpg", title: "Maison paradis perdu" }
      ]
    },
    {
      name: "Fête des artistes en cartes postales (2009)",
      slides: [
        { src: "img/FeteDesArtistes/gizeh-2009-ana-ruiz.webp", title: "Gizeh" },
        { src: "img/FeteDesArtistes/naples-2009-ana-ruiz.webp", title: "Naples" },
        { src: "img/FeteDesArtistes/nepal-2009-ana-ruiz.webp", title: "Népal" },
        { src: "img/FeteDesArtistes/athenes-2009-ana-ruiz.webp", title: "Athènes" }
      ]
    },
    {
      name: "Sur le sentier du dragonnier (2008)",
      slides: [
        { src: "img/SurLesSentiersDuDragonnier/dragonnier-couverture.jpg", title: "Le sentier de la vie" },
        { src: "img/SurLesSentiersDuDragonnier/le-vieux-dragonnier.jpg", title: "La force du dragonnier" },
        { src: "img/SurLesSentiersDuDragonnier/le-vieux-volcan.jpg", title: "Le vieux volcan" },
        { src: "img/SurLesSentiersDuDragonnier/sable-noir.jpg", title: "Sable noir" },
        { src: "img/SurLesSentiersDuDragonnier/sur-la-terre.jpg", title: "Sur la terre ferme" }
      ]
    },
    {
      name: "Couleurs en nudité (2007)",
      slides: [
        { src: "img/CouleurEnNudite/couleurs-a-nues-2007-ana-ruiz.webp", title: "Couleurs à nues" },
        { src: "img/CouleurEnNudite/el-rayo-de-luna-2007-ana-ruiz.webp", title: "El rayo de luna (100 × 100)" }
      ]
    },
    {
      name: "Angles de vie (2005)",
      slides: [
        { src: "img/AnglesDeVie/angles-de-vie-1-ana-ruiz.webp", title: "Angles de vie I" },
        { src: "img/AnglesDeVie/angles-de-vie-2-ana-ruiz.webp", title: "Angles de vie II" },
        { src: "img/AnglesDeVie/angles-de-vie-3-ana-ruiz.webp", title: "Angles de vie III" },
        { src: "img/AnglesDeVie/angles-de-vie-4-ana-ruiz.webp", title: "Angles de vie IV" }
      ]
    }
  ];

  var sequence = [];
  galleries.forEach(function (g) {
    var maxSlides = (typeof g.maxSlides === 'number') ? g.maxSlides : 4;
    var galleryLabel = g.galleryLabel || g.name;
    sequence.push({ type: 'title', gallery: g.name });
    (g.slides || []).slice(0, maxSlides).forEach(function (s) {
      sequence.push({ type: 'image', gallery: galleryLabel, src: s.src, title: s.title });
    });
  });

  /* Filigrane visible sur l'image du diaporama */
  var stage = imgEl.parentNode;
  var mark = document.createElement('div'); mark.className = 'art-watermark'; mark.setAttribute('aria-hidden', 'true'); mark.textContent = '© Ana Ruiz Llamazares';
  stage.appendChild(mark);
  function placeMark() {
    if (imgEl.style.display === 'none' || !imgEl.getAttribute('src')) { mark.style.opacity = '0'; return; }
    var r = imgEl.getBoundingClientRect(), p = stage.getBoundingClientRect();
    mark.style.left = (r.right - p.left - mark.offsetWidth - 10) + 'px'; mark.style.top = (r.bottom - p.top - mark.offsetHeight - 8) + 'px';
    mark.style.opacity = '1';
  }
  imgEl.addEventListener('load', function () { placeMark(); setTimeout(placeMark, 120); });
  window.addEventListener('resize', placeMark);
  document.addEventListener('fullscreenchange', function () { setTimeout(placeMark, 120); });

  var current = 0;
  var timer = null;
  var intervalMs = 5000;

  function showSlide(index) {
    current = (index + sequence.length) % sequence.length;
    var slide = sequence[current];

    if (slide.type === 'title') {
      titleCard.hidden = false;
      titleCard.textContent = slide.gallery;

      imgEl.style.display = 'none';
      imgEl.removeAttribute('src'); mark.style.opacity = '0';
      imgEl.alt = '';

      galleryEl.textContent = '';
      captionEl.textContent = '';
    } else {
      titleCard.hidden = true;
      titleCard.textContent = '';

      imgEl.style.display = 'block';
      imgEl.src = assetPrefix + slide.src;
      imgEl.alt = slide.title || tr('altFallback');

      galleryEl.textContent = slide.gallery;
      captionEl.textContent = slide.title || '';
    }

    indicatorEl.textContent = (current + 1) + ' / ' + sequence.length;
  }

  function nextSlide() { showSlide(current + 1); }
  function prevSlide() { showSlide(current - 1); }

  var paused = false;
  function startAuto() {
    stopAuto();
    if (paused) return;
    timer = setInterval(nextSlide, intervalMs);
  }

  function stopAuto() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  function resetAuto() {
    stopAuto();
    startAuto();
  }

  prevBtn.addEventListener('click', function () {
    prevSlide();
    resetAuto();
  });

  nextBtn.addEventListener('click', function () {
    nextSlide();
    resetAuto();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prevBtn.click(); }
    if (e.key === 'ArrowRight') { nextBtn.click(); }
  });

  if (sequence.length) {
    showSlide(0);
    startAuto();
  }

  /* --- Pause / reprise du défilement (la musique n'est pas concernée) --- */
  var pauseBtn = document.getElementById('pause-btn');
  function syncPause() {
    if (!pauseBtn) return;
    pauseBtn.textContent = paused ? '▶' : '⏸';
    pauseBtn.title = paused ? tr('play') : tr('pause');
    pauseBtn.setAttribute('aria-label', pauseBtn.title);
    pauseBtn.setAttribute('aria-pressed', paused ? 'true' : 'false');
  }
  if (pauseBtn) {
    syncPause();
    pauseBtn.addEventListener('click', function () { paused = !paused; syncPause(); if (paused) stopAuto(); else startAuto(); });
  }
  document.addEventListener('keydown', function (e) { if (e.key === ' ' && pauseBtn && document.activeElement === document.body) { e.preventDefault(); pauseBtn.click(); } });

  /* --- Plein écran natif du diaporama (comme un lecteur vidéo) --- */
  var container = document.getElementById('diapo-container');
  var fsBtn = document.getElementById('fullscreen-btn');
  var fsExitBtn = document.getElementById('fullscreen-exit');
  function fsElement() { return document.fullscreenElement || document.webkitFullscreenElement || null; }
  function fsSupported() { return !!(container && (container.requestFullscreen || container.webkitRequestFullscreen)); }
  function enterFs() {
    if (!container) return;
    try {
      var r = container.requestFullscreen ? container.requestFullscreen({ navigationUI: 'hide' }) : container.webkitRequestFullscreen();
      if (r && typeof r.catch === 'function') r.catch(function () {});
    } catch (e) {}
  }
  function exitFs() {
    if (!fsElement()) return;
    try {
      var r = document.exitFullscreen ? document.exitFullscreen() : document.webkitExitFullscreen();
      if (r && typeof r.catch === 'function') r.catch(function () {});
    } catch (e) {}
  }
  function syncFs() {
    var on = !!fsElement();
    if (container) container.classList.toggle('is-fullscreen', on);
    if (fsBtn) { fsBtn.title = on ? tr('exitFullscreen') : tr('fullscreen'); fsBtn.setAttribute('aria-label', fsBtn.title); fsBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  }
  if (fsBtn) {
    if (!fsSupported()) { fsBtn.hidden = true; }
    else {
      fsBtn.title = tr('fullscreen'); fsBtn.setAttribute('aria-label', tr('fullscreen'));
      fsBtn.addEventListener('click', function () { fsElement() ? exitFs() : enterFs(); });
    }
  }
  if (fsExitBtn) {
    fsExitBtn.title = tr('exitFullscreen'); fsExitBtn.setAttribute('aria-label', tr('exitFullscreen'));
    fsExitBtn.addEventListener('click', exitFs);
  }
  document.addEventListener('fullscreenchange', syncFs);
  document.addEventListener('webkitfullscreenchange', syncFs);

  var audioBtn = document.getElementById('audio-btn');
  var audioIcon = document.getElementById('audio-icon');
  var diapoAudio = document.getElementById('diapo-audio');
  var audioPlaying = false;

  function setAudioUI(playing) {
    audioPlaying = !!playing;
    if (audioIcon) audioIcon.textContent = audioPlaying ? '⏸️' : '🎵';
    if (audioBtn) {
      audioBtn.setAttribute('aria-pressed', audioPlaying ? 'true' : 'false');
      audioBtn.title = audioPlaying ? tr('audioPause') : tr('audioPlay');
    }
    try { localStorage.setItem('ana-diapo-music', audioPlaying ? 'on' : 'off'); } catch (e) {}
  }

  if (audioBtn && diapoAudio) {
    var pref = null;
    try { pref = localStorage.getItem('ana-diapo-music'); } catch (e) {}

    if (pref === 'on') {
      var pp = diapoAudio.play();
      if (pp && typeof pp.then === 'function') {
        pp.then(function () { setAudioUI(true); }).catch(function () { setAudioUI(false); });
      } else {
        setAudioUI(true);
      }
    } else {
      setAudioUI(false);
    }

    audioBtn.addEventListener('click', function () {
      if (!audioPlaying) {
        var playPromise = diapoAudio.play();
        if (playPromise && typeof playPromise.then === 'function') {
          playPromise.then(function () { setAudioUI(true); }).catch(function () { setAudioUI(false); });
        } else {
          setAudioUI(true);
        }
      } else {
        diapoAudio.pause();
        setAudioUI(false);
      }
    });
  }
});
