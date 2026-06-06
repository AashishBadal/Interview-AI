import React from 'react'
import { motion } from 'motion/react'
import { BsBarChart, BsFileEarmarkText, BsFiletypePdf, BsClockHistory } from 'react-icons/bs'
import resumeImg from '../../assets/resume.png'
import pdfImg from '../../assets/pdf.png'
import { SectionHeading } from './Steps'

const tile = 'card p-6 md:p-7 hover:border-line-strong transition-colors flex flex-col group'

const Capabilities = () => {
  return (
    <div className='w-full max-w-5xl mt-28 md:mt-40 px-2'>
      <SectionHeading
        index='// 02'
        label='capabilities'
        title='Built like a real interviewer, not a quiz.'
        sub='Every session is scored, explained and saved — so practice actually compounds.'
      />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 md:auto-rows-[210px]'>
        {/* A — wide feature: live scoring */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className={`${tile} md:col-span-2 justify-between`}
        >
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 text-accent'>
              <BsBarChart size={15} />
              <span className='label-mono !text-accent/80'>scoring</span>
            </div>
            <span className='label-mono'>per answer</span>
          </div>
          <div>
            <h3 className='font-display font-semibold text-lg mb-4'>AI answer evaluation</h3>
            <div className='space-y-2.5'>
              {[['Communication', 84], ['Technical accuracy', 79], ['Confidence', 81]].map(([label, val]) => (
                <div key={label} className='flex items-center gap-3'>
                  <span className='text-xs text-muted w-36 shrink-0'>{label}</span>
                  <div className='flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden'>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${val}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: 'easeOut' }}
                      className='h-full bg-accent rounded-full'
                    />
                  </div>
                  <span className='font-mono text-xs text-ink w-8 text-right'>{(val / 10).toFixed(1)}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* B — tall: resume */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className={`${tile} md:row-span-2 justify-between`}
        >
          <div>
            <div className='flex items-center gap-2 text-accent mb-4'>
              <BsFileEarmarkText size={15} />
              <span className='label-mono !text-accent/80'>resume</span>
            </div>
            <h3 className='font-display font-semibold text-lg mb-2'>Resume-based interview</h3>
            <p className='text-muted text-sm leading-relaxed'>Upload a resume and get questions drawn from your actual projects and stack.</p>
          </div>
          <div className='mt-6 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-300 p-6 flex items-center justify-center group-hover:scale-[1.02] transition-transform'>
            <img src={resumeImg} alt='Resume based interview' className='w-28 h-28 object-contain' />
          </div>
        </motion.div>

        {/* C — pdf report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`${tile} justify-between`}
        >
          <div className='flex items-start justify-between'>
            <div className='flex items-center gap-2 text-accent'>
              <BsFiletypePdf size={15} />
              <span className='label-mono !text-accent/80'>report</span>
            </div>
            <img src={pdfImg} alt='' className='w-12 h-12 object-contain opacity-90 group-hover:scale-110 transition-transform' />
          </div>
          <div>
            <h3 className='font-display font-semibold text-base mb-1.5'>Downloadable PDF</h3>
            <p className='text-muted text-sm leading-relaxed'>Strengths, gaps and concrete next steps in a shareable report.</p>
          </div>
        </motion.div>

        {/* D — history with mini bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className={`${tile} justify-between`}
        >
          <div className='flex items-center gap-2 text-accent'>
            <BsClockHistory size={15} />
            <span className='label-mono !text-accent/80'>analytics</span>
          </div>
          <div className='flex items-end gap-1.5 h-12'>
            {[40, 55, 48, 70, 64, 88].map((h, i) => (
              <motion.span
                key={i}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                className={`flex-1 rounded-t ${i === 5 ? 'bg-accent' : 'bg-surface-3'}`}
              />
            ))}
          </div>
          <div>
            <h3 className='font-display font-semibold text-base mb-1.5'>History & analytics</h3>
            <p className='text-muted text-sm leading-relaxed'>Watch your scores trend up over every session.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Capabilities
