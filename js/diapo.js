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
      garmentLabel: 'Vêtement'
    },
    en: {
      altFallback: 'Artwork by Ana Ruiz',
      audioPlay: 'Play music',
      audioPause: 'Pause music',
      facesSection: 'Faces',
      garmentsSection: 'Garments',
      faceLabel: 'Face',
      garmentLabel: 'Garment'
    },
    es: {
      altFallback: 'Obra de Ana Ruiz',
      audioPlay: 'Reproducir música',
      audioPause: 'Pausar música',
      facesSection: 'Rostros',
      garmentsSection: 'Prendas',
      faceLabel: 'Rostro',
      garmentLabel: 'Prenda'
    },
    zh: {
      altFallback: 'Ana Ruiz 的作品',
      audioPlay: '播放音乐',
      audioPause: '暂停音乐',
      facesSection: '面孔',
      garmentsSection: '服饰',
      faceLabel: '面孔',
      garmentLabel: '服饰'
    }
  };

  function tr(key) {
    var l = siteLang();
    return (I18N[l] && I18N[l][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  function peauDaneSectionTitle(sectionKey) {
    return "Peau d’âne (2025) — " + tr(sectionKey);
  }

  function peauDaneFaceTitle(index) {
    return tr('faceLabel') + ' ' + index;
  }

  function peauDaneGarmentTitle(index) {
    return tr('garmentLabel') + ' ' + index;
  }

  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var assetPrefix = /\/((en|es|zh))\//.test(path) ? '../' : '';

  var galleries = [
    {
      name: peauDaneSectionTitle('facesSection'),
      galleryLabel: "Peau d’âne (2025)",
      maxSlides: 5,
      slides: [
        { src: "img/PeauDAne/peau-dane-visage-1-ana-ruiz.webp", title: peauDaneFaceTitle(1) },
        { src: "img/PeauDAne/peau-dane-visage-2-ana-ruiz.webp", title: peauDaneFaceTitle(2) },
        { src: "img/PeauDAne/peau-dane-visage-3-ana-ruiz.webp", title: peauDaneFaceTitle(3) },
        { src: "img/PeauDAne/peau-dane-visage-4-ana-ruiz.webp", title: peauDaneFaceTitle(4) },
        { src: "img/PeauDAne/peau-dane-visage-5-ana-ruiz.webp", title: peauDaneFaceTitle(5) }
      ]
    },
    {
      name: peauDaneSectionTitle('garmentsSection'),
      galleryLabel: "Peau d’âne (2025)",
      maxSlides: 6,
      slides: [
        { src: "img/PeauDAne/peau-dane-vetement-1-ana-ruiz.webp", title: peauDaneGarmentTitle(1) },
        { src: "img/PeauDAne/peau-dane-vetement-2-ana-ruiz.webp", title: peauDaneGarmentTitle(2) },
        { src: "img/PeauDAne/peau-dane-vetement-3-ana-ruiz.webp", title: peauDaneGarmentTitle(3) },
        { src: "img/PeauDAne/peau-dane-vetement-4-ana-ruiz.webp", title: peauDaneGarmentTitle(4) },
        { src: "img/PeauDAne/peau-dane-vetement-5-ana-ruiz.webp", title: peauDaneGarmentTitle(5) },
        { src: "img/PeauDAne/peau-dane-vetement-6-ana-ruiz.webp", title: peauDaneGarmentTitle(6) }
      ]
    },
    {
      name: "La maison ou le pouvoir de rentrer en soi-même (2012)",
      slides: [
        { src: "img/la-maison/maison-sacree.jpg", title: "Maison sacrée" },
        { src: "img/la-maison/maison-floride.jpg", title: "Maison Floride" },
        { src: "img/la-maison/maison-temple.jpg", title: "Maison temple" },
        { src: "img/la-maison/maison-palais-prison.jpg", title: "Maison palais prison" }
      ]
    },
    {
      name: "Sur le sentier du dragonnier (2008)",
      slides: [
        { src: "img/dragonnier-couverture.jpg", title: "Dragonnier couverture" },
        { src: "img/le-vieux-dragonnier.jpg", title: "Le vieux dragonnier" },
        { src: "img/le-vieux-volcan.jpg", title: "Le vieux volcan" },
        { src: "img/au-dessous-du-volcan.jpg", title: "Au-dessous du volcan" }
      ]
    },
    {
      name: "Couleurs en nudité (2007)",
      slides: [
        { src: "img/dragonnier-couverture.jpg", title: "Couverture Dragonnier" },
        { src: "img/le-vieux-dragonnier.jpg", title: "Le vieux dragonnier" },
        { src: "img/le-vieux-volcan.jpg", title: "Le vieux volcan" },
        { src: "img/au-dessous-du-volcan.jpg", title: "Au-dessous du volcan" }
      ]
    },
    {
      name: "Fête des artistes (2009)",
      slides: [
        { src: "img/dragonnier-couverture.jpg", title: "Couverture Dragonnier" },
        { src: "img/le-vieux-dragonnier.jpg", title: "Le vieux dragonnier" }
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
      imgEl.removeAttribute('src');
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

  function startAuto() {
    stopAuto();
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
