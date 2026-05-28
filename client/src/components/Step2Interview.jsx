import React, { useEffect, useRef, useState } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer';
import {motion} from 'motion/react'
import { FaMicrophone,FaMicrophoneSlash } from 'react-icons/fa6';

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, username } = interviewData;

  const [isIntroPhase,setIsIntroPhase]=useState(true)

  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef(null);
  const [isAiPlaying,setAiPlaying]=useState(false)

  const [currentIndex,setCurrentIndex]=useState(0)
  const [answer,setAnswer]=useState('')
  const [feedback,setFeedback]=useState('')
  const [timeLeft,setTimerLeft]=useState(questions[0]?.timeLimit || 60)
  const [selectedVoice,setSelectedVoice]=useState(null)
  const [isSubmitting,setIsSubmitting]=useState(false)
  const [voiceGender,setVoiceGender]=useState("female")
  const [subTitle,setSubTitle]=useState("")

  const videoRef = useRef(null);

  const currentQuestion=questions[currentIndex];

  useEffect(()=>{
    const loadVoices = () =>{
      const voices = window.speechSynthesis.getVoices()
      if(!voices.length) return;

      //try known female voices first
      const femaleVoice = voices.find(
        v=> 
        v.name.toLowerCase().includes("zira") ||
        v.name.toLowerCase().includes("samantha") ||
        v.name.toLowerCase().includes("female")
      )

      if(femaleVoice){
        setSelectedVoice(femaleVoice)
        setVoiceGender("female")
        return
      }

      //try known male voices
      const maleVoice = voices.find(
        v=> 
        v.name.toLowerCase().includes("david") ||
        v.name.toLowerCase().includes("mark") ||
        v.name.toLowerCase().includes("male")
      )
      if(maleVoice){
        setSelectedVoice(maleVoice)
        setVoiceGender("male")
        return
      }

      //fallback to first voice(assume female)
      setSelectedVoice(voices[0])
      setVoiceGender("female")
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged=()=>{
      loadVoices();
    }
  },[])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text)=>{
    return new Promise((resolve) => {
        if(!window.speechSynthesis || !selectedVoice){
          resolve()
          return
        }
        window.speechSynthesis.cancel()
        
        //add natural pauses after commas and periods
        const humanText = text
          .replace(/,/g," , ... ")
          .replace(/\./g,". ...");
          
          const utterence=new SpeechSynthesisUtterance(humanText);
          utterence.voice=selectedVoice;

          //human like pacing
          utterence.rate=0.92;
          utterence.pitch=1.05;
          utterence.volume=1;

          utterence.onstart=()=>{
            setAiPlaying(true)
            videoRef.current?.play()

          }

          utterence.onend=()=>{
            videoRef.current?.pause()
            videoRef.current.currentTime = 0;
            setAiPlaying(false)
            setTimeout(() => {
              setSubTitle("")
              resolve();
            },300)
          }

        setSubTitle(humanText);  

        window.speechSynthesis.speak(utterence)
    })
  }

  useEffect(()=>{
    if(!selectedVoice) return;

    const runIntro = async () => {
      if(isIntroPhase){
        //speak intro
        await speakText(
          `Hi ${username} Welcome to AI Smart Interview. We're about to begin your interview. please be ready`
        )

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin"
        )

        setIsIntroPhase(false)
      }else if(currentQuestion){
        await new Promise(r=> setTimeout(r,800))

        if(currentIndex === questions.length -1 ){
          await speakText(
            `This is your final question. Take your time and answer carefully.`
          )
        }else{
          await speakText(
            `Here's your next question.`
          )
        }

        await speakText(currentQuestion.question)

      }
    }

    runIntro()

  },[selectedVoice,isIntroPhase, currentIndex])

  return (
    <div className='min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6'>
      <div className='w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden'>
        <div className='w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200'>
          {/*video area*/}
          <div className='w-full max-w-md rounded-2xl overflow-hidden shadow-xl'>
            <video src={videoSource}
            key={videoSource}
            ref={videoRef}
             playsInline
              preload='auto' 
              muted 
              className='w-full h-auto object-cover' />
          </div>
          {/*subtitle area*/}
          {subTitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-4">
              <p className='text-sm text-gray-700 sm:text-base font-medium text-center leading-relaxed'>{subTitle}</p>
            </div>
          )}

          {/*timer area*/}
          <div className='w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-gray-500'>Interview Status
              </span>
              {isAiPlaying&& <span className='text-sm font-semibold text-emerald-600'>
                {isAiPlaying ? "AI Speaking" : ""}
              </span>}
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='flex justify-center'>
              <Timer
                timeLeft={200} totalTime={300}
              />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-semibold text-emerald-600'>{currentIndex+1}</span>
                <span className='text-xs text-gray-400'>Current Question</span>
              </div>
              <div>
                <span className='text-2xl font-semibold text-emerald-600'>{questions?.length}</span>
                <span className='text-xs text-gray-400'>Total Questions</span>
              </div>

            </div>
          </div>
        </div>

        {/*Text section*/}
        <div className='flex p-4 sm:p-6 md:p-8 relative flex-col flex-1'>
          <h2 className='text-xl sm:text-2xl font-bold text-emerald-600 mb-6'>AI Smart Interview</h2>
          <div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'><p className=' text-xs sm:text-sm text-gray-400 mb-2 '>Question {currentIndex+1} of {questions?.length}</p>
          <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16'>
              {currentQuestion?.question}
          </div>
          
          </div>
      <textarea placeholder='Type your answer here...' className='flex-1 bg-gray-100 p-4 sm:p-6, rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800' />
      <div className='flex items-center gap-4 mt-6'>
        <motion.button
        whileTap={{scale:0.95}}
        whileHover={{scale:1.05}}
         className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white'>
          <FaMicrophone size={20}/>
        </motion.button>

        <motion.button
        whileTap={{scale:0.95}}
        whileHover={{scale:1.05}}
         className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold'>
        Submit Answer
        </motion.button>
       
      </div>
        </div>
      </div>
    </div>
  )
}

export default Step2Interview