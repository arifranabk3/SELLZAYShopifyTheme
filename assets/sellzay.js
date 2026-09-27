'use strict';

document.addEventListener('DOMContentLoaded', () => {
  console.log('SellZeo theme initialized.');

  // Categories Dropdown functionality
  const categoriesToggle = document.querySelector('[data-sellzay-categories-toggle]');
  const categoriesMenu = document.querySelector('[data-sellzay-categories-menu]');

  if (categoriesToggle && categoriesMenu) {
    const toggleDropdown = () => {
      const isExpanded = categoriesToggle.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        categoriesToggle.setAttribute('aria-expanded', 'false');
        categoriesMenu.classList.remove('is-open');
      } else {
        categoriesToggle.setAttribute('aria-expanded', 'true');
        categoriesMenu.classList.add('is-open');
      }
    };

    categoriesToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleDropdown();
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!categoriesToggle.contains(e.target) && !categoriesMenu.contains(e.target)) {
        if (categoriesToggle.getAttribute('aria-expanded') === 'true') {
          categoriesToggle.setAttribute('aria-expanded', 'false');
          categoriesMenu.classList.remove('is-open');
        }
      }
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && categoriesToggle.getAttribute('aria-expanded') === 'true') {
        categoriesToggle.setAttribute('aria-expanded', 'false');
        categoriesMenu.classList.remove('is-open');
        categoriesToggle.focus();
      }
    });
  }

  // Hero Slider functionality
  const heroSection = document.querySelector('[data-sellzay-hero]');
  if (heroSection) {
    const slides = heroSection.querySelectorAll('[data-sellzay-hero-slide]');
    const prevBtn = heroSection.querySelector('[data-sellzay-hero-prev]');
    const nextBtn = heroSection.querySelector('[data-sellzay-hero-next]');
    const dots = heroSection.querySelectorAll('[data-sellzay-hero-dot]');
    
    let currentSlide = 0;
    let autoplayTimer = null;
    const isAutoplayEnabled = heroSection.dataset.autoplay === 'true';
    const autoplayInterval = parseInt(heroSection.dataset.autoplayInterval, 10) || 5000;
    
    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const goToSlide = (index) => {
      slides[currentSlide].classList.remove('is-active');
      if (dots.length > 0) {
        dots[currentSlide].classList.remove('is-active');
        dots[currentSlide].setAttribute('aria-current', 'false');
      }
      
      currentSlide = (index + slides.length) % slides.length;
      
      slides[currentSlide].classList.add('is-active');
      if (dots.length > 0) {
        dots[currentSlide].classList.add('is-active');
        dots[currentSlide].setAttribute('aria-current', 'true');
      }
    };

    const nextSlide = () => goToSlide(currentSlide + 1);
    const prevSlide = () => goToSlide(currentSlide - 1);

    const startAutoplay = () => {
      if (isAutoplayEnabled && slides.length > 1 && !prefersReducedMotion) {
        stopAutoplay();
        autoplayTimer = setInterval(nextSlide, autoplayInterval);
      }
    };

    const stopAutoplay = () => {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    };

    const resetAutoplay = () => {
      stopAutoplay();
      startAutoplay();
    };

    if (slides.length > 1) {
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          nextSlide();
          resetAutoplay();
        });
      }
      
      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          prevSlide();
          resetAutoplay();
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          resetAutoplay();
        });
      });
      
      // Pause on hover
      heroSection.addEventListener('mouseenter', stopAutoplay);
      heroSection.addEventListener('mouseleave', startAutoplay);
      
      startAutoplay();
    }
  }
});
