import { useEffect, useState } from 'react'

// shown while the initial /user/current check is in flight.
// the backend is hosted on Render's free tier, which spins the
// instance down after ~15 min of inactivity — the first request
// after that triggers a cold start that can take ~1-2 min.
const SessionLoader = () => {
    const [elapsed, setElapsed] = useState(0)

    useEffect(() => {
        const id = setInterval(() => setElapsed((s) => s + 1), 1000)
        return () => clearInterval(id)
    }, [])

    // after a few seconds, surface the cold-start explanation so the
    // user understands why nothing is happening yet.
    const showColdStartNotice = elapsed >= 4

    return (
        <div className='min-h-screen bg-bg bg-grid flex items-center justify-center px-6'>
            <div className='flex flex-col items-center text-center max-w-md'>
                {/* spinner */}
                <div className='relative w-12 h-12'>
                    <div className='absolute inset-0 rounded-full border border-line' />
                    <div className='absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin' />
                </div>

                <p className='label-mono animate-pulse mt-6'>checking session…</p>

                <div
                    className={`mt-6 transition-opacity duration-700 ${
                        showColdStartNotice ? 'opacity-100' : 'opacity-0'
                    }`}
                >
                    <p className='text-sm text-muted leading-relaxed'>
                        Heads up — the backend is hosted on{' '}
                        <span className='text-ink font-medium'>Render's free tier</span>, which
                        goes to sleep after 15 minutes of inactivity.
                    </p>
                    <p className='text-sm text-muted leading-relaxed mt-2'>
                        If it's waking from a cold start, this can take up to{' '}
                        <span className='text-accent font-medium'>~2 minutes</span>. Hang tight —
                        no need to refresh.
                    </p>
                    <p className='label-mono mt-5'>warming up · {elapsed}s</p>
                </div>
            </div>
        </div>
    )
}

export default SessionLoader
