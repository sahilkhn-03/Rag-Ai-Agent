import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Video, Code, Brain, Award, Download, Music, FileText, Network, Search, Sparkles } from 'lucide-react'

const About = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.3 })

  const courseTopics = [
    'Installing VS Code & How Websites Work',
    'Your First HTML Website',
    'Basic Structure of an HTML Website',
    'Heading, Paragraphs and Links',
    'Image, Lists, and Tables in HTML',
    'SEO and Core Web Vitals',
    'Forms and Input Tags',
    'Inline & Block Elements',
    'Id & Classes in HTML',
    'Video, Audio & Media',
    'Semantic Tags in HTML',
    'HTML Entities & Code Tag',
    'Introduction to CSS',
    'Inline, Internal & External CSS',
    'CSS Selectors',
    'CSS Box Model',
    'Margin, Padding & Borders',
    '...and many more!'
  ]

  const dataProcessingSteps = [
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Download Videos',
      description: 'Downloaded course videos from YouTube playlist',
      gradient: 'from-red-500 to-pink-500',
      step: '1'
    },
    {
      icon: <Music className="w-6 h-6" />,
      title: 'Video to Audio',
      description: 'Converted videos to MP3 format for processing',
      gradient: 'from-purple-500 to-pink-500',
      step: '2'
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Audio to Text',
      description: 'Transcribed audio using Whisper AI into JSON chunks',
      gradient: 'from-blue-500 to-cyan-500',
      step: '3'
    },
    {
      icon: <Network className="w-6 h-6" />,
      title: 'Generate Embeddings',
  description: 'Created vector embeddings using all-MiniLM-L6-v2 model',
      gradient: 'from-green-500 to-emerald-500',
      step: '4'
    },
    {
      icon: <Search className="w-6 h-6" />,
      title: 'Cosine Similarity',
      description: 'Find relevant content using semantic search',
      gradient: 'from-orange-500 to-yellow-500',
      step: '5'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Response',
      description: 'Generate answers using Llama 3.1 LLM',
      gradient: 'from-sky-500 to-blue-500',
      step: '6'
    }
  ]

  const features = [
    {
      icon: <Video className="w-6 h-6" />,
      title: 'Dataset: 18+ Video Lectures',
      description: 'Processed educational content covering HTML, CSS, JavaScript, and React fundamentals for the RAG knowledge base',
      gradient: 'from-blue-500 to-cyan-500',
      topics: courseTopics
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'ML Model: RAG Pipeline',
  description: 'Implemented end-to-end RAG system with all-MiniLM-L6-v2 embeddings, cosine similarity search, and Llama 3.1 for natural language generation',
      gradient: 'from-green-500 to-emerald-500',
  features: [
  'Vector embeddings (384D)',
        'Semantic search engine',
        'LLM-powered responses',
        'Real-time inference'
      ]
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  }

  return (
    <section id="about" ref={ref} className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-4">
            <>
              <Brain className="w-4 h-4 text-sky-400" />
              <span className="text-sm font-medium text-sky-300">About the Course</span>
            </>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 px-2 sm:px-0">
            <span className="text-gradient">RAG System Architecture</span> & Data Processing
          </h2>
          <p className="text-base md:text-lg text-slate-400 max-w-3xl mx-auto px-4 sm:px-0">
            A complete <span className="text-sky-400 font-semibold">Machine Learning pipeline</span> demonstrating 
            <span className="text-cyan-400 font-semibold"> RAG (Retrieval-Augmented Generation)</span>, 
            vector embeddings, and semantic search capabilities
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid sm:grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -5 }}
              className="group relative bg-slate-900/60 backdrop-blur-xl border border-slate-700/40 hover:border-sky-500/50 rounded-xl p-4 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-sky-500/10"
            >
              {/* Subtle gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`} />
              
              {/* Minimal decorative corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-sky-500/3 to-transparent rounded-bl-full" />
              
              <div className="relative z-10">
                {/* Compact icon */}
                <div className="relative mb-3 w-fit">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} blur-lg opacity-30 group-hover:opacity-40 transition-all duration-300`} />
                  <div className={`relative w-10 h-10 bg-gradient-to-br ${feature.gradient} rounded-lg flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300`}>
                    {feature.icon}
                  </div>
                </div>
                
                {/* Clean typography */}
                <h3 className="text-base font-semibold mb-2 text-white/95 group-hover:text-sky-400 transition-colors tracking-tight">
                  {feature.title}
                </h3>
                
                <p className="text-xs text-slate-400/90 leading-relaxed mb-3">
                  {feature.description}
                </p>

                {feature.topics && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-700/30">
                      <div className="flex items-center space-x-1.5">
                        <div className="w-1 h-1 rounded-full bg-sky-400" />
                        <p className="text-xs font-medium text-sky-400">
                          Training Data
                        </p>
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-800/30 px-1.5 py-0.5 rounded">
                        {feature.topics.length} videos
                      </span>
                    </div>
                    <div className="max-h-32 overflow-y-auto pr-1 space-y-1 custom-scrollbar">
                      {feature.topics.map((topic, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -5 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.01 * i }}
                          className="flex items-start space-x-1.5 text-xs text-slate-400 bg-slate-800/10 hover:bg-slate-800/25 p-1.5 rounded transition-all duration-150 group/item"
                        >
                          <span className="text-sky-500 mt-0.5 flex-shrink-0 group-hover/item:text-cyan-400 transition-colors text-[10px]">▸</span>
                          <span className="group-hover/item:text-slate-300 transition-colors leading-tight">{topic}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {feature.features && (
                  <div className="mt-3">
                    <div className="flex items-center space-x-1.5 mb-2 pb-1.5 border-b border-slate-700/30">
                      <div className="w-1 h-1 rounded-full bg-green-400" />
                      <p className="text-xs font-medium text-green-400">
                        ML Capabilities
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {feature.features.map((item, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: 0.05 * i }}
                          className="flex items-center space-x-1.5 text-xs bg-slate-800/15 hover:bg-slate-800/30 p-1.5 rounded transition-all duration-200 group/feat"
                        >
                          <div className="w-1 h-1 bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full flex-shrink-0 group-hover/feat:scale-125 transition-transform" />
                          <span className="text-slate-400 group-hover/feat:text-slate-300 transition-colors leading-tight">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Subtle bottom accent */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          {/* Data Processing Pipeline */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-center mb-4">
              <span className="text-gradient">How I Built This System</span>
            </h3>
            <p className="text-center text-slate-400 mb-8 max-w-2xl mx-auto">
              Complete data processing pipeline from raw videos to intelligent AI responses
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {dataProcessingSteps.map((step, index) => (
                <div key={index} className="relative">
                  {/* Step Number Badge - Absolutely Fixed Outside */}
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-sky-500 to-cyan-500 rounded-full flex items-center justify-center text-sm font-bold shadow-lg z-20">
                    {step.step}
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.9 + index * 0.1, duration: 0.5 }}
                    className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 hover:border-sky-500/50 rounded-xl p-6 transition-all duration-300 group h-full"
                  >
                    {/* Icon */}
                    <div className={`w-12 h-12 bg-gradient-to-br ${step.gradient} rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:shadow-2xl transition-shadow`}>
                      {step.icon}
                    </div>
                    
                    {/* Content */}
                    <h4 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {step.description}
                    </p>
                    
                    {/* Hover Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity`} />
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Info */}
          <div className="inline-block bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-6 w-full">
            <p className="text-base text-slate-300 mb-3 text-center">
              <span className="text-gradient font-semibold">Revolutionary Learning Experience</span> powered by 
              Retrieval-Augmented Generation (RAG) technology
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-xs text-slate-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                <span>Whisper AI Transcription</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>all-MiniLM-L6-v2 Embeddings</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-sky-500 rounded-full" />
                <span>Llama 3.1 LLM</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                <span>Cosine Similarity Search</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default About
