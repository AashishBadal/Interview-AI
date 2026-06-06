import React, { useEffect, useRef, useState } from 'react'
import maleVideo from '../assets/Videos/male-ai.mp4'
import femaleVideo from '../assets/Videos/female-ai.mp4'
import Timer from './Timer';
import { motion } from 'motion/react'
import { FaMicrophone, FaMicrophoneSlash, FaArrowRight, FaLightbulb, FaArrowRotateLeft } from 'react-icons/fa6';
import axios from 'axios'
import { ServerUrl } from '../App';

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, username, userName, resumeIndex = 0, isResume = false } = interviewData;
  const activeUsername = username || userName || '';

  // when resuming an interview, jump straight to the first unanswered question and skip the intro
  const [isIntroPhase, setIsIntroPhase] = useState(!isResume)

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

  const [currentIndex, setCurrentIndex] = useState(resumeIndex || 0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState('')
  const [suggestedAnswer, setSuggestedAnswer] = useState('')
  const [attempt, setAttempt] = useState(0)
  const [isSpeakingTransition, setIsSpeakingTransition] = useState(false)

  const feedbackRef = useRef(feedback);

  useEffect(() => {
    feedbackRef.current = feedback;
  }, [feedback]);
  const [timeLeft, setTimerLeft] = useState(questions[resumeIndex || 0]?.timeLimit || 60)
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
  }, [isIntroPhase, currentQuestion, attempt])


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
      setSuggestedAnswer(result.data.suggestedAnswer || "")
      await speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
      console.log(error)
      setIsSubmitting(false)
    }
  }

  const handleTryAgain = () => {
    // re-attempt the same question after reading the suggested answer
    window.speechSynthesis.cancel();
    setAiPlaying(false);
    isAiPlayingRef.current = false;
    setFeedback("");
    feedbackRef.current = "";
    setSuggestedAnswer("");
    setAnswer("");
    setIsSubmitting(false);
    setTimerLeft(currentQuestion?.timeLimit || 60);
    setAttempt((a) => a + 1); // restarts the countdown timer effect
    if (isMicOn) startMic();
  }

  const handleNext = async () =>{
    setAnswer("")
    setFeedback("")
    setSuggestedAnswer("")
    feedbackRef.current = "";
    if(currentIndex + 1 >= questions.length){
      finishInterview();
      return;
    }

    const nextQuestion = questions[currentIndex + 1];
    setTimerLeft(nextQuestion?.timeLimit || 60);

    setIsSpeakingTransition(true);
    await speakText(`Alright. Here is your next question.`)
    setCurrentIndex(currentIndex + 1)
    setIsSpeakingTransition(false);
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
    <div className='min-h-screen lg:h-screen bg-bg text-ink flex items-center justify-center p-4 sm:p-6 relative overflow-hidden'>
      <div className='pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[55vh] rounded-full bg-accent/8 blur-[150px]' />
      <div className='pointer-events-none absolute inset-0 bg-grid opacity-30' />

      <div className='relative w-full max-w-6xl min-h-[80vh] lg:min-h-0 lg:h-[calc(100vh-3rem)] card !rounded-3xl flex flex-col lg:flex-row overflow-hidden'>
        {/* Left rail — avatar + status */}
        <div className='w-full lg:w-[36%] bg-surface-2 flex flex-col items-center p-6 gap-5 border-b lg:border-b-0 lg:border-r border-line min-h-0 lg:overflow-y-auto'>
          {/*video area*/}
          <div className='relative w-full max-w-md rounded-2xl overflow-hidden border border-line'>
            <video src={videoSource}
              key={videoSource}
              ref={videoRef}
              playsInline
              preload='auto'
              muted
              className='w-full h-auto object-cover' />
            <div className='absolute top-3 left-3 flex items-center gap-2 bg-bg/70 backdrop-blur px-3 py-1.5 rounded-full border border-line'>
              <span className={`w-2 h-2 rounded-full ${isAiPlaying ? 'bg-accent animate-pulse' : 'bg-faint'}`} />
              <span className='label-mono !text-[9px] !text-ink/80'>{isAiPlaying ? 'ai speaking' : 'idle'}</span>
            </div>
          </div>

          {/*subtitle area*/}
          {subTitle && (
            <div className="w-full max-w-md bg-surface border border-line rounded-xl p-4">
              <p className='text-sm text-ink/90 font-medium text-center leading-relaxed'>{subTitle}</p>
            </div>
          )}

          {/*timer area*/}
          <div className='w-full max-w-md bg-surface border border-line rounded-2xl p-6 space-y-5'>
            <div className='flex items-center justify-between'>
              <span className='label-mono'>interview status</span>
              {isAiPlaying && <span className='text-xs font-semibold text-accent'>AI Speaking</span>}
            </div>
            <div className='h-px bg-line'></div>
            <div className='flex justify-center'>
              <Timer timeLeft={timeLeft} totalTime={currentQuestion?.timeLimit} />
            </div>
            <div className='h-px bg-line'></div>
            <div className='grid grid-cols-2 gap-4 text-center'>
              <div className='flex flex-col'>
                <span className='font-display text-3xl font-semibold text-accent'>{currentIndex + 1}</span>
                <span className='label-mono mt-1'>current</span>
              </div>
              <div className='flex flex-col'>
                <span className='font-display text-3xl font-semibold text-ink'>{questions?.length}</span>
                <span className='label-mono mt-1'>total</span>
              </div>
            </div>
          </div>
        </div>

        {/*Text section*/}
        <div className='flex p-5 sm:p-7 md:p-9 relative flex-col flex-1 min-h-0 lg:overflow-y-auto'>
          <div className='flex items-center gap-3 mb-6'>
            <span className='label-mono'>step 02 / live</span>
            <span className='flex-1 h-px bg-line' />
          </div>
          <h2 className='font-display text-2xl font-semibold mb-6'>AI Smart Interview</h2>

          {!isIntroPhase && !isSpeakingTransition && (
            <div className='relative mb-5 bg-surface-2 p-5 sm:p-6 rounded-2xl border border-line'>
              <p className='label-mono mb-2'>question {currentIndex + 1} / {questions?.length}</p>
              <div className='text-base sm:text-lg font-semibold text-ink leading-relaxed pr-4'>
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <textarea
            onChange={(e) => setAnswer(e.target.value)}
            value={answer}
            placeholder='Type your answer here, or hit the mic and speak…'
            className='field flex-1 min-h-32 lg:min-h-0 p-4 sm:p-5 resize-none text-ink leading-relaxed' />

          {!feedback ? (
            <div className='flex items-center gap-4 mt-5'>
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                className={`w-14 h-14 flex items-center justify-center rounded-full border transition shrink-0 ${isMicOn ? 'bg-accent text-bg border-accent' : 'bg-surface-2 text-ink border-line-strong'}`}>
                {isMicOn ? <FaMicrophone size={19} /> : <FaMicrophoneSlash size={19} />}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.01 }}
                className='btn-accent flex-1 py-4 text-[15px]'>
                {isSubmitting ? "Submitting…" : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className='mt-5 space-y-3'>
              {/* feedback */}
              <div className='bg-accent-soft border border-accent/30 p-5 rounded-2xl'>
                <div className='flex items-center gap-2 mb-3'>
                  <span className='w-1.5 h-1.5 rounded-full bg-accent' />
                  <span className='label-mono !text-accent/80'>ai feedback</span>
                </div>
                <p className='text-ink/90 leading-relaxed'>{feedback}</p>
              </div>

              {/* suggested answer — study it, then retry */}
              {suggestedAnswer && (
                <div className='bg-surface-2 border border-line p-5 rounded-2xl'>
                  <div className='flex items-center gap-2 mb-3 text-accent'>
                    <FaLightbulb size={14} />
                    <span className='label-mono !text-accent/80'>suggested answer</span>
                  </div>
                  <p className='text-muted text-sm leading-relaxed'>{suggestedAnswer}</p>
                </div>
              )}

              {/* actions */}
              <div className='flex flex-col sm:flex-row gap-3 pt-1'>
                <button
                  onClick={handleTryAgain}
                  className='btn-ghost flex-1 py-3 flex items-center justify-center gap-2'>
                  <FaArrowRotateLeft size={14} /> Try Again
                </button>
                <button
                  onClick={handleNext}
                  className='btn-accent flex-1 py-3 flex items-center justify-center gap-2'>
                  {currentIndex + 1 >= questions.length ? (
                    "Finish Interview"
                  ) : (
                    <>Next Question <FaArrowRight size={16} /></>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Step2Interview