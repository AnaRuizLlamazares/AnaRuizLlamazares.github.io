/* Lightbox des œuvres (version consolidée, i18n). Le volet de présentation est en HTML natif (<details class="intro-panel">), voir js/navbar-load.js pour son bouton « Replier ». */
(function(){
  function siteLang(){
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.indexOf('en') === 0) return 'en';
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('de') === 0) return 'de';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'fr';
  }

  var I18N = {
    fr: { close: 'Fermer', zoom: 'Agrandir l’œuvre' },
    en: { close: 'Close', zoom: 'Open artwork full size' },
    es: { close: 'Cerrar', zoom: 'Abrir la obra en gran formato' },
    de: { close: 'Schließen', zoom: 'Werk vergrößern' },
    zh: { close: '关闭', zoom: '放大查看作品' }
  };

  function tr(key){
    var lang = siteLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  function lightboxMarkup(){
    return `<div id="lightbox" class="lightbox-overlay" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="lightbox-frame">
        <button id="lightbox-close" type="button" aria-label="${tr('close')}" title="${tr('close')}">✕</button>
        <div class="lightbox-inner">
          <img id="lightbox-img" alt="">
        </div>
      </div>
    </div>`;
  }

  function ensureLightbox(){
    var existing = document.getElementById('lightbox');
    if(existing){
      var complete = existing.classList.contains('lightbox-overlay')
        && existing.querySelector('.lightbox-frame')
        && existing.querySelector('.lightbox-inner')
        && existing.querySelector('#lightbox-img')
        && existing.querySelector('#lightbox-close');

      if(!complete){
        existing.outerHTML = lightboxMarkup();
      } else {
        var close = existing.querySelector('#lightbox-close');
        if(close){
          close.setAttribute('aria-label', tr('close'));
          close.setAttribute('title', tr('close'));
          if(!close.getAttribute('type')) close.setAttribute('type', 'button');
        }
      }
      return;
    }

    const wrap=document.createElement('div');
    wrap.innerHTML=lightboxMarkup();
    document.body.appendChild(wrap.firstElementChild);
  }

  let box,img,closeBtn,mark;
  /* Filigrane visible : « © Ana Ruiz Llamazares » dans le coin de l'image */
  function ensureMark(){
    if(mark) return mark;
    mark=document.createElement('div'); mark.className='art-watermark'; mark.setAttribute('aria-hidden','true'); mark.textContent='© Ana Ruiz Llamazares';
    (box.querySelector('.lightbox-inner')||box).appendChild(mark); return mark;
  }
  function placeMark(){
    if(!mark||!img||!box.classList.contains('open')) return;
    var r=img.getBoundingClientRect(), p=mark.offsetParent?mark.offsetParent.getBoundingClientRect():{left:0,top:0};
    mark.style.left=(r.right-p.left-mark.offsetWidth-10)+'px'; mark.style.top=(r.bottom-p.top-mark.offsetHeight-8)+'px';
    mark.style.opacity='1';
  }
  window.addEventListener('resize',placeMark);
  document.addEventListener('fullscreenchange',function(){ setTimeout(placeMark,80); });
  const BLANK='data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  let loading=false,savedPad='',aborted=false;

  function initLightbox(){
    ensureLightbox();
    box=document.getElementById('lightbox');
    img=document.getElementById('lightbox-img');
    closeBtn=document.getElementById('lightbox-close');
    if(!box||!img||!closeBtn) return;
    closeBtn.addEventListener('click',e=>{e.stopPropagation();close();});
    box.addEventListener('click',e=>{if(e.target===box)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&box.classList.contains('open'))close();});
  }

  /* Plein écran natif (barre d'adresse et onglets masqués), si le navigateur le permet */
  function fsElement(){ return document.fullscreenElement||document.webkitFullscreenElement||null; }
  function enterFullscreen(){
    var el=document.documentElement;
    try{
      var r=el.requestFullscreen?el.requestFullscreen({navigationUI:'hide'}):(el.webkitRequestFullscreen?el.webkitRequestFullscreen():null);
      if(r&&typeof r.catch==='function') r.catch(function(){});
    }catch(e){}
  }
  function exitFullscreen(){
    if(!fsElement()) return;
    try{
      var r=document.exitFullscreen?document.exitFullscreen():(document.webkitExitFullscreen?document.webkitExitFullscreen():null);
      if(r&&typeof r.catch==='function') r.catch(function(){});
    }catch(e){}
  }
  function onFsChange(){
    /* Sortie du plein écran par le navigateur (Échap, geste) : on referme le zoom */
    if(!fsElement()&&box&&box.classList.contains('open')) close(true);
  }
  document.addEventListener('fullscreenchange',onFsChange);
  document.addEventListener('webkitfullscreenchange',onFsChange);

  function open(src,alt){
    if(loading) return;
    loading=true; aborted=false;
    enterFullscreen();
    savedPad=document.body.style.paddingTop||'';
    document.body.style.paddingTop='0';
    img.classList.remove('ready');
    const loader=new Image();
    loader.onload=function(){
      if(aborted) return;
      img.src=src; img.alt=alt||'';
      ensureMark(); mark.style.opacity='0';
      requestAnimationFrame(()=>{img.classList.add('ready'); setTimeout(placeMark,60); setTimeout(placeMark,350);});
      box.classList.add('open');
      box.setAttribute('aria-hidden','false');
      document.body.classList.add('lb-open');
      closeBtn.focus();
      loading=false;
    };
    loader.onerror=function(){
      loading=false;
      if(aborted) return;
      console.warn('Image load failed:',src);
    };
    loader.src=src;
  }

  function close(fromBrowser){
    aborted=true;
    if(!fromBrowser) exitFullscreen();
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
    document.body.style.paddingTop=savedPad;
    img.classList.remove('ready');
    if(mark) mark.style.opacity='0';
    setTimeout(()=>{img.src=BLANK;},150);
  }

  function enhanceThumbnails(){
    document.querySelectorAll('.gallery-work').forEach(w=>{
      const pic=w.querySelector('img');
      if(!pic) return;

      if(!pic.dataset.lbBound){
        pic.dataset.lbBound = '1';
        pic.style.cursor = 'zoom-in';
        pic.addEventListener('click', ()=>{
          const src=pic.getAttribute('data-large')||pic.src;
          open(src,pic.alt||'');
        });
      }

      if(!w.querySelector('.zoom-btn')){
        const b=document.createElement('button');
        b.type='button';
        b.className='zoom-btn';
        b.textContent='+';
        b.setAttribute('aria-label', tr('zoom'));
        b.title = tr('zoom');
        b.addEventListener('click',e=>{
          e.stopPropagation();
          const src=pic.getAttribute('data-large')||pic.src;
          open(src,pic.alt||'');
        });
        w.appendChild(b);
      }

      if(!pic.hasAttribute('tabindex')) pic.tabIndex=0;
      if(!pic.dataset.lbKeyBound){
        pic.dataset.lbKeyBound = '1';
        pic.addEventListener('keydown',e=>{
          if(e.key==='Enter'||e.key===' '){
            e.preventDefault();
            open(pic.getAttribute('data-large')||pic.src,pic.alt||'');
          }
        });
      }
    });
  }

  /* Appel direct depuis une page (ex. Publications : onclick="openLightbox('...')") */
  window.openLightbox=function(src,alt){ if(!box) initLightbox(); if(box) open(src,alt||''); };
  window.closeLightbox=function(){ if(box) close(); };

  document.addEventListener('DOMContentLoaded',()=>{
    initLightbox();
    enhanceThumbnails();
  });
})();
