/* Custom demo form: any <form data-custom-demo> (optionally data-service="HVAC") posts the visitor's
   website, name and email to the n8n workflow "Custom Demo Request → Queue + Alert Owner"
   (webhook /custom-demo). It logs a New row to the Demo Requests tab and emails the owner, who has
   Claude build a private demo bot from that website (08-Aminos/demo-bots/CUSTOM-DEMO-PROCEDURE.md).
   Form markup needs: inputs named website, name, email, fax (honeypot); [data-cd-ts] (Turnstile box),
   [data-cd-status] (message line), [data-cd-send] (submit button).
   The workflow must be published for the form to work. */
(function () {
  var HOOK = window.CUSTOM_DEMO_WEBHOOK || 'https://n8n.chatbotglobal.com/webhook/custom-demo';
  var KEY = window.TURNSTILE_SITEKEY || '0x4AAAAAAGCSfBoJVxmaC11c';
  var forms = document.querySelectorAll('form[data-custom-demo]');
  if (!forms.length) return;

  function loadTurnstile(cb) {
    if (window.turnstile) return cb();
    var waiting = window.__cdTsQueue = window.__cdTsQueue || [];
    waiting.push(cb);
    if (window.__cdTsLoading) return;
    window.__cdTsLoading = true;
    window.__cdTsReady = function () { waiting.splice(0).forEach(function (f) { f(); }); };
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__cdTsReady';
    s.async = true; s.defer = true;
    document.head.appendChild(s);
  }

  Array.prototype.forEach.call(forms, function (form) {
    var box = form.querySelector('[data-cd-ts]'), st = form.querySelector('[data-cd-status]'), btn = form.querySelector('[data-cd-send]');
    var service = form.getAttribute('data-service') || 'Other';
    function pickService() { return (form.elements.service && form.elements.service.value) || service; }
    var tsId = null, loadedAt = Date.now(), started = false;

    function say(m, bad) { st.textContent = m; st.className = 'mt-4 min-h-[1.5rem] text-sm ' + (bad ? 'font-semibold text-coral-600' : 'text-ink-500'); }
    function tok() { try { return tsId !== null ? (window.turnstile.getResponse(tsId) || '') : ''; } catch (_) { return ''; } }
    function render() {
      loadTurnstile(function () {
        if (tsId !== null) { try { window.turnstile.reset(tsId); } catch (_) {} return; }
        tsId = window.turnstile.render(box, { sitekey: KEY, size: 'flexible', theme: 'light' });
      });
    }
    // Load the security check when the visitor first touches the form, not on page load (keeps pages fast).
    form.addEventListener('focusin', function () { if (!started) { started = true; loadedAt = Date.now(); render(); } });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var site = form.website.value.trim(), name = form.name.value.trim(), email = form.email.value.trim().toLowerCase();
      if (!/^\S+\.\S+$/.test(site)) { say('Please enter your website, for example yourbusiness.com.', true); form.website.focus(); return; }
      if (!name) { say('Please enter your name.', true); form.name.focus(); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { say('Please enter a valid email address.', true); form.email.focus(); return; }
      var t = tok();
      if (!t) { if (!started) { started = true; render(); } say('One moment: we’re checking that you’re a person. Please try again in a few seconds.', true); return; }
      btn.disabled = true; say('Sending…');
      fetch(HOOK, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
        requestType: 'custom-demo', name: name, email: email, business: site, website: site, service: pickService(), canEdit: 'not sure',
        phone: '', smsConsent: false, smsConsentText: '', gbp: '', leadEmail: '',
        notes: 'CUSTOM DEMO REQUEST. Build a private demo bot trained on this website and email the link. Not a sign-up.',
        page: location.pathname, requestedAt: new Date().toISOString(), fax: form.fax.value,
        elapsedMs: Date.now() - loadedAt, turnstileToken: t })
      }).then(function (r) {
        if (r.status === 403) { var x = new Error('check'); x.check = true; throw x; }
        if (!r.ok) throw new Error('status ' + r.status);
        form.reset();
        say('Got it. We’ll build your private demo and email the link to ' + email + '. Check your spam folder if it doesn’t show up.');
        if (typeof gtag === 'function') gtag('event', 'custom_demo_request', { service: pickService() });
      }).catch(function (err) {
        say(err && err.check ? 'The security check didn’t go through. Please try sending again.' : 'Sorry, that didn’t go through. Please try again in a moment.', true);
      }).then(function () { btn.disabled = false; render(); });
    });
  });
})();
