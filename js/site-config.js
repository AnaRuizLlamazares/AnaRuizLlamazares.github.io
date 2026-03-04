/*
  Site configuration (client-side)
  --------------------------------
  This file is meant to be edited by the site owner.

  Contact form:
  - To avoid exposing an email address in the HTML source, the contact form posts to a secure form endpoint.
  - Recommended: Formspree (https://formspree.io) or any provider that gives you an HTTPS endpoint WITHOUT your email in the URL.

  IMPORTANT:
  - Replace REPLACE_ME with your real endpoint.
  - Do NOT put the destination email address in the front-end.
*/

window.SITE_CONFIG = window.SITE_CONFIG || {};

/*
  Endpoint du formulaire de contact
  -------------------------------
  Le site étant statique (GitHub Pages), l'envoi doit passer par un service tiers.

  Configuration actuelle : FormSubmit (mode AJAX)
  - Envoie les messages vers la boîte demandée.
  - Endpoint HTTPS.

  NB : si tu changes de fournisseur, remplace simplement l'URL ci-dessous.
*/

// Base endpoint (FormSubmit AJAX). The real destination is built at runtime.
// This keeps the email from appearing as plain text in the HTML.
window.SITE_CONFIG.CONTACT_FORM_ENDPOINT = "https://formsubmit.co/ajax/";

// Destination (base64) — email de réception (encodé pour éviter l'affichage en clair)
// IMPORTANT : destination correcte (anaruizllamazares.com)
window.SITE_CONFIG.CONTACT_EMAIL_B64 = "YXJ0aXN0ZUBhbmFydWl6bGxhbWF6YXJlcy5jb20=";
