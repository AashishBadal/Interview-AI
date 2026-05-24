import React from 'react'
import { motion } from 'motion/react'
import { HiSparkles } from 'react-icons/hi'

const Hero = ({ onStart, onViewHistory }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className='text-center max-w-4xl mx-auto'
    >
      {/* Badge */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className='inline-flex items-center gap-2 bg-white border border-gray-200/80 px-4 py-2 rounded-full shadow-sm mb-8 hover:shadow-md transition-shadow duration-300'
      >
        <HiSparkles size={16} className='text-[#10b981]' />
        <span className='text-gray-600 text-xs md:text-sm font-medium'>
          AI Powered Smart Interview Platform
        </span>
      </motion.div>

      {/* Heading */}
      <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-tight md:leading-none mb-6'>
        Practice Interviews with <br />
        <span className='bg-[#e6fcf5] text-[#0ca678] border border-[#c3fae8] px-6 py-2 rounded-full inline-block mt-4 font-semibold text-[0.8em] md:text-[0.75em] shadow-sm'>
          AI Intelligence
        </span>
      </h1>

      {/* Description */}
      <p className='text-gray-500 text-base md:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10 mt-6'>
        Role-based mock interviews with smart follow-ups, adaptive difficulty and real-time performance evaluation.
      </p>

      {/* Buttons */}
      <div className='flex flex-wrap items-center justify-center gap-4'>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className='bg-black text-white hover:bg-neutral-800 text-sm md:text-base font-semibold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer'
        >
          Start Interview
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewHistory}
          className='bg-white text-gray-700 hover:text-black hover:bg-gray-50 text-sm md:text-base font-semibold px-8 py-3.5 rounded-full border border-gray-200 shadow-sm transition-all duration-300 cursor-pointer'
        >
          View History
        </motion.button>
      </div>
    </motion.div>
  )
}

export default Hero
