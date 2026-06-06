import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import Hero from '../components/HomePage/Hero'
import RoleMarquee from '../components/HomePage/RoleMarquee'
import Steps from '../components/HomePage/Steps'
import Capabilities from '../components/HomePage/Capabilities'
import InterviewModes from '../components/HomePage/InterviewModes'
import CTABand from '../components/HomePage/CTABand'
import Footer from '../components/Footer'

const Home = () => {
  const { userData } = useSelector(state => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!userData) {
      setShowAuth(true);
    } else {
      // In the future, this will redirect to a setups/dashboard page.
      alert("Start Interview feature is coming soon!");
    }
  }

  const handleViewHistory = () => {
    if (!userData) {
      setShowAuth(true);
    } else {
      navigate('/history');
    }
  }

  return (
    <div className='min-h-screen bg-bg text-ink flex flex-col relative overflow-hidden'>
      {/* ambient glow — only behind the hero, fades into pure dark below */}
      <div className='pointer-events-none absolute top-[-12%] left-1/2 -translate-x-1/2 w-[80vw] h-[55vh] rounded-full bg-accent/10 blur-[150px]' />
      <div className='pointer-events-none absolute inset-x-0 top-0 h-[120vh] bg-grid opacity-30' />
      <div className='relative z-10 flex flex-col'>
        <Navbar />
        <div className='flex-1 flex flex-col items-center px-6 pt-16 pb-12'>
          <Hero onStart={handleStartInterview} onViewHistory={handleViewHistory} />
          <RoleMarquee />
          <Steps />
          <Capabilities />
          <InterviewModes />
          <CTABand />
        </div>
        <Footer />
      </div>

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  )
}

export default Home