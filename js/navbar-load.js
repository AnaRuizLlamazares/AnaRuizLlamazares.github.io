/*
  Global script for Ana Ruiz site
  - Mobile menu (hamburger)
  - Light / Dark theme (default: light cream)
  - Computes real navbar height -> CSS var --site-nav-offset
  - Language switcher (flags in the navbar)

  Goal: reliable behaviour even when opened locally (no fetch).
*/

(function () {
  // --- i18n helpers (tiny) ---
  function siteLang() {
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.indexOf('en') === 0) return 'en';
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'fr';
  }

  var I18N = {
    fr: {
      themeLabelDark: 'Fond sombre (cliquer pour passer en clair)',
      themeLabelLight: 'Fond clair (cliquer pour passer en sombre)',
      themeTitleDark: 'Fond sombre',
      themeTitleLight: 'Fond clair',
      langSwitcherLabel: 'Choisir la langue'
    },
    en: {
      themeLabelDark: 'Dark background (click to switch to light)',
      themeLabelLight: 'Light background (click to switch to dark)',
      themeTitleDark: 'Dark theme',
      themeTitleLight: 'Light theme',
      langSwitcherLabel: 'Choose language'
    },
    es: {
      themeLabelDark: 'Fondo oscuro (clic para pasar a claro)',
      themeLabelLight: 'Fondo claro (clic para pasar a oscuro)',
      themeTitleDark: 'Tema oscuro',
      themeTitleLight: 'Tema claro',
      langSwitcherLabel: 'Elegir idioma'
    },
    zh: {
      themeLabelDark: '深色背景（点击切换为浅色）',
      themeLabelLight: '浅色背景（点击切换为深色）',
      themeTitleDark: '深色模式',
      themeTitleLight: '浅色模式',
      langSwitcherLabel: '选择语言'
    }
  };

  function tr(key) {
    var l = siteLang();
    return (I18N[l] && I18N[l][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  // --- Theme: apply as early as possible (avoids flash) ---
  try {
    var stored = localStorage.getItem('ana-theme');
    if (stored === 'dark' || stored === 'light') {
      document.documentElement.setAttribute('data-theme', stored);
    } else if (!document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  } catch (e) {
    if (!document.documentElement.getAttribute('data-theme')) {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }

  function setNavOffset() {
    var nav = document.querySelector('nav.navbar');
    if (!nav) return;
    var h = Math.ceil((nav.getBoundingClientRect && nav.getBoundingClientRect().height) || nav.offsetHeight || 0);
    if (h > 0) {
      document.documentElement.style.setProperty('--site-nav-offset', h + 'px');
    }
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  function updateThemeButton(btn) {
    if (!btn) return;
    var icon = btn.querySelector('.theme-icon') || btn;
    var dark = currentTheme() === 'dark';
    if (icon) icon.textContent = dark ? '☾' : '☀︎';
    btn.setAttribute('aria-label', dark ? tr('themeLabelDark') : tr('themeLabelLight'));
    btn.title = dark ? tr('themeTitleDark') : tr('themeTitleLight');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('ana-theme', theme); } catch (e) {}
  }

  // --- Language switcher (flags) ---
  function currentPageFile() {
    var path = (window.location && window.location.pathname) ? window.location.pathname : '';
    var parts = path.split('/').filter(Boolean);
    var file = parts.length ? parts[parts.length - 1] : 'index.html';
    // If we are on a directory URL without a filename, fallback to index.html
    if (file.indexOf('.') === -1) file = 'index.html';
    return file;
  }

  function currentLangFromPath() {
    var path = (window.location && window.location.pathname) ? window.location.pathname : '';
    var m = path.match(/\/((en|es|zh))\//);
    if (m && m[1]) return m[1];
    return 'fr';
  }

  function buildLangHref(targetLang) {
    var file = currentPageFile();
    var current = currentLangFromPath();

    if (targetLang === current) return file;

    // Target French = root
    if (targetLang === 'fr') {
      return (current === 'fr') ? file : ('../' + file);
    }

    // Target en/es/zh
    if (current === 'fr') return targetLang + '/' + file;
    return '../' + targetLang + '/' + file;
  }

  function setupLanguageLinks() {
    var switcher = document.querySelector('.lang-switcher');
    if (switcher) {
      // accessibility only (no visible text)
      if (!switcher.getAttribute('aria-label')) {
        switcher.setAttribute('aria-label', tr('langSwitcherLabel'));
      }
    }

    var links = document.querySelectorAll('.lang-link[data-lang]');
    if (!links || !links.length) return;

    var current = currentLangFromPath();

    links.forEach(function (a) {
      var target = a.getAttribute('data-lang');
      if (!target) return;

      a.setAttribute('href', buildLangHref(target));

      if (target === current) {
        a.classList.add('active');
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    // --- MOBILE MENU ---
    var nav = document.querySelector('nav.navbar');
    var menuBtn = document.getElementById('menu-toggle');
    var navLinks = document.querySelector('.nav-links');
    var navContainer = document.querySelector('.navbar-container');
    var navLogo = document.querySelector('.nav-logo');
    var navActions = document.querySelector('.nav-actions');

    // Some viewports (or font loading) can make the first item (e.g. "Accueil") look truncated.
    // We force the hamburger layout when the menu doesn't fit.
    function updateNavMode(){
      try{
        // CSS breakpoint already handles <= 1100px
        if (window.matchMedia('(max-width:1100px)').matches){
          document.documentElement.classList.remove('nav-force-hamburger');
          return;
        }

        if(!navLinks || !navContainer) return;

        // Temporarily remove forced mode so we can measure the real width need
        var had = document.documentElement.classList.contains('nav-force-hamburger');
        if (had) document.documentElement.classList.remove('nav-force-hamburger');

        // Ensure the list is measurable even if another rule hid it
        var prevInlineDisplay = navLinks.style.display;
        var computed = window.getComputedStyle(navLinks);
        if (computed.display === 'none') navLinks.style.display = 'flex';

        var containerW = navContainer.getBoundingClientRect().width;
        var logoW = navLogo ? navLogo.getBoundingClientRect().width : 0;
        var actionsW = navActions ? navActions.getBoundingClientRect().width : 0;

        // scrollWidth gives the intrinsic width needed to show all links
        var linksW = navLinks.scrollWidth;
        var needed = logoW + actionsW + linksW + 32; // small safety buffer
        var force = needed > containerW;

        // Restore
        navLinks.style.display = prevInlineDisplay;
        if (had) document.documentElement.classList.add('nav-force-hamburger');

        document.documentElement.classList.toggle('nav-force-hamburger', !!force);
      }catch(e){
        // No-op
      }
    }

    function hamburgerModeActive(){
      return window.matchMedia('(max-width:1100px)').matches || document.documentElement.classList.contains('nav-force-hamburger');
    }

    function isOpen() {
      return navLinks && (navLinks.classList.contains('open') || navLinks.classList.contains('show'));
    }

    function openMenu() {
      if (!navLinks || !menuBtn) return;
      navLinks.classList.add('open');
      navLinks.classList.add('show'); // compat with older styles
      menuBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
    }

    function closeMenu() {
      if (!navLinks || !menuBtn) return;
      navLinks.classList.remove('open');
      navLinks.classList.remove('show');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
    }

    if (menuBtn && navLinks) {
      menuBtn.setAttribute('aria-expanded', 'false');

      menuBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (isOpen()) closeMenu();
        else openMenu();
      });

      // Close after clicking a nav link
      navLinks.addEventListener('click', function (e) {
        var t = e.target;
        if (t && t.tagName === 'A' && isOpen()) closeMenu();
      });

      // Close if click outside (mobile)
      document.addEventListener('click', function (e) {
        // Fermer si on est en mode hamburger (breakpoint ou mode forcé)
        if (!hamburgerModeActive()) return;
        if (!isOpen()) return;
        if (nav && nav.contains(e.target)) return;
        closeMenu();
      });

      // Close with Escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && isOpen()) {
          closeMenu();
          try { menuBtn.focus(); } catch (err) {}
        }
      });

      // Reset on resize
      window.addEventListener('resize', function () {
        closeMenu();
        setNavOffset();
        updateNavMode();
      });
    }

    // --- THEME TOGGLE ---
    var themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
      updateThemeButton(themeBtn);
      themeBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var next = currentTheme() === 'dark' ? 'light' : 'dark';
        setTheme(next);
        updateThemeButton(themeBtn);
      });
    }

    // --- LANGUAGE LINKS (flags) ---
    setupLanguageLinks();

    // --- Simple fade-in ---
    document.querySelectorAll('.fade-in').forEach(function (el) {
      el.classList.add('visible');
    });

    // --- NAV OFFSET ---
    setNavOffset();
    window.addEventListener('load', function () {
      setTimeout(setNavOffset, 60);
      // after fonts/images have settled
      setTimeout(updateNavMode, 120);
    });

    // initial measurement
    updateNavMode();
  });
})();
