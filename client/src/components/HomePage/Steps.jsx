import React from 'react'
import { motion } from 'motion/react'
import { BsRobot, BsMic, BsClock } from 'react-icons/bs'

const steps = [
  {
    n: '01',
    icon: BsRobot,
    title: 'Set the room',
    body: 'Pick a job role and seniority — or drop your resume and let the AI pull questions straight from your real projects. Difficulty calibrates to match.',
  },
  {
    n: '02',
    icon: BsMic,
    title: 'Speak, don\'t type',
    body: 'A voice interviewer asks, listens, and reacts in real time with dynamic follow-ups — exactly like a human panel probing for depth.',
  },
  {
    n: '03',
    icon: BsClock,
    title: 'Get graded',
    body: 'Per-question timers recreate real pressure. The moment you finish, you get scored on communication, correctness and confidence — plus a PDF.',
  },
]

const SectionHeading = ({ index, label, title, sub }) => (
  <div className='mb-14'>
    <div className='flex items-center gap-4 mb-6'>
      <span className='label-mono'>{index}</span>
      <span className='flex-1 h-px bg-line' />
      <span className='label-mono'>{label}</span>
    </div>
    <h2 className='font-display text-3xl md:text-5xl font-semibold tracking-tight text-balance max-w-2xl'>
      {title}
    </h2>
    {sub && <p className='text-muted mt-4 max-w-xl'>{sub}</p>}
  </div>
)

const Steps = () => {
  return (
    <div className='w-full max-w-5xl mt-28 md:mt-40 px-2'>
      <SectionHeading
        index='// 01'
        label='how it works'
        title='Three steps from cold to interview-ready.'
      />

      <div className='relative'>
        {/* connecting vertical line */}
        <span className='absolute left-[27px] md:left-[39px] top-4 bottom-4 w-px bg-line hidden sm:block' />

        <div className='space-y-4'>
          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className='group relative flex items-start gap-6 md:gap-8 card p-6 md:p-7 hover:border-line-strong transition-colors'
              >
                {/* index node */}
                <div className='relative shrink-0 flex items-center justify-center'>
                  <div className='w-14 h-14 md:w-20 md:h-20 rounded-2xl bg-surface-2 border border-line flex items-center justify-center group-hover:border-accent transition-colors'>
                    <span className='font-display text-xl md:text-3xl font-semibold text-surface-3 group-hover:text-accent transition-colors'>
                      {step.n}
                    </span>
                  </div>
                </div>

                <div className='flex-1 pt-1'>
                  <div className='flex items-center gap-2.5 mb-2 text-muted group-hover:text-accent transition-colors'>
                    <Icon size={16} />
                    <h3 className='font-display text-lg md:text-xl font-semibold text-ink'>{step.title}</h3>
                  </div>
                  <p className='text-muted text-sm md:text-[15px] leading-relaxed max-w-2xl'>{step.body}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export { SectionHeading }
export default Steps
