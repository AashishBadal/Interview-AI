import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BsRobot } from 'react-icons/bs'

// a scripted interview that types itself out on a loop — the hero "shows" the product
const script = [
  {
    q: "Walk me through how you'd design a rate limiter for a public API.",
    a: "I'd start with a token bucket per client key, then push hot keys to Redis so it scales horizontally…",
    axis: 'technical accuracy',
    score: 8.4,
  },
  {
    q: "How do you keep a React list smooth at ten-thousand rows?",
    a: "Virtualize the viewport, memoize each row, and key on a stable id so React skips re-renders…",
    axis: 'communication',
    score: 7.9,
  },
  {
    q: "Tell me about an engineering tradeoff you'd make differently.",
    a: "I cached a response too early and it masked a data bug — now I add caching only after correctness…",
    axis: 'confidence',
    score: 8.1,
  },
]

const Waveform = ({ active }) => (
  <div className='flex items-center gap-[3px] h-7'>
    {Array.from({ length: 22 }).map((_, i) => (
      <span
        key={i}
        className={`w-[3px] rounded-full origin-center transition-colors ${active ? 'bg-accent' : 'bg-surface-3'}`}
        style={{ height: '100%', animation: active ? `wave 1.05s ease-in-out ${(i % 8) * 0.09}s infinite` : 'none' }}
      />
    ))}
  </div>
)

const LiveInterview = () => {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [result, setResult] = useState(null) // { axis, score }
  const [timer, setTimer] = useState(0)

  // typewriter driver — one self-cancelling loop
  useEffect(() => {
    let cancelled = false
    const timers = []
    const wait = (ms) => new Promise((res) => timers.push(setTimeout(res, ms)))
    const type = async (full, setter, speed) => {
      for (let i = 1; i <= full.length; i++) {
        if (cancelled) return
        setter(full.slice(0, i))
        await wait(speed)
      }
    }
    const run = async () => {
      let i = 0
      while (!cancelled) {
        const item = script[i % script.length]
        setResult(null)
        setAnswer('')
        setQuestion('')
        setSpeaking(false)
        setTimer(0)
        await wait(450)
        await type(item.q, setQuestion, 26) // interviewer asks
        await wait(500)
        setSpeaking(true)
        await type(item.a, setAnswer, 20) // candidate responds
        setSpeaking(false)
        await wait(350)
        setResult({ axis: item.axis, score: item.score }) // score reveals
        await wait(2800)
        i++
      }
    }
    run()
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // running clock while a turn is in progress
  useEffect(() => {
    const id = setInterval(() => setTimer((t) => (result ? t : t + 1)), 1000)
    return () => clearInterval(id)
  }, [result])

  const mmss = `00:${String(timer).padStart(2, '0')}`

  return (
    <div className='relative w-full'>
      {/* glow behind */}
      <div className='pointer-events-none absolute inset-0 bg-accent/10 blur-[90px] scale-90' />

      <div className='relative card bg-surface/85 backdrop-blur-xl p-5 sm:p-7 text-left'>
        {/* header */}
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-2.5'>
            <span className='relative flex h-2.5 w-2.5'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-70' />
              <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-accent' />
            </span>
            <span className='label-mono !text-ink/70'>live session</span>
          </div>
          <span className='font-mono text-sm text-muted tabular-nums'>{mmss}</span>
        </div>

        {/* interviewer */}
        <div className='flex items-start gap-3 mb-5 min-h-[72px]'>
          <div className='shrink-0 w-9 h-9 rounded-xl bg-surface-3 border border-line flex items-center justify-center text-accent'>
            <BsRobot size={17} />
          </div>
          <div>
            <p className='label-mono mb-1.5'>ai interviewer</p>
            <p className='text-ink text-[15px] sm:text-base leading-relaxed font-medium'>
              {question || <span className='text-faint'>connecting…</span>}
              {question && !speaking && !result && (
                <span className='inline-block w-[2px] h-[1.05em] align-[-0.15em] bg-accent ml-0.5 animate-pulse' />
              )}
            </p>
          </div>
        </div>

        {/* candidate answer + waveform */}
        <div className='bg-surface-2 border border-line rounded-2xl p-4 min-h-[112px]'>
          <div className='flex items-center justify-between mb-3'>
            <span className={`label-mono ${speaking ? '!text-accent/80' : ''}`}>
              {speaking ? "you're speaking" : 'you'}
            </span>
            <Waveform active={speaking} />
          </div>
          <p className='text-sm text-muted leading-relaxed font-mono'>
            <span className='text-faint'>&gt; </span>
            {answer}
            {speaking && <span className='inline-block w-[2px] h-[1.05em] align-[-0.15em] bg-accent ml-0.5 animate-pulse' />}
          </p>
        </div>

        {/* live score reveal */}
        <div className='mt-4 min-h-[52px] flex items-center'>
          <AnimatePresence mode='wait'>
            {result ? (
              <motion.div
                key={result.axis + result.score}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className='w-full flex items-center justify-between bg-accent-soft border border-accent/30 rounded-xl px-4 py-3'
              >
                <div className='flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent' />
                  <span className='label-mono !text-accent/80'>scored · {result.axis}</span>
                </div>
                <span className='font-display text-xl font-semibold text-ink tabular-nums'>
                  {result.score.toFixed(1)}<span className='text-faint text-sm'>/10</span>
                </span>
              </motion.div>
            ) : (
              <motion.div
                key='analyzing'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='flex items-center gap-2'
              >
                <span className='label-mono'>{speaking ? 'analyzing response…' : 'awaiting answer'}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default LiveInterview
