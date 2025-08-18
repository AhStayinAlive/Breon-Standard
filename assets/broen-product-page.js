// assets/broen-product-page.js

class BroenProductPage {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
    this.removeOrangeElements();
    this.initializeComponents();
    this.setupAccessibility();
    this.handleUrlParameters();
  }

  bindEvents() {
    document.addEventListener('DOMContentLoaded', () => {
      this.setupColorTypes();
      this.setupMortiseOptions();
      this.setupCarousels();
      this.setupStickyButton();
      this.setupFormValidation();
      this.trackProductInteractions();
    });

    // Re-run orange removal on DOM changes
    const observer = new MutationObserver(() => this.removeOrangeElements());
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupColorTypes() {
    const colorTypes = document.querySelectorAll('.broen-color-type');
    colorTypes.forEach((type, index) => {
      type.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectColorType(type, index);
      });

      type.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectColorType(type, index);
        }
      });

      // Make focusable
      type.setAttribute('tabindex', '0');
      type.setAttribute('role', 'button');
      type.setAttribute('aria-label', `Select Color Type ${index + 1}`);
    });
  }

  selectColorType(selectedType, index) {
    const colorTypes = document.querySelectorAll('.broen-color-type');
    colorTypes.forEach(type => {
      type.classList.remove('active');
      type.setAttribute('aria-selected', 'false');
    });
    
    selectedType.classList.add('active');
    selectedType.setAttribute('aria-selected', 'true');
    
    // Update product variant if available
    this.updateProductVariant('color', index + 1);
    
    // Track selection
    this.trackEvent('color_type_selected', { type: index + 1 });
  }

  setupMortiseOptions() {
    const mortiseOptions = document.querySelectorAll('.broen-mortise-option');
    mortiseOptions.forEach((option, index) => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectMortiseOption(option, index);
      });

      option.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectMortiseOption(option, index);
        }
      });

      // Make focusable
      option.setAttribute('tabindex', '0');
      option.setAttribute('role', 'button');
      option.setAttribute('aria-label', `Select Mortise Type ${index + 1}`);
    });
  }

  selectMortiseOption(selectedOption, index) {
    const mortiseOptions = document.querySelectorAll('.broen-mortise-option');
    mortiseOptions.forEach(option => {
      option.classList.remove('active');
      option.setAttribute('aria-selected', 'false');
    });
    
    selectedOption.classList.add('active');
    selectedOption.setAttribute('aria-selected', 'true');
    
    // Update product variant if available
    this.updateProductVariant('mortise', index + 1);
    
    // Track selection
    this.trackEvent('mortise_type_selected', { type: index + 1 });
  }

  setupCarousels() {
    // Setup About Product Carousel
    this.setupCarousel('.broen-horizontal-carousel', 'about_product');
    
    // Setup Service Carousel
    this.setupCarousel('.broen-service-carousel', 'after_sales_service');
  }

  setupCarousel(selector, trackingName) {
    const carousel = document.querySelector(selector);
    if (!carousel) return;

    const items = carousel.querySelectorAll('.broen-carousel-item, .broen-service-item');
    items.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        this.selectCarouselItem(carousel, item, index, trackingName);
      });

      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.selectCarouselItem(carousel, item, index, trackingName);
        }
      });

      // Make focusable
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.setAttribute('aria-label', `View ${trackingName} item ${index + 1}`);
    });
  }

  selectCarouselItem(carousel, selectedItem, index, trackingName) {
    const items = carousel.querySelectorAll('.broen-carousel-item, .broen-service-item');
    items.forEach(item => {
      item.classList.remove('active');
      item.setAttribute('aria-selected', 'false');
    });
    
    selectedItem.classList.add('active');
    selectedItem.setAttribute('aria-selected', 'true');
    
    // Track selection
    this.trackEvent(`${trackingName}_item_selected`, { item: index + 1 });
  }

  setupStickyButton() {
    const stickyButton = document.querySelector('.broen-specialist-btn');
    if (!stickyButton) return;

    // Track clicks on specialist button
    stickyButton.addEventListener('click', (e) => {
      // Let the default action proceed (Viber link)
      this.trackEvent('specialist_button_clicked', { source: 'sticky_button' });
      
      // Add success feedback
      this.showButtonFeedback(stickyButton);
    });

    // Handle keyboard navigation
    stickyButton.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stickyButton.click();
      }
    });
  }

  showButtonFeedback(button) {
    const originalText = button.textContent;
    button.textContent = 'Opening Viber...';
    button.style.background = 'linear-gradient(135deg, #4ECDC4 0%, #614524 100%)';
    
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = '';
    }, 2000);
  }

  setupFormValidation() {
    const addToCartBtn = document.querySelector('.broen-add-to-cart-btn');
    const productForm = document.querySelector('.product-form form');
    
    if (!addToCartBtn || !productForm) return;

    addToCartBtn.addEventListener('click', (e) => {
      // Validate selections
      const hasColorSelection = document.querySelector('.broen-color-type.active');
      const hasMortiseSelection = document.querySelector('.broen-mortise-option.active');
      
      if (!hasColorSelection) {
        e.preventDefault();
        this.showValidationError('Please select a color type');
        return;
      }
      
      if (!hasMortiseSelection) {
        e.preventDefault();
        this.showValidationError('Please select a mortise type');
        return;
      }
      
      // Track successful add to cart
      this.trackEvent('add_to_cart_attempted', {
        product_id: this.getProductId(),
        color_type: this.getSelectedColorType(),
        mortise_type: this.getSelectedMortiseType()
      });
      
      // Show loading state
      this.showLoadingState(addToCartBtn);
    });
  }

  showValidationError(message) {
    // Remove existing error
    const existingError = document.querySelector('.broen-validation-error');
    if (existingError) existingError.remove();
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'broen-validation-error';
    errorDiv.style.cssText = `
      background: #dc3545;
      color: white;
      padding: 1rem;
      border-radius: 8px;
      margin: 1rem 0;
      text-align: center;
      font-weight: 600;
      animation: fadeIn 0.3s ease;
    `;
    errorDiv.textContent = message;
    
    // Insert before add to cart button
    const addToCartBtn = document.querySelector('.broen-add-to-cart-btn');
    addToCartBtn.parentNode.insertBefore(errorDiv, addToCartBtn);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 3000);
  }

  showLoadingState(button) {
    const originalText = button.textContent;
    button.textContent = 'Adding to Cart...';
    button.disabled = true;
    button.style.background = '#6c757d';
    
    // Reset after 3 seconds (in case form doesn't redirect)
    setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      button.style.background = '';
    }, 3000);
  }

  updateProductVariant(type, value) {
    // Update hidden form fields if they exist
    const form = document.querySelector('.product-form form');
    if (!form) return;
    
    // Find or create hidden input for the variant option
    let input = form.querySelector(`input[name="properties[${type}]"]`);
    if (!input) {
      input = document.createElement('input');
      input.type = 'hidden';
      input.name = `properties[${type}]`;
      form.appendChild(input);
    }
    input.value = value;
  }

  removeOrangeElements() {
    // Comprehensive orange element removal
    const selectors = [
      '[style*="orange"]:not(.broen-video-badge):not(.broen-carousel-label):not(.broen-demo-label)',
      '[class*="orange"]:not(.broen-video-badge):not(.broen-carousel-label):not(.broen-demo-label)',
      '.price__badge-sale',
      '.price__sale',
      '.badge--sale',
      '.product__text--variant-sold-out-message',
      '.shopify-payment-button'
    ];
    
    selectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Check if it's actually orange-colored and not one of our branded elements
        if (this.isOrangeElement(el) && !this.isBroenBrandedElement(el)) {
          el.style.display = 'none';
        }
      });
    });
  }

  isOrangeElement(element) {
    const style = window.getComputedStyle(element);
    const bgColor = style.backgroundColor;
    const color = style.color;
    const className = element.className.toLowerCase();
    
    return (
      bgColor.includes('orange') ||
      color.includes('orange') ||
      className.includes('orange') ||
      bgColor.includes('255, 165, 0') || // orange RGB
      bgColor.includes('255, 140, 0')    // dark orange RGB
    );
  }

  isBroenBrandedElement(element) {
    return element.classList.contains('broen-video-badge') ||
           element.classList.contains('broen-carousel-label') ||
           element.classList.contains('broen-demo-label') ||
           element.closest('.broen-video-badge') ||
           element.closest('.broen-carousel-label') ||
           element.closest('.broen-demo-label');
  }

  initializeComponents() {
    // Set default selections
    this.setDefaultSelections();
    
    // Initialize media gallery enhancements
    this.enhanceMediaGallery();
    
    // Initialize intersection observer for animations
    this.setupIntersectionObserver();
  }

  setDefaultSelections() {
    // Set first color type as active if none selected
    const firstColorType = document.querySelector('.broen-color-type:first-child');
    if (firstColorType && !document.querySelector('.broen-color-type.active')) {
      firstColorType.classList.add('active');
      firstColorType.setAttribute('aria-selected', 'true');
    }
    
    // Set first mortise option as active if none selected
    const firstMortiseOption = document.querySelector('.broen-mortise-option:first-child');
    if (firstMortiseOption && !document.querySelector('.broen-mortise-option.active')) {
      firstMortiseOption.classList.add('active');
      firstMortiseOption.setAttribute('aria-selected', 'true');
    }
    
    // Set first carousel items as active
    const firstAboutItem = document.querySelector('.broen-horizontal-carousel .broen-carousel-item:first-child');
    if (firstAboutItem && !document.querySelector('.broen-horizontal-carousel .broen-carousel-item.active')) {
      firstAboutItem.classList.add('active');
      firstAboutItem.setAttribute('aria-selected', 'true');
    }
    
    const firstServiceItem = document.querySelector('.broen-service-carousel .broen-service-item:first-child');
    if (firstServiceItem && !document.querySelector('.broen-service-carousel .broen-service-item.active')) {
      firstServiceItem.classList.add('active');
      firstServiceItem.setAttribute('aria-selected', 'true');
    }
  }

  enhanceMediaGallery() {
    const mediaImages = document.querySelectorAll('.product__media img');
    mediaImages.forEach(img => {
      img.addEventListener('load', () => {
        img.style.opacity = '1';
      });
      
      // Fix third image display issue
      if (img.src && this.isThirdImage(img)) {
        img.style.objectFit = 'contain';
        img.style.backgroundColor = 'white';
        img.style.padding = '10px';
      }
    });
  }

  isThirdImage(img) {
    const mediaItems = document.querySelectorAll('.product__media');
    const imgMedia = img.closest('.product__media');
    const index = Array.from(mediaItems).indexOf(imgMedia);
    return index === 2; // Third image (0-indexed)
  }

  setupIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animationPlayState = 'running';
        }
      });
    }, observerOptions);
    
    // Observe animated sections
    const animatedSections = document.querySelectorAll('.broen-about-section, .broen-how-it-works, .broen-after-sales');
    animatedSections.forEach(section => {
      section.style.animationPlayState = 'paused';
      observer.observe(section);
    });
  }

  setupAccessibility() {
    // Add ARIA labels and roles
    const productContainer = document.querySelector('.product__info-container');
    if (productContainer) {
      productContainer.setAttribute('role', 'main');
      productContainer.setAttribute('aria-label', 'Product Information');
    }
    
    // Add skip link for keyboard users
    this.addSkipLink();
    
    // Handle keyboard navigation
    this.setupKeyboardNavigation();
  }

  addSkipLink() {
    const skipLink = document.createElement('a');
    skipLink.href = '#product-info';
    skipLink.textContent = 'Skip to product information';
    skipLink.className = 'broen-skip-link';
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--broen-black);
      color: var(--broen-white);
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', () => {
      skipLink.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', () => {
      skipLink.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add target ID
    const productInfo = document.querySelector('.product__info-container');
    if (productInfo) {
      productInfo.id = 'product-info';
    }
  }

  setupKeyboardNavigation() {
    // Tab navigation for interactive elements
    const interactiveElements = document.querySelectorAll(
      '.broen-color-type, .broen-mortise-option, .broen-carousel-item, .broen-service-item, .broen-specialist-btn, .broen-add-to-cart-btn'
    );
    
    interactiveElements.forEach(element => {
      element.addEventListener('focus', () => {
        element.style.outline = '3px solid var(--broen-accent)';
        element.style.outlineOffset = '2px';
      });
      
      element.addEventListener('blur', () => {
        element.style.outline = '';
        element.style.outlineOffset = '';
      });
    });
  }

  handleUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Handle media parameter for direct image viewing
    const mediaId = urlParams.get('media');
    if (mediaId) {
      this.showSpecificMedia(mediaId);
    }
    
    // Handle product configuration from URL
    const colorType = urlParams.get('color');
    const mortiseType = urlParams.get('mortise');
    
    if (colorType) {
      this.selectColorTypeByValue(colorType);
    }
    
    if (mortiseType) {
      this.selectMortiseTypeByValue(mortiseType);
    }
  }

  showSpecificMedia(mediaId) {
    const mediaElement = document.querySelector(`[data-media-id="${mediaId}"]`);
    if (mediaElement) {
      mediaElement.scrollIntoView({ behavior: 'smooth' });
      mediaElement.focus();
    }
  }

  selectColorTypeByValue(value) {
    const colorTypes = document.querySelectorAll('.broen-color-type');
    const targetIndex = parseInt(value) - 1;
    if (colorTypes[targetIndex]) {
      this.selectColorType(colorTypes[targetIndex], targetIndex);
    }
  }

  selectMortiseTypeByValue(value) {
    const mortiseOptions = document.querySelectorAll('.broen-mortise-option');
    const targetIndex = parseInt(value) - 1;
    if (mortiseOptions[targetIndex]) {
      this.selectMortiseOption(mortiseOptions[targetIndex], targetIndex);
    }
  }

  trackProductInteractions() {
    // Track product view
    this.trackEvent('product_viewed', {
      product_id: this.getProductId(),
      product_name: this.getProductName(),
      timestamp: new Date().toISOString()
    });
    
    // Track scroll depth
    this.trackScrollDepth();
    
    // Track time on page
    this.trackTimeOnPage();
  }

  trackScrollDepth() {
    let maxScrollDepth = 0;
    const sections = [
      '.broen-product-header',
      '.broen-color-section',
      '.broen-mortise-section',
      '.broen-about-section',
      '.broen-how-it-works',
      '.broen-after-sales'
    ];
    
    window.addEventListener('scroll', () => {
      const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
      
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        
        // Track milestone percentages
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          this.trackEvent('scroll_depth', { depth: scrollPercent });
        }
      }
      
      // Track section visibility
      sections.forEach((selector, index) => {
        const section = document.querySelector(selector);
        if (section && this.isElementInViewport(section)) {
          this.trackEvent('section_viewed', { 
            section: selector.replace('.broen-', ''),
            order: index + 1
          });
        }
      });
    });
  }

  trackTimeOnPage() {
    const startTime = Date.now();
    
    // Track time milestones
    const milestones = [30, 60, 120, 300]; // seconds
    milestones.forEach(seconds => {
      setTimeout(() => {
        this.trackEvent('time_on_page', { seconds });
      }, seconds * 1000);
    });
    
    // Track exit intent
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0) {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        this.trackEvent('exit_intent', { time_spent: timeOnPage });
      }
    });
    
    // Track page unload
    window.addEventListener('beforeunload', () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      this.trackEvent('page_exit', { time_spent: timeOnPage });
    });
  }

  isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  trackEvent(eventName, data = {}) {
    // Google Analytics 4 tracking
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, {
        event_category: 'product_page',
        event_label: this.getProductName(),
        ...data
      });
    }
    
    // Facebook Pixel tracking
    if (typeof fbq !== 'undefined') {
      fbq('trackCustom', eventName, data);
    }
    
    // Console log for debugging
    console.log('Broen Event Tracked:', eventName, data);
  }

  getProductId() {
    const form = document.querySelector('.product-form form');
    if (form) {
      const idInput = form.querySelector('input[name="id"]');
      return idInput ? idInput.value : null;
    }
    return null;
  }

  getProductName() {
    const nameElement = document.querySelector('.broen-product-name');
    return nameElement ? nameElement.textContent.trim() : 'Unknown Product';
  }

  getSelectedColorType() {
    const activeColor = document.querySelector('.broen-color-type.active');
    if (activeColor) {
      const colorTypes = document.querySelectorAll('.broen-color-type');
      return Array.from(colorTypes).indexOf(activeColor) + 1;
    }
    return null;
  }

  getSelectedMortiseType() {
    const activeMortise = document.querySelector('.broen-mortise-option.active');
    if (activeMortise) {
      const mortiseOptions = document.querySelectorAll('.broen-mortise-option');
      return Array.from(mortiseOptions).indexOf(activeMortise) + 1;
    }
    return null;
  }

  // Utility methods
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  // Performance optimization
  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach(img => imageObserver.observe(img));
  }

  // Error handling
  handleErrors() {
    window.addEventListener('error', (e) => {
      this.trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        colno: e.colno
      });
    });

    window.addEventListener('unhandledrejection', (e) => {
      this.trackEvent('promise_rejection', {
        reason: e.reason
      });
    });
  }

  // Device detection for enhanced UX
  detectDevice() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bTablet\b)/i.test(navigator.userAgent);
    
    document.body.classList.add(isMobile ? 'broen-mobile' : 'broen-desktop');
    if (isTablet) document.body.classList.add('broen-tablet');
    
    return { isMobile, isTablet };
  }

  // Initialize everything
  static init() {
    return new BroenProductPage();
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => BroenProductPage.init());
} else {
  BroenProductPage.init();
}

// Export for manual initialization if needed
window.BroenProductPage = BroenProductPage;