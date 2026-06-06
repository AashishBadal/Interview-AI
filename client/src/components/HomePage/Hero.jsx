import React from 'react'
import { motion } from 'motion/react'
import { HiArrowUpRight } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import LiveInterview from './LiveInterview'

const Hero = ({ onViewHistory }) => {
  const navigate = useNavigate()
  return (
    <div className='relative w-full max-w-6xl mx-auto flex flex-col items-center text-center pb-4'>
      {/* status pill */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='inline-flex items-center gap-2.5 border border-line rounded-full pl-2.5 pr-4 py-1.5 mb-9 bg-surface/60 backdrop-blur'
      >
        <span className='relative flex h-2 w-2'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-70' />
          <span className='relative inline-flex rounded-full h-2 w-2 bg-accent' />
        </span>
        <span className='label-mono !text-faint !text-[10px]'>voice-first ai interview engine</span>
      </motion.div>

      {/* mega headline */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className='font-display font-semibold tracking-tight leading-[0.9] text-[clamp(2.75rem,8vw,6.5rem)] text-balance max-w-4xl'
      >
        Interview like it's
        <br className='hidden sm:block' />{' '}
        <span className='relative inline-block text-gradient-accent'>
          the real thing
          <svg className='absolute -bottom-1 sm:-bottom-2 left-0 w-full' height='12' viewBox='0 0 400 12' fill='none' preserveAspectRatio='none'>
            <path d='M3 8C90 3 320 3 397 8' stroke='var(--color-accent)' strokeWidth='3' strokeLinecap='round' opacity='0.85' />
          </svg>
        </span>
        .
      </motion.h1>

      {/* subhead */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className='text-muted text-base md:text-lg leading-relaxed mt-8 max-w-xl'
      >
        A voice-first AI interviewer that asks role-specific questions, fires back
        live follow-ups, and scores you the way a hiring panel actually would.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className='flex flex-wrap items-center justify-center gap-3 mt-9'
      >
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/interview')}
          className='btn-accent group inline-flex items-center gap-2 px-7 py-3.5 text-[15px]'
        >
          Start an interview
          <HiArrowUpRight className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' size={17} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onViewHistory}
          className='btn-ghost px-7 py-3.5 text-[15px]'
        >
          View history
        </motion.button>
      </motion.div>

      {/* live, self-playing demo */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
        className='w-full max-w-2xl mt-16'
      >
        {/* caption above the panel */}
        <div className='flex items-center justify-center gap-3 mb-4'>
          <span className='h-px w-10 bg-line' />
          <span className='label-mono'>this is a real session, playing live</span>
          <span className='h-px w-10 bg-line' />
        </div>
        <LiveInterview />
      </motion.div>
    </div>
  )
}

export default Hero
