/**
 * Example: How to use dynamic variants from config
 * 
 * This shows how to make Hero.jsx fully dynamic based on heroVariants.js config.
 * Currently, Variant B is hardcoded. Use this pattern to make it configurable.
 */

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Play, Youtube } from 'lucide-react'
import { useEffect } from 'react'
import { setupCTATracking } from '../utils/analytics'
import { getActiveVariant } from '../config/heroVariants'

const HeroDynamic = () => {
  const variant = getActiveVariant();
  
  useEffect(() => {
    setupCTATracking();
  }, []);

  const scrollToAI = () => {
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.6, 0.05, 0.01, 0.9] }
    }
  }

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto space-y-6"
          >
            {/* Dynamic H1 from config */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight space-y-2"
              data-variant={variant.id}
            >
              <span className="block text-white text-left pl-4 sm:pl-6">
                {variant.h1Line1}
              </span>
              <span className="block bg-gradient-to-r from-sky-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent drop-shadow-sm text-left pl-4 sm:pl-6 md:pl-[42%] lg:pl-[44%] xl:pl-[45%]">
                {variant.h1Line2}
              </span>
            </motion.h1>

            {/* Dynamic Subheadline from config */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl mx-auto font-light"
            >
              {variant.subheadline}
            </motion.p>

            {/* Dynamic CTAs from config */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2"
            >
              {/* Primary CTA */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToAI}
                data-variant={variant.id}
                data-cta="primary"
                aria-label={variant.primaryAriaLabel}
                className="group px-10 py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-400 hover:via-cyan-400 hover:to-blue-400 rounded-full font-bold text-white text-base shadow-xl shadow-sky-500/30 hover:shadow-sky-400/50 transition-all duration-300 flex items-center justify-center gap-3 min-w-[240px]"
              >
                <Sparkles className="w-5 h-5" />
                <span>{variant.primaryCTA}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Secondary CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToAI}
                data-variant={variant.id}
                data-cta="secondary"
                aria-label={variant.secondaryAriaLabel}
                className="px-6 py-3 text-sky-400 hover:text-sky-300 font-semibold text-base transition-colors duration-300 flex items-center justify-center gap-2 underline decoration-sky-400/30 hover:decoration-sky-300/50 underline-offset-4"
              >
                <Play className="w-4 h-4" />
                <span>{variant.secondaryCTA}</span>
              </motion.button>
            </motion.div>

            {/* Tech icons, stats, etc. - rest of your Hero component */}
            
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default HeroDynamic

/**
 * USAGE:
 * 
 * 1. Replace Hero.jsx with this file OR
 * 2. Copy the dynamic parts (getActiveVariant, variant.* references)
 * 3. Change ACTIVE_VARIANT in heroVariants.js to test different versions
 * 4. Track results in analytics
 */
