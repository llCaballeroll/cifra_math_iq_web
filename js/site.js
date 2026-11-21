// Cifra: Math IQ — botones de tienda y animaciones de entrada.
(function () {
  // Enlaces de las tiendas (publicada en ambas).
  var IOS_URL = 'https://apps.apple.com/mx/app/cifra-math-iq/id6834884097';
  var ANDROID_URL = 'https://play.google.com/store/apps/details?id=com.luiscaballero.cifra';

  var ua = navigator.userAgent || '';
  var isAndroid = /android/i.test(ua);
  var isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  document.querySelectorAll('[data-store]').forEach(function (a) {
    var url = a.getAttribute('data-store') === 'ios' ? IOS_URL : ANDROID_URL;
    if (url) {
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      a.classList.remove('soon');
      var s = a.querySelector('small');
      if (s && s.dataset.live) s.textContent = s.dataset.live;
    } else {
      a.removeAttribute('href');
      a.setAttribute('aria-disabled', 'true');
    }
  });
  if (IOS_URL || ANDROID_URL) {
    document.querySelectorAll('.soon-note').forEach(function (n) { n.hidden = true; });
  }

  // El botón "Descargar" de la barra lleva a la tienda del teléfono si ya existe.
  document.querySelectorAll('[data-smart-download]').forEach(function (btn) {
    var url = isIOS ? IOS_URL : (isAndroid ? ANDROID_URL : '');
    if (url) { btn.href = url; btn.target = '_blank'; btn.rel = 'noopener'; }
  });

  if (isAndroid) {
    document.querySelectorAll('.store-row').forEach(function (row) {
      var a = row.querySelector('[data-store="android"]');
      if (a) row.insertBefore(a, row.firstChild);
    });
  }

  var items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  items.forEach(function (el) { io.observe(el); });
  // Respaldo: si el observador no dispara, mostrar todo.
  setTimeout(function () { items.forEach(function (el) { el.classList.add('visible'); }); }, 2500);
})();
