import { motion, AnimatePresence } from 'motion/react'
import { FaXmark, FaTriangleExclamation, FaCircleCheck, FaCircleInfo } from 'react-icons/fa6'

const variantConfig = {
    confirm: {
        Icon: FaTriangleExclamation,
        iconClass: 'text-bad',
        iconWrap: 'bg-bad/10 border-bad/30',
    },
    success: {
        Icon: FaCircleCheck,
        iconClass: 'text-accent',
        iconWrap: 'bg-accent-soft border-accent/30',
    },
    error: {
        Icon: FaTriangleExclamation,
        iconClass: 'text-bad',
        iconWrap: 'bg-bad/10 border-bad/30',
    },
    info: {
        Icon: FaCircleInfo,
        iconClass: 'text-accent',
        iconWrap: 'bg-accent-soft border-accent/30',
    },
}

const Modal = ({
    open,
    onClose,
    title,
    message,
    variant = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    showCancel = false,
    loading = false,
    danger = false,
}) => {
    const { Icon, iconClass, iconWrap } = variantConfig[variant] || variantConfig.info

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={loading ? undefined : onClose}
                    className='fixed inset-0 z-[999] bg-bg/80 flex items-center justify-center backdrop-blur-md px-4'>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 16 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 16 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        onClick={(e) => e.stopPropagation()}
                        className='card relative w-full max-w-md p-7'>
                        {!loading && (
                            <button
                                onClick={onClose}
                                aria-label='Close'
                                className='absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full border border-line text-muted hover:text-ink hover:border-line-strong transition'>
                                <FaXmark size={15} />
                            </button>
                        )}

                        <div className={`w-12 h-12 flex items-center justify-center rounded-full border ${iconWrap} mb-5`}>
                            <Icon className={iconClass} size={20} />
                        </div>

                        {title && (
                            <h3 className='font-display text-xl font-semibold tracking-tight mb-2'>{title}</h3>
                        )}
                        {message && (
                            <p className='text-muted text-sm leading-relaxed'>{message}</p>
                        )}

                        <div className='mt-7 flex items-center justify-end gap-3'>
                            {showCancel && (
                                <button
                                    onClick={onClose}
                                    disabled={loading}
                                    className='px-5 py-2.5 rounded-full text-sm font-medium border border-line text-muted hover:text-ink hover:border-line-strong transition disabled:opacity-50'>
                                    {cancelText}
                                </button>
                            )}
                            <button
                                onClick={onConfirm || onClose}
                                disabled={loading}
                                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-50 ${danger
                                    ? 'bg-bad text-white hover:bg-bad/90'
                                    : 'btn-accent'}`}>
                                {loading ? 'Please wait…' : confirmText}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default Modal
