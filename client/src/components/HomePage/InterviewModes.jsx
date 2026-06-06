import React from 'react'
import { motion } from 'motion/react'
import { HiArrowUpRight } from 'react-icons/hi2'
import hrImg from '../../assets/HR.png'
import techImg from '../../assets/tech.png'
import confiImg from '../../assets/confi.png'
import creditImg from '../../assets/credit.png'
import { SectionHeading } from './Steps'

const modes = [
  { img: techImg, no: '01', title: 'Technical', body: 'Deep, role-specific technical questioning.' },
  { img: hrImg, no: '02', title: 'HR & Behavioral', body: 'Communication and situational evaluation.' },
  { img: confiImg, no: '03', title: 'Confidence detection', body: 'Tone and delivery insights from your voice.' },
  { img: creditImg, no: '04', title: 'Credit system', body: 'Unlock premium sessions on demand.' },
]

const InterviewModes = () => {
  return (
    <div className='w-full max-w-5xl mt-28 md:mt-40 px-2'>
      <SectionHeading
        index='// 03'
        label='interview modes'
        title='One engine. Many rooms.'
      />

      <div className='border-t border-line'>
        {modes.map((mode, i) => (
          <motion.div
            key={mode.title}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className='group flex items-center gap-5 md:gap-8 py-6 md:py-7 border-b border-line cursor-default'
          >
            <span className='font-mono text-sm text-faint group-hover:text-accent transition-colors w-8 shrink-0'>{mode.no}</span>

            {/* reveal thumbnail */}
            <div className='shrink-0 w-0 md:group-hover:w-16 w-16 md:w-0 overflow-hidden transition-all duration-300'>
              <div className='w-16 h-16 rounded-xl bg-gradient-to-br from-zinc-100 to-zinc-300 flex items-center justify-center'>
                <img src={mode.img} alt='' className='w-10 h-10 object-contain' />
              </div>
            </div>

            <h3 className='font-display text-2xl md:text-4xl font-semibold tracking-tight text-muted group-hover:text-ink transition-colors flex-1'>
              {mode.title}
            </h3>

            <p className='hidden sm:block text-sm text-muted max-w-[220px] text-right'>{mode.body}</p>

            <HiArrowUpRight className='text-faint group-hover:text-accent group-hover:translate-x-1 group-hover:-translate-y-1 transition-all shrink-0' size={22} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default InterviewModes
