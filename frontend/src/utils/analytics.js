/**
 * Analytics Tracking Hooks
 * 
 * Add event listeners to CTAs with data attributes for A/B testing.
 * Usage: Import and call setupCTATracking() after component mount.
 */

import { trackCTAClick } from '../config/heroVariants';

/**
 * Set up click tracking for all CTAs with data attributes
 * Call this in useEffect or after DOM is ready
 */
export const setupCTATracking = () => {
  const ctaButtons = document.querySelectorAll('[data-variant][data-cta]');
  
  ctaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const variant = e.currentTarget.getAttribute('data-variant');
      const ctaType = e.currentTarget.getAttribute('data-cta');
      
      trackCTAClick(variant, ctaType);
    });
  });
  
  console.log(`✅ Tracking enabled for ${ctaButtons.length} CTA buttons`);
};

/**
 * Track custom events (optional - for additional tracking needs)
 */
export const trackCustomEvent = (eventName, properties = {}) => {
  if (window.gtag) {
    window.gtag('event', eventName, properties);
  }
  
  console.log('Custom Event:', { eventName, properties, timestamp: new Date().toISOString() });
  
  // Add your custom analytics here
};

/**
 * React Hook for CTA tracking
 * Usage in component: useCTATracking();
 */
export const useCTATracking = () => {
  if (typeof window !== 'undefined') {
    // For React - add to useEffect
    // useEffect(() => {
    //   setupCTATracking();
    //   return () => cleanup if needed
    // }, []);
    
    setupCTATracking();
  }
};

export default {
  setupCTATracking,
  trackCustomEvent,
  useCTATracking
};
