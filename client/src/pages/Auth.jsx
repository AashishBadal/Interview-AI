import { BsRobot } from 'react-icons/bs'
import { IoSparkles } from 'react-icons/io5'
import { motion } from 'motion/react'
import {FcGoogle} from 'react-icons/fc'
import { auth, provider } from '../utils/firebase'
import { signInWithPopup } from 'firebase/auth'
import { ServerUrl } from '../App'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

const Auth = ({isModal=false, onClose}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleSignIn = async() => {
        try {
             const response = await signInWithPopup(auth,provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + '/auth/google',{name,email},{withCredentials:true});
            
            dispatch(setUserData(result.data.user))
            navigate('/')
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }
    return (
        <div className={`w-full ${isModal ? '' : 'min-h-screen bg-[#f3f3f3] flex items-center justify-center px-6 py-20'}`}>
            < motion.div
            initial={{opacity:0,y:-40}}
            animate={{opacity:1,y:0}}
            transition={{duration:1.05,ease:"easeOut"}} className={ `w-full ${isModal ? 'max-w-md p-8 rounded-3xl relative'  : 'max-w-lg p-12 rounded-[32px]'} bg-white shadow-2xl border border-gray-200`}>
                {isModal && onClose && (
                    <button onClick={onClose} className="absolute top-5 right-5 text-gray-800 hover:text-black text-xl cursor-pointer">
                        <FaTimes />
                    </button>
                )}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className='bg-black text-white p-2 rounded-lg'>
                        <BsRobot size={18} />
                    </div>

                    <h2 className='font-semibold text-lg'> Interview AI </h2>
                </div>
                <h1 className='text-2xl md:text-3xl font-semibold text-center leading-snug mb4'> Continue with <span className='bg-green-100 text-green-600 px-3 py-1 rounded-full inline-flex items-center gap-2'> <IoSparkles/>AI Smart Interview</span></h1>
                <p className='text-center text-gray-600 text-sm md:text-base leading-relaxed mb-8'>Sign in to start AI-Powered mock interviews. Track your progress and unlock detailed performance insights</p>
            <motion.button
            whileHover={{opacity:0.9,scale:1.03}}
            whileTap={{opacity:0.8,scale:0.98}} className="w-full py-3 px-4 flex items-center bg-black text-white font-medium rounded-full cursor-pointer justify-center gap-2" onClick={handleGoogleSignIn}>
                <FcGoogle/>
                Continue with Google
            </motion.button>
            </motion.div>
        </div>
    )
}

export default Auth