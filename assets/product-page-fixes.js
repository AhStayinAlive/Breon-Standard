// Product Page JavaScript Fixes
// Add this script to your product page template

document.addEventListener('DOMContentLoaded', function() {
  
  // 1. Fix third image display issue
  function fixThirdImageDisplay() {
    const productImages = document.querySelectorAll('.product__media img, .product__media-item img, .slider__slide img');
    productImages.forEach((img, index) => {
      if (index === 2) { // Third image (0-indexed)
        img.style.objectFit = 'contain';
        img.style.backgroundColor = 'white';
        img.style.padding = '15px';
        img.style.borderRadius = '8px';
      }
    });
    
    // Also check for specific third slide
    const thirdSlide = document.querySelector('.product__media-item:nth-child(3) img, .slider__slide:nth-child(3) img');
    if (thirdSlide) {
      thirdSlide.style.objectFit = 'contain';
      thirdSlide.style.backgroundColor = 'white';
      thirdSlide.style.padding = '15px';
      thirdSlide.style.borderRadius = '8px';
    }
  }

  // 2. Handle clicked image from product grid
  function handleImageFromGrid() {
    const urlParams = new URLSearchParams(window.location.search);
    const mediaId = urlParams.get('media');
    const variantId = urlParams.get('variant');
    
    if (mediaId) {
      // Find and activate the correct slide
      const targetSlide = document.querySelector(`[data-media-id*="${mediaId}"]`);
      const targetThumbnail = document.querySelector(`[data-target*="${mediaId}"]`);
      
      if (targetSlide) {
        // Remove active class from current slide
        const currentActive = document.querySelector('.product__media-item.is-active');
        if (currentActive) {
          currentActive.classList.remove('is-active');
        }
        
        // Add active class to target slide
        targetSlide.classList.add('is-active');
        
        // Update thumbnail if exists
        if (targetThumbnail) {
          const currentActiveThumbnail = document.querySelector('.thumbnail[aria-current="true"]');
          if (currentActiveThumbnail) {
            currentActiveThumbnail.removeAttribute('aria-current');
          }
          const thumbButton = targetThumbnail.querySelector('.thumbnail');
          if (thumbButton) {
            thumbButton.setAttribute('aria-current', 'true');
          }
        }
        
        // Scroll to the target slide
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    
    if (variantId) {
      const targetVariant = document.querySelector(`[data-variant-id="${variantId}"]`);
      if (targetVariant) {
        targetVariant.click();
      }
    }
  }

  // 3. Remove orange badges and elements
  function removeOrangeElements() {
    const orangeSelectors = [
      '.orange',
      '.badge.orange',
      '[class*="orange"]',
      '.tag.orange',
      'span.orange',
      '[style*="orange"]',
      '[style*="#ff6600"]',
      '[style*="#ff8800"]',
      '[style*="rgb(255, 102, 0)"]'
    ];
    
    orangeSelectors.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.remove();
      });
    });
  }

  // 4. Create sticky talk to specialist button if it doesn't exist
  function createStickySpecialistButton() {
    // Remove any existing specialist buttons from header/top
    const topButtons = document.querySelectorAll('.hero-section .specialist-btn, .header .specialist-btn, .top-specialist-btn');
    topButtons.forEach(btn => btn.remove());
    
    // Check if sticky button already exists
    if (!document.querySelector('.sticky-specialist-btn')) {
      const stickyBtn = document.createElement('a');
      stickyBtn.href = 'tel:+639190740658'; // Update with your phone number
      stickyBtn.className = 'sticky-specialist-btn';
      stickyBtn.textContent = 'Talk to a Specialist';
      stickyBtn.setAttribute('aria-label', 'Call specialist for product consultation');
      
      document.body.appendChild(stickyBtn);
    }
  }

  // 5. Enhance product cards for better clicking experience
  function enhanceProductCards() {
    const productCards = document.querySelectorAll('.card-wrapper, .product-card-wrapper');
    productCards.forEach(card => {
      const productLink = card.querySelector('a[href*="/products/"]');
      const productImage = card.querySelector('img');
      
      if (productLink && productImage) {
        const mediaId = productImage.getAttribute('data-media-id');
        if (mediaId) {
          productLink.addEventListener('click', function(e) {
            e.preventDefault();
            const baseUrl = this.href;
            const urlWithMedia = baseUrl + (baseUrl.includes('?') ? '&' : '?') + 'media=' + mediaId;
            window.location.href = urlWithMedia;
          });
        }
      }
      
      // Add hover effects
      card.style.transition = 'all 0.3s ease';
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px)';
        this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
      });
    });
  }

  // 6. Lazy loading enhancement
  function enhanceLazyLoading() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.addEventListener('load', function() {
        this.classList.add('loaded');
      });
    });
  }

  // 7. Media gallery improvements
  function improveMediaGallery() {
    const mediaGallery = document.querySelector('media-gallery');
    if (mediaGallery) {
      // Add smooth transitions
      const slides = mediaGallery.querySelectorAll('.product__media-item');
      slides.forEach(slide => {
        slide.style.transition = 'all 0.3s ease';
      });
      
      // Improve thumbnail clicking
      const thumbnails = mediaGallery.querySelectorAll('.thumbnail');
      thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
          // Add visual feedback
          this.style.transform = 'scale(0.95)';
          setTimeout(() => {
            this.style.transform = 'scale(1.05)';
          }, 100);
        });
      });
    }
  }

  // 8. Handle variant changes to ensure proper image display
  function handleVariantChanges() {
    const variantSelectors = document.querySelectorAll('input[name="id"], select[name="id"]');
    variantSelectors.forEach(selector => {
      selector.addEventListener('change', function() {
        // Re-apply third image fix after variant change
        setTimeout(() => {
          fixThirdImageDisplay();
        }, 100);
      });
    });
  }

  // 9. Clean up URL after loading
  function cleanUpURL() {
    // Remove media parameter from URL after initial load to keep URL clean
    setTimeout(() => {
      const url = new URL(window.location);
      const hasMedia = url.searchParams.has('media');
      if (hasMedia) {
        // Keep the functionality but clean URL for sharing
        const cleanUrl = url.pathname + (url.search.replace(/[?&]media=[^&]*/, '').replace(/^&/, '?') || '');
        history.replaceState(null, '', cleanUrl || url.pathname);
      }
    }, 2000);
  }

  // 10. Mobile optimizations
  function mobileOptimizations() {
    if (window.innerWidth <= 768) {
      // Adjust sticky button for mobile
      const stickyBtn = document.querySelector('.sticky-specialist-btn');
      if (stickyBtn) {
        stickyBtn.style.bottom = '20px';
        stickyBtn.style.right = '20px';
        stickyBtn.style.padding = '0.75rem 1.25rem';
        stickyBtn.style.fontSize = '0.8rem';
      }
      
      // Improve touch interactions
      const buttons = document.querySelectorAll('.btn, .button, .thumbnail');
      buttons.forEach(btn => {
        btn.style.touchAction = 'manipulation';
      });
    }
  }

  // 11. Enhance form interactions
  function enhanceFormInteractions() {
    const addToCartForms = document.querySelectorAll('form[action*="cart/add"]');
    addToCartForms.forEach(form => {
      form.addEventListener('submit', function(e) {
        const submitBtn = this.querySelector('[type="submit"]');
        if (submitBtn) {
          submitBtn.style.opacity = '0.7';
          submitBtn.disabled = true;
          
          // Re-enable after 2 seconds
          setTimeout(() => {
            submitBtn.style.opacity = '1';
            submitBtn.disabled = false;
          }, 2000);
        }
      });
    });
  }

  // 12. Keyboard navigation improvements
  function improveKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(el => {
      el.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && this.tagName === 'A') {
          this.click();
        }
      });
    });
  }

  // 13. Performance optimizations
  function performanceOptimizations() {
    // Lazy load images that are far from viewport
    const images = document.querySelectorAll('img:not([loading])');
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          observer.unobserve(img);
        }
      });
    });

    images.forEach(img => {
      if (img.getBoundingClientRect().top > window.innerHeight * 2) {
        imageObserver.observe(img);
      }
    });
  }

  // 14. Error handling for images
  function handleImageErrors() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      img.addEventListener('error', function() {
        this.style.display = 'none';
        console.warn('Failed to load image:', this.src);
      });
    });
  }

  // 15. Accessibility improvements
  function improveAccessibility() {
    // Add proper ARIA labels
    const mediaItems = document.querySelectorAll('.product__media-item');
    mediaItems.forEach((item, index) => {
      item.setAttribute('aria-label', `Product image ${index + 1}`);
    });

    // Ensure buttons have proper labels
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    buttons.forEach(btn => {
      if (btn.textContent.trim() === '') {
        btn.setAttribute('aria-label', 'Button');
      }
    });
  }

  // Execute all fixes
  fixThirdImageDisplay();
  handleImageFromGrid();
  removeOrangeElements();
  createStickySpecialistButton();
  enhanceProductCards();
  enhanceLazyLoading();
  improveMediaGallery();
  handleVariantChanges();
  cleanUpURL();
  mobileOptimizations();
  enhanceFormInteractions();
  improveKeyboardNavigation();
  performanceOptimizations();
  handleImageErrors();
  improveAccessibility();

  // Re-run some fixes on window resize
  window.addEventListener('resize', function() {
    mobileOptimizations();
  });

  // Re-run fixes when new content is loaded (for AJAX)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.addedNodes.length) {
        setTimeout(() => {
          fixThirdImageDisplay();
          removeOrangeElements();
          enhanceProductCards();
        }, 100);
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  console.log('Product page fixes applied successfully!');
});

