/*
  Contact form handler
  - Reads endpoint from window.SITE_CONFIG.CONTACT_FORM_ENDPOINT
  - Submits via fetch() (AJAX) to keep a smooth UX
  - Does not expose any destination email address in the HTML
*/

(function(){
  function siteLang(){
    var l = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (l.indexOf('en') === 0) return 'en';
    if (l.indexOf('es') === 0) return 'es';
    if (l.indexOf('zh') === 0) return 'zh';
    return 'fr';
  }

  var I18N = {
    fr: {
      config: 'Le formulaire est en cours de configuration. Merci de réessayer plus tard.',
      sending: 'Envoi en cours…',
      success: 'Message envoyé. Merci !',
      error: 'Erreur lors de l’envoi. Merci de réessayer.'
    },
    en: {
      config: 'The form is being configured. Please try again later.',
      sending: 'Sending…',
      success: 'Message sent. Thank you!',
      error: 'Sending failed. Please try again.'
    },
    es: {
      config: 'El formulario se está configurando. Por favor, inténtalo de nuevo más tarde.',
      sending: 'Enviando…',
      success: 'Mensaje enviado. ¡Gracias!',
      error: 'Error al enviar. Por favor, inténtalo de nuevo.'
    },
    zh: {
      config: '表单正在配置中，请稍后再试。',
      sending: '正在发送…',
      success: '发送成功，谢谢！',
      error: '发送失败，请重试。'
    }
  };

  function tr(key){
    var lang = siteLang();
    return (I18N[lang] && I18N[lang][key]) || (I18N.fr && I18N.fr[key]) || '';
  }

  function decodeB64(str){
    if(!str) return '';
    try { return atob(str); } catch(e) { return ''; }
  }

  function getEndpoint(){
    try {
      var cfg = window.SITE_CONFIG || {};
      var ep = (cfg.CONTACT_FORM_ENDPOINT || '').trim();

      if (ep && /formsubmit\.co\/ajax\/?$/i.test(ep) && ep.indexOf('@') === -1){
        if (cfg.CONTACT_EMAIL_B64){
          var email = decodeB64(String(cfg.CONTACT_EMAIL_B64).trim());
          if (email){
            if (ep.slice(-1) !== '/') ep += '/';
            ep = ep + email;
          } else {
            return '';
          }
        }
      }
      return ep;
    } catch(e){
      return '';
    }
  }

  function isValidEndpoint(ep){
    if(!ep) return false;
    if(ep.indexOf('REPLACE_ME') !== -1) return false;
    if(!/^https:\/\//i.test(ep)) return false;
    return true;
  }

  function setStatus(el, msg, kind){
    if(!el) return;
    el.textContent = msg || '';
    el.classList.remove('ok','error','info');
    if(kind) el.classList.add(kind);
  }

  document.addEventListener('DOMContentLoaded', function(){
    var forms = document.querySelectorAll('form[data-contact-form]');
    if(!forms || !forms.length) return;

    forms.forEach(function(form){
      var status = form.querySelector('.form-status');
      var submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');

      var endpoint = getEndpoint();
      if(!isValidEndpoint(endpoint)){
        if(submitBtn) submitBtn.disabled = true;
        setStatus(status, form.getAttribute('data-msg-config') || tr('config'), 'info');
        return;
      }

      form.setAttribute('action', endpoint);
      form.setAttribute('method', 'POST');

      form.addEventListener('submit', function(e){
        e.preventDefault();

        if(submitBtn) submitBtn.disabled = true;
        setStatus(status, form.getAttribute('data-msg-sending') || tr('sending'), 'info');

        var data = new FormData(form);

        fetch(endpoint, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        })
        .then(function(res){
          if(res.ok) return res.json().catch(function(){ return {}; });
          return res.json().catch(function(){ return null; }).then(function(payload){
            var msg = null;
            if(payload && payload.errors && payload.errors.length && payload.errors[0].message){
              msg = payload.errors[0].message;
            }
            throw new Error(msg || (form.getAttribute('data-msg-error') || tr('error')));
          });
        })
        .then(function(){
          form.reset();
          setStatus(status, form.getAttribute('data-msg-success') || tr('success'), 'ok');
        })
        .catch(function(err){
          setStatus(status, (err && err.message) ? err.message : (form.getAttribute('data-msg-error') || tr('error')), 'error');
        })
        .finally(function(){
          if(submitBtn) submitBtn.disabled = false;
        });
      });
    });
  });
})();
