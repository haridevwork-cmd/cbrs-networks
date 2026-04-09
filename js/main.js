/* ============================================================
   CBRS Networks – main.js
   Handles: Navbar scroll, mobile menu, scroll-to-top,
            animated counters, intersection observer animations
   ============================================================ */

(function () {
  'use strict';

  /* ── Navbar ──────────────────────────────────────────────── */
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  function handleScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Scroll-to-top button
    const scrollBtn = document.getElementById('scrollTop');
    if (scrollBtn) {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('show');
      } else {
        scrollBtn.classList.remove('show');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  /* ── Mobile Menu ─────────────────────────────────────────── */
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      navLinks.classList.toggle('open');
      const isOpen = navLinks.classList.contains('open');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        hamburger.click();
      }
    });

    // Close menu on nav link click
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
      });
    });

    // Close menu on outside click
    document.addEventListener('click', function (e) {
      if (!navbar.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  /* ── Scroll To Top ───────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Animated Counters ───────────────────────────────────── */
  function animateCounter(el) {
    const target = el.dataset.target;
    const isFloat = target.includes('.');
    const numericValue = parseFloat(target.replace(/[^0-9.]/g, ''));
    const suffix = target.replace(/[0-9.]/g, '');
    const duration = 1800;
    const steps = 60;
    const stepTime = duration / steps;
    let current = 0;
    const increment = numericValue / steps;

    const timer = setInterval(function () {
      current += increment;
      if (current >= numericValue) {
        current = numericValue;
        clearInterval(timer);
      }
      el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, stepTime);
  }

  /* ── Intersection Observer (fade-in + counters) ──────────── */
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  // Add fade-in class to animatable elements
  const animatables = document.querySelectorAll(
    '.service-card, .why-item, .process-step, .industry-card, ' +
    '.testimonial-card, .value-card, .team-card, .office-card, ' +
    '.job-card, .faq-item, .em-card'
  );

  animatables.forEach(function (el, index) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.5s ease ' + (index % 4 * 0.08) + 's, transform 0.5s ease ' + (index % 4 * 0.08) + 's';
  });

  const fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  animatables.forEach(function (el) {
    fadeObserver.observe(el);
  });

  // Counter elements (data-target attribute)
  const counterEls = document.querySelectorAll('[data-target]');
  if (counterEls.length) {
    const counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterEls.forEach(function (el) {
      counterObserver.observe(el);
    });
  }

  /* ── Active Nav Link Highlighting ───────────────────────── */
  (function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  })();

  /* ── Smooth Anchor Scrolling ─────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

})();