// Additional utility functions
window.productPageUtils = {
  // Function to manually trigger image fix
  fixImages: function() {
    const productImages = document.querySelectorAll('.product__media img, .product__media-item img');
    productImages.forEach((img, index) => {
      if (index === 2) {
        img.style.objectFit = 'contain';
        img.style.backgroundColor = 'white';
        img.style.padding = '15px';
        img.style.borderRadius = '8px';
      }
    });
  },
  
  // Function to manually remove orange elements
  removeOrange: function() {
    const elements = document.querySelectorAll('.orange, [class*="orange"], [style*="orange"]');
    elements.forEach(el => el.remove());
  },
  
  // Function to highlight specific media
  showMedia: function(mediaId) {
    const target = document.querySelector(`[data-media-id*="${mediaId}"]`);
    if (target) {
      const current = document.querySelector('.product__media-item.is-active');
      if (current) current.classList.remove('is-active');
      target.classList.add('is-active');
      target.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  // Function to update phone number
  updatePhoneNumber: function(newNumber) {
    const stickyBtn = document.querySelector('.sticky-specialist-btn');
    if (stickyBtn) {
      stickyBtn.href = `tel:${newNumber}`;
    }
  },
  
  // Function to toggle specialist button visibility
  toggleSpecialistButton: function(show = true) {
    const stickyBtn = document.querySelector('.sticky-specialist-btn');
    if (stickyBtn) {
      stickyBtn.style.display = show ? 'block' : 'none';
    }
  }
};

// Track product clicks for analytics (optional)
function trackProductClick(mediaId, productUrl) {
  // Add your analytics tracking here
  if (typeof gtag !== 'undefined') {
    gtag('event', 'product_click', {
      'media_id': mediaId,
      'product_url': productUrl
    });
  }
  
  if (mediaId) {
    const urlWithMedia = productUrl + (productUrl.includes('?') ? '&' : '?') + 'media=' + mediaId;
    window.location.href = urlWithMedia;
    return false;
  }
  return true;
}