import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mota Painting Services — Ultra-Smooth Cinematic Core Engine
 */
class MotaExperience {
  constructor() {
    this.heroSection = document.getElementById('hero');
    this.header = document.getElementById('site-header');

    this.init();
  }

  init() {
    this.initHeaderBehavior();
    this.initMobileMenu();
    this.initHeroEntrance();
    this.initServicesAnimations();
    this.initAboutAnimations();
    this.initPortfolio();
    this.initBeforeAfterSlider();
    this.initFaqAccordion();
    this.initContactForm();
    this.initBackToTop();
  }

  /**
   * Subtle editorial fade & elevation for Hero elements on load
   */
  initHeroEntrance() {
    gsap.from('.hero-content-box > *', {
      opacity: 0,
      y: 24,
      stagger: 0.12,
      duration: 1,
      ease: 'power3.out',
      delay: 0.15
    });

    gsap.from('.hero-bg-image', {
      scale: 1.05,
      opacity: 0.85,
      duration: 1.6,
      ease: 'power2.out'
    });
  }

  /**
   * Transparent header on Hero.
   * Only activates Dark Glass background when the user reaches the white/light section (#services).
   * Updates active state of nav links based on scroll position.
   */
  initHeaderBehavior() {
    const navLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const sections = ['hero', 'services', 'our-work', 'who-we-serve', 'about', 'why-us', 'process', 'reviews', 'areas', 'faq', 'contact'];
    const servicesSection = document.getElementById('services');

    const updateHeader = () => {
      // Check if services section has reached the header
      if (servicesSection) {
        const servicesRect = servicesSection.getBoundingClientRect();
        // Trigger precisely when the top of the white section enters or passes under the header (~80px)
        if (servicesRect.top <= 80) {
          this.header.classList.add('header-scrolled');
        } else {
          this.header.classList.remove('header-scrolled');
        }
      } else {
        if (window.scrollY > 400) {
          this.header.classList.add('header-scrolled');
        } else {
          this.header.classList.remove('header-scrolled');
        }
      }

      // Dynamic Active Navigation Link Tracker
      let currentSection = 'hero';
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140 && rect.bottom >= 140) {
            currentSection = sectionId;
            break;
          }
        }
      }

      // Sync Desktop Links
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });

      // Sync Mobile Floating Menu Links
      const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
      mobileNavLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${currentSection}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    };

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // initial check
  }

  /**
   * Mobile responsive floating Dark Glass drawer navigation with Escape key & click-outside support
   */
  initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-menu-drawer');
    const card = document.getElementById('mobile-menu-card');
    const links = document.querySelectorAll('.mobile-nav-link');

    const openMenu = () => {
      drawer.classList.remove('hidden');
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
      toggleBtn.setAttribute('aria-expanded', 'true');
    };

    const closeMenu = () => {
      drawer.classList.remove('active');
      drawer.classList.add('hidden');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
      if (toggleBtn) toggleBtn.focus();
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(l => l.addEventListener('click', closeMenu));

    // Close when clicking outside the floating card (backdrop click)
    if (drawer) {
      drawer.addEventListener('click', (e) => {
        if (card && !card.contains(e.target) && !toggleBtn.contains(e.target)) {
          closeMenu();
        }
      });
    }

    // Close on Escape key press
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  /**
   * Editorial Service Section entrance animations
   */
  initServicesAnimations() {
    gsap.from('.services-header', {
      scrollTrigger: {
        trigger: '#services',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 40,
      duration: 1,
      ease: 'power3.out'
    });

    gsap.from('.service-primary-card', {
      scrollTrigger: {
        trigger: '.service-primary-card',
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 50,
      stagger: 0.15,
      duration: 1.1,
      ease: 'power3.out'
    });

    gsap.from('.service-secondary-card', {
      scrollTrigger: {
        trigger: '.service-secondary-card',
        start: 'top 88%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 35,
      stagger: 0.1,
      duration: 0.9,
      ease: 'power2.out'
    });
  }

  /**
   * About Section entrance animations (Smooth, refined fade-in without aggressive parallax)
   */
  initAboutAnimations() {
    gsap.from('.about-image-container', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      x: -30,
      duration: 1.1,
      ease: 'power3.out'
    });

    gsap.from('.about-content', {
      scrollTrigger: {
        trigger: '#about',
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
      opacity: 0,
      y: 35,
      duration: 1,
      delay: 0.15,
      ease: 'power3.out'
    });
  }

  /**
   * 03. Portfolio Filter Tabs (Commercial, Condominium, Residential, All)
   */
  initPortfolio() {
    const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
    const items = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        items.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filter === 'all' || category === filter) {
            item.style.display = 'block';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 30);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.97)';
            setTimeout(() => {
              item.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  /**
   * Interactive Before/After Comparison Drag Slider
   */
  initBeforeAfterSlider() {
    const container = document.getElementById('before-after-container');
    const beforeImage = document.getElementById('before-image-wrap');
    const handle = document.getElementById('slider-handle');
    if (!container || !beforeImage || !handle) return;

    let isDragging = false;

    const setPosition = (x) => {
      const rect = container.getBoundingClientRect();
      let percent = ((x - rect.left) / rect.width) * 100;
      if (percent < 0) percent = 0;
      if (percent > 100) percent = 100;

      beforeImage.style.width = `${percent}%`;
      handle.style.left = `${percent}%`;
    };

    const onMove = (e) => {
      if (!isDragging) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      setPosition(clientX);
    };

    const stopDragging = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      setPosition(e.clientX);
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      setPosition(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchend', stopDragging);
  }

  /**
   * 10. FAQ Single-open Accordion
   */
  initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
      const trigger = item.querySelector('.faq-trigger');
      const content = item.querySelector('.faq-content');

      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('active');

        // Close all other items (single accordion policy)
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherContent = otherItem.querySelector('.faq-content');
            if (otherContent) otherContent.style.maxHeight = null;
          }
        });

        // Toggle current item
        if (isOpen) {
          item.classList.remove('active');
          content.style.maxHeight = null;
        } else {
          item.classList.add('active');
          content.style.maxHeight = content.scrollHeight + 'px';
        }
      });
    });
  }

  /**
   * 11. Final Contact Estimate Form with Direct WhatsApp Integration
   */
  initContactForm() {
    const form = document.getElementById('contact-form');
    const feedbackBox = document.getElementById('contact-feedback');
    if (!form) return;

    const submitBtn = form.querySelector('button[type="submit"]');

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const city = form.querySelector('[name="city"]')?.value.trim();
      const propType = form.querySelector('[name="property_type"]')?.value;
      const service = form.querySelector('[name="service"]')?.value;
      const details = form.querySelector('[name="details"]')?.value.trim();

      // Reset previous feedback
      if (feedbackBox) {
        feedbackBox.classList.add('hidden');
        feedbackBox.innerHTML = '';
      }

      // 1. Client-side Validation: Required fields
      if (!name || !email || !phone || !service) {
        if (feedbackBox) {
          feedbackBox.className = 'p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm mb-6 flex items-start gap-3';
          feedbackBox.innerHTML = `
            <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <div>
              <p class="font-bold text-white text-[15px] mb-0.5">Missing Required Fields</p>
              <p class="text-white/80">Please complete Full Name, Email, Phone Number, and Service Needed.</p>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        }
        return;
      }

      // 2. Client-side Validation: Valid email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedbackBox) {
          feedbackBox.className = 'p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-200 text-sm mb-6 flex items-start gap-3';
          feedbackBox.innerHTML = `
            <svg class="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <div>
              <p class="font-bold text-white text-[15px] mb-0.5">Invalid Email Address</p>
              <p class="text-white/80">Please enter a valid email address so we can contact you.</p>
            </div>
          `;
          feedbackBox.classList.remove('hidden');
        }
        return;
      }

      // 3. Construct WhatsApp Pre-filled Message in American English
      let message = `*NEW ESTIMATE REQUEST — MOTA PAINTING SERVICES*\n\n` +
        `Hello! I'd like to request a free estimate for my project.\n\n` +
        `*CUSTOMER INFORMATION*\n\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Phone: ${phone}\n`;

      if (city) {
        message += `Location: ${city}\n`;
      }

      message += `\n*PROJECT INFORMATION*\n\n`;

      if (propType) {
        message += `Property Type: ${propType}\n`;
      }

      message += `Service Needed: ${service}\n`;

      if (details) {
        message += `\n*PROJECT DETAILS*\n${details}\n`;
      }

      message += `\nThank you! I look forward to hearing from your team.`;

      // Official WhatsApp Click-to-Chat URL
      const whatsappUrl = `https://wa.me/19548560488?text=${encodeURIComponent(message)}`;

      // 4. Subtle visual feedback on button
      if (submitBtn) {
        submitBtn.classList.add('scale-[0.98]');
        setTimeout(() => submitBtn.classList.remove('scale-[0.98]'), 200);
      }

      // 5. Open WhatsApp in new tab / application without wiping form fields
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  /**
   * Back to Top smooth scroll button
   */
  initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new MotaExperience();
});
