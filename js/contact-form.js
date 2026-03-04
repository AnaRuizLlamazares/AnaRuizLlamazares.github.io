/*
  Contact form handler
  - Reads endpoint from window.SITE_CONFIG.CONTACT_FORM_ENDPOINT
  - Submits via fetch() (AJAX) to keep a smooth UX
  - Does not expose any destination email address in the HTML

  Works with providers like Formspree.
*/

(function(){
  function decodeB64(str){
    if(!str) return '';
    try { return atob(str); } catch(e) { return ''; }
  }

  function getEndpoint(){
    try {
      var cfg = window.SITE_CONFIG || {};
      var ep = (cfg.CONTACT_FORM_ENDPOINT || '').trim();

      // If using FormSubmit in "base" form (https://formsubmit.co/ajax/)
      // and the destination email is provided in base64, build the full endpoint.
      if (ep && /formsubmit\.co\/ajax\/?$/i.test(ep) && ep.indexOf('@') === -1){
        // FormSubmit base endpoint needs the destination email appended.
        if (cfg.CONTACT_EMAIL_B64){
          var email = decodeB64(String(cfg.CONTACT_EMAIL_B64).trim());
          if (email){
            if (ep.slice(-1) !== '/') ep += '/';
            ep = ep + email;
          } else {
            // If we can't build the final endpoint, disable the form (handled later).
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
        setStatus(status, form.getAttribute('data-msg-config') || 'Le formulaire est en cours de configuration. Merci de réessayer plus tard.', 'info');
        return;
      }

      form.setAttribute('action', endpoint);
      form.setAttribute('method', 'POST');

      form.addEventListener('submit', function(e){
        e.preventDefault();

        if(submitBtn) submitBtn.disabled = true;
        setStatus(status, form.getAttribute('data-msg-sending') || 'Envoi en cours…', 'info');

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
            throw new Error(msg || 'Erreur lors de l’envoi. Merci de réessayer.');
          });
        })
        .then(function(){
          form.reset();
          setStatus(status, form.getAttribute('data-msg-success') || 'Message envoyé. Merci !', 'ok');
        })
        .catch(function(err){
          setStatus(status, (err && err.message) ? err.message : (form.getAttribute('data-msg-error') || 'Erreur lors de l’envoi. Merci de réessayer.'), 'error');
        })
        .finally(function(){
          if(submitBtn) submitBtn.disabled = false;
        });
      });
    });
  });
})();
