/*
  Slideshow (v3)
  - Max 4 images per gallery
  - 5 seconds per image
  - Before each gallery: a title card with the gallery name
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

  // --- Language (for small UI strings only) ---
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
      audioPause: 'Mettre en pause la musique'
    },
    en: {
      altFallback: 'Artwork by Ana Ruiz',
      audioPlay: 'Play music',
      audioPause: 'Pause music'
    },
    es: {
      altFallback: 'Obra de Ana Ruiz',
      audioPlay: 'Reproducir música',
      audioPause: 'Pausar música'
    },
    zh: {
      altFallback: 'Ana Ruiz 的作品',
      audioPlay: '播放音乐',
      audioPause: '暂停音乐'
    }
  };

  function tr(key) {
    var l = siteLang();
    return (I18N[l] && I18N[l][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  // --- Assets path prefix (for /en, /es, /zh pages opened locally) ---
  var path = (window.location && window.location.pathname) ? window.location.pathname : '';
  var assetPrefix = /\/((en|es|zh))\//.test(path) ? '../' : '';

  // --- Data: galleries + artworks (max 4 per gallery) ---
  var galleries = [
    {
      name: "Peau d’âne (2025)",
      slides: [
        { src: "img/auMilieuTerre.png", title: "Je me suis assis au milieu de la Terre" }
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

  // --- Flatten sequence with title cards ---
  var sequence = [];
  galleries.forEach(function (g) {
    sequence.push({ type: 'title', gallery: g.name });
    (g.slides || []).slice(0, 4).forEach(function (s) {
      sequence.push({ type: 'image', gallery: g.name, src: s.src, title: s.title });
    });
  });

  var current = 0;
  var timer = null;
  var intervalMs = 5000;

  function showSlide(index) {
    current = (index + sequence.length) % sequence.length;
    var slide = sequence[current];

    if (slide.type === 'title') {
      // Title card for gallery
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

      // Gallery name + artwork title
      galleryEl.textContent = slide.gallery;
      captionEl.textContent = slide.title || '';
    }

    // Simple indicator (position / total)
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

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { prevBtn.click(); }
    if (e.key === 'ArrowRight') { nextBtn.click(); }
  });

  // Init
  if (sequence.length) {
    showSlide(0);
    startAuto();
  }

  // --- Optional music ---
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
    // Restore preference
    var pref = null;
    try { pref = localStorage.getItem('ana-diapo-music'); } catch (e) {}

    if (pref === 'on') {
      // Try autoplay (may be blocked by browser policy)
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
