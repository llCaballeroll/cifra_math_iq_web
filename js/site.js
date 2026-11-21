// Cifra: Math IQ — tiendas, descarga inteligente, idioma, mini acertijo y animaciones.
(function () {
  // Enlaces de las tiendas (publicada en ambas).
  var IOS_URL = 'https://apps.apple.com/app/id6834884097';
  var ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.luiscaballero.cifra';

  var doc = document.documentElement;
  var isEN = (doc.lang || '').toLowerCase().indexOf('en') === 0;
  var ua = navigator.userAgent || '';
  var isAndroid = /android/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function store(key, val) {
    try { if (val === undefined) return localStorage.getItem(key); localStorage.setItem(key, val); } catch (e) { return null; }
  }

  // ---- Botones de tienda ----
  document.querySelectorAll('[data-store]').forEach(function (a) {
    a.href = a.getAttribute('data-store') === 'ios' ? IOS_URL : ANDROID_URL;
    a.target = '_blank';
    a.rel = 'noopener';
  });

  // En el teléfono, la tienda que le toca va primero y resaltada.
  var mineKey = isIOS ? 'ios' : (isAndroid ? 'android' : '');
  if (mineKey) {
    document.querySelectorAll('.badges').forEach(function (row) {
      var a = row.querySelector('[data-store="' + mineKey + '"]');
      if (a) { row.insertBefore(a, row.firstChild); a.classList.add('mine'); }
    });
  }

  // "Descargar" de la barra: directo a la tienda del teléfono; en computadora baja a la sección.
  document.querySelectorAll('[data-smart-download]').forEach(function (btn) {
    var url = isIOS ? IOS_URL : (isAndroid ? ANDROID_URL : '');
    if (url) { btn.href = url; btn.target = '_blank'; btn.rel = 'noopener'; }
  });

  // ---- Idioma: recordar la elección y sugerir el otro idioma si el navegador lo pide ----
  document.querySelectorAll('[data-lang-link]').forEach(function (a) {
    a.addEventListener('click', function () { store('cifra-lang', a.getAttribute('data-lang-link')); });
  });
  var bar = document.querySelector('[data-lang-bar]');
  if (bar) {
    var langs = (navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || '']).map(function (l) { return String(l).toLowerCase(); });
    var wantsES = langs.some(function (l) { return l.indexOf('es') === 0; });
    var chosen = store('cifra-lang');
    var suggest = !chosen && (isEN ? (langs[0] || '').indexOf('es') === 0 : !wantsES);
    if (suggest) {
      bar.hidden = false;
      var close = bar.querySelector('button');
      if (close) close.addEventListener('click', function () {
        bar.hidden = true; store('cifra-lang', isEN ? 'en' : 'es');
      });
    }
  }

  // ---- Mini acertijo ----
  document.querySelectorAll('[data-try]').forEach(function (box) {
    var form = box.querySelector('form');
    var input = box.querySelector('input');
    var out = box.querySelector('.result');
    var answer = box.getAttribute('data-answer');
    var hintBtn = box.querySelector('[data-hint]');
    var tries = 0;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = (input.value || '').trim();
      if (!v) { input.focus(); return; }
      box.classList.remove('shake');
      if (v === answer) {
        box.classList.add('solved');
        out.className = 'result ok';
        out.textContent = box.getAttribute(tries === 0 ? 'data-ok3' : 'data-ok');
        input.readOnly = true;
      } else {
        tries++;
        void box.offsetWidth;
        box.classList.add('shake');
        out.className = 'result no';
        out.textContent = box.getAttribute('data-no');
      }
    });
    if (hintBtn) hintBtn.addEventListener('click', function () {
      out.className = 'result';
      out.textContent = box.getAttribute('data-hint-text');
      tries++;
      input.focus();
    });
  });

  // ---- Tarjeta de IQ: el número sube y las barras se llenan al verla ----
  function animateIQ(card) {
    if (card.classList.contains('live')) return;
    card.classList.add('live');
    var num = card.querySelector('[data-count]');
    if (!num) return;
    var target = parseInt(num.getAttribute('data-count'), 10);
    if (reduceMotion) { num.firstChild.nodeValue = String(target); return; }
    var start = null, from = 70, dur = 1600;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      num.firstChild.nodeValue = String(Math.round(from + (target - from) * eased));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Galería: botones anterior / siguiente ----
  document.querySelectorAll('[data-gallery]').forEach(function (g) {
    var track = g.querySelector('.gallery-track');
    g.querySelectorAll('[data-dir]').forEach(function (b) {
      b.addEventListener('click', function () {
        track.scrollBy({ left: parseInt(b.getAttribute('data-dir'), 10) * track.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });
  });

  // ---- Aparición al entrar en pantalla ----
  var items = document.querySelectorAll('.reveal');
  var cards = document.querySelectorAll('.brain-card');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    cards.forEach(animateIQ);
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (e.target.classList.contains('brain-card')) animateIQ(e.target);
      else e.target.classList.add('visible');
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
  cards.forEach(function (el) { io.observe(el); });
  // Respaldo: si el observador no dispara (capturas, impresión), mostrar todo.
  setTimeout(function () {
    items.forEach(function (el) { el.classList.add('visible'); });
  }, 3000);
})();
