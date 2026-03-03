/* Lightbox + description global (version consolidée) */
(function(){
  function ensureLightbox(){
    if(document.getElementById('lightbox')) return;
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div id="lightbox" class="lightbox-overlay" aria-hidden="true" role="dialog" aria-modal="true">
      <div class="lightbox-frame">
        <button id="lightbox-close" aria-label="Fermer">✕</button>
        <div class="lightbox-inner">
          <img id="lightbox-img" alt="">
        </div>
      </div>
    </div>`;
    document.body.appendChild(wrap.firstElementChild);
  }
  let box,img,closeBtn;
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
  function open(src,alt){
    if(loading) return;
    loading=true; aborted=false;
    savedPad=document.body.style.paddingTop||'';
    document.body.style.paddingTop='0';
    img.classList.remove('ready');
    const loader=new Image();
    loader.onload=function(){
      if(aborted) return;
      img.src=src; img.alt=alt||'';
      requestAnimationFrame(()=>img.classList.add('ready'));
      box.classList.add('open');
      box.setAttribute('aria-hidden','false');
      document.body.classList.add('lb-open');
      closeBtn.focus();
      loading=false;
    };
    loader.onerror=function(){loading=false;if(aborted)return;console.warn('Échec image:',src);};
    loader.src=src;
  }
  function close(){
    aborted=true;
    box.classList.remove('open');
    box.setAttribute('aria-hidden','true');
    document.body.classList.remove('lb-open');
    document.body.style.paddingTop=savedPad;
    img.classList.remove('ready');
    setTimeout(()=>{img.src=BLANK;},150);
  }
  function enhanceThumbnails(){
    document.querySelectorAll('.gallery-work').forEach(w=>{
      const pic=w.querySelector('img'); if(!pic) return;
      if(!w.querySelector('.zoom-btn')){
        const b=document.createElement('button');
        b.type='button'; b.className='zoom-btn'; b.textContent='+';
        b.addEventListener('click',e=>{
          e.stopPropagation();
          const src=pic.getAttribute('data-large')||pic.src;
          open(src,pic.alt||'');
        });
        w.appendChild(b);
      }
      if(!pic.hasAttribute('tabindex')) pic.tabIndex=0;
      pic.addEventListener('keydown',e=>{
        if(e.key==='Enter'||e.key===' '){
          e.preventDefault();
          open(pic.getAttribute('data-large')||pic.src,pic.alt||'');
        }
      });
    });
  }
  function initDescription(){
    const trigger=document.getElementById('gallery-desc');
    const panel=document.getElementById('gallery-desc-full');
    const closeB=document.getElementById('gallery-desc-close');
    if(!trigger||!panel) return;
    function openDesc(){
      panel.style.display='block';
      requestAnimationFrame(()=>{
        panel.classList.add('open');
        panel.setAttribute('aria-hidden','false');
        trigger.setAttribute('aria-expanded','true');
        closeB&&closeB.focus();
      });
    }
    function closeDesc(){
      panel.classList.remove('open');
      panel.setAttribute('aria-hidden','true');
      trigger.setAttribute('aria-expanded','false');
      setTimeout(()=>{panel.style.display='none'; trigger.focus();},200);
    }
    function toggle(){panel.classList.contains('open')?closeDesc():openDesc();}
    trigger.addEventListener('click',e=>{e.preventDefault();toggle();});
    trigger.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}
    });
    closeB&&closeB.addEventListener('click',e=>{e.stopPropagation();closeDesc();});
    closeB&&closeB.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){e.preventDefault();closeDesc();}
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    initLightbox();
    enhanceThumbnails();
    initDescription();
  });
})();