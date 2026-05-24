import React from 'react'
import { motion } from 'motion/react'
import hrImg from '../../assets/HR.png'
import techImg from '../../assets/tech.png'
import confiImg from '../../assets/confi.png'
import creditImg from '../../assets/credit.png'

const InterviewModes = () => {
  return (
    <>
      {/* Multiple Interview Modes Section */}
      <h2 className='text-3xl md:text-5xl font-bold text-gray-900 text-center tracking-tight mb-12 mt-12 md:mt-16'>
        Multiple Interview <span className='text-[#10b981]'>Modes</span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 pb-12'>
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-row items-center justify-between gap-6'
        >
          <div className='flex-1 flex flex-col text-left'>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>HR Interview Mode</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Behavioral and communication based evaluation.</p>
          </div>
          <div className='w-24 md:w-32 flex justify-end shrink-0'>
            <img src={hrImg} alt="HR Interview Mode" className='w-full h-auto object-contain' />
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-row items-center justify-between gap-6'
        >
          <div className='flex-1 flex flex-col text-left'>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>Technical Mode</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Deep technical questioning based on selected role.</p>
          </div>
          <div className='w-24 md:w-32 flex justify-end shrink-0'>
            <img src={techImg} alt="Technical Mode" className='w-full h-auto object-contain' />
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-row items-center justify-between gap-6'
        >
          <div className='flex-1 flex flex-col text-left'>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>Confidence Detection</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Basic tone and voice analysis insights.</p>
          </div>
          <div className='w-24 md:w-32 flex justify-end shrink-0'>
            <img src={confiImg} alt="Confidence Detection" className='w-full h-auto object-contain' />
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-row items-center justify-between gap-6'
        >
          <div className='flex-1 flex flex-col text-left'>
            <h3 className='font-bold text-gray-900 text-lg mb-2'>Credits System</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Unlock premium interview sessions easily.</p>
          </div>
          <div className='w-24 md:w-32 flex justify-end shrink-0'>
            <img src={creditImg} alt="Credits System" className='w-full h-auto object-contain' />
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default InterviewModes
