import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { MessageSquare, ArrowRight } from 'lucide-react'

const Contact = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })

  const scrollToAI = () => {
    document.getElementById('ai-assistant')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="contact" ref={ref} className="py-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-6"
          >
            <MessageSquare className="w-4 h-4 text-primary-400" />
            <span className="text-sm font-medium text-primary-300">Model Performance</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6"
          >
            Experience the <span className="text-gradient">Performance</span>
          </motion.h2>


          {/* Stats/Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { label: 'AI Powered', value: '100%' },
              { label: 'Response Time', value: '<5s' },
              { label: 'Accuracy', value: '95%+' },
              { label: 'Available', value: '24/7' }
            ].map((stat, index) => (
              <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-4">
                <div className="text-2xl md:text-3xl font-bold text-gradient mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default Contact
