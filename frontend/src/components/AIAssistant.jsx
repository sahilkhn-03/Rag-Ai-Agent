import React, { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Bot, User, Lightbulb, Clock, GraduationCap, Loader2 } from 'lucide-react'

const AIAssistant = () => {
  const ref = useRef(null)
  const messagesEndRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '👋 Hi! I\'m your Sigma Web Development AI Assistant. Ask me anything about the course and I\'ll find the exact video with timestamps!',
      examples: [
        'What is HTML?',
        'What is Box Model?',
        'What is CSS and where is it taught?'
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState('Checking system...')
  const [backendReady, setBackendReady] = useState(false)

  // Backend base URL (configurable via Vite env var VITE_BACKEND_URL)
  const BACKEND_BASE = import.meta.env.VITE_BACKEND_URL || 'https://rag-ai-backend-207455190663.asia-south1.run.app'

  // Check backend health on mount
  useEffect(() => {
    fetch(`${BACKEND_BASE}/health`)
      .then(res => res.json())
      .then(data => {
        console.log('Backend health check:', data)
        
        // Check if system is ready (deployed version doesn't need Ollama)
        const isReady = data.embeddings_loaded
        
        if (isReady) {
          setStatus('Ready')
          setBackendReady(true)
          console.log('✓ Backend is ready! Using:', data.api_type || 'Groq API')
        } else {
          let errorMsg = 'Backend not ready: '
          if (!data.embeddings_loaded) errorMsg += 'Embeddings not loaded. '
          
          setStatus('Not ready')
          setBackendReady(false)
          console.warn(errorMsg, data)
        }
      })
      .catch(err => {
        console.error('Backend health check failed:', err)
        setStatus('Backend offline')
        setBackendReady(false)
      })
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const askBackend = async (question) => {
    try {
      const response = await fetch(`${BACKEND_BASE}/ask`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

  const data = await response.json()
      return {
        success: true,
        answer: data.response,
        sources: data.sources
      }
    } catch (error) {
      console.error('Backend error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    if (!backendReady) {
      setMessages(prev => [...prev, {
        type: 'bot',
        content: '⚠️ The backend system is not ready yet. Please check:\n\n1. Backend API is responding\n2. Groq API key is configured\n3. Embeddings are loaded\n\nCheck the console for more details.',
        isError: true
      }])
      return
    }

    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { type: 'user', content: userMessage }])
    setIsLoading(true)
    setStatus('Searching through lectures...')

    // Call the real backend API
    const result = await askBackend(userMessage)

    if (result.success) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: result.answer,
        evidence: result.evidence,
        sources: result.sources 
      }])
      setStatus('Ready')
    } else {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: `❌ Error: ${result.error}

Please check:
- Backend API is running on Google Cloud Run
- Internet connection is active
- Groq API is operational`,
        isError: true
      }])
      setStatus('Error occurred')
    }

    setIsLoading(false)
  }

  const handleExampleClick = (example) => {
    setInput(example)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const infoCards = [
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: 'Smart & Accurate',
      description: 'Our AI understands context and finds exactly where topics are discussed in videos',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Instant Answers',
      description: 'Get responses in seconds with precise video numbers and timestamps',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: 'Learn Faster',
      description: 'No more searching through videos - jump directly to what you need',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <section id="ai-assistant" ref={ref} className="py-4 lg:py-6 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 lg:mb-6"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-5 py-2.5 mb-5 backdrop-blur"
          >
            <Bot className="w-4 h-4 text-primary-300" />
            <span className="text-sm font-medium text-primary-200">AI Assistant</span>
          </motion.div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl tracking-tight font-display font-semibold md:font-bold mb-2">
            Ask Your <span className="text-gradient">AI Teaching Assistant</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-2xl md:max-w-3xl mx-auto">
            Get instant guidance on where to find any topic in our course
          </p>

          <div className="h-px w-24 md:w-32 mx-auto mt-6 bg-gradient-to-r from-transparent via-primary-500/60 to-transparent" />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-4 lg:gap-6">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2 order-2 lg:order-1 max-w-2xl mx-auto lg:max-w-none"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm border border-gray-200/10 rounded-xl overflow-hidden shadow-sm">
              {/* Chat Header */}
              <div className="bg-gradient-primary p-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                    <Bot className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Sigma AI Assistant</h3>
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <div className={`w-2 h-2 rounded-full ${status === 'Ready' ? 'bg-green-400' : status === 'Thinking...' ? 'bg-yellow-400' : 'bg-red-400'} animate-pulse`} />
                      <span>{status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[220px] sm:h-[240px] lg:h-[260px] overflow-y-auto p-3 sm:p-4 space-y-3 bg-slate-950/50 custom-scrollbar">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[85%] sm:max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-accent-500 to-pink-500' 
                          : 'bg-gradient-primary'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      
                      <div className={`rounded-xl p-3 shadow-sm border transition-all duration-300 ${
                        message.type === 'user' 
                          ? 'bg-primary-600/20 hover:bg-primary-600/30 border-primary-500/50' 
                          : message.isError 
                            ? 'bg-red-500/10 hover:bg-red-500/20 border-red-500/50'
                            : 'bg-slate-800/40 hover:bg-slate-800/60 border-gray-200/10'
                      }`}>
                        <p className={`text-sm md:text-base leading-relaxed ${message.isError ? 'text-red-400' : 'text-slate-200'}`}>
                          {message.content}
                        </p>
                        
                        {message.examples && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-slate-400">Try asking:</p>
                            {message.examples.map((example, i) => (
                              <motion.button
                                key={i}
                                onClick={() => handleExampleClick(example)}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="block w-full text-left text-sm bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg px-3 py-2 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-400/70"
                              >
                                "{example}"
                              </motion.button>
                            ))}
                          </div>
                        )}

                        {/* Evidence / timestamps shown for bot messages */}
                        {message.evidence && message.evidence.length > 0 && (
                          <div className="mt-3 p-3 bg-slate-900/40 border border-slate-600/30 rounded-xl">
                            <p className="text-xs text-slate-300 font-semibold mb-2">📚 Video References:</p>
                            <div className="space-y-2">
                              {message.evidence.map((ev, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg hover:bg-slate-800/50 transition-colors">
                                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                                    <span className="text-xs font-mono text-primary-300 bg-primary-500/10 px-2 py-1 rounded">⏱ {ev.timestamp}</span>
                                    <span className="text-xs text-slate-200 truncate">{ev.title}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start space-x-2"
                  >
                    <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-slate-800/50 border border-gray-200/10 rounded-xl p-3 w-48">
                      <div className="space-y-2">
                        <div className="h-3 w-36 bg-slate-700/80 rounded-full animate-pulse" />
                        <div className="h-3 w-28 bg-slate-700/60 rounded-full animate-pulse" />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-slate-900/80 backdrop-blur border-t border-slate-800">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about the course..."
                    className="flex-1 bg-slate-800/60 border border-slate-700 rounded-full px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-all focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-60"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="h-12 w-full sm:w-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-primary-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/70"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <Send className="w-5 h-5 text-white" />
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="space-y-2 lg:space-y-2 order-1 lg:order-2"
          >
            {infoCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.01, y: -2 }}
                className="bg-slate-900/70 backdrop-blur-sm border border-slate-800 hover:border-primary-500/50 rounded-lg p-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-primary-500/10 cursor-default"
              >
                <div className={`w-8 h-8 bg-gradient-to-br ${card.color} rounded-md flex items-center justify-center mb-2 shadow-lg`}>
                  <div className="text-white">
                    {React.cloneElement(card.icon, { className: 'w-4 h-4' })}
                  </div>
                </div>
                <h3 className="font-medium text-white text-sm mb-1">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-snug">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AIAssistant
