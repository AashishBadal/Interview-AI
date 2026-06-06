import { motion } from 'motion/react'
import { FcGoogle } from 'react-icons/fc'
import { HiArrowUpRight } from 'react-icons/hi2'
import { auth, provider } from '../utils/firebase'
import { signInWithPopup } from 'firebase/auth'
import { ServerUrl } from '../App'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom'
import { FaTimes } from 'react-icons/fa'

const Auth = ({ isModal = false, onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleGoogleSignIn = async () => {
        try {
            const response = await signInWithPopup(auth, provider)
            let User = response.user
            let name = User.displayName
            let email = User.email
            const result = await axios.post(ServerUrl + '/auth/google', { name, email }, { withCredentials: true });

            dispatch(setUserData(result.data.user))
            navigate('/')
        } catch (error) {
            console.log(error)
            dispatch(setUserData(null))
        }
    }
    return (
        <div className={`w-full ${isModal ? '' : 'min-h-screen bg-bg flex items-center justify-center px-6 py-20 relative overflow-hidden'}`}>
            {!isModal && (
                <>
                    <div className='pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[60vh] rounded-full bg-accent/10 blur-[140px]' />
                    <div className='pointer-events-none absolute inset-0 bg-grid opacity-40' />
                </>
            )}
            <motion.div
                initial={{ opacity: 0, y: -24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className={`relative w-full ${isModal ? 'max-w-md p-8' : 'max-w-md p-10'} card !rounded-3xl bg-surface`}>
                {isModal && onClose && (
                    <button onClick={onClose} className="absolute top-5 right-5 text-faint hover:text-ink text-lg cursor-pointer transition">
                        <FaTimes />
                    </button>
                )}
                <div className="flex items-center gap-3 mb-10">
                    <div className='w-9 h-9 rounded-xl bg-accent flex items-center justify-center font-display font-bold text-bg text-lg leading-none'>i</div>
                    <span className='font-display font-semibold tracking-tight'>Interview<span className='text-accent'>AI</span></span>
                </div>

                <span className='label-mono'>welcome</span>
                <h1 className='font-display text-3xl font-semibold tracking-tight leading-tight mt-3 mb-3'>
                    Sign in to start <br /> your <span className='text-accent'>mock interview</span>
                </h1>
                <p className='text-muted text-sm leading-relaxed mb-9'>
                    Track your progress, unlock detailed performance insights, and pick up right where you left off.
                </p>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleGoogleSignIn}
                    className="group w-full py-3.5 px-4 flex items-center bg-ink text-bg font-medium rounded-full cursor-pointer justify-center gap-3 transition hover:bg-white">
                    <FcGoogle size={20} />
                    Continue with Google
                    <HiArrowUpRight className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' size={16} />
                </motion.button>

                <p className='label-mono text-center mt-6 !text-[10px]'>
                    secure oauth · no password required
                </p>
            </motion.div>
        </div>
    )
}

export default Auth
