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
    'Llama 3.2 LLM'
  ]

  return (
    <footer className="bg-slate-950/80 backdrop-blur-sm border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-gradient">
                WebDev Assistant
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              AI-powered learning assistant for the <span className="text-sky-400 font-semibold">Sigma Web Development Course</span> on YouTube.
              Empowering the next generation of web developers with intelligent course assistance.
            </p>
            <div className="flex flex-wrap gap-3">
              <motion.a
                href="https://github.com/sahilkhn-03"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/60 hover:bg-slate-700/70 border-2 border-slate-600/50 hover:border-slate-500/70 rounded-xl backdrop-blur-sm shadow-lg shadow-slate-900/50 transition-all duration-300 group"
              >
                <Github className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                <span className="text-white font-bold text-base">GitHub</span>
              </motion.a>
              
              <motion.a
                href="https://www.linkedin.com/in/sahil-%E3%85%A4-3552b3290/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border-2 border-blue-500/50 hover:border-blue-400/70 rounded-xl backdrop-blur-sm shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 group"
              >
                <Linkedin className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                <span className="text-white font-bold text-base">LinkedIn</span>
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.id || link.url}>
                  {link.external ? (
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-red-400 transition-colors flex items-center space-x-2"
                    >
                      <span>{link.label}</span>
                      <Youtube className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="text-slate-400 hover:text-primary-400 transition-colors"
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
            <h4 className="font-semibold text-white mb-4">Technology</h4>
            <ul className="space-y-2">
              {technologies.map((tech, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  <span className="text-slate-400">{tech}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} RAG AI Agent - Sigma Web Development Course.{' '}
            <span className="text-gradient font-semibold">Powered by AI</span>
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
