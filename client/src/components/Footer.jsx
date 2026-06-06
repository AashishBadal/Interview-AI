import React from 'react'

const Footer = () => {
  return (
    <footer className='px-4 sm:px-6 pb-6 mt-24'>
      <div className='w-full max-w-6xl mx-auto card px-6 sm:px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-5'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-accent flex items-center justify-center font-display font-bold text-bg leading-none'>i</div>
          <span className='font-display font-semibold tracking-tight'>Interview<span className='text-accent'>AI</span></span>
        </div>
        <p className='label-mono order-3 md:order-2'>
          © {new Date().getFullYear()} interviewai — all rights reserved
        </p>
        <div className='flex items-center gap-6 text-sm text-muted order-2 md:order-3'>
          <a href="#" className='hover:text-ink transition-colors'>Terms</a>
          <a href="#" className='hover:text-ink transition-colors'>Privacy</a>
          <a href="#" className='hover:text-ink transition-colors'>Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
