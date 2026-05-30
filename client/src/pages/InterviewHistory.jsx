import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from '../App';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa6';

const InterviewHistory = () => {
    const [interviews, setInterviews] = useState([]);
    const navigate = useNavigate()
    const getMyInterviews = async () => {
        try {
            const response = await axios.get(ServerUrl + '/interview/get-interview', { withCredentials: true });
            setInterviews(response.data.interviews);
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        getMyInterviews();
    }, []);
    return (
        <div className='min-h-screen bg-linear-to-br from-gray-50 to-emerald-50 py-10'>
            <div className='w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto'>
                <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/')}
                        className='mt-1 p-3 rounded-full bg-white shadow hover:shadow-md transition'><FaArrowLeft className='text-gray-700' /></button>
                    <div>
                        <h1 className='text-4xl font-bold flex-nowrap'>Interview History</h1>
                        <p className=' text-gray-500 mt-2'>Track your past interview reports</p>
                    </div>
                </div>
                {interviews.length === 0 ? (
                    <div className='bg-white p-10 rounded-2xl shadow text-center'>
                        <p className='text-gray-500'>No interviews found, Start your first interview</p>
                    </div>
                ) : (
                    <div className='grid gap-3'>
                        {interviews.map((interview, index) => (
                            <div key={index} onClick={()=>navigate(`/report/${interview._id}`)} className='bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className='text-xl font-semibold text-gray-800'>{interview.role}</h3>
                                        <p className='text-gray-600 mt-1'><b>{interview.experience}:</b> {interview.mode}</p>
                                        <p className='text-gray-500 text-sm mt-2'>Date: {new Date(interview.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className='flex items-center gap-6'>
                                        <div className='text-right'>
                                            <p className='text-xl font-bold text-emerald-600'>{interview.finalScore || 0}/10</p>
                                            <p className='text-xs text-gray-400'>
                                                Overall Score
                                            </p>
                                        </div>
                                        <span className={`px-4 py-1 rounded-full text-xs font-medium ${interview.status?.toLowerCase() === "completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{interview.status}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    )
}

export default InterviewHistory