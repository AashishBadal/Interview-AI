import React, { useState } from 'react'
import { motion } from 'motion/react'
import { FaUserTie, FaBriefcase, FaFileArrowUp, FaMicrophone, FaChartLine } from 'react-icons/fa6'
import { HiArrowUpRight } from 'react-icons/hi2'
import axios from 'axios'
import { ServerUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const Step1Setup = ({ onStart }) => {
  const { userData } = useSelector((state) => state.user)
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
      if (userData) {
        dispatch(setUserData({
          ...userData,
          credits: result.data.creditsLeft
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

  const highlights = [
    { icon: <FaUserTie />, text: "Choose role & experience" },
    { icon: <FaMicrophone />, text: "Smart voice interview" },
    { icon: <FaChartLine />, text: "Performance analysis" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className='min-h-screen md:h-screen flex items-center justify-center bg-bg px-4 py-6 relative overflow-hidden'>
      <div className='pointer-events-none absolute top-[-20%] left-[-10%] w-[60vw] h-[60vh] rounded-full bg-accent/8 blur-[140px]' />
      <div className='pointer-events-none absolute inset-0 bg-grid opacity-40' />

      <div className='relative w-full max-w-5xl md:h-[88vh] md:max-h-[760px] card !rounded-3xl grid md:grid-cols-[0.85fr_1fr] overflow-hidden'>
        {/* Left — pitch panel */}
        <motion.div
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='relative bg-surface-2 p-9 md:p-11 flex flex-col justify-between border-b md:border-b-0 md:border-r border-line min-h-0 md:overflow-y-auto'>
          <div>
            <span className='label-mono'>step 01 / setup</span>
            <h2 className='font-display text-3xl md:text-4xl font-semibold tracking-tight mt-4 mb-4 leading-tight'>
              Start your <br /> <span className='text-accent'>AI interview</span>
            </h2>
            <p className='text-muted text-sm leading-relaxed max-w-xs'>
              Practice real interview scenarios powered by AI. Sharpen communication, technical depth, and confidence.
            </p>
          </div>

          <div className='space-y-3 mt-10'>
            {highlights.map((item, index) => (
              <motion.div
                initial={{ y: 16, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.25 + index * 0.12 }}
                key={index}
                className='flex items-center gap-4 bg-surface border border-line p-3.5 rounded-xl'
              >
                <span className='w-8 h-8 rounded-lg bg-accent-soft text-accent flex items-center justify-center shrink-0'>
                  {item.icon}
                </span>
                <span className='text-sm font-medium text-ink'>{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ x: 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='flex flex-col min-h-0 p-7 md:p-9'>
          <div className='shrink-0'>
            <h2 className='font-display text-2xl font-semibold mb-1'>Interview setup</h2>
            <p className='text-muted text-sm'>Fill in the details — or let your resume do it.</p>
          </div>

          {/* scrollable fields — keeps the action button pinned below */}
          <div className='flex-1 min-h-0 overflow-y-auto space-y-5 mt-6 pr-1 -mr-2'>
            <div>
              <label className='label-mono'>job role</label>
              <div className='relative mt-2'>
                <FaUserTie className='absolute top-1/2 -translate-y-1/2 left-4 text-faint text-sm' />
                <input type="text" placeholder='e.g. Senior Full Stack Engineer' className='field w-full pl-11 pr-4 py-3 text-sm' value={role} onChange={(e) => setRole(e.target.value)} />
              </div>
            </div>

            <div>
              <label className='label-mono'>experience level</label>
              <div className='relative mt-2'>
                <FaBriefcase className='absolute top-1/2 -translate-y-1/2 left-4 text-faint text-sm' />
                <input type="text" placeholder='e.g. 3–5 years' className='field w-full pl-11 pr-4 py-3 text-sm' value={experience} onChange={(e) => setExperience(e.target.value)} />
              </div>
            </div>

            <div>
              <label className='label-mono'>interview type</label>
              <select value={mode} onChange={(e) => setMode(e.target.value)} className='field w-full px-4 py-3 mt-2 text-sm appearance-none cursor-pointer'>
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
                <option value="Behavioral">Behavioral Interview</option>
              </select>
            </div>

            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => document.getElementById('resumeUpload').click()}
                className='border border-dashed border-line-strong rounded-2xl p-7 text-center cursor-pointer hover:border-accent hover:bg-accent-soft transition group'
              >
                <FaFileArrowUp className='text-2xl mx-auto text-faint group-hover:text-accent mb-3 transition' />
                <input type="file" accept=".pdf,.doc,.docx" id='resumeUpload' className='hidden' onChange={(e) => setResumeFile(e.target.files[0])} />
                <p className='text-sm text-muted'>{resumeFile ? resumeFile.name : 'Upload your resume to auto-fill (optional)'}</p>

                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume(e)
                    }}
                    disabled={analyzing}
                    className='btn-accent mt-4 px-5 py-2 text-sm'>
                    {analyzing ? 'Analyzing…' : 'Analyze resume'}
                  </motion.button>
                )}
              </motion.div>
            )}

            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className='bg-surface-2 border border-line rounded-2xl p-5 space-y-4'>
                <div className='flex items-center gap-2'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent' />
                  <h3 className='label-mono !text-accent/80'>resume analysis</h3>
                </div>
                {projects.length > 0 && (
                  <div>
                    <p className='text-xs font-medium text-muted mb-1.5'>Projects</p>
                    <ul className='list-disc list-inside text-sm text-ink/90 space-y-1'>
                      {projects.map((project, index) => (
                        <li key={index}>{project}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {skills.length > 0 && (
                  <div>
                    <p className='text-xs font-medium text-muted mb-1.5'>Skills</p>
                    <div className='flex flex-wrap gap-2'>
                      {skills.map((skill, index) => (
                        <span key={index} className='bg-accent-soft text-accent px-3 py-1 rounded-full text-xs font-mono'>{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </div>

          {/* pinned action — always visible */}
          <div className='shrink-0 pt-5'>
            <motion.button
              onClick={() => handleStart()}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className='btn-accent w-full py-3.5 inline-flex items-center justify-center gap-2 text-[15px] group'>
              {loading ? "Starting…" : <>Start interview <HiArrowUpRight className='group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform' size={16} /></>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Step1Setup
