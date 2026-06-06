import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ServerUrl } from '../App';
import Step1Setup from '../components/Step1Setup';
import Step2Interview from '../components/Step2Interview';
import Step3Report from '../components/Step3Report';

const InterviewPage = () => {
    const [step,setStep]=useState(1)
    const [interviewData,setInterviewData]=useState(null)
    const location = useLocation();

    // resume an incomplete interview when navigated here from history
    useEffect(() => {
        const resumeId = location.state?.resumeId;
        if (!resumeId) return;
        const loadResume = async () => {
            try {
                const res = await axios.get(`${ServerUrl}/interview/resume/${resumeId}`, { withCredentials: true });
                setInterviewData({ ...res.data, isResume: true });
                setStep(2);
            } catch (error) {
                console.log(error);
            }
        };
        loadResume();
    }, [location.state]);

  return (
    <div className='min-h-screen bg-bg text-ink'>
        {step===1 && <Step1Setup onStart={(data)=>{
            setInterviewData(data)
            setStep(2)
        }} />}
        {step===2 && <Step2Interview interviewData={interviewData} onFinish={(report)=>{
            setInterviewData(report)
            setStep(3)
        }}/>}
        {step===3 && <Step3Report report={interviewData}/>}
    </div>
  )
}

export default InterviewPage