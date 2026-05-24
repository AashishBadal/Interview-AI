import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import AuthModal from '../components/AuthModal'
import Hero from '../components/HomePage/Hero'
import Steps from '../components/HomePage/Steps'
import Capabilities from '../components/HomePage/Capabilities'
import InterviewModes from '../components/HomePage/InterviewModes'
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
    <div className='min-h-screen bg-[#f3f3f3] flex flex-col'>
      <Navbar />
      <div className='flex-1 flex flex-col items-center justify-center px-6 py-12 md:py-20'>
        <Hero onStart={handleStartInterview} onViewHistory={handleViewHistory} />
        <Steps />
        <Capabilities />
        <InterviewModes />
      </div>
      <Footer />

      {showAuth && (
        <AuthModal onClose={() => setShowAuth(false)} />
      )}
    </div>
  )
}

export default Home