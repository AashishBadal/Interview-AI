import React from 'react'
import { BsRobot } from 'react-icons/bs'

const Footer = () => {
  return (
    <div className='bg-[#f3f3f3] flex justify-center px-6 pb-8'>
      <div className='w-full max-w-6xl bg-white rounded-[24px] border border-gray-200/50 px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm'>
        <div className='flex items-center gap-3'>
          <div className='bg-black text-white p-2 rounded-lg'>
            <BsRobot size={18} />
          </div>
          <span className='font-semibold text-gray-800 text-md'>Interview AI</span>
        </div>
        <p className='text-gray-400 text-xs md:text-sm order-3 md:order-2'>
          &copy; {new Date().getFullYear()} Interview AI. All rights reserved.
        </p>
        <div className='flex items-center gap-6 text-sm text-gray-500 font-medium order-2 md:order-3'>
          <a href="#" className='hover:text-black transition-colors'>Terms</a>
          <a href="#" className='hover:text-black transition-colors'>Privacy</a>
          <a href="#" className='hover:text-black transition-colors'>Contact</a>
        </div>
      </div>
    </div>
  )
}

export default Footer
