import { useState, useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Bot, User, Lightbulb, Clock, GraduationCap, Loader2 } from 'lucide-react'

const AIAssistant = () => {
  const ref = useRef(null)
  const messagesEndRef = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })
  
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: '👋 Hello! I\'m your Sigma Web Development AI Assistant powered by RAG technology. I can help you with the **Sigma Web Development Course** available on YouTube. Ask me anything about the course - I\'ll search through all video lectures to give you precise answers with timestamps!',
      examples: [
        'How do websites work?',
        'Where is CSS taught?',
        'What are HTML entities?',
        'How to use flexbox?'
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
    <section id="ai-assistant" ref={ref} className="py-12 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-4"
          >
            <Bot className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">AI Assistant</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            Ask Your <span className="text-gradient">AI Teaching Assistant</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Get instant guidance on where to find any topic in our course
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="lg:col-span-2"
          >
            <div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
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
              <div className="h-[500px] overflow-y-auto p-6 space-y-4 bg-slate-950/50">
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.type === 'user' 
                          ? 'bg-gradient-to-br from-accent-500 to-pink-500' 
                          : 'bg-gradient-primary'
                      }`}>
                        {message.type === 'user' ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      
                      <div className={`rounded-2xl p-4 ${
                        message.type === 'user' 
                          ? 'bg-primary-600/30 border border-primary-500/50' 
                          : message.isError 
                            ? 'bg-red-500/10 border border-red-500/50'
                            : 'bg-slate-800/50 border border-slate-700'
                      }`}>
                        <p className={`text-sm leading-relaxed ${message.isError ? 'text-red-400' : 'text-slate-200'}`}>
                          {message.content}
                        </p>
                        
                        {message.examples && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs text-slate-400">Try asking:</p>
                            {message.examples.map((example, i) => (
                              <button
                                key={i}
                                onClick={() => handleExampleClick(example)}
                                className="block w-full text-left text-sm bg-primary-500/10 hover:bg-primary-500/20 border border-primary-500/30 rounded-lg px-3 py-2 transition-colors"
                              >
                                "{example}"
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Evidence / timestamps shown for bot messages */}
                        {message.evidence && message.evidence.length > 0 && (
                          <div className="mt-3 text-xs text-slate-400">
                            <p className="text-xs text-slate-400 mb-1">Timestamps:</p>
                            <div className="space-y-1">
                              {message.evidence.map((ev, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <span className="text-xs text-primary-300">⏱ {ev.timestamp}</span>
                                  <span className="text-xs">{ev.title}</span>
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
                    <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about the course..."
                    className="flex-1 bg-slate-800 border border-slate-700 focus:border-primary-500 rounded-full px-4 py-3 text-sm text-white placeholder-slate-400 outline-none transition-colors"
                    disabled={isLoading}
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg hover:shadow-primary-500/50 transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
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
            className="space-y-4"
          >
            {infoCards.map((card, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-primary-500/50 rounded-2xl p-6 transition-all duration-300"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  {card.icon}
                </div>
                <h3 className="font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{card.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AIAssistant
