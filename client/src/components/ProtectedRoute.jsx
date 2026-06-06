import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

const ProtectedRoute = ({ children }) => {
    const { userData, authLoading } = useSelector((state) => state.user)

    // wait for the initial /user/current check to resolve before deciding
    if (authLoading) {
        return (
            <div className='min-h-screen bg-bg flex items-center justify-center'>
                <p className='label-mono animate-pulse'>checking session…</p>
            </div>
        )
    }

    if (!userData) {
        return <Navigate to='/auth' replace />
    }

    return children
}

export default ProtectedRoute
