import React from 'react'

const roles = [
  'Frontend Engineer', 'Data Scientist', 'Product Manager', 'Backend Engineer',
  'DevOps', 'ML Engineer', 'UX Designer', 'Full Stack', 'Security Analyst',
  'Mobile Developer', 'Cloud Architect', 'QA Engineer',
]

const RoleMarquee = () => {
  // duplicate the list so the -50% translate loops seamlessly
  const loop = [...roles, ...roles]
  return (
    <div className='w-full mt-24 md:mt-32 border-y border-line py-6 overflow-hidden relative'>
      {/* edge fades */}
      <div className='pointer-events-none absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-bg to-transparent z-10' />
      <div className='pointer-events-none absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-bg to-transparent z-10' />

      <div className='flex w-max animate-marquee'>
        {loop.map((role, i) => (
          <span key={i} className='flex items-center gap-6 px-6 whitespace-nowrap'>
            <span className='font-display text-xl md:text-2xl font-medium text-muted hover:text-ink transition-colors'>
              {role}
            </span>
            <span className='text-accent text-lg'>✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export default RoleMarquee
