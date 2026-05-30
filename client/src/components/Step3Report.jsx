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
      <div
        className="min-h-screen flex items-center justify-center"
      >
        <p className='text-gray-500 text-lg'>
          Loading Report
        </p>
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
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback && q.feedback.trim() !== "" ? q.feedback : "No feedback available."
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
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
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 50 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: 90 } // feedback (sum = 10+50+20+90 = 170 = contentWidth)
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
    <div className='min-h-screen bg-linear-to-br from-gray-50 to-green-50 px-4 sm:px-6 lg:px-10 py-8'>
      <div className='mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div className="md:mb-10 w-full flex items-start gap-4">
          <button
            onClick={() => navigate('/history')}
            className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition cursor-pointer'><FaArrowLeft className='text-gray-700' /></button>
          <div>
            <h1 className='text-4xl font-bold flex-nowrap'>Interview Analytics Dashboard</h1>
            <p className=' text-gray-500 mt-2'>Comprehensive breakdown of your interview performance</p>
          </div>
        </div>

        <button onClick={downloadPDF} className='bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap cursor-pointer px-6'>Download PDF</button>

      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8'>
        <div className='space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center'>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4">Overall Performance</h1>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "20px",
                  pathColor: "#3b82f6",
                  textColor: "#333",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>
            <div className='bg-linear-to-br from-gray-50 to-green-50 rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 text-center'>

              <p className='text-lg font-semibold'>{performanceText}</p>
              <p className='text-gray-600 mt-2 text-lg font-semibold'>{shortTagline}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8'>
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 mb-6'>Skill Evaluation</h3>
            <div className='space-y-4'>
              {
                skills.map((skill, index) => (
                  <div key={index} >
                    <div className='flex text-sm justify-between mb-1 sm:text-base'>
                      <span className='text-gray-600 font-medium'>{skill.label}</span>
                      <span className='text-green-500 font-semibold'>{skill.value}</span>

                    </div>

                    <div className='bg-gray-200 h-2 sm:h-3 rounded-full'>
                      <div className='bg-green-500 h-full rounded-full' style={{ width: `${skill.value * 10}%` }}>

                      </div>

                    </div>

                  </div>
                ))
              }
            </div>
          </motion.div>
        </div>

        <div className='lg:col-span-2 space-y-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-6 sm:p-8 '>
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 sm:mb-6 mb-4'>Performance Trend</h3>
            <div className='h-64 sm:h-72'>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="score" stroke="#22c55e" fill="#bbf7d0" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='bg-white rounded-2xl sm:rounded-3xl shadow-lg p-5 sm:p-8 '
          >
            <h3 className='text-base sm:text-lg font-semibold text-gray-700 sm:mb-6 mb-4'>Question Breakdown</h3>
            <div className='space-y-4'>
              {
                questionWiseScore.map((question, index) => (
                  <div key={index} className='bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-200'>
                    <div className='flex flex-col sm:flex-row justify-between sm:items-start gap-3 mb-4'>
                      <div className=''>
                        <p className='text-xs text-gray-400'>Question {index + 1}</p>
                        <p className='font-semibold text-gray-800 text-sm sm:text-base leading-relaxed'>{question.question}</p>
                      </div>
                      <div className='bg-green-100 text-green-600 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit'>
                        {question.score}/10
                      </div>
                    </div>

                    <div className='bg-green-50 border border-green-200 p-4 rounded-lg'>
                      <p className='text-sm font-semibold text-green-800 mb-1 '>AI FEEDBACK </p>
                      <p className='text-sm text-gray-700 leading-relaxed'>{question.feedback && question.feedback.trim() !== "" ? question.feedback : "No feedback available"}</p>

                    </div>

                  </div>
                ))
              }
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Step3Report