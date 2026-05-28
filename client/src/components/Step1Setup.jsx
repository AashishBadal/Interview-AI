import React, { useState } from 'react'
import { motion, moveItem } from 'motion/react'
import { FaUserTie, FaBriefcase, FaFileArrowUp, FaMicrophone, FaChartLine, FaList } from 'react-icons/fa6'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const Step1Setup = ({ onStart }) => {
  const {userData}= useSelector((state)=>state.user)
  const dispatch = useDispatch();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical")
  const [resumeFile, setResumeFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [resumeText, setResumeText] = useState(null)
  const [analysisDone, setAnalysisDone] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);

    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const result = await axios.post(ServerUrl + '/interview/resume', formData, { withCredentials: true });
      console.log(result.data);

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setSkills(result.data.skills || []);
      setProjects(result.data.projects || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);

    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }

  }

  const handleStart = async () => {
    setLoading(true)
    try {
      const result = await axios.post(ServerUrl + '/interview/generate-questions', {
        role,
        experience,
        mode,
        resumeText,
        projects,
        skills
      }, { withCredentials: true });
      console.log(result.data);
      if(userData){
        dispatch(setUserData({
          ...userData,
          credits:result.data.creditsLeft
        }))
      }

      setLoading(false)
      onStart(result.data)
    } catch (error) {
      console.log("Error response:", error.response?.data || error.message)
      alert(error.response?.data?.message || "Something went wrong")
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className='min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4'>
      <div className='w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden'>
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center'>
          <h2 className='text-4xl font-bold mb-4 text-green-900'>
            Start Your AI Interview
          </h2>
          <p className='text-lg text-gray-700'>
            Practice real interview scenarios powered by AI. Improve communication, technical skills, and confidence.
          </p>

          <div className='space-y-5'>
            {
              [
                {
                  icon: <FaUserTie className='text-green-600 text-xl' />,
                  text: "Choose Role and Experience",
                },
                {
                  icon: <FaMicrophone className='text-green-600 text-xl' />,
                  text: "Smart Voice Interview",
                },
                {
                  icon: <FaChartLine className='text-green-600 text-xl' />,
                  text: "Performace Analysis",
                }
              ].map((item, index) => {
                return (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.15 }}
                    whileHover={{ scale: 1.03 }}
                    key={index}
                    className='flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer'
                  >
                    {
                      item.icon
                    }
                    <span className='text-gray-700 font-medium'>{item.text}</span>

                  </motion.div>
                )
              })
            }
          </div>

        </motion.div>

        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className='p-12 bg-white'>
          <h2 className='text-3xl font-bold text-gray-800 mb-6'>Interview Setup</h2>
          <div className='space-y-6'>
            <div className='relative'>
              <FaUserTie className='absolute top-4 left-4 text-gray-400' />
              <input type="text" placeholder='Enter Job Role' className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all outline-none' value={role} onChange={(e) => setRole(e.target.value)} />
              <p className='text-gray-500 mt-2'>eg. Senior Full Stack Engineer</p>
            </div>
            <div className='relative'>
              <FaBriefcase className='absolute top-4 left-4 text-gray-400' />
              <input type="text" placeholder='Enter Experience Level' className='w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all outline-none' value={experience} onChange={(e) => setExperience(e.target.value)} />
              <p className='text-gray-500 mt-2'>eg. 3-5 years</p>
            </div>
            <select value={mode} onChange={(e) => setMode(e.target.value)} className='w-full pl-5 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-500 transition-all outline-none'>
              <option value="Technical">Technical Interview</option>
              <option value="HR">HR Interview</option>
              <option value="Behavioral">Behavioral Interview</option>
            </select>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById('resumeUpload').click()}
                className='border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition'
              >
                <FaFileArrowUp className='text-4xl mx-auto text-green-600 mb-3' />
                <input type="file" accept=".pdf,.doc,.docx" id='resumeUpload' className='hidden' onChange={(e) => setResumeFile(e.target.files[0])} />
                <p className='text-gray-500 mt-2'>{resumeFile ? resumeFile.name : 'Click to Upload your Resume (Optional)'}</p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume(e)
                    }}
                    disabled={analyzing}
                    className='mt-4 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all outline-none'>
                    {analyzing ? 'Analyzing...' : 'Analyse'}
                  </motion.button>
                )}

              </motion.div>
            )}
            {
              analysisDone && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1
                  }}
                  className='bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4'>
                  <div>
                    <h3 className='font-bold text-lg mb-2'>AI Resume Analysis Result</h3>
                    {projects.length > 0 && (
                      <div className='mb-3'>
                        <p className='font-medium text-gray-700 mb-1'>Projects:</p>
                        <ul className='list-disc list-inside text-gray-600 space-y-1'>
                          {projects.map((project, index) => (
                            <li key={index}>{project}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {skills.length > 0 && (
                      <div className='mb-3'>
                        <p className='font-medium text-gray-700 mb-1'>Skills:</p>
                        <div className='flex flex-wrap gap-2'>
                          {skills.map((skill, index) => (
                            <span key={index} className='bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm'>{skill}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            }

            <motion.button
            onClick={()=>handleStart()}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.5 }}
              className='w-full disabled:opacity-50 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all outline-none'>
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>

          </div>

        </motion.div>

      </div>

    </motion.div>
  )
}

export default Step1Setup