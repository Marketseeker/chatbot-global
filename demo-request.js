/* Demo request: any element with [data-open-demo] opens a small form (service + email).
   The form POSTs JSON to DEMO_WEBHOOK. An automation (n8n) is expected to pick the demo bot
   for that service and email the visitor the code. Optional: data-service="carpet cleaning"
   on the button preselects the service. */
(function () {
  var DEMO_WEBHOOK = window.DEMO_WEBHOOK || 'https://n8n.chatbotglobal.com/webhook/demo-request';
  // Alphabetical, "Other" last. Keep names in sync with the n8n lookup table and 08-Aminos/demo-services.md.
  var SERVICES = [
    'Appliance repair', 'Auto detailing', 'Carpet cleaning', 'Electrical', 'Garage door repair',
    'Handyman', 'House cleaning', 'HVAC', 'Junk removal', 'Landscaping', 'Locksmith', 'Moving',
    'Painting', 'Pest control', 'Plumbing', 'Pool service', 'Roofing', 'Tree service',
    'Water damage restoration', 'Window cleaning & pressure washing', 'Other'
  ];
  // Cloudflare Turnstile (checks the visitor is a person; n8n verifies the token).
  var TURNSTILE_SITEKEY = window.TURNSTILE_SITEKEY || '0x4AAAAAAGCSfBoJVxmaC11c';
  var dlg, form, status, sendBtn, svc, other, otherWrap, email, lastFocus, tsBox, tsId = null, loadedAt;

  function loadTurnstile(cb) {
    if (window.turnstile) return cb();
    window.__demoTsReady = cb;
    var sc = document.createElement('script');
    sc.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__demoTsReady';
    sc.async = true; sc.defer = true;
    document.head.appendChild(sc);
  }
  function renderTurnstile() {
    loadTurnstile(function () {
      if (tsId !== null) { try { window.turnstile.reset(tsId); } catch (_) {} return; }
      tsId = window.turnstile.render(tsBox, { sitekey: TURNSTILE_SITEKEY, size: 'flexible', theme: 'light' });
    });
  }
  function tsToken() { try { return tsId !== null ? (window.turnstile.getResponse(tsId) || '') : ''; } catch (_) { return ''; } }

  var FIELD = 'w-full rounded-xl border border-ink/15 bg-white px-4 py-3 text-[15px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral';

  function build() {
    dlg = document.createElement('dialog');
    dlg.setAttribute('aria-labelledby', 'demo-title');
    dlg.className = 'w-[calc(100%-2rem)] max-w-md rounded-[28px] border border-ink/10 bg-cream-50 p-0 text-ink shadow-floating backdrop:bg-ink/50';
    dlg.innerHTML =
      '<form method="dialog" id="demo-form" class="p-7 sm:p-9" novalidate>' +
        '<div class="flex items-start justify-between gap-4">' +
          '<div><p class="text-[13px] font-semibold uppercase tracking-[.18em] text-coral-600">Free demo</p>' +
          '<h2 id="demo-title" class="font-display mt-2 text-3xl font-semibold tracking-tight">Get a demo by email</h2></div>' +
          '<button type="button" data-demo-close class="-mr-2 -mt-1 rounded-full p-2 text-ink-500 hover:bg-ink/5 hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral active:bg-ink/10" aria-label="Close">' +
            '<svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
        '</div>' +
        '<p class="mt-3 text-ink-500">Tell us your kind of service and where to send it. We email you a link to a generic demo chatbot for that service.</p>' +
        '<label class="mt-6 block text-sm font-semibold" for="demo-service">Your kind of service</label>' +
        '<select id="demo-service" name="service" required class="mt-1.5 ' + FIELD + '">' +
          SERVICES.map(function (s) { return '<option value="' + s + '">' + s + '</option>'; }).join('') +
        '</select>' +
        '<div id="demo-other-wrap" class="mt-4 hidden"><label class="block text-sm font-semibold" for="demo-other">What service?</label>' +
          '<input id="demo-other" name="other" type="text" autocomplete="off" class="mt-1.5 ' + FIELD + '"></div>' +
        '<label class="mt-4 block text-sm font-semibold" for="demo-email">Your email</label>' +
        '<input id="demo-email" name="email" type="email" required autocomplete="email" inputmode="email" class="mt-1.5 ' + FIELD + '" placeholder="you@yourcompany.com">' +
        '<div id="demo-turnstile" class="mt-5"></div>' +
        '<div aria-hidden="true" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap"><label for="demo-fax">Fax number</label><input id="demo-fax" name="fax" type="text" tabindex="-1" autocomplete="off"></div>' +
        '<p id="demo-status" role="status" aria-live="polite" class="mt-4 min-h-[1.5rem] text-sm text-ink-500"></p>' +
        '<button type="submit" id="demo-send" class="spring lift mt-2 inline-flex w-full items-center justify-center rounded-full bg-coral px-7 py-3.5 text-[15px] font-semibold text-ink shadow-coral hover:bg-coral-600 hover:text-cream-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 active:bg-coral-600 disabled:opacity-60">Email me the demo</button>' +
      '</form>';
    document.body.appendChild(dlg);
    form = dlg.querySelector('#demo-form');
    status = dlg.querySelector('#demo-status');
    sendBtn = dlg.querySelector('#demo-send');
    svc = dlg.querySelector('#demo-service');
    other = dlg.querySelector('#demo-other');
    otherWrap = dlg.querySelector('#demo-other-wrap');
    email = dlg.querySelector('#demo-email');
    tsBox = dlg.querySelector('#demo-turnstile');

    svc.addEventListener('change', function () {
      var isOther = svc.value === 'Other';
      otherWrap.classList.toggle('hidden', !isOther);
      if (isOther) other.focus();
    });
    dlg.querySelector('[data-demo-close]').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', function () { if (lastFocus && lastFocus.focus) lastFocus.focus(); });
    form.addEventListener('submit', submit);
  }

  function say(msg, bad) {
    status.textContent = msg;
    status.className = 'mt-4 min-h-[1.5rem] text-sm ' + (bad ? 'text-coral-600 font-semibold' : 'text-ink-500');
  }

  function submit(e) {
    e.preventDefault();
    var addr = email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) { say('Please enter a valid email address.', true); email.focus(); return; }
    var service = svc.value === 'Other' ? other.value.trim() : svc.value;
    if (!service) { say('Please tell us your kind of service.', true); other.focus(); return; }
    var token = tsToken();
    if (!token) { say('One moment: we’re checking that you’re a person. Please try again in a few seconds.', true); return; }
    sendBtn.disabled = true; say('Sending…');
    fetch(DEMO_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: addr, service: service, page: location.pathname, requestedAt: new Date().toISOString(),
        fax: dlg.querySelector('#demo-fax').value, elapsedMs: Date.now() - loadedAt, turnstileToken: token })
    }).then(function (r) {
      if (r.status === 403) { var err = new Error('check'); err.check = true; throw err; }
      if (!r.ok) throw new Error('bad status ' + r.status);
      form.reset(); otherWrap.classList.add('hidden');
      say('Done. Check your email for your demo. If it doesn’t show up in a few minutes, look in your spam folder.');
      if (typeof gtag === 'function') gtag('event', 'demo_request', { service: service });
    }).catch(function (err) {
      say(err && err.check ? 'The security check didn’t go through. Please try sending again.' : 'Sorry, that didn’t go through. Please try again in a moment.', true);
    }).then(function () {
      sendBtn.disabled = false;
      renderTurnstile(); // tokens work once; get a fresh one for the next send
    });
  }

  function open(btn) {
    if (!dlg) build();
    lastFocus = btn;
    var pre = btn && btn.getAttribute('data-service');
    if (pre) {
      for (var i = 0; i < svc.options.length; i++) {
        if (svc.options[i].value.toLowerCase() === pre.toLowerCase()) { svc.selectedIndex = i; break; }
      }
      svc.dispatchEvent(new Event('change'));
    }
    status.textContent = '';
    loadedAt = Date.now();
    renderTurnstile();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    email.focus();
  }

  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-open-demo]');
    if (b) { e.preventDefault(); open(b); }
  });
})();
