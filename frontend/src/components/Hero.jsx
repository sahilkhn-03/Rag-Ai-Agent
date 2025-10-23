
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Play, ChevronDown, Youtube, Github, Linkedin } from 'lucide-react'
import { useEffect } from 'react'
import { setupCTATracking } from '../utils/analytics'

const Hero = () => {
  // Setup CTA click tracking on component mount
  useEffect(() => {
    setupCTATracking();
  }, []);

  const scrollToHome = () => {
    document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAI = () => {
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openYouTubePlaylist = () => {
    window.open('https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w', '_blank')
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  }

  const techCardVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: 0.8 + i * 0.1,
        duration: 0.6,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    })
  }

  const floatingTechs = [
    { name: 'HTML5', icon: '🌐', color: 'from-orange-500 via-red-500 to-rose-500', shadow: 'shadow-orange-500/50' },
    { name: 'CSS3', icon: '🎨', color: 'from-sky-400 via-blue-500 to-indigo-600', shadow: 'shadow-sky-500/50' },
    { name: 'JavaScript', icon: '⚡', color: 'from-yellow-400 via-amber-500 to-orange-500', shadow: 'shadow-yellow-500/50' },
    { name: 'React', icon: '⚛️', color: 'from-cyan-400 via-sky-500 to-blue-600', shadow: 'shadow-cyan-500/50' },
  ]

  return (
    <section 
      id="home" 
      className="relative flex items-center justify-center overflow-hidden"
      style={{
        minHeight: 'calc(100vh - var(--nav-h))',
        paddingTop: 'var(--nav-h)' // Just navbar height, no extra padding
      }}
    >
      {/* Subtle Gradient Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/90 to-slate-950" />
      
      {/* Minimalist Animated Background */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/4 -left-32 w-96 h-96 bg-gradient-to-br from-sky-500/20 via-cyan-500/10 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-1/4 -right-32 w-96 h-96 bg-gradient-to-br from-cyan-500/20 via-blue-500/10 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10 w-full py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col items-center text-center" style={{ gap: 'clamp(12px, 2.5vh, 24px)' }}>
          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="max-w-4xl mx-auto"
            style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(12px, 2.5vh, 20px)' }}
          >
            {/* Heading - Project Showcase with Fluid Typography */}
            <motion.h1
              variants={itemVariants}
              className="font-black leading-tight tracking-tight text-white px-2 sm:px-0 break-words"
              style={{
                fontSize: 'clamp(18px, 5vw, 48px)',
                maxWidth: '95%',
                margin: '0 auto',
                lineHeight: 'clamp(1.15, 1.25, 1.35)',
                wordSpacing: 'clamp(-0.5px, 0px, 2px)'
              }}
              data-variant="b-student-friendly"
            >
              <span className="inline-block">End-to-End RAG Pipeline</span>{' '}
              <span className="inline-block">for Educational Content</span>
            </motion.h1>

            {/* Description - Skills Showcase Subheadline with Fluid Typography */}
            <motion.p
              variants={itemVariants}
              className="text-slate-300 leading-relaxed font-light px-4 sm:px-0"
              style={{
                fontSize: 'clamp(14px, 3vw, 20px)',
                maxWidth: '90%',
                margin: '0 auto'
              }}
            >
              Showcasing skills in NLP, vector databases, semantic search, and full-stack AI application development
            </motion.p>

            {/* Primary CTA and YouTube Link Side by Side */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center w-full max-w-lg sm:max-w-none mx-auto"
              style={{ marginTop: 'clamp(8px, 2vh, 16px)' }}
            >
              {/* Primary CTA - Start Learning Now */}
              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={scrollToAI}
                data-variant="b-student-friendly"
                data-cta="primary"
                aria-label="Start learning web development now with AI assistance"
                className="group px-6 sm:px-8 lg:px-10 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-500 hover:from-sky-400 hover:via-cyan-400 hover:to-blue-400 rounded-full font-bold text-white shadow-xl shadow-sky-500/30 hover:shadow-sky-400/50 transition-all duration-300 flex items-center justify-center gap-2 sm:gap-3 w-full sm:w-auto sm:min-w-[220px] lg:min-w-[240px]"
                style={{ fontSize: 'clamp(14px, 2.2vw, 18px)' }}
              >
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="whitespace-nowrap">Start Learning Now</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </motion.button>

              {/* YouTube Playlist Button */}
              <motion.a
                href="https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -2 }}
                aria-label="Watch the complete YouTube playlist"
                className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 lg:px-8 py-3 sm:py-3.5 lg:py-4 bg-gradient-to-br from-red-500/20 to-red-600/10 border-2 border-red-500/50 hover:border-red-400/70 rounded-full backdrop-blur-sm shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 group w-full sm:w-auto sm:min-w-[220px] lg:min-w-[240px] justify-center"
                style={{ fontSize: 'clamp(14px, 2.2vw, 18px)' }}
              >
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="text-white font-bold whitespace-nowrap">Watch Playlist</span>
              </motion.a>
            </motion.div>

            {/* Tech Icons Row - Better Structure */}
            <motion.div
              variants={itemVariants}
              className="w-full max-w-md mx-auto text-center"
              style={{ marginTop: 'clamp(16px, 3vh, 24px)' }}
            >
              <p className="text-slate-400 text-xs font-medium mb-2">Built with Modern Technologies</p>
              <div className="grid grid-cols-4 gap-2">
                {floatingTechs.map((tech, index) => (
                    <motion.div
                      key={tech.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group cursor-pointer"
                    >
                      <div className={`relative bg-gradient-to-br ${tech.color} p-[1px] rounded-md shadow-sm hover:shadow-md ${tech.shadow} transition-all duration-300`}>
                        <div className="bg-slate-900/90 backdrop-blur-sm rounded-md px-2 py-1.5 border border-white/10 group-hover:border-white/30 transition-all duration-300">
                          <div className="flex items-center justify-center gap-1.5">
                            <span className="text-sm">{tech.icon}</span>
                            <span className="text-white font-medium text-xs text-center leading-tight">{tech.name}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Compact Stats - Hide on very small screens */}
            <motion.div
              variants={itemVariants}
              className="hidden sm:flex items-center justify-center gap-4 lg:gap-8"
              style={{ marginTop: 'clamp(12px, 2vh, 24px)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-sky-400 to-cyan-400 bg-clip-text text-transparent">18+</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Videos</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-slate-700"></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">AI</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Powered</div>
              </div>
              <div className="w-px h-6 sm:h-8 bg-slate-700"></div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">24/7</div>
                <div className="text-xs sm:text-sm text-slate-400 font-medium">Available</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero
