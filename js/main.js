/* ============================================================
   CBRS Networks – main.js  (Advanced Edition)
   Features:
     • Page loader fade-out
     • Scroll progress bar
     • Animated hamburger ↔ X with side-drawer + overlay
     • Swipe-to-close drawer (touch)
     • Escape key closes drawer
     • Dark mode toggle + localStorage persistence
     • Typewriter effect (hero headline)
     • Animated stat counters (Intersection Observer)
     • Scroll-triggered fade-in animations
     • Active nav link auto-highlight
     • Smooth anchor scroll
     • Floating mobile CTA
     • Toast notification system
   ============================================================ */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     1. PAGE LOADER
  ═══════════════════════════════════════════════════════════ */
  const loader = document.getElementById('pageLoader');
  if (loader) {
    function hideLoader() { loader.classList.add('hidden'); }
    // Use DOMContentLoaded — do NOT wait for video/images to finish downloading
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { setTimeout(hideLoader, 400); });
    } else {
      setTimeout(hideLoader, 400);
    }
    // Absolute hard fallback — hide no matter what after 1s
    setTimeout(hideLoader, 1000);
  }

  /* ═══════════════════════════════════════════════════════════
     2. SCROLL PROGRESS BAR
  ═══════════════════════════════════════════════════════════ */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress() {
    if (!progressBar) return;
    const scrolled  = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0) + '%';
  }

  /* ═══════════════════════════════════════════════════════════
     3. NAVBAR SCROLL BEHAVIOR
  ═══════════════════════════════════════════════════════════ */
  const navbar   = document.getElementById('navbar');
  const scrollBtn = document.getElementById('scrollTop');

  function handleScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 50);
    if (scrollBtn) scrollBtn.classList.toggle('show', y > 400);
    updateProgress();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ═══════════════════════════════════════════════════════════
     4. ANIMATED HAMBURGER + SIDE DRAWER
  ═══════════════════════════════════════════════════════════ */
  const hamburger  = document.getElementById('hamburger');
  const navLinks   = document.getElementById('navLinks');
  const navOverlay = document.getElementById('navOverlay');
  let drawerOpen   = false;

  function openDrawer() {
    drawerOpen = true;
    if (hamburger)  hamburger.classList.add('open');
    if (navLinks)   navLinks.classList.add('open');
    if (navOverlay) {
      navOverlay.classList.add('open');
      requestAnimationFrame(function () { navOverlay.classList.add('visible'); });
    }
    document.body.style.overflow = 'hidden';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'true');
  }

  function closeDrawer() {
    drawerOpen = false;
    if (hamburger)  hamburger.classList.remove('open');
    if (navLinks)   navLinks.classList.remove('open');
    if (navOverlay) {
      navOverlay.classList.remove('visible');
      setTimeout(function () { navOverlay.classList.remove('open'); }, 300);
    }
    document.body.style.overflow = '';
    if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
  }

  if (hamburger) {
    hamburger.addEventListener('click', function () {
      drawerOpen ? closeDrawer() : openDrawer();
    });
    hamburger.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); hamburger.click(); }
    });
  }

  // Overlay click closes drawer
  if (navOverlay) {
    navOverlay.addEventListener('click', closeDrawer);
  }

  // Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawerOpen) closeDrawer();
  });

  // Close on nav link click
  if (navLinks) {
    navLinks.querySelectorAll('.nav-link, .btn-nav').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });
  }

  // Touch swipe-right to close
  let touchStartX = 0;
  if (navLinks) {
    navLinks.addEventListener('touchstart', function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    navLinks.addEventListener('touchend', function (e) {
      if (e.changedTouches[0].clientX - touchStartX > 60) closeDrawer();
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════════════
     5. SCROLL TO TOP
  ═══════════════════════════════════════════════════════════ */
  if (scrollBtn) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ═══════════════════════════════════════════════════════════
     6. DARK MODE TOGGLE
  ═══════════════════════════════════════════════════════════ */
  const darkToggles = document.querySelectorAll('.dark-toggle');
  let darkMode = localStorage.getItem('cbrs-dark') === 'true';

  function applyDark(on) {
    document.body.classList.toggle('dark', on);
    darkToggles.forEach(function (btn) { btn.textContent = on ? '☀️' : '🌙'; });
    localStorage.setItem('cbrs-dark', on);
  }

  applyDark(darkMode);

  darkToggles.forEach(function (btn) {
    btn.addEventListener('click', function () {
      darkMode = !darkMode;
      applyDark(darkMode);
      showToast(darkMode ? '🌙 Dark mode on' : '☀️ Light mode on', 'info');
    });
  });

  /* ═══════════════════════════════════════════════════════════
     7. TYPEWRITER EFFECT (hero h1)
  ═══════════════════════════════════════════════════════════ */
  const typeTarget = document.getElementById('typewriter');
  if (typeTarget) {
    const phrases = [
      'Great Talent',
      'Top Engineers',
      'IT Professionals',
      'Healthcare Heroes',
      'Finance Experts'
    ];
    let pIdx = 0, cIdx = 0, deleting = false;

    function type() {
      const current = phrases[pIdx];
      if (deleting) {
        typeTarget.textContent = current.slice(0, --cIdx);
      } else {
        typeTarget.textContent = current.slice(0, ++cIdx);
      }

      let delay = deleting ? 55 : 90;

      if (!deleting && cIdx === current.length) {
        delay = 1800;
        deleting = true;
      } else if (deleting && cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        delay = 350;
      }
      setTimeout(type, delay);
    }

    // Start after loader fades
    setTimeout(type, 800);
  }

  /* ═══════════════════════════════════════════════════════════
     8. ANIMATED STAT COUNTERS
  ═══════════════════════════════════════════════════════════ */
  function animateCounter(el) {
    const raw   = el.dataset.target || el.textContent;
    const num   = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suffix = raw.replace(/[0-9.]/g, '').replace('.', '');
    const isFloat = raw.includes('.');
    const steps = 70, stepTime = 1800 / steps;
    let cur = 0;

    const t = setInterval(function () {
      cur += num / steps;
      if (cur >= num) { cur = num; clearInterval(t); }
      el.textContent = (isFloat ? cur.toFixed(1) : Math.floor(cur)) + suffix;
    }, stepTime);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length) {
    const cObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          cObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counterEls.forEach(function (el) { cObs.observe(el); });
  }

  /* ═══════════════════════════════════════════════════════════
     9. SCROLL-TRIGGERED FADE-IN ANIMATIONS
  ═══════════════════════════════════════════════════════════ */
  const animatables = document.querySelectorAll(
    '.service-card, .why-item, .process-step, .industry-card, ' +
    '.testimonial-card, .value-card, .team-card, .office-card, ' +
    '.job-card, .faq-item, .em-card, .stat'
  );

  animatables.forEach(function (el, i) {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(28px)';
    el.style.transition = 'opacity .55s ease ' + (i % 4 * 0.07) + 's, transform .55s ease ' + (i % 4 * 0.07) + 's';
  });

  const fadeObs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });

  animatables.forEach(function (el) { fadeObs.observe(el); });

  /* ═══════════════════════════════════════════════════════════
     10. ACTIVE NAV LINK
  ═══════════════════════════════════════════════════════════ */
  (function () {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === page || (page === '' && href === 'index.html'));
    });
  })();

  /* ═══════════════════════════════════════════════════════════
     11. SMOOTH ANCHOR SCROLL
  ═══════════════════════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 90, behavior: 'smooth' });
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     12. TOAST NOTIFICATION SYSTEM
  ═══════════════════════════════════════════════════════════ */
  window.showToast = function (message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;

    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const icons = { success: '✅', info: '💡', error: '❌', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = '<span class="toast-icon">' + (icons[type] || '💡') + '</span><span>' + message + '</span>';
    container.appendChild(toast);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () { toast.classList.add('show'); });
    });

    setTimeout(function () {
      toast.classList.add('hide');
      toast.addEventListener('transitionend', function () { toast.remove(); }, { once: true });
    }, duration);
  };

  /* ═══════════════════════════════════════════════════════════
     13. WELCOME TOAST (home page only)
  ═══════════════════════════════════════════════════════════ */
  const isHome = (window.location.pathname.split('/').pop() || 'index.html') === 'index.html';
  if (isHome && !sessionStorage.getItem('cbrs-welcomed')) {
    setTimeout(function () {
      showToast('👋 Welcome to CBRS Networks — your career starts here!', 'info', 4500);
      sessionStorage.setItem('cbrs-welcomed', '1');
    }, 2000);
  }

  /* ═══════════════════════════════════════════════════════════
     14. FLOATING MOBILE CTA click
  ═══════════════════════════════════════════════════════════ */
  const mobileCta = document.getElementById('mobileCta');
  if (mobileCta) {
    mobileCta.addEventListener('click', function () {
      window.location.href = 'contact.html';
    });
  }

})();


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
