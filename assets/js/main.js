(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Header state, back to top ---------- */
  var header = document.querySelector('[data-header]');
  var toTop = document.querySelector('[data-to-top]');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 40);
    toTop.classList.toggle('is-visible', y > window.innerHeight * 0.9);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('[data-menu-toggle]');
  var menu = document.querySelector('[data-mobile-menu]');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
    if (open) header.classList.add('is-scrolled'); else onScroll();
  }
  toggle.addEventListener('click', function () { setMenu(menu.hidden); });
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); } });
  window.addEventListener('resize', function () { if (window.innerWidth > 1080 && !menu.hidden) setMenu(false); });

  /* ---------- Active menu link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.header-nav a'));
  if ('IntersectionObserver' in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    navLinks.forEach(function (a) { var h = a.getAttribute('href'); if (h.charAt(0) !== '#') return; var s = document.querySelector(h); if (s) sectionObserver.observe(s); });
  }

  /* ---------- Compare sliders ---------- */
  function initCompare(el) {
    var range = el.querySelector('.compare-range');
    function set(v) { el.style.setProperty('--pos', v + '%'); }
    range.addEventListener('input', function () { set(range.value); el.dataset.touched = '1'; });
    set(range.value);
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-compare]'), initCompare);

  /* ---------- Hero mini before and after ---------- */
  var heroBa = document.querySelector('[data-hero-ba]');
  if (heroBa) {
    var patients = ['p05', 'p01', 'p08'];
    var heroCompare = heroBa.querySelector('[data-compare]');
    var heroRange = heroCompare.querySelector('.compare-range');
    var afterImg = heroBa.querySelector('[data-hero-after]');
    var beforeImg = heroBa.querySelector('[data-hero-before]');
    var dots = Array.prototype.slice.call(heroBa.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var heroTimer = null;
    var userTouched = false;

    patients.forEach(function (p) { var i = new Image(); i.src = '/assets/img/ba/' + p + '-after.webp'; var j = new Image(); j.src = '/assets/img/ba/' + p + '-before.webp'; });

    function show(i) {
      current = i;
      dots.forEach(function (d, k) { d.setAttribute('aria-selected', String(k === i)); });
      heroCompare.classList.add('is-swapping');
      setTimeout(function () {
        afterImg.src = '/assets/img/ba/' + patients[i] + '-after.webp';
        beforeImg.src = '/assets/img/ba/' + patients[i] + '-before.webp';
        heroRange.value = 50; heroCompare.style.setProperty('--pos', '50%');
        heroCompare.classList.remove('is-swapping');
        if (!userTouched && !reduceMotion) sweep();
      }, 350);
    }
    /* A gentle sweep shows visitors the slider is interactive */
    function sweep() {
      var start = null, dur = 2600;
      function frame(t) {
        if (userTouched) return;
        if (!start) start = t;
        var p = Math.min((t - start) / dur, 1);
        var v = 50 + Math.sin(p * Math.PI * 2) * 32;
        heroRange.value = v; heroCompare.style.setProperty('--pos', v + '%');
        if (p < 1) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
    function startTimer() { if (reduceMotion) return; stopTimer(); heroTimer = setInterval(function () { show((current + 1) % patients.length); }, 6000); }
    function stopTimer() { if (heroTimer) clearInterval(heroTimer); heroTimer = null; }

    dots.forEach(function (d, k) { d.addEventListener('click', function () { userTouched = true; stopTimer(); show(k); }); });
    heroRange.addEventListener('pointerdown', function () { userTouched = true; stopTimer(); });
    heroRange.addEventListener('keydown', function () { userTouched = true; stopTimer(); });
    if (!reduceMotion) { setTimeout(sweep, 1700); startTimer(); }
  }

  /* ---------- Results carousel ---------- */
  var results = document.querySelector('[data-results]');
  if (results) {
    var track = results.querySelector('[data-results-track]');
    var cards = Array.prototype.slice.call(track.children);
    var prev = document.querySelector('[data-results-prev]');
    var next = document.querySelector('[data-results-next]');
    var bar = document.querySelector('[data-results-bar]');
    var index = 0;

    function perView() { return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1; }
    function maxIndex() { return Math.max(0, cards.length - perView()); }
    function update() {
      index = Math.min(index, maxIndex());
      var gap = parseFloat(getComputedStyle(track).columnGap) || 24;
      var offset = cards[index].offsetLeft - cards[0].offsetLeft;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
      prev.disabled = index === 0;
      next.disabled = index >= maxIndex();
      var pv = perView();
      bar.style.width = (pv / cards.length * 100) + '%';
      bar.style.transform = 'translateX(' + (index / pv * 100) + '%)';
      cards.forEach(function (c, i) {
        var visible = i >= index && i < index + pv;
        c.setAttribute('aria-hidden', String(!visible));
        c.querySelector('.compare-range').tabIndex = visible ? 0 : -1;
      });
      void gap;
    }
    prev.addEventListener('click', function () { index = Math.max(0, index - perView()); update(); });
    next.addEventListener('click', function () { index = Math.min(maxIndex(), index + perView()); update(); });
    window.addEventListener('resize', update);

    /* Swipe on the gap between photos (photos themselves are sliders) */
    var startX = null;
    track.addEventListener('touchstart', function (e) {
      if (e.target.closest('.compare')) { startX = null; return; }
      startX = e.touches[0].clientX;
    }, { passive: true });
    track.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) { index = dx < 0 ? Math.min(maxIndex(), index + 1) : Math.max(0, index - 1); update(); }
      startX = null;
    });
    update();
  }

  /* ---------- Anatomy tabs and hotspots ---------- */
  var anatomy = document.querySelector('[data-anatomy]');
  if (anatomy) {
    var tabs = Array.prototype.slice.call(anatomy.querySelectorAll('[data-layer-tab]'));
    var layers = Array.prototype.slice.call(anatomy.querySelectorAll('[data-layer]'));
    var spots = Array.prototype.slice.call(anatomy.querySelectorAll('[data-hotspot]'));
    function selectLayer(i, focus) {
      tabs.forEach(function (t, k) { var on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      layers.forEach(function (l, k) { l.hidden = k !== i; });
      spots.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      if (focus) tabs[i].focus();
    }
    tabs.forEach(function (t, k) {
      t.addEventListener('click', function () { selectLayer(k); });
      t.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); selectLayer((k + 1) % tabs.length, true); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); selectLayer((k - 1 + tabs.length) % tabs.length, true); }
      });
    });
    spots.forEach(function (s, k) { s.addEventListener('click', function () { selectLayer(k); }); });
    selectLayer(0);
  }

  /* ---------- Journey track ---------- */
  var journey = document.querySelector('[data-journey]');
  if (journey) {
    var jBar = document.querySelector('[data-journey-bar]');
    var jPrev = document.querySelector('[data-journey-prev]');
    var jNext = document.querySelector('[data-journey-next]');
    function stepWidth() { var s = journey.children[0]; return s.getBoundingClientRect().width + 28; }
    function jUpdate() {
      var max = journey.scrollWidth - journey.clientWidth;
      var p = max > 0 ? journey.scrollLeft / max : 1;
      jBar.style.width = (Math.max(p, 0.04) * 100) + '%';
      jPrev.disabled = journey.scrollLeft <= 4;
      jNext.disabled = journey.scrollLeft >= max - 4;
    }
    jPrev.addEventListener('click', function () { journey.scrollBy({ left: -stepWidth(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    jNext.addEventListener('click', function () { journey.scrollBy({ left: stepWidth(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    journey.addEventListener('scroll', jUpdate, { passive: true });
    window.addEventListener('resize', jUpdate);
    jUpdate();
  }

  /* ---------- FAQ: one open at a time ---------- */
  var faq = document.querySelector('[data-faq]');
  if (faq) {
    var items = Array.prototype.slice.call(faq.querySelectorAll('details'));
    items.forEach(function (d) {
      d.addEventListener('toggle', function () { if (d.open) items.forEach(function (o) { if (o !== d) o.open = false; }); });
    });
  }

  /* ---------- Image reveal ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); ro.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    Array.prototype.forEach.call(reveals, function (el) { ro.observe(el); });
  } else {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  }

  /* ---------- Parallax for floating satellites and the statement band ---------- */
  var floaters = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var bandImg = document.querySelector('[data-parallax-bg]');
  if (!reduceMotion && (floaters.length || bandImg)) {
    var ticking = false;
    function parallax() {
      var vh = window.innerHeight;
      if (window.innerWidth >= 900) {
        floaters.forEach(function (el) {
          var r = el.parentElement.getBoundingClientRect();
          var center = r.top + r.height / 2 - vh / 2;
          var off = Math.max(-60, Math.min(60, center * parseFloat(el.dataset.parallax)));
          el.style.transform = 'translate3d(0,' + off.toFixed(1) + 'px,0)';
        });
      } else {
        floaters.forEach(function (el) { el.style.transform = ''; });
      }
      if (bandImg) {
        var br = bandImg.parentElement.parentElement.getBoundingClientRect();
        if (br.bottom > 0 && br.top < vh) {
          var p = (br.top + br.height / 2 - vh / 2) / vh;
          bandImg.style.transform = 'translate3d(0,' + (p * -60).toFixed(1) + 'px,0)';
        }
      }
      ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });
    window.addEventListener('resize', parallax);
    parallax();
  }

  /* ---------- Booking form (front end only, connect to a CRM later) ---------- */
  var form = document.querySelector('[data-book-form]');
  if (form) {
    var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    function validateField(input) {
      var ok = true;
      var v = input.value.trim();
      if (input.required && !v) ok = false;
      if (ok && input.type === 'email') ok = emailRe.test(v);
      if (ok && input.type === 'tel') ok = v.replace(/[^\d]/g, '').length >= 7;
      input.closest('.field').classList.toggle('is-invalid', !ok);
      input.setAttribute('aria-invalid', String(!ok));
      var err = form.querySelector('[data-error-for="' + input.id + '"]');
      if (err) { err.id = input.id + '-error'; if (!ok) input.setAttribute('aria-describedby', err.id); else input.removeAttribute('aria-describedby'); }
      return ok;
    }
    var required = Array.prototype.slice.call(form.querySelectorAll('[required]'));
    required.forEach(function (input) {
      input.addEventListener('blur', function () { if (input.value) validateField(input); });
      input.addEventListener('input', function () { if (input.closest('.field').classList.contains('is-invalid')) validateField(input); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      required.forEach(function (input) { if (!validateField(input) && !firstBad) firstBad = input; });
      if (firstBad) { firstBad.focus(); return; }
      var success = form.querySelector('[data-form-success]');
      success.hidden = false;
      success.focus();
      form.reset();
    });
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
