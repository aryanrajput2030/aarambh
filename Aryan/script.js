/**
 * AARAMBH — script.js
 * Premium Child-Centred Learning & Development Centre
 * Pure vanilla JavaScript — no libraries or frameworks
 */

'use strict';

/* ── Reduced Motion Check ── */
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ============================================================
   1. NAVBAR SCROLL EFFECT
   Adds .scrolled class when user scrolls past 50px
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  // Run once on load in case page is already scrolled
  handleNavbarScroll();
})();

/* ============================================================
   2. HAMBURGER MENU — Toggle mobile nav
   ============================================================ */
(function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  if (!hamburger || !navMenu) return;

  // Toggle menu open/close
  hamburger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  /* ── 3. Close menu on nav link click ── */
  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside (on the overlay)
  document.addEventListener('click', (e) => {
    if (
      navMenu.classList.contains('active') &&
      !navMenu.contains(e.target) &&
      !hamburger.contains(e.target)
    ) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
})();

/* ============================================================
   4. ACTIVE NAV LINK — IntersectionObserver per section
   ============================================================ */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  function setActiveLink(id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === `#${id}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setActiveLink(entry.target.id);
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
})();

/* ============================================================
   5. SCROLL REVEAL ANIMATIONS
   IntersectionObserver adds .visible to .reveal elements
   Service cards get staggered delay
   ============================================================ */
(function initScrollReveal() {
  if (prefersReducedMotion) {
    // Skip animation — make everything visible immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
    return;
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (!revealElements.length) return;

  // Apply stagger delays to service cards
  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  // Apply stagger to support pills
  const supportPills = document.querySelectorAll('.support-pill');
  supportPills.forEach((pill, i) => {
    pill.style.transitionDelay = `${(i % 3) * 0.08}s`;
  });

  // Apply stagger to why cards
  const whyCards = document.querySelectorAll('.why-card');
  whyCards.forEach((card, i) => {
    card.style.transitionDelay = `${(i % 3) * 0.1}s`;
  });

  // Apply stagger to journey steps
  const journeySteps = document.querySelectorAll('.journey-step');
  journeySteps.forEach((step, i) => {
    step.style.transitionDelay = `${i * 0.12}s`;
  });

  // Apply stagger to age stops
  const ageStops = document.querySelectorAll('.age-stop');
  ageStops.forEach((stop, i) => {
    stop.style.transitionDelay = `${i * 0.12}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Unobserve after revealing to improve performance
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));
})();

/* ============================================================
   6. SCROLL TO TOP BUTTON
   Shows after 400px scroll; smooth scroll to top on click
   ============================================================ */
(function initScrollToTop() {
  const btn = document.getElementById('scrollTop');
  if (!btn) return;

  function handleScrollTopVisibility() {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', handleScrollTopVisibility, { passive: true });

  btn.addEventListener('click', () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  // Initial check
  handleScrollTopVisibility();
})();

/* ============================================================
   7. FLOATING WHATSAPP — entrance animation on load
   The CSS handles the animation via @keyframes floatEntrance
   This JS adds an aria-label update and pulse after a delay
   ============================================================ */
(function initFloatingWhatsApp() {
  const floatBtn = document.querySelector('.float-whatsapp');
  if (!floatBtn || prefersReducedMotion) return;

  // Add a subtle pulse class after initial entrance animation completes
  setTimeout(() => {
    floatBtn.style.animation = 'none';
    floatBtn.style.opacity   = '1';
    floatBtn.style.transform = 'scale(1)';
  }, 1400);
})();

/* ============================================================
   8. SMOOTH SCROLL FOR ANCHOR LINKS
   Intercepts clicks on href="#..." and smoothly scrolls
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const navbarHeight = document.getElementById('navbar')?.offsetHeight || 72;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navbarHeight;

      if (prefersReducedMotion) {
        window.scrollTo(0, targetPosition);
      } else {
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
})();

/* ============================================================
   9. PHILOSOPHY WORDS ANIMATION RESET ON VISIBILITY
   Re-trigger animation when hero comes back into view
   (in case user navigated away and returned)
   ============================================================ */
(function initPhilosophyAnimation() {
  if (prefersReducedMotion) {
    document.querySelectorAll('.phil-word').forEach(w => {
      w.style.opacity = '1';
      w.style.transform = 'none';
    });
    return;
  }

  const heroSection = document.getElementById('home');
  if (!heroSection) return;

  const philWords = heroSection.querySelectorAll('.phil-word');
  if (!philWords.length) return;

  let hasPlayed = false;

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        hasPlayed = true;
        // Words already have CSS animation via data-delay attribute
        // Just ensure they're in their initial state
        philWords.forEach(word => {
          word.style.animationPlayState = 'running';
        });
      }
    });
  }, { threshold: 0.3 });

  heroObserver.observe(heroSection);
})();

/* ============================================================
   10. ADDITIONAL ENHANCEMENTS
   ============================================================ */

/* Navbar background fix: on page load, if page is already scrolled */
window.addEventListener('DOMContentLoaded', () => {
  const navbar = document.getElementById('navbar');
  if (navbar && window.scrollY > 50) {
    navbar.classList.add('scrolled');
  }
});

/* Lazy-enhance: add title attributes to phone links for accessibility */
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  if (!link.title) {
    link.title = `Call ${link.textContent.trim()}`;
  }
});

/* Lazy-enhance: add rel attributes to all external links */
document.querySelectorAll('a[href^="http"]').forEach(link => {
  if (!link.rel.includes('noopener')) {
    link.rel = 'noopener noreferrer';
  }
});

/* Console attribution */
console.log(
  '%cAARambh%c — Child-Centred Learning & Development Centre\nBuilt with ❤️ in vanilla HTML, CSS & JS.',
  'color: #2a9d8f; font-weight: 900; font-size: 1.2em;',
  'color: #636e72; font-size: 0.9em;'
);
