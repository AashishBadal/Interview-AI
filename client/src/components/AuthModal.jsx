import { useEffect } from "react";
import { useSelector } from "react-redux"
import Auth from "../pages/Auth";

const AuthModal = ({onClose}) => {
    const {userData} = useSelector((state) => state.user);

    useEffect(() => {
        if (userData) {
            onClose();
        }
    }, [userData, onClose]);
  return (
    <div className='fixed inset-0 z-[999] bg-bg/80 flex items-center justify-center backdrop-blur-md px-4'>
        <div className="w-full max-w-md">
            <Auth isModal={true} onClose={onClose}/>
        </div>
    </div>
  )
}

export default AuthModal