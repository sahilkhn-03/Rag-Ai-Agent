import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { FileText, Database, Search, Sparkles } from 'lucide-react'

const Features = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const steps = [
    {
      number: 1,
      icon: <FileText className="w-6 h-6" />,
      title: 'Video Processing',
      description: 'All course videos are converted to text using advanced speech-to-text technology (Whisper AI)',
      tech: 'Whisper AI',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      number: 2,
      icon: <Database className="w-6 h-6" />,
      title: 'Semantic Embeddings',
  description: 'Text chunks are converted into high-dimensional vector embeddings using all-MiniLM-L6-v2 model',
  tech: 'all-MiniLM-L6-v2',
      color: 'from-purple-500 to-pink-500'
    },
    {
      number: 3,
      icon: <Search className="w-6 h-6" />,
      title: 'Smart Search',
      description: 'Your question is matched against video chunks using cosine similarity to find the most relevant content',
      tech: 'RAG Search',
      color: 'from-green-500 to-emerald-500'
    },
    {
      number: 4,
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Response',
      description: 'Llama 3.1 generates a natural response telling you exactly which video and timestamp to watch',
      tech: 'Llama 3.1',
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <section id="features" ref={ref} className="py-12 bg-slate-950/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <Sparkles className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">How It Works</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
            <span className="text-gradient">RAG-Based AI</span> Technology
          </h2>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Revolutionary Retrieval-Augmented Generation system that understands your questions 
            and guides you to the exact learning content
          </p>
        </motion.div>

        <div className="relative">
          {/* Connecting Lines */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-500/30 to-transparent transform -translate-y-1/2" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                className="relative"
              >
                {/* Step Number Badge */}
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br ${step.color} rounded-full flex items-center justify-center font-bold text-white shadow-lg z-10`}
                >
                  {step.number}
                </motion.div>

                {/* Card */}
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group bg-slate-900/80 backdrop-blur-sm border border-slate-800 hover:border-primary-500/50 rounded-2xl p-6 pt-10 h-full transition-all duration-300"
                >
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg group-hover:shadow-2xl transition-shadow`}>
                    {step.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-white text-center">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-400 text-center leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Tech Badge */}
                  <div className="flex justify-center">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${step.color} text-white`}>
                      {step.tech}
                    </span>
                  </div>

                  {/* Hover Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`} />
                </motion.div>

                {/* Arrow (for desktop) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-primary-500"
                    >
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-10 text-center"
        >
          <div className="inline-block bg-gradient-to-r from-primary-500/10 to-accent-500/10 border border-primary-500/30 rounded-2xl p-6">
            <p className="text-lg text-slate-300">
              Experience the power of <span className="text-gradient font-semibold">AI-driven learning</span> that adapts to your needs
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features
