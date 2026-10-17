/* Protection des œuvres (dissuasive, pas absolue) :
   - pas de clic droit ni de glisser-déposer sur les images,
   - pas d'appui long « Enregistrer l'image » sur mobile (CSS),
   - impression bloquée (Cmd/Ctrl+P) et page d'impression vide (CSS).
   Une capture d'écran reste toujours possible : voir README, § 4. */
(function () {
  function isImageTarget(t) {
    if (!t || !t.closest) return false;
    return !!(t.closest('img, picture, .lightbox-overlay, .diapo-stage, .mosaic-bg, .gallery-work, .home-works, .home-feature-card, .article-card, .tableau-card, .background-slideshow'));
  }
  document.addEventListener('contextmenu', function (e) { if (isImageTarget(e.target)) e.preventDefault(); }, true);
  document.addEventListener('dragstart', function (e) { if (e.target && e.target.tagName === 'IMG') e.preventDefault(); }, true);
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.metaKey || e.ctrlKey) && (k === 'p' || (k === 's' && e.target && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA'))) { e.preventDefault(); e.stopPropagation(); }
  }, true);
  window.addEventListener('beforeprint', function () { document.documentElement.classList.add('printing'); });
  window.addEventListener('afterprint', function () { document.documentElement.classList.remove('printing'); });
})();
