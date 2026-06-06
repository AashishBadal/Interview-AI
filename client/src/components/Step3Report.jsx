import { motion } from 'motion/react'
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { jsPDF } from "jspdf"
import {
  AreaChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'
import autoTable from 'jspdf-autotable'

const Step3Report = ({ report }) => {

  const navigate = useNavigate()
  if (!report) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <p className='label-mono animate-pulse'>loading report…</p>
      </div>
    )
  }

  const { finalScore = 0, confidence = 0, communication = 0, correctness = 0, questionWiseScore = [] } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q ${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: 'Communication', value: communication },
    { label: 'Correctness', value: correctness },
    { label: 'Confidence', value: confidence },
  ]

  let performanceText = "";
  let shortTagline = ""

  if (finalScore >= 8) {
    performanceText = "Ready for job oppurtinities"
    shortTagline = "Excellent clarity and structured responses"
  } else if (finalScore >= 6) {
    performanceText = "Needs minor improvement before interview"
    shortTagline = "Good foundation, refine articulation"
  } else {
    performanceText = "Significant improvement required."
    shortTagline = "Work on clarity and confidence"
  }

  const score = finalScore
  const percentage = (score / 10) * 100

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4")
    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let currentY = 25

    // TITLE Banner
    doc.setFont("helvetica", "bold")
    doc.setFontSize(20)
    doc.setTextColor(5, 150, 105) // Emerald 600
    doc.text("INTERVIEW PERFORMANCE REPORT", pageWidth / 2, currentY, { align: "center" })
    currentY += 5

    // TITLE UNDERLINE
    doc.setDrawColor(5, 150, 105)
    doc.setLineWidth(0.8)
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2)

    currentY += 15

    // PERFORMANCE SUMMARY CARD
    const summaryCardHeight = 35;
    doc.setFillColor(249, 250, 251) // Gray 50
    doc.setDrawColor(229, 231, 235) // Gray 200
    doc.setLineWidth(0.2)
    doc.roundedRect(margin, currentY, contentWidth, summaryCardHeight, 3, 3, "FD")

    // Left Column (Overall Score)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128) // Gray 500
    doc.text("OVERALL SCORE", margin + 10, currentY + 9)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(26)
    doc.setTextColor(15, 23, 42) // Slate 900
    doc.text(`${finalScore}`, margin + 10, currentY + 21)

    const finalScoreWidth = doc.getTextWidth(`${finalScore}`);
    doc.setFont("helvetica", "normal")
    doc.setFontSize(14)
    doc.setTextColor(107, 114, 128)
    doc.text(" / 10", margin + 10 + finalScoreWidth, currentY + 20)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(5, 150, 105) // Emerald 600
    doc.text(performanceText, margin + 10, currentY + 29)

    // Divider Line
    doc.setDrawColor(229, 231, 235)
    doc.setLineWidth(0.2)
    doc.line(margin + 75, currentY + 5, margin + 75, currentY + summaryCardHeight - 5)

    // Right Column (Skills Breakdown)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(9)
    doc.setTextColor(107, 114, 128)
    doc.text("SKILL METRICS", margin + 85, currentY + 9)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(75, 85, 99) // Gray 600
    
    doc.text("Confidence:", margin + 85, currentY + 16)
    doc.setTextColor(5, 150, 105)
    doc.text(`${confidence} / 10`, margin + 140, currentY + 16)

    doc.setTextColor(75, 85, 99)
    doc.text("Communication:", margin + 85, currentY + 23)
    doc.setTextColor(5, 150, 105)
    doc.text(`${communication} / 10`, margin + 140, currentY + 23)

    doc.setTextColor(75, 85, 99)
    doc.text("Correctness:", margin + 85, currentY + 30)
    doc.setTextColor(5, 150, 105)
    doc.text(`${correctness} / 10`, margin + 140, currentY + 30)

    currentY += summaryCardHeight + 8

    // ADVICE CARD
    let advice = ""
    if (finalScore >= 8) {
      advice = "Fantastic job! Your performance demonstrates an excellent command of the technical topics, exceptional communication clarity, and commendable confidence. You structured your responses logically, addressed the core prompts directly, and maintained a highly engaging, professional tone throughout the entire session. To stand out even further in competitive hiring processes, continue to refine your delivery by incorporating specific, high-impact examples from your past experiences using the STAR method (Situation, Task, Action, Result). Focus on highlighting quantifiable achievements and lessons learned. You are fully prepared for active job opportunities—approach your upcoming interviews with confidence!"
    } else if (finalScore >= 5) {
      advice = "Good effort! You have established a solid foundation with a clear grasp of the core concepts, but there is room to refine your articulation and delivery. At times, your responses lacked specific detail or structured flow, which can dilute the impact of your answers. To build more impact, practice structuring your answers using the STAR method: clearly outline the situation, specify the exact tasks, describe your actions, and present the final results. Additionally, work on pacing your speech to maintain high confidence. With a bit of targeted refinement and practice, you will be well-prepared for success!"
    } else {
      advice = "Your performance indicates that significant improvement is required to succeed in upcoming professional interviews. Focus heavily on rebuilding confidence and mastering core technical concepts before scheduling another session. When answering, practice organizing your thoughts systematically rather than rushing into responses; clear structure is key to communication. We recommend studying key topics, outlining structured talking points for common questions, and practicing mock interviews aloud. Concentrate on speaking clearly, pausing when needed, and aligning your answers with concrete examples. With dedicated preparation, structured practice, and consistency, you can dramatically improve your delivery and score."
    }

    // Dynamic advice card height calculation
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20)
    const adviceLineHeight = 4.8
    const adviceTextHeight = splitAdvice.length * adviceLineHeight
    const adviceCardHeight = 15 + adviceTextHeight + 6

    doc.setFillColor(240, 253, 244) // Light emerald 50
    doc.setDrawColor(187, 247, 208) // Emerald 200 border
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, currentY, contentWidth, adviceCardHeight, 3, 3, "FD")

    // Advice Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(5, 150, 105)
    doc.text("PROFESSIONAL ADVICE", margin + 10, currentY + 9)

    // Advice Text
    doc.setFont("helvetica", "normal")
    doc.setFontSize(9.5)
    doc.setTextColor(55, 65, 81)
    doc.text(splitAdvice, margin + 10, currentY + 16)

    currentY += adviceCardHeight + 8

    // DETAILED BREAKDOWN SECTION HEADING
    let tableStartY = currentY + 8;
    if (currentY + 30 > 270) {
      doc.addPage();
      currentY = 20;
      tableStartY = 28;
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(12)
    doc.setTextColor(15, 23, 42) // Slate 900
    doc.text("DETAILED QUESTION BREAKDOWN", margin, currentY + 4)

    // QUESTION TABLE WITH AUTOTABLE
    autoTable(doc, {
      startY: tableStartY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback", "Suggested Answer"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available.",
        q.suggestedAnswer && q.suggestedAnswer.trim() !== "" ? q.suggestedAnswer : "No suggested answer available."
      ]),
      styles: {
        fontSize: 8.5,
        cellPadding: 4,
        valign: "top",
        overflow: "linebreak"
      },
      headStyles: {
        fillColor: [5, 150, 105], // Emerald 600
        textColor: 255,
        fontStyle: "bold",
        halign: "left"
      },
      columnStyles: {
        0: { cellWidth: 8, halign: "center" }, // index
        1: { cellWidth: 40 }, // question
        2: { cellWidth: 15, halign: "center" }, // score
        3: { cellWidth: 52 }, // feedback
        4: { cellWidth: 55 } // suggested answer (sum = 8+40+15+52+55 = 170 = contentWidth)
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251]
      },
      theme: "striped",
      didDrawPage: (data) => {
        // Running Header on pages > 1
        if (data.pageNumber > 1) {
          doc.setFont("helvetica", "normal")
          doc.setFontSize(8)
          doc.setTextColor(156, 163, 175)
          doc.text("Interview Analytics Performance Report", margin, 12)
          doc.setDrawColor(229, 231, 235)
          doc.setLineWidth(0.1)
          doc.line(margin, 14, pageWidth - margin, 14)
        }
        
        // Running Footer on all pages
        doc.setFont("helvetica", "normal")
        doc.setFontSize(8)
        doc.setTextColor(156, 163, 175)
        doc.text(`Page ${data.pageNumber}`, pageWidth - margin - 15, doc.internal.pageSize.getHeight() - 10)
        doc.text("Generated by Interview AI", margin, doc.internal.pageSize.getHeight() - 10)
      }
    })

    doc.save(`Interview-Analytics-Report-${new Date().toISOString().slice(0, 10)}.pdf`)
  }

  return (
    <div className='min-h-screen bg-bg text-ink px-4 sm:px-6 lg:px-10 py-8 relative overflow-hidden'>
      <div className='pointer-events-none absolute top-[-15%] right-[-5%] w-[50vw] h-[50vh] rounded-full bg-accent/8 blur-[150px]' />
      <div className='relative z-10'>
        <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
          <div className="w-full flex items-start gap-4">
            <button
              onClick={() => navigate('/history')}
              className='mt-1 w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-line hover:border-line-strong transition cursor-pointer'><FaArrowLeft className='text-muted' /></button>
            <div>
              <span className='label-mono'>step 03 / report</span>
              <h1 className='font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-2'>Interview Analytics</h1>
              <p className='text-muted mt-1.5 text-sm'>Comprehensive breakdown of your interview performance</p>
            </div>
          </div>

          <button onClick={downloadPDF} className='btn-accent py-3 px-6 text-sm text-nowrap'>Download PDF</button>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          <div className='space-y-5'>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className='card p-7 text-center'>
              <h2 className="label-mono mb-6">overall performance</h2>
              <div className='relative w-28 h-28 mx-auto'>
                <CircularProgressbar
                  value={percentage}
                  text={`${score}/10`}
                  styles={buildStyles({
                    textSize: "20px",
                    pathColor: "#c6f24e",
                    textColor: "#fafafa",
                    trailColor: "rgba(255,255,255,0.08)",
                    strokeLinecap: "round",
                  })}
                />
              </div>
              <div className='mt-6 pt-5 border-t border-line'>
                <p className='font-display text-lg font-semibold text-accent'>{performanceText}</p>
                <p className='text-muted mt-1.5 text-sm'>{shortTagline}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className='card p-7'>
              <h3 className='label-mono mb-6'>skill evaluation</h3>
              <div className='space-y-5'>
                {skills.map((skill, index) => (
                  <div key={index}>
                    <div className='flex text-sm justify-between mb-2'>
                      <span className='text-muted font-medium'>{skill.label}</span>
                      <span className='text-accent font-mono font-semibold'>{skill.value}/10</span>
                    </div>
                    <div className='bg-surface-3 h-2 rounded-full overflow-hidden'>
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.value * 10}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className='bg-accent h-full rounded-full' />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className='lg:col-span-2 space-y-5'>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className='card p-6 sm:p-7'>
              <h3 className='label-mono mb-6'>performance trend</h3>
              <div className='h-64 sm:h-72'>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={questionScoreData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c6f24e" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#c6f24e" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                    <XAxis dataKey="name" stroke="#56565f" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                    <YAxis domain={[0, 10]} stroke="#56565f" tick={{ fontSize: 12, fontFamily: 'JetBrains Mono' }} />
                    <Tooltip
                      contentStyle={{ background: '#16161c', border: '1px solid rgba(255,255,255,0.16)', borderRadius: 12, color: '#fafafa' }}
                      cursor={{ stroke: 'rgba(198,242,78,0.4)' }} />
                    <Area type="monotone" dataKey="score" stroke="#c6f24e" strokeWidth={2.5} fill="url(#scoreFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className='card p-5 sm:p-7'>
              <h3 className='label-mono mb-6'>question breakdown</h3>
              <div className='space-y-4'>
                {questionWiseScore.map((question, index) => (
                  <div key={index} className='bg-surface-2 p-5 rounded-2xl border border-line'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4'>
                      <div>
                        <p className='label-mono mb-1'>question {index + 1}</p>
                        <p className='font-semibold text-ink text-sm sm:text-base leading-relaxed'>{question.question}</p>
                      </div>
                      <div className='bg-accent-soft text-accent px-3 py-1 rounded-full font-mono font-semibold text-xs sm:text-sm w-fit shrink-0'>
                        {question.score}/10
                      </div>
                    </div>

                    <div className='bg-surface border border-line p-4 rounded-xl'>
                      <p className='label-mono !text-accent/80 mb-2'>ai feedback</p>
                      <p className='text-sm text-muted leading-relaxed'>{question.feedback && question.feedback.trim() !== "" ? question.feedback : "No feedback available"}</p>
                    </div>

                    {question.suggestedAnswer && question.suggestedAnswer.trim() !== "" && (
                      <div className='bg-surface border border-line p-4 rounded-xl mt-3'>
                        <p className='label-mono !text-accent/80 mb-2'>suggested answer</p>
                        <p className='text-sm text-muted leading-relaxed'>{question.suggestedAnswer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report