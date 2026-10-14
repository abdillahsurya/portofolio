/* =========================================================
   Portofolio Abdillah Surya – script.js
   ========================================================= */

(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');

  /* ---------- 1. Menu untuk layar HP ---------- */
  function closeMenu() {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Buka menu');
    navToggle.firstElementChild.className = 'bi bi-list';
  }

  navToggle.addEventListener('click', function () {
    var isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Tutup menu' : 'Buka menu');
    navToggle.firstElementChild.className = isOpen ? 'bi bi-x-lg' : 'bi bi-list';
  });

  // Tutup menu setelah salah satu link diklik
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) closeMenu();
  });

  // Tutup menu dengan tombol Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMenu();
  });

  /* ---------- 2. Garis bawah header saat halaman di-scroll ---------- */
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- 3. Menandai menu yang sedang aktif ---------- */
  var links = Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]:not(.btn)'));
  var sections = links
    .map(function (link) { return document.querySelector(link.getAttribute('href')); })
    .filter(Boolean);

  function setActive() {
    var position = window.scrollY + 140;
    var current = sections[0];
    sections.forEach(function (section) {
      if (section.offsetTop <= position) current = section;
    });
    // Jika sudah di dasar halaman, tandai bagian terakhir (Kontak)
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }
    links.forEach(function (link) {
      link.classList.toggle('active', current && link.getAttribute('href') === '#' + current.id);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();

  /* ---------- 4. Animasi muncul saat di-scroll ---------- */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    // Browser lama: langsung tampilkan semuanya
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 5. Tahun otomatis di footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
