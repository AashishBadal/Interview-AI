import { motion } from 'motion/react'
import { FaArrowLeft } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {
  AreaChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts'

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

        <button className='bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl shadow-md transition-all duration-300 font-semibold text-sm sm:text-base text-nowrap px-6'>Download PDF</button>

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
                      <p className='text-sm font-semibold text-green-800 mb-1 '>AI FEEDBACK                     
                         <p className='text-sm text-gray-700 leading-relaxed'>{question.feedback && question.feedback.trim() !== "" ? question.feedback : "No feedback available"}</p>
                      </p>
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