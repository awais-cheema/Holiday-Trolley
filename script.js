/* Holiday Trolley — vanilla interactions (faithful port of the React app) */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {

    /* ---------- Helpers ---------- */
    var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    /* ---------- Clean pretty URLs ---------- */
    (function cleanPrettyUrl() {
      if (!window.history || !window.history.replaceState) return;
      var path = window.location.pathname;
      if (!/\.html$/i.test(path)) return;

      var cleanPath = path.replace(/\/index\.html$/i, '/').replace(/\.html$/i, '');
      try {
        window.history.replaceState(null, document.title, cleanPath + window.location.search + window.location.hash);
      } catch (e) {
        // Some local file contexts block history updates; the hosted site will still clean the URL.
      }
    })();

    /* ---------- Hero slider ---------- */
    (function heroSlider() {
      var hero = $('[data-hero]');
      if (!hero) return;
      var slides = $$(':scope > div.absolute.inset-0', hero);
      if (!slides.length) return;
      var total = slides.length;
      var current = 0;
      var timer = null;

      function show(i) {
        current = (i + total) % total;
        slides.forEach(function (s, idx) {
          var active = idx === current;
          s.style.opacity = active ? '1' : '0';
          s.style.zIndex = active ? '10' : '0';
          s.style.pointerEvents = active ? 'auto' : 'none';
        });
      }
      function next() { show(current + 1); }
      function prev() { show(current - 1); }
      function start() { stop(); timer = setInterval(next, 2000); }
      function stop() { if (timer) clearInterval(timer); }

      var prevBtn = $('button[aria-label="Previous slide"]', hero);
      var nextBtn = $('button[aria-label="Next slide"]', hero);
      if (prevBtn) prevBtn.addEventListener('click', function () { prev(); start(); });
      if (nextBtn) nextBtn.addEventListener('click', function () { next(); start(); });

      window.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { prev(); start(); }
        if (e.key === 'ArrowRight') { next(); start(); }
      });

      show(0);
      start();
    })();

    /* ---------- Horizontal carousels (Top Holidays + Holidays By Type) ---------- */
    $$('[data-carousel-track]').forEach(function (track) {
      var wrap = track.parentElement;
      var prevBtn = $('button[aria-label="Previous"]', wrap);
      var nextBtn = $('button[aria-label="Next"]', wrap);
      function step(dir) {
        var card = track.children[0];
        var w = (card ? card.offsetWidth : 300) + 24;
        track.scrollBy({ left: dir * w, behavior: 'smooth' });
      }
      if (prevBtn) prevBtn.addEventListener('click', function () { step(-1); });
      if (nextBtn) nextBtn.addEventListener('click', function () { step(1); });
    });

    /* ---------- Partner rows (looping autoplay) ---------- */
    $$('[data-partner-track]').forEach(function (track) {
      var VISIBLE = 6;
      var children = Array.prototype.slice.call(track.children);
      var originalCount = children.length / 2; // duplicated for looping
      var index = 0;
      var wrap = track.parentElement;
      var prevBtn = $('button[aria-label="Previous"]', wrap);
      var nextBtn = $('button[aria-label="Next"]', wrap);

      function apply(animated) {
        track.style.transition = animated ? 'transform 0.5s ease-in-out' : 'none';
        track.style.transform = 'translateX(-' + (index * (100 / VISIBLE)) + '%)';
      }
      function next() {
        index += 1;
        apply(true);
        if (index >= originalCount) {
          setTimeout(function () {
            apply(false);
            index = 0;
            // force reflow then re-enable animation next tick
            void track.offsetWidth;
            requestAnimationFrame(function () { track.style.transition = 'transform 0.5s ease-in-out'; });
          }, 520);
        }
      }
      function prev() {
        index -= 1;
        if (index < 0) index = 0;
        apply(true);
      }
      if (prevBtn) prevBtn.addEventListener('click', prev);
      if (nextBtn) nextBtn.addEventListener('click', next);
      apply(false);
      setInterval(next, 3000);
    });

    /* ---------- FAQ accordion ---------- */
    (function faq() {
      var buttons = $$('button[aria-expanded]');
      function setOpen(btn, open) {
        var card = btn.parentElement;
        var panel = btn.nextElementSibling;
        var chevron = btn.querySelector('svg');
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        if (open) {
          card.classList.add('border-gold-accent', 'bg-soft-cream');
          card.classList.remove('border-outline-variant/40', 'bg-soft-cream/30', 'hover:border-gold-accent/50');
          panel.classList.add('max-h-64', 'opacity-100', 'border-t', 'border-outline-variant/20');
          panel.classList.remove('max-h-0', 'opacity-0');
          if (chevron) { chevron.classList.add('rotate-180'); chevron.classList.remove('rotate-0'); }
        } else {
          card.classList.remove('border-gold-accent', 'bg-soft-cream');
          card.classList.add('border-outline-variant/40', 'bg-soft-cream/30', 'hover:border-gold-accent/50');
          panel.classList.remove('max-h-64', 'opacity-100', 'border-t', 'border-outline-variant/20');
          panel.classList.add('max-h-0', 'opacity-0');
          if (chevron) { chevron.classList.remove('rotate-180'); chevron.classList.add('rotate-0'); }
        }
      }
      buttons.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var isOpen = btn.getAttribute('aria-expanded') === 'true';
          // single-open accordion
          buttons.forEach(function (b) { if (b !== btn) setOpen(b, false); });
          setOpen(btn, !isOpen);
        });
      });
    })();

    /* ---------- Header scroll state ---------- */
    (function headerScroll() {
      var header = $('#main-header');
      if (!header) return;
      var scrolledOn = ['bg-pure-white/95', 'backdrop-blur-md', 'shadow-md', 'py-3', 'border-outline-variant/30'];
      var scrolledOff = ['bg-pure-white', 'shadow-sm', 'py-5', 'border-outline-variant'];
      function onScroll() {
        if (window.scrollY > 50) {
          header.classList.add.apply(header.classList, scrolledOn);
          header.classList.remove.apply(header.classList, scrolledOff);
        } else {
          header.classList.remove.apply(header.classList, scrolledOn);
          header.classList.add.apply(header.classList, scrolledOff);
        }
      }
      window.addEventListener('scroll', onScroll);
      onScroll();
    })();

    /* ---------- Mobile menu ---------- */
    (function mobileMenu() {
      var btn = $('button[aria-label="Open navigation menu"]');
      var menu = $('#mobile-menu');
      if (!btn || !menu) return;
      btn.addEventListener('click', function () {
        menu.style.display = (menu.style.display === 'none' || !menu.style.display) ? 'block' : 'none';
      });
      // closing via any nav link inside
      $$('button, a', menu).forEach(function (el) {
        el.addEventListener('click', function () { menu.style.display = 'none'; });
      });
    })();

    /* ---------- Search suggestions ---------- */
    (function suggestions() {
      var input = $('input[placeholder="Where do you want to go?"]');
      var box = $('#search-suggestions');
      if (!input || !box) return;
      var options = $$('button', box);

      function filter() {
        var q = input.value.toLowerCase();
        options.forEach(function (opt) {
          var match = opt.textContent.toLowerCase().indexOf(q) !== -1;
          opt.style.display = match ? '' : 'none';
        });
      }
      input.addEventListener('focus', function () { box.style.display = 'block'; filter(); });
      input.addEventListener('input', function () { box.style.display = 'block'; filter(); });
      options.forEach(function (opt) {
        opt.addEventListener('click', function () {
          input.value = opt.textContent.trim();
          box.style.display = 'none';
        });
      });
      document.addEventListener('click', function (e) {
        if (!box.contains(e.target) && e.target !== input) box.style.display = 'none';
      });
    })();

    /* ---------- Modals ---------- */
    function openModal(id) {
      var m = $('#' + id);
      if (m) { m.style.display = 'block'; document.body.style.overflow = 'hidden'; }
    }
    function closeModal(m) {
      if (m) { m.style.display = 'none'; }
      if (!$$('.ht-modal').some(function (x) { return x.style.display === 'block'; })) {
        document.body.style.overflow = '';
      }
    }
    function closeAllModals() {
      $$('.ht-modal').forEach(function (m) { m.style.display = 'none'; });
      document.body.style.overflow = '';
    }

    // Wire close: backdrop + any Close button inside each modal
    $$('.ht-modal').forEach(function (modal) {
      // backdrop = first child div with absolute inset-0 (the click-to-close layer)
      var backdrop = modal.querySelector(':scope > div > div.absolute.inset-0');
      if (backdrop) backdrop.addEventListener('click', function () { closeModal(modal); });
      $$('button[aria-label^="Close"]', modal).forEach(function (b) {
        b.addEventListener('click', function () { closeModal(modal); });
      });
    });
    window.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllModals(); });

    // Header "Enquire Now"
    $$('#main-header button').forEach(function (b) {
      if (/Enquire Now/i.test(b.textContent)) {
        b.addEventListener('click', function () { openModal('modal-enquiry'); });
      }
    });

    // Footer contact + scroll-to-top
    var contactBtn = $('footer button[aria-label="Contact us"]');
    if (contactBtn) contactBtn.addEventListener('click', function () { openModal('modal-contact'); });
    var topBtn = $('footer button[aria-label="Scroll to top"]');
    if (topBtn) topBtn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

    // Hero "Take Me There" buttons -> enquiry
    var hero = $('[data-hero]');
    if (hero) {
      $$('button', hero).forEach(function (b) {
        if (/Take Me There/i.test(b.textContent)) {
          b.addEventListener('click', function () { openModal('modal-enquiry'); });
        }
      });
    }

    // Navy feature section buttons
    $$('button').forEach(function (b) {
      var t = b.textContent.trim();
      if (t === 'Inquire Instantly') b.addEventListener('click', function () { openModal('modal-enquiry'); });
      if (t === 'Explore Day Timeline') b.addEventListener('click', function () { openModal('modal-detail'); });
    });

    // Top Holidays cards -> detail dialog
    var listings = $('#holiday-listings-section [data-carousel-track]');
    if (listings) {
      Array.prototype.slice.call(listings.children).forEach(function (card) {
        card.addEventListener('click', function () { openModal('modal-detail'); });
      });
    }

    // Detail dialog internal actions
    var detail = $('#modal-detail');
    if (detail) {
      $$('button', detail).forEach(function (b) {
        var t = b.textContent.trim();
        if (/Enquire on this Journey/i.test(t)) {
          b.addEventListener('click', function () { closeModal(detail); openModal('modal-enquiry'); });
        }
        if (/Shortlist/i.test(t)) {
          b.addEventListener('click', function () { openModal('modal-shortlist'); });
        }
      });
    }

    // Smooth-scroll helpers for "View All Holidays" + category nav + trending/type cards
    function scrollToListings() {
      var sec = $('#holiday-listings-section');
      if (sec) sec.scrollIntoView({ behavior: 'smooth' });
    }
    $$('button').forEach(function (b) {
      if (/View All Holidays/i.test(b.textContent.trim())) {
        b.addEventListener('click', scrollToListings);
      }
    });

  });
})();
