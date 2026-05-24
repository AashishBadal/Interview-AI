import React from 'react'
import { motion } from 'motion/react'
import { BsRobot, BsMic, BsClock } from 'react-icons/bs'

const Steps = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
      className='grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 max-w-5xl w-full mt-12 md:mt-16 px-4 pb-12'
    >
      {/* Card 1 */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className='bg-white border-2 border-gray-200/60 hover:border-[#10b981] rounded-3xl p-8 pt-12 shadow-lg md:-rotate-3 flex flex-col items-center text-center relative transition-all duration-300'
      >
        <div className='absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-2 border-[#10b981] rounded-2xl flex items-center justify-center shadow-md'>
          <BsRobot className='text-[#10b981]' size={22} />
        </div>
        <span className='text-[#10b981] text-xs font-bold tracking-wider uppercase mb-2'>Step 1</span>
        <h3 className='text-gray-900 font-bold text-lg mb-3'>Role & Experience Selection</h3>
        <p className='text-gray-500 text-sm leading-relaxed max-w-[240px]'>AI adjusts difficulty based on selected job role.</p>
      </motion.div>

      {/* Card 2 */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className='bg-white border-2 border-gray-200/60 hover:border-[#10b981] rounded-3xl p-8 pt-12 shadow-lg md:rotate-1 flex flex-col items-center text-center relative transition-all duration-300'
      >
        <div className='absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-2 border-[#10b981] rounded-2xl flex items-center justify-center shadow-md'>
          <BsMic className='text-[#10b981]' size={22} />
        </div>
        <span className='text-[#10b981] text-xs font-bold tracking-wider uppercase mb-2'>Step 2</span>
        <h3 className='text-gray-900 font-bold text-lg mb-3'>Smart Voice Interview</h3>
        <p className='text-gray-500 text-sm leading-relaxed max-w-[240px]'>Dynamic follow-up questions based on your answers.</p>
      </motion.div>

      {/* Card 3 */}
      <motion.div
        whileHover={{ y: -8, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className='bg-white border-2 border-gray-200/60 hover:border-[#10b981] rounded-3xl p-8 pt-12 shadow-lg md:-rotate-1 flex flex-col items-center text-center relative transition-all duration-300'
      >
        <div className='absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white border-2 border-[#10b981] rounded-2xl flex items-center justify-center shadow-md'>
          <BsClock className='text-[#10b981]' size={22} />
        </div>
        <span className='text-[#10b981] text-xs font-bold tracking-wider uppercase mb-2'>Step 3</span>
        <h3 className='text-gray-900 font-bold text-lg mb-3'>Timer Based Simulation</h3>
        <p className='text-gray-500 text-sm leading-relaxed max-w-[240px]'>Real interview pressure with time tracking.</p>
      </motion.div>
    </motion.div>
  )
}

export default Steps
