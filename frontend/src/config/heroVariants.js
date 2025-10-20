/**
 * Hero Section A/B Testing Configuration
 * 
 * Toggle between different headline variants for conversion optimization.
 * Track clicks with data attributes for analytics.
 */

export const HERO_VARIANTS = {
  A_ORIGINAL: {
    id: 'a-original',
    h1Line1: 'Master Web Development',
    h1Line2: 'with RAG Based AI Agent',
    subheadline: 'Learn HTML, CSS, JavaScript, and React from the Sigma Web Development Course with intelligent AI assistance and precise video timestamps.',
    primaryCTA: 'Try AI Assistant',
    secondaryCTA: 'Learn More',
    primaryAriaLabel: 'Try the AI assistant for web development learning',
    secondaryAriaLabel: 'Learn more about the web development course'
  },
  
  B_STUDENT_FRIENDLY: {
    id: 'b-student-friendly',
    h1Line1: 'Learn Web Development',
    h1Line2: 'With Your AI Tutor',
    subheadline: 'Build websites step-by-step using HTML, CSS, JavaScript, and React—get help whenever you need it.',
    primaryCTA: 'Start Learning Now',
    secondaryCTA: 'Try the AI Assistant',
    primaryAriaLabel: 'Start learning web development now with AI assistance',
    secondaryAriaLabel: 'Try the AI assistant to see how it helps you learn'
  },
  
  C_RESULTS_FOCUSED: {
    id: 'c-results-focused',
    h1Line1: 'Build Real Web Apps',
    h1Line2: 'Get Job-Ready',
    subheadline: 'Master HTML, CSS, JavaScript & React with AI-powered guidance that answers your questions instantly.',
    primaryCTA: 'Start Learning Free',
    secondaryCTA: 'See Course Content',
    primaryAriaLabel: 'Start learning web development for free',
    secondaryAriaLabel: 'View the complete course curriculum'
  }
};

// Active variant - change this to switch between variants
export const ACTIVE_VARIANT = 'B_STUDENT_FRIENDLY'; // Options: 'A_ORIGINAL', 'B_STUDENT_FRIENDLY', 'C_RESULTS_FOCUSED'

// Get current active variant configuration
export const getActiveVariant = () => HERO_VARIANTS[ACTIVE_VARIANT];

// Analytics event tracking helper
export const trackCTAClick = (variant, ctaType) => {
  // Hook for analytics platforms (Google Analytics, Mixpanel, etc.)
  if (window.gtag) {
    window.gtag('event', 'cta_click', {
      variant_id: variant,
      cta_type: ctaType,
      event_category: 'hero_conversion',
      event_label: `${variant}_${ctaType}`
    });
  }
  
  // Console log for development
  console.log('CTA Click:', { variant, ctaType, timestamp: new Date().toISOString() });
  
  // Add your analytics tracking here:
  // Example: analytics.track('Hero CTA Clicked', { variant, ctaType });
};
