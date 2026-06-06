import React from 'react'
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Timer = ({ timeLeft, totalTime }) => {
    const percentage = (timeLeft / totalTime) * 100;
    // shift toward warning/danger as time runs out
    const pathColor = percentage <= 20 ? '#fb7185' : percentage <= 50 ? '#fbbf24' : '#c6f24e';
    return (
        <div className='w-24 h-24'>
            <CircularProgressbar
                value={percentage}
                text={`${timeLeft}`}
                styles={buildStyles({
                    textSize: "26px",
                    pathColor,
                    textColor: "#fafafa",
                    trailColor: "rgba(255,255,255,0.08)",
                    strokeLinecap: "round",
                })}
            />
        </div>
    )
}

export default Timer
