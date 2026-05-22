import { useDispatch, useSelector } from 'react-redux'
import { motion } from "motion/react"
import { BsCoin, BsRobot } from 'react-icons/bs'
import { FaUserAstronaut } from 'react-icons/fa6';
import { HiOutlineLogout } from 'react-icons/hi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/userSlice';
import axios from 'axios';
import { ServerUrl } from '../App';

const Navbar = () => {
    const { userData } = useSelector((state) => state.user)
    const [showCreditPopup, setShowCreditPopup] = useState(false);
    const [showUserPopup, setShowUserPopup] = useState(false);
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
        <div className='bg-[#f3f3f3] flex justify-center px-4 px-6'>
            <motion.div
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
                className='w-full max-w-6xl bg-white rounded-[24px] border-gray-200 px-8 py-4 flex items-center justify-between relative'>
                <div className='flex items-center gap-3 cursor-pointer'>
                    <div className='bg-black text-white p-2 rounded-lg'><BsRobot size={18} /></div>
                    <h1 className='font-semibold hidden md:block text-lg'>Interview AI</h1>
                </div>
                <div className='flex items-center gap-4 relative' >
                    <div className='relative'>
                        <button onClick={() => {
                            setShowCreditPopup(!showCreditPopup);
                            setShowUserPopup(false);
                        }}
                            className='flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-full text-md hover:bg-gray-200 transition'>
                            <BsCoin size={20} />
                            {userData?.credits || '0'}
                        </button>
                        {showCreditPopup && (
                            <div className='absolute mt-3 w-64 right-[-50px] bg-white rounded-xl shadow-xl border border-gray-200 rounded-xl  p-5 z-50'>
                                <p className='text-sm text-gray-600 mb-4'>Need more credits to continue to interviews?</p>
                                <button onClick={() => navigate('/pricing')} className='w-full bg-black text-white py-2 rounded-lg text-sm'>Buy more credits</button>
                            </div>
                        )}
                    </div>
                    <div className='relative'>
                        <button onClick={() => { setShowUserPopup(!showUserPopup); setShowCreditPopup(false) }} className='w-9 h-9 bg-black text-white rounded-full flex items-center justify-center font-semibold cursor-pointer' >
                            {userData ? userData?.name?.charAt(0).toUpperCase() : <FaUserAstronaut size={16} />}
                        </button>
                        {showUserPopup && (
                            <div className='absolute mt-3 w-48 right-0 bg-white rounded-xl shadow-xl border border-gray-200 rounded-xl  p-5 z-50'>
                                <p className='text-md text-blue-600 font-medium mb-1'>{userData?.name}</p>
                                <button onClick={() => navigate('/history')} className='w-full text-left text-sm py-2 hover:text-black text-gray-600 cursor-pointer'>Interview History</button>
                                <button onClick={() => handleLogout()} className='w-full flex gap-2 items-center text-left text-sm py-2 text-red-500 cursor-pointer'>
                                    <HiOutlineLogout size={16} />
                                    Logout</button>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

        </div>
    )
}

export default Navbar