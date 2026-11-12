/* =========================================================
   Portofolio Surya Abdillah – script.js
   ========================================================= */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var header = $('#header'), navToggle = $('#navToggle'), navLinks = $('#navLinks');
  var navIcon = navToggle.querySelector('i');
  var toastEl = $('#toast'), toastTimer;

  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }

  /* ---------- 1. Menu HP ---------- */
  function setMenu(open) {
    navLinks.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
    navIcon.className = open ? 'bi bi-x-lg' : 'bi bi-list';
  }
  navToggle.addEventListener('click', function () { setMenu(!navLinks.classList.contains('open')); });
  navLinks.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', function (e) { if (!header.contains(e.target)) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) { setMenu(false); navToggle.focus(); }
  });

  /* ---------- 2. Tema gelap/terang ---------- */
  var root = document.documentElement, themeBtn = $('#themeToggle');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
    themeBtn.firstElementChild.className = t === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    var meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#14110F' : '#FFFCFA');
  }
  applyTheme(root.getAttribute('data-theme') || 'light');
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  /* ---------- 3. Scroll: header, progress, tombol atas ---------- */
  var progress = $('#progress'), toTop = $('#toTop'), ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    header.classList.toggle('scrolled', y > 10);
    progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    toTop.classList.toggle('show', y > 600);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  /* ---------- 4. Menu aktif ---------- */
  var links = $$('a[href^="#"]:not(.btn)', navLinks);
  var sections = links.map(function (l) { return $(l.getAttribute('href')); }).filter(Boolean);
  function setActive() {
    var pos = window.scrollY + 140, current = sections[0];
    sections.forEach(function (s) { if (s.offsetTop <= pos) current = s; });
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) current = sections[sections.length - 1];
    links.forEach(function (l) { l.classList.toggle('active', !!current && l.getAttribute('href') === '#' + current.id); });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* ---------- 5. Animasi muncul + hitung angka ---------- */
  function countUp(el) {
    var target = Number(el.dataset.count), start = null;
    if (reduceMotion || target > 1000) { el.textContent = target; return; }
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / 900, 1);
      el.textContent = Math.round(target * p);
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }
  var items = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('visible');
        $$('[data-count]', en.target).forEach(countUp);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 6. Efek mengetik pada peran ---------- */
  var typed = $('#typed');
  var roles = ['Pembuat Perangkat IoT', 'Pengembang Sistem Tertanam', 'Penggemar ESP32 dan Arduino', 'Pembuat Website'];
  if (typed && !reduceMotion) {
    var ri = 0, ci = roles[0].length, deleting = true;
    (function tick() {
      var word = roles[ri], delay = deleting ? 40 : 80;
      typed.textContent = word.slice(0, ci);
      if (!deleting && ci === word.length) { deleting = true; delay = 1800; }
      else if (deleting && ci === 0) { deleting = false; ri = (ri + 1) % roles.length; delay = 300; }
      else ci += deleting ? -1 : 1;
      setTimeout(tick, delay);
    })();
  }

  /* ---------- 7. Demo servo ---------- */
  var range = $('#servoRange'), arm = $('.servo-arm'), angleLabel = $('#servoAngle');
  if (range && arm && angleLabel) {
    range.addEventListener('input', function () {
      var a = Number(range.value);
      arm.style.transform = 'rotate(' + (a - 90) + 'deg)';
      angleLabel.textContent = a + '°';
    });
  }

  /* ---------- 8. Demo RFID ---------- */
  var lcd = $('#lcdText'), lcdBox = $('#lcdBox'), rfidCard = $('#rfidCard'), rfidTimer;
  $$('[data-tap]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var ok = btn.dataset.tap === 'ok';
      clearTimeout(rfidTimer);
      rfidCard.classList.add('tap');
      lcdBox.setAttribute('class', 'il-black ' + (ok ? 'ok' : 'no'));
      lcd.textContent = ok ? 'Akses diterima!' : 'Akses ditolak!';
      if (!ok) { var c = btn.closest('.card'); c.classList.remove('shake'); void c.offsetWidth; c.classList.add('shake'); }
      rfidTimer = setTimeout(function () {
        rfidCard.classList.remove('tap');
        lcdBox.setAttribute('class', 'il-black');
        lcd.textContent = 'Tempelkan kartu...';
      }, 2200);
    });
  });

  /* ---------- 9. Filter proyek ---------- */
  var chips = $$('.chip'), cards = $$('.card'), empty = $('#empty');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter, shown = 0;
      chips.forEach(function (c) { var on = c === chip; c.classList.toggle('active', on); c.setAttribute('aria-pressed', String(on)); });
      cards.forEach(function (card) {
        var hide = f !== 'all' && card.dataset.cat !== f;
        card.classList.toggle('hidden', hide);
        if (!hide) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  /* ---------- 10. Klik keahlian = sorot proyek terkait ---------- */
  var skillBtns = $$('#skills button');
  skillBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true', key = btn.dataset.skill;
      skillBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      cards.forEach(function (c) { c.classList.remove('match', 'dim'); });
      if (!on) return;
      btn.setAttribute('aria-pressed', 'true');
      var n = 0;
      cards.forEach(function (c) {
        var has = (c.dataset.skills || '').split(' ').indexOf(key) > -1;
        c.classList.add(has ? 'match' : 'dim');
        if (has) n++;
      });
      toast(n + ' proyek memakai ' + btn.textContent.trim());
      if (chips.length) chips[0].click();
      $('#proyek').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  });

  /* ---------- 11. Salin email ---------- */
  var copyBtn = $('#copyEmail');
  if (copyBtn) copyBtn.addEventListener('click', function () {
    var mail = $('#emailText').textContent.trim();
    if (navigator.clipboard) navigator.clipboard.writeText(mail).then(function () { toast('Email disalin'); }, function () { toast(mail); });
    else toast(mail);
  });

  /* ---------- 12. Tahun otomatis ---------- */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();
})();
