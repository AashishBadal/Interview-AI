import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsCoin } from 'react-icons/bs'
import { FaUserAstronaut } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { ServerUrl } from '../App';
import AuthModal from './AuthModal';

const Navbar = () => {
    const { userData } = useSelector((state) => state.user)
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = async() => {
        try {
            await axios.get(ServerUrl + '/auth/logout',{withCredentials:true});
            dispatch(setUserData(null));
            setShowUserPopup(false);
            setShowCreditPopup(false);
            navigate('/auth');
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <div className='sticky top-0 z-50 px-4 sm:px-6 pt-4'>
            <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className='w-full max-w-6xl mx-auto bg-surface/70 backdrop-blur-xl border border-line rounded-2xl px-5 sm:px-7 py-3.5 flex items-center justify-between relative'>
                <div onClick={() => navigate('/')} className='flex items-center gap-3 cursor-pointer group'>
                    <div className='relative w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-display font-bold text-bg text-lg leading-none'>
                        i
                        <span className='absolute -right-0.5 -top-0.5 w-2 h-2 rounded-full bg-accent ring-2 ring-bg animate-pulse' />
                    </div>
                    <div className='hidden sm:flex flex-col leading-none'>
                        <span className='font-display font-semibold text-[15px] tracking-tight'>Interview<span className='text-accent'>AI</span></span>
                        <span className='label-mono mt-1 !text-[9px]'>mock interview engine</span>
                    </div>
                </div>
                <div className='flex items-center gap-3 relative' >
                    <div className='relative'>
                        <button onClick={() => {
                            if(!userData){
                                setShowAuth(true);
                                return;
                            }else{
                                setShowCreditPopup(!showCreditPopup);
                                setShowUserPopup(false);
                            }
                        }}
                            className='flex items-center gap-2 bg-surface-2 border border-line px-4 py-2 rounded-full text-sm font-medium hover:border-line-strong transition'>
                            <BsCoin size={16} className='text-accent' />
                            <span className='font-mono'>{userData?.credits ?? '0'}</span>
                        </button>
                        {showCreditPopup && (
                            <div className='absolute mt-3 w-64 right-0 sm:right-[-40px] card !rounded-2xl p-5 z-50'>
                                <p className='label-mono mb-2'>balance</p>
                                <p className='text-sm text-muted mb-4'>Running low on credits? Top up to keep practicing.</p>
                                <button onClick={() => navigate('/pricing')} className='btn-accent w-full py-2.5 text-sm'>Buy credits</button>
                            </div>
                        )}
                    </div>
                    <div className='relative'>
                        <button onClick={() => {
                            if(!userData){
                                setShowAuth(true);
                                return;
                            }else{
                                setShowUserPopup(!showUserPopup);
                                setShowCreditPopup(false);
                            }}} className='w-9 h-9 bg-surface-2 border border-line-strong text-ink rounded-full flex items-center justify-center font-display font-semibold cursor-pointer hover:border-accent transition' >
                            {userData ? userData?.name?.charAt(0).toUpperCase() : <FaUserAstronaut size={15} />}
                        </button>
                        {showUserPopup && (
                            <div className='absolute mt-3 w-52 right-0 card !rounded-2xl p-4 z-50'>
                                <p className='label-mono mb-1'>signed in</p>
                                <p className='text-sm text-ink font-medium mb-3 truncate'>{userData?.name}</p>
                                <div className='h-px bg-line mb-2' />
                                <button onClick={() => navigate('/history')} className='w-full text-left text-sm py-2 text-muted hover:text-ink transition cursor-pointer'>Interview History</button>
                                <button onClick={() => handleLogout()} className='w-full flex gap-2 items-center text-left text-sm py-2 text-bad hover:text-rose-300 transition cursor-pointer'>
                                    <HiOutlineLogout size={15} />
                                    Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
            {
                showAuth && (
                    <AuthModal onClose={() => setShowAuth(false)} />
                )
            }
        </div>
    )
}

export default Navbar