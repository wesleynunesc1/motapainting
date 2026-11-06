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
  }

  /**
   * Transparent header with smart backdrop transition when scrolling past hero
   */
  initHeaderBehavior() {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY > 50) {
        this.header.classList.add('header-scrolled');
      } else {
        this.header.classList.remove('header-scrolled');
      }
    }, { passive: true });
  }

  /**
   * Mobile responsive drawer navigation
   */
  initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('mobile-menu-close');
    const drawer = document.getElementById('mobile-menu-drawer');
    const links = document.querySelectorAll('.mobile-link');

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
    };

    if (toggleBtn) toggleBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    links.forEach(l => l.addEventListener('click', closeMenu));
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
}

// Instantiate on DOM load
window.addEventListener('DOMContentLoaded', () => {
  new MotaExperience();
});
