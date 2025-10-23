import { motion } from 'framer-motion'
import { Bot, Github, Linkedin, Youtube } from 'lucide-react'

const Footer = () => {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'features', label: 'Features' },
    { id: 'ai-assistant', label: 'AI Assistant' },
    { url: 'https://www.youtube.com/playlist?list=PLu0W_9lII9agq5TrH9XLIKQvv0iaF2X3w', label: 'YouTube Playlist', external: true }
  ]

  const technologies = [
    'RAG-Based AI',
    'Whisper AI',
  'all-MiniLM-L6-v2 Embeddings',
    'Llama 3.1 LLM'
  ]

  return (
    <footer className="bg-slate-950/90 backdrop-blur-sm border-t border-slate-800/50 pt-8 pb-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-gradient">
                WebDev Assistant
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              AI-powered learning assistant for the <span className="text-sky-400 font-medium">Sigma Web Development Course</span> on YouTube.
            </p>
            <div className="flex flex-wrap gap-2">
              <motion.a
                href="https://github.com/sahilkhn-03"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800/60 hover:bg-slate-700/70 border border-slate-600/50 hover:border-slate-500/70 rounded-lg backdrop-blur-sm transition-all duration-300 group"
              >
                <Github className="w-4 h-4 text-slate-300 group-hover:text-white transition-colors" />
                <span className="text-white font-medium text-sm">GitHub</span>
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/in/sahil-%E3%85%A4-3552b3290/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03, y: -1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/50 hover:border-blue-400/70 rounded-lg backdrop-blur-sm transition-all duration-300 group"
              >
                <Linkedin className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
                <span className="text-white font-medium text-sm">LinkedIn</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Quick Links</h4>
            <ul className="space-y-1.5">
              {quickLinks.map((link) => (
                <li key={link.id || link.url}>
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-red-400 transition-colors flex items-center space-x-2 text-sm"
                    >
                      <span>{link.label}</span>
                      <Youtube className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-slate-400 hover:text-primary-400 transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold text-white text-sm mb-3">Technology</h4>
            <ul className="space-y-1.5">
              {technologies.map((tech, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-primary-500 rounded-full" />
                  <span className="text-slate-400 text-sm">{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-slate-800/50 text-center">
          <p className="text-slate-400 text-xs">
            &copy; {new Date().getFullYear()} RAG AI Agent - Sigma Web Development Course.{' '}
            <span className="text-gradient font-medium">Powered by AI</span>
            {' '}| Created by{' '}
            <a 
              href="https://www.linkedin.com/in/sahil-%E3%85%A4-3552b3290/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 transition-colors"
            >
              Sahil
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
