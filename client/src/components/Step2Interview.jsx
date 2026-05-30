import React, { useEffect, useRef, useState } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer';
import { motion } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash, FaArrowRight } from 'react-icons/fa6';
import axios from 'axios'
import { ServerUrl } from '../App';

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, username, userName } = interviewData;
  const activeUsername = username || userName || '';

  const [isIntroPhase, setIsIntroPhase] = useState(true)

  const [isMicOn, setIsMicOn] = useState(false);
  const recognitionRef = useRef(null);
  const [isAiPlaying, setAiPlaying] = useState(false)

  const isMicOnRef = useRef(isMicOn);
  const isAiPlayingRef = useRef(isAiPlaying);

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAiPlayingRef.current = isAiPlaying;
  }, [isAiPlaying]);

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')

  const feedbackRef = useRef(feedback);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);
  const [timeLeft, setTimerLeft] = useState(questions[0]?.timeLimit || 60)
  const [selectedVoice, setSelectedVoice] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [voiceGender, setVoiceGender] = useState("female")
  const [subTitle, setSubTitle] = useState("")

  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (!voices.length) return;

      //try known female voices first
      const femaleVoice = voices.find(
        v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      )

      if (femaleVoice) {
        setSelectedVoice(femaleVoice)
        setVoiceGender("female")
        return
      }

      //try known male voices
      const maleVoice = voices.find(
        v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      )
      if (maleVoice) {
        setSelectedVoice(maleVoice)
        setVoiceGender("male")
        return
      }

      //fallback to first voice(assume female)
      setSelectedVoice(voices[0])
      setVoiceGender("female")
    }
    loadVoices();
    window.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    }
  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve()
        return
      }
      window.speechSynthesis.cancel()

      //add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, " , ... ")
        .replace(/\./g, ". ...");

      const utterence = new SpeechSynthesisUtterance(humanText);
      utterence.voice = selectedVoice;

      //human like pacing
      utterence.rate = 0.92;
      utterence.pitch = 1.05;
      utterence.volume = 1;

      utterence.onstart = () => {
        setAiPlaying(true)
        isAiPlayingRef.current = true;
        if (recognitionRef.current) {
          recognitionRef.current.stop();
        }
        videoRef.current?.play()

      }

      utterence.onend = () => {
        videoRef.current?.pause()
        videoRef.current.currentTime = 0;
        setAiPlaying(false)
        isAiPlayingRef.current = false;
        if (isMicOn && !feedbackRef.current) {
          startMic()
        }
        setTimeout(() => {
          setSubTitle("")
          resolve();
        }, 300)
      }

      setSubTitle(text);

      window.speechSynthesis.speak(utterence)
    })
  }

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        //speak intro
        await speakText(
          `Hi ${activeUsername} Welcome to AI Smart Interview. We're about to begin your interview. please be ready`
        )

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin"
        )

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800))

        if (currentIndex === questions.length - 1) {
          await speakText(
            `This is your final question. Take your time and answer carefully.`
          )
        }

        await speakText(currentQuestion.question)

        if (isMicOn) {
          startMic()
        }

      }
    }

    runIntro()

  }, [selectedVoice, isIntroPhase, currentIndex])

  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    if(isSubmitting) return

    const timer = setInterval(() => {
      setTimerLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [isIntroPhase, currentQuestion])


  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    }

    recognition.onend = () => {
      if (isMicOnRef.current && !isAiPlayingRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.log("Error restarting recognition:", error);
        }
      }
    }

    recognitionRef.current = recognition;
  }, [])

  const startMic = () => {
    if (recognitionRef.current && !isAiPlaying) {
      try {
        isMicOnRef.current = true;
        recognitionRef.current.start();
      } catch (error) {

      }
    }
  }

  const stopMic = () => {
    if (recognitionRef.current) {
      isMicOnRef.current = false;
      recognitionRef.current.stop();
    }
  }

  const toggleMic = () => {

    if (isMicOn) {
      stopMic();
    } else {
      startMic()
    };
    setIsMicOn(!isMicOn);
  }

  const submitAnswer = async ()=>{
    if(isSubmitting) return;
    stopMic();
    setIsSubmitting(true)
    try {
      const result = await axios.post(
        `${ServerUrl}/interview/submit-answer`,
        {
          interviewId,
          questionIndex:currentIndex,
          answer,
          timeTaken:currentQuestion.timeLimit - timeLeft,
        },
        {
          withCredentials:true
        }
      )
      setFeedback(result.data.feedback)
      feedbackRef.current = result.data.feedback;
      await speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
    }
  }

  const handleNext = async () =>{
    setAnswer("")
    setFeedback("")
    feedbackRef.current = "";
    if(currentIndex + 1 >= questions.length){
      finishInterview();
      return;
    }

    const nextQuestion = questions[currentIndex + 1];
    setTimerLeft(nextQuestion?.timeLimit || 60);

    await speakText(`Alright. Here is your next question.`)
    setCurrentIndex(currentIndex + 1)
  }

  const finishInterview = async () =>{
    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(
        `${ServerUrl}/interview/finish`,
        {interviewId},
        {withCredentials:true}
      )
      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    if(isIntroPhase) return;
    if(!currentQuestion) return;

    if(timeLeft === 0 && !isSubmitting && !feedback){
      submitAnswer()
    }
  },[timeLeft])

  useEffect(()=>{
    return()=>{
      if(recognitionRef.current){
        recognitionRef.current.stop()
        recognitionRef.current.abort()
      }
      window.speechSynthesis.cancel()
    }
  },[])




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
              {isAiPlaying && <span className='text-sm font-semibold text-emerald-600'>
                {isAiPlaying ? "AI Speaking" : ""}
              </span>}
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='flex justify-center'>
              <Timer
                timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit}
              />
            </div>
            <div className='h-px bg-gray-200'></div>
            <div className='grid grid-cols-2 gap-6 text-center'>
              <div>
                <span className='text-2xl font-semibold text-emerald-600'>{currentIndex + 1}</span>
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
          {!isIntroPhase && (<div className='relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm'><p className=' text-xs sm:text-sm text-gray-400 mb-2 '>Question {currentIndex + 1} of {questions?.length}</p>
            <div className='text-base sm:text-lg font-semibold text-gray-800 leading-relaxed pr-16'>
              {currentQuestion?.question}
            </div>
          </div>)}
          <textarea
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            placeholder='Type your answer here...' className='flex-1 bg-gray-100 p-4 sm:p-6, rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800' />
         { !feedback ? (<div className='flex items-center gap-4 mt-6'>
            <motion.button
              onClick={toggleMic}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              className='w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white'>
              {isMicOn ? <FaMicrophone size={20} /> : <FaMicrophoneSlash size={20} />}
            </motion.button>

            <motion.button
            onClick={submitAnswer}
            disabled={isSubmitting}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            className='flex-1 bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-400 cursor-pointer'>
            {isSubmitting ? "Submitting..." : "Submit Answer"}
            </motion.button>

          </div>):
          (
            <motion.div
            initial={{opacity:0}}
            animate={{opacity:1}}
             className='mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm'>
              <p className='text-emerald-700 font-medium mb-4'>{feedback}</p>
              <button
              onClick={handleNext}
               className='w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition cursor-pointer flex items-center justify-center gap-1'>
            Next Question <FaArrowRight size={18} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview