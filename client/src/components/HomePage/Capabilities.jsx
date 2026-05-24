import React from 'react'
import { motion } from 'motion/react'
import { BsBarChart, BsFileEarmarkText } from 'react-icons/bs'
import aiAnsImg from '../../assets/ai-ans.png'
import resumeImg from '../../assets/resume.png'
import pdfImg from '../../assets/pdf.png'
import historyImg from '../../assets/history.png'

const Capabilities = () => {
  return (
    <>
      {/* Advanced AI Capabilities Section */}
      <h2 className='text-3xl md:text-5xl font-bold text-gray-900 text-center tracking-tight mb-12 mt-12 md:mt-16'>
        Advanced AI <span className='text-[#10b981]'>Capabilities</span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4 pb-12'>
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6'
        >
          <div className='w-full sm:w-1/2 flex justify-center'>
            <img src={aiAnsImg} alt="AI Answer Evaluation" className='w-full max-w-[160px] h-auto object-contain' />
          </div>
          <div className='w-full sm:w-1/2 flex flex-col items-start text-left gap-2'>
            <div className='bg-[#e6fcf5] text-[#0ca678] p-2.5 rounded-xl flex items-center justify-center shadow-sm'>
              <BsBarChart size={18} />
            </div>
            <h3 className='font-bold text-gray-900 text-lg mt-1'>AI Answer Evaluation</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Scores communication, technical accuracy and confidence.</p>
          </div>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6'
        >
          <div className='w-full sm:w-1/2 flex justify-center'>
            <img src={resumeImg} alt="Resume Based Interview" className='w-full max-w-[160px] h-auto object-contain' />
          </div>
          <div className='w-full sm:w-1/2 flex flex-col items-start text-left gap-2'>
            <div className='bg-[#e6fcf5] text-[#0ca678] p-2.5 rounded-xl flex items-center justify-center shadow-sm'>
              <BsFileEarmarkText size={18} />
            </div>
            <h3 className='font-bold text-gray-900 text-lg mt-1'>Resume Based Interview</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Project-specific questions based on uploaded resume.</p>
          </div>
        </motion.div>

        {/* Card 3 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6'
        >
          <div className='w-full sm:w-1/2 flex justify-center'>
            <img src={pdfImg} alt="Downloadable PDF Report" className='w-full max-w-[160px] h-auto object-contain' />
          </div>
          <div className='w-full sm:w-1/2 flex flex-col items-start text-left gap-2'>
            <div className='bg-[#e6fcf5] text-[#0ca678] p-2.5 rounded-xl flex items-center justify-center shadow-sm'>
              <BsFileEarmarkText size={18} />
            </div>
            <h3 className='font-bold text-gray-900 text-lg mt-1'>Downloadable PDF Report</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Detailed strengths, weaknesses and improvement insights.</p>
          </div>
        </motion.div>

        {/* Card 4 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className='bg-white rounded-3xl p-6 md:p-8 border border-gray-200/50 shadow-md hover:shadow-xl hover:border-[#10b981]/50 transition-all duration-300 flex flex-col sm:flex-row items-center gap-6'
        >
          <div className='w-full sm:w-1/2 flex justify-center'>
            <img src={historyImg} alt="History & Analytics" className='w-full max-w-[160px] h-auto object-contain' />
          </div>
          <div className='w-full sm:w-1/2 flex flex-col items-start text-left gap-2'>
            <div className='bg-[#e6fcf5] text-[#0ca678] p-2.5 rounded-xl flex items-center justify-center shadow-sm'>
              <BsBarChart size={18} />
            </div>
            <h3 className='font-bold text-gray-900 text-lg mt-1'>History & Analytics</h3>
            <p className='text-gray-500 text-sm leading-relaxed'>Track progress with performance graphs and topic analysis.</p>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default Capabilities
