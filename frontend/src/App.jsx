import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Features from './components/Features'
import AIAssistant from './components/AIAssistant'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [activeSection, setActiveSection] = useState('home')

  // Ensure page starts at top on load
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'features', 'ai-assistant', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative overflow-hidden">
      <div className="bg-gradient-mesh fixed inset-0 -z-10" />
      
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Features />
      <AIAssistant />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
