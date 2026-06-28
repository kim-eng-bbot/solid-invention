/* ============================================================
   STRONG THREADS AFRICA LTD — Main JavaScript
   ============================================================ */

/* ------------------------------------------------------------
   SITE CONFIG — single source of truth for contact details.
   Change values here and they update everywhere via [data-bind].
   ------------------------------------------------------------ */
const SITE = {
  phoneDisplay: '+254 0711 942 888',
  phoneRaw: '+254711942888',
  whatsappNumber: '254711942888',
  email: 'info@strongthreadsafrica.co.ke'
};

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Bind SITE config to [data-bind] elements ---- */
  const bind = (key, value) => {
    document.querySelectorAll(`[data-bind="${key}"]`).forEach(el => {
      if (key.endsWith('-link')) el.href = value;
      else el.textContent = value;
    });
  };
  bind('phone', SITE.phoneDisplay);
  bind('phone-link', 'tel:' + SITE.phoneRaw);
  bind('wa-link', 'https://wa.me/' + SITE.whatsappNumber);
  bind('email', SITE.email);
  bind('email-link', 'mailto:' + SITE.email);
  bind('year', String(new Date().getFullYear()));

  /* ---- Page Loader ---- */
  const pageLoader = document.getElementById('pageLoader');
  if (pageLoader) {
    const hideLoader = () => setTimeout(() => pageLoader.classList.add('hidden'), 200);
    window.addEventListener('load', hideLoader);
    setTimeout(() => pageLoader.classList.add('hidden'), 1500);
  }

  /* ---- Sticky Header ---- */
  const header = document.getElementById('header');
  if (header) {
    const handleHeaderScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  /* ---- Active Nav Link ---- */
  const navLinks = document.querySelectorAll('.primary-nav a');
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNav = () => {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollY >= top && scrollY < bottom) {
        navLinks.forEach(link => {
          const isActive = link.getAttribute('href') === '#' + id;
          link.classList.toggle('active', isActive);
          if (isActive) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      }
    });
  };
  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ---- Mobile Menu (single consolidated nav) ---- */
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  let menuOpen = false;

  const setMenu = (open) => {
    menuOpen = open;
    if (!menuToggle || !primaryNav) return;
    menuToggle.classList.toggle('active', menuOpen);
    menuToggle.setAttribute('aria-expanded', String(menuOpen));
    menuToggle.setAttribute('aria-label', menuOpen ? 'Close menu' : 'Open menu');
    primaryNav.classList.toggle('active', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  };

  if (menuToggle) {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.addEventListener('click', () => setMenu(!menuOpen));
  }
  if (primaryNav) {
    primaryNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => setMenu(false));
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menuOpen) setMenu(false);
  });

  /* ---- Smooth Scroll (for in-page anchors) ---- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') { e.preventDefault(); return; }
      if (!href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
      }
    });
  });

  /* ---- Scroll Reveal Animations ---- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (prefersReducedMotion) {
    revealElements.forEach(el => el.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  /* ---- Gallery Lightbox (accessible modal) ---- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxClose = document.getElementById('lightboxClose');
  const galleryItems = document.querySelectorAll('.gallery-item[data-lightbox]');
  let lastFocused = null;

  const openLightbox = (imgEl) => {
    if (!lightbox || !lightboxImage) return;
    lastFocused = document.activeElement;
    lightboxImage.src = imgEl.src;
    lightboxImage.alt = imgEl.alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (lightboxClose) lightboxClose.focus();
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  };

  galleryItems.forEach(item => {
    item.setAttribute('role', 'button');
    item.setAttribute('tabindex', '0');
    const open = () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img);
    };
    item.addEventListener('click', open);
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightbox) {
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox && lightbox.classList.contains('active')) closeLightbox();
  });

  /* ---- Testimonials Carousel ---- */
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const dotsContainer = document.getElementById('testimonialsDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let currentSlide = 0;
    let slidesPerView = 3;
    let autoPlayInterval = null;

    const getSlidesPerView = () => {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    };
    const getTotalSlides = () => Math.max(1, cards.length - slidesPerView + 1);

    const updateDots = () => {
      const totalSlides = getTotalSlides();
      if (!dotsContainer) return;
      dotsContainer.innerHTML = '';
      for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === currentSlide) {
          dot.classList.add('active');
          dot.setAttribute('aria-current', 'true');
        }
        dot.addEventListener('click', () => {
          currentSlide = i;
          updateCarousel();
          resetAutoPlay();
        });
        dotsContainer.appendChild(dot);
      }
    };

    function updateCarousel() {
      slidesPerView = getSlidesPerView();
      const totalSlides = getTotalSlides();
      if (currentSlide >= totalSlides) currentSlide = totalSlides - 1;

      const gap = parseFloat(getComputedStyle(track).gap) || 0;
      const cardWidth = cards[0].offsetWidth + gap;
      const offset = currentSlide * cardWidth;
      track.style.transform = `translateX(-${offset}px)`;
      updateDots();
    }

    const nextSlide = () => { currentSlide = (currentSlide + 1) % getTotalSlides(); updateCarousel(); };
    const prevSlide = () => { currentSlide = (currentSlide - 1 + getTotalSlides()) % getTotalSlides(); updateCarousel(); };
    const startAutoPlay = () => { if (!prefersReducedMotion) autoPlayInterval = setInterval(nextSlide, 5000); };
    const resetAutoPlay = () => { clearInterval(autoPlayInterval); startAutoPlay(); };

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    track.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.addEventListener('mouseleave', startAutoPlay);

    let touchStartX = 0;
    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      clearInterval(autoPlayInterval);
    }, { passive: true });
    track.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 50) { diff > 0 ? nextSlide() : prevSlide(); }
      startAutoPlay();
    }, { passive: true });

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateCarousel, 150);
    });

    updateCarousel();
    startAutoPlay();
  }

  /* ---- Contact Form (inline validation + WhatsApp handoff) ---- */
  const quoteForm = document.getElementById('quoteForm');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmitBtn = document.getElementById('formSubmitBtn');

  const setError = (field, message) => {
    if (!field) return;
    const errorEl = document.getElementById(field.id + 'Error');
    field.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message || '';
  };

  const shakeButton = (btn) => {
    if (!btn || prefersReducedMotion) return;
    btn.classList.add('shake');
    btn.addEventListener('animationend', () => btn.classList.remove('shake'), { once: true });
  };

  if (quoteForm) {
    const nameField = document.getElementById('formName');
    const phoneField = document.getElementById('formPhone');
    const emailField = document.getElementById('formEmail');
    const serviceField = document.getElementById('formService');
    const messageField = document.getElementById('formMessage');

    [nameField, phoneField, emailField, serviceField].forEach(field => {
      if (field) field.addEventListener('input', () => setError(field, ''));
    });

    quoteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let firstInvalid = null;
      const fail = (field, message) => {
        setError(field, message);
        if (!firstInvalid) firstInvalid = field;
      };

      const name = nameField ? nameField.value.trim() : '';
      const phone = phoneField ? phoneField.value.trim() : '';
      const email = emailField ? emailField.value.trim() : '';
      const service = serviceField ? serviceField.value : '';
      const message = messageField ? messageField.value.trim() : '';

      if (!name) fail(nameField, 'Please enter your name.');
      if (!phone) fail(phoneField, 'Please enter your phone number.');
      else if (phone.replace(/\D/g, '').length < 7) fail(phoneField, 'Please enter a valid phone number.');
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail(emailField, 'Please enter a valid email address.');
      if (!service) fail(serviceField, 'Please select a service.');

      if (firstInvalid) {
        firstInvalid.focus();
        shakeButton(formSubmitBtn);
        return;
      }

      if (formSubmitBtn) {
        formSubmitBtn.textContent = 'Sending...';
        formSubmitBtn.disabled = true;
      }

      const waMessage = encodeURIComponent(
        `Hello Strong Threads Africa! 👋\n\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        (email ? `Email: ${email}\n` : '') +
        `Service: ${service}\n` +
        (message ? `Details: ${message}` : '')
      );

      setTimeout(() => {
        quoteForm.style.display = 'none';
        if (formSuccess) formSuccess.classList.add('show');
        setTimeout(() => {
          window.open(`https://wa.me/${SITE.whatsappNumber}?text=${waMessage}`, '_blank');
        }, 1500);
      }, 1200);
    });
  }

  /* ---- Scroll to Top ---- */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 600);
    }, { passive: true });
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  }

  /* ---- Animated Counters (Hero Stats) ---- */
  const heroStats = document.querySelector('.hero-stats');
  if (heroStats && !prefersReducedMotion) {
    const statNumbers = heroStats.querySelectorAll('.hero-stat-number');
    let statsCounted = false;

    const animateCounters = () => {
      if (statsCounted) return;
      statsCounted = true;
      statNumbers.forEach(stat => {
        const text = stat.textContent;
        const match = text.match(/(\d+)/);
        if (!match) return;
        const target = parseInt(match[1], 10);
        const suffix = text.replace(match[1], '');
        const duration = 2000;
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          stat.textContent = Math.min(Math.round(target * step / steps), target) + suffix;
          if (step >= steps) { stat.textContent = text; clearInterval(timer); }
        }, duration / steps);
      });
    };

    const statsObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { animateCounters(); statsObserver.disconnect(); }
    }, { threshold: 0.5 });
    statsObserver.observe(heroStats);
  }

  /* ---- Parallax on hero (skipped for reduced motion) ---- */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.1) translateY(${scrolled * 0.15}px)`;
      }
    }, { passive: true });
  }
});
