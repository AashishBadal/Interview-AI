import React from 'react'
import { motion } from 'motion/react'
import { HiArrowUpRight } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'

const CTABand = () => {
  const navigate = useNavigate()
  return (
    <div className='w-full max-w-5xl mt-28 md:mt-40 px-2'>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6 }}
        className='relative card overflow-hidden px-7 py-14 md:px-16 md:py-20 text-center'
      >
        {/* glow + grid inside the band */}
        <div className='pointer-events-none absolute inset-0 bg-grid opacity-30' />
        <div className='pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[60%] h-[120%] bg-accent/15 blur-[120px]' />

        {/* waveform motif */}
        <div className='relative flex items-center justify-center gap-[3px] h-8 mb-8'>
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className='w-[3px] rounded-full bg-accent/70 origin-center'
              style={{ height: '100%', animation: `wave 1.2s ease-in-out ${(i % 11) * 0.08}s infinite` }}
            />
          ))}
        </div>

        <h2 className='relative font-display text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[0.95] text-balance'>
          Your next interview
          <br /> starts <span className='text-gradient-accent'>talking back.</span>
        </h2>

        <p className='relative text-muted mt-6 max-w-md mx-auto'>
          Run a full voice mock interview in minutes. No scheduling, no judgment — just reps.
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/interview')}
          className='btn-accent group relative inline-flex items-center gap-2 px-8 py-4 mt-9 text-[15px]'
        >
          Start your interview
          <HiArrowUpRight className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' size={17} />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default CTABand
