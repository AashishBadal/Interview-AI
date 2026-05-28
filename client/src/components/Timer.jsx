import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ timeLeft, totalTime }) => {
    const percentage = (timeLeft/totalTime)*100;
  return (
    <div className='w-20 h-20'>
        <CircularProgressbar 
        value={percentage}
        text={timeLeft}
        styles={buildStyles({
            textSize:"20px",
            pathColor:"#3b82f6",
            textColor:"#333",
            trailColor:"#e5e7eb",
        })}
        />
    </div>
  )
}

export default Timer