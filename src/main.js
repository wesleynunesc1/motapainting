import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mota Painting Services — Ultra-Smooth Cinematic Core Engine
 */
class MotaExperience {
  constructor() {
    this.video = document.getElementById('hero-video');
    this.heroSection = document.getElementById('hero');
    this.scrollIndicator = document.getElementById('hero-scroll-indicator');
    this.progressBar = document.getElementById('transformation-progress-bar');
    this.header = document.getElementById('site-header');
    
    this.targetProgress = 0;
    this.currentProgress = 0;
    this.isRendering = false;
    this.rafId = null;

    this.init();
  }

  init() {
    this.initHeaderBehavior();
    this.initMobileMenu();
    this.initHeroVideoScrubber();
    this.initServicesAnimations();
    this.initAboutAnimations();
    this.initPortfolio();
    this.initBeforeAfterSlider();
    this.initFaqAccordion();
    this.initContactForm();
    this.initBackToTop();
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
   * Scroll-Driven Video Scrubbing Engine
   * Directly drives frame position with sub-frame precision and zero jitter
   * Configured to start strictly from second 1.0 (startTime = 1.0)
   */
  initHeroVideoScrubber() {
    if (!this.video || !this.heroSection) return;

    const startTime = 1.0; // Start playback at 1 second

    this.video.muted = true;
    this.video.playsInline = true;
    
    // Play briefly then pause at 1.0s to ensure mobile iOS / Android WebKit primes the frame buffer
    const primeVideo = () => {
      this.video.currentTime = startTime;
      const playPromise = this.video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          this.video.pause();
          this.video.currentTime = startTime;
        }).catch(() => {
          this.video.currentTime = startTime;
        });
      }
    };
    primeVideo();

    const setupScrubber = () => {
      const duration = this.video.duration || 6.04;
      const scrubRange = Math.max(duration - startTime, 0.1);

      // Force video to second 1.0 immediately on load
      this.video.currentTime = startTime;

      // Responsive scroll pacing: ~200% on mobile for natural fingertip gesture, 350% on desktop
      const isMobile = window.innerWidth <= 768;
      const scrollDistance = isMobile ? '+=200%' : '+=350%';

      // Master pinned ScrollTrigger
      ScrollTrigger.create({
        trigger: this.heroSection,
        start: 'top top',
        end: scrollDistance,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        scrub: isMobile ? 0.08 : 0.15, // Ultra-responsive on mobile touch
        onUpdate: (self) => {
          this.targetProgress = self.progress;

          // Update subtle progress bar
          if (this.progressBar) {
            this.progressBar.style.width = `${self.progress * 100}%`;
          }

          // Fade out scroll indicators quickly upon scroll start
          const desktopInd = document.getElementById('hero-scroll-indicator');
          const mobileInd = document.querySelector('.mobile-scroll-indicator');
          [desktopInd, mobileInd].forEach(ind => {
            if (ind) {
              if (self.progress > 0.03) {
                ind.style.opacity = '0';
                ind.style.pointerEvents = 'none';
              } else {
                ind.style.opacity = ind === mobileInd ? '0.7' : '1';
                ind.style.pointerEvents = 'auto';
              }
            }
          });

          // Start smooth interpolation render loop
          if (!this.isRendering) {
            this.isRendering = true;
            this.renderScrub(startTime, scrubRange);
          }
        }
      });
    };

    if (this.video.readyState >= 1) {
      setupScrubber();
    } else {
      this.video.addEventListener('loadedmetadata', setupScrubber, { once: true });
    }
  }

  /**
   * Ultra-smooth physics-lerped frame synchronization loop
   * Interpolates from startTime (1.0s) to final frame
   */
  renderScrub(startTime, scrubRange) {
    if (!this.video) return;

    const delta = this.targetProgress - this.currentProgress;

    if (Math.abs(delta) > 0.0008) {
      // Smooth exponential approach towards target position
      this.currentProgress += delta * 0.28;
      const targetTime = startTime + (this.currentProgress * scrubRange);

      if (!this.video.seeking) {
        this.video.currentTime = targetTime;
      }

      this.rafId = requestAnimationFrame(() => this.renderScrub(startTime, scrubRange));
    } else {
      this.currentProgress = this.targetProgress;
      const targetTime = startTime + (this.currentProgress * scrubRange);
      this.video.currentTime = targetTime;
      this.isRendering = false;
    }
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
   * 11. Final Contact Estimate Form with Real Client-side Validation & Feedback
   */
  initContactForm() {
    const form = document.getElementById('estimate-form');
    const feedbackBox = document.getElementById('form-feedback-box');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = form.querySelector('[name="full_name"]')?.value.trim();
      const email = form.querySelector('[name="email"]')?.value.trim();
      const phone = form.querySelector('[name="phone"]')?.value.trim();
      const propType = form.querySelector('[name="property_type"]')?.value;
      const service = form.querySelector('[name="service"]')?.value;
      const city = form.querySelector('[name="city"]')?.value.trim();
      const details = form.querySelector('[name="details"]')?.value.trim();

      // Basic client-side validation
      if (!name || !email || !phone || !service) {
        if (feedbackBox) {
          feedbackBox.className = 'p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-5';
          feedbackBox.innerHTML = '<strong>Please complete all required fields</strong> (Full Name, Email, Phone, and Service Needed).';
          feedbackBox.classList.remove('hidden');
        }
        return;
      }

      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        if (feedbackBox) {
          feedbackBox.className = 'p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm mb-5';
          feedbackBox.innerHTML = '<strong>Invalid Email Address.</strong> Please provide a valid email so we can reach you.';
          feedbackBox.classList.remove('hidden');
        }
        return;
      }

      // Format WhatsApp / Instant Direct Submission as actual working endpoint
      const message = `*NEW PROJECT ESTIMATE REQUEST*\n\n` +
        `*Name:* ${name}\n` +
        `*Email:* ${email}\n` +
        `*Phone:* ${phone}\n` +
        `*Property Type:* ${propType || 'Not specified'}\n` +
        `*Service Needed:* ${service}\n` +
        `*City / Location:* ${city || 'Florida'}\n` +
        `*Project Details:* ${details || 'None provided'}`;

      const whatsappUrl = `https://wa.me/19548560488?text=${encodeURIComponent(message)}`;

      if (feedbackBox) {
        feedbackBox.className = 'p-4 rounded-xl bg-[#dfa938]/15 border border-[#dfa938]/40 text-[#f3e5ab] text-sm mb-5';
        feedbackBox.innerHTML = '<strong>Estimate request generated successfully!</strong> Redirecting your project specifications to Mota Painting Services...';
        feedbackBox.classList.remove('hidden');
      }

      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 700);
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
