import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Menu, X, Bot } from 'lucide-react'

const Navbar = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { id: 'contact', label: 'Performance' },
  ]

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-950/80 backdrop-blur-lg shadow-lg shadow-primary-500/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection('home')}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-gradient">
              WebDev Assistant
            </span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  activeSection === item.id
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => scrollToSection('ai-assistant')}
              className="px-6 py-2.5 bg-gradient-primary rounded-full font-semibold text-white shadow-lg shadow-primary-500/50 hover:shadow-xl hover:shadow-primary-500/60 transition-all duration-300"
            >
              Try AI Assistant
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-800/50"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800"
        >
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                  activeSection === item.id
                    ? 'text-primary-400 bg-primary-500/10'
                    : 'text-slate-300 hover:bg-slate-800/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => scrollToSection('ai-assistant')}
              className="w-full px-4 py-3 bg-gradient-primary rounded-lg font-semibold text-white shadow-lg"
            >
              Try AI Assistant
            </button>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar
