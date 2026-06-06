import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from '../App';
import axios from 'axios';
import { FaArrowLeft, FaRegTrashCan, FaArrowRotateLeft, FaArrowRight } from 'react-icons/fa6';

const InterviewHistory = () => {
    const [interviews, setInterviews] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
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

    const isCompleted = (interview) => interview.status?.toLowerCase() === "completed";

    const handleOpen = (interview) => {
        if (isCompleted(interview)) {
            navigate(`/report/${interview._id}`);
        } else {
            // resume the incomplete interview from where it was left off
            navigate('/interview', { state: { resumeId: interview._id } });
        }
    }

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (!window.confirm("Delete this interview permanently? This cannot be undone.")) return;
        setDeletingId(id);
        try {
            await axios.delete(`${ServerUrl}/interview/${id}`, { withCredentials: true });
            setInterviews((prev) => prev.filter((i) => i._id !== id));
        } catch (error) {
            console.log(error);
        } finally {
            setDeletingId(null);
        }
    }
    return (
        <div className='min-h-screen bg-bg text-ink py-12 relative overflow-hidden'>
            <div className='pointer-events-none absolute top-[-15%] left-1/2 -translate-x-1/2 w-[60vw] h-[45vh] rounded-full bg-accent/8 blur-[150px]' />
            <div className='relative z-10 w-[90vw] lg:w-[72vw] max-w-5xl mx-auto'>
                <div className="mb-10 w-full flex items-start gap-4 flex-wrap">
                    <button
                        onClick={() => navigate('/')}
                        className='mt-1 w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-line hover:border-line-strong transition'><FaArrowLeft className='text-muted' /></button>
                    <div>
                        <span className='label-mono'>archive</span>
                        <h1 className='font-display text-3xl sm:text-4xl font-semibold tracking-tight mt-2'>Interview History</h1>
                        <p className='text-muted mt-1.5 text-sm'>Track your past interview reports</p>
                    </div>
                </div>
                {interviews.length === 0 ? (
                    <div className='card p-12 text-center'>
                        <p className='label-mono mb-2'>empty</p>
                        <p className='text-muted'>No interviews yet — start your first one.</p>
                    </div>
                ) : (
                    <div className='grid gap-3'>
                        {interviews.map((interview, index) => {
                            const completed = isCompleted(interview);
                            return (
                            <div key={index} onClick={() => handleOpen(interview)} className='group card p-6 hover:border-line-strong transition-all duration-200 cursor-pointer'>
                                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                                    <div>
                                        <h3 className='font-display text-lg font-semibold text-ink group-hover:text-accent transition-colors'>{interview.role}</h3>
                                        <p className='text-muted text-sm mt-1.5'><span className='text-ink/80 font-medium'>{interview.experience}</span> · {interview.mode}</p>
                                        <p className='label-mono mt-3'>{new Date(interview.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className='flex items-center gap-4 sm:gap-6'>
                                        {completed ? (
                                            <div className='text-right'>
                                                <p className='font-display text-xl font-semibold text-accent'>{interview.finalScore || 0}<span className='text-faint text-sm'>/10</span></p>
                                                <p className='label-mono mt-0.5'>score</p>
                                            </div>
                                        ) : (
                                            <div className='text-right'>
                                                <p className='font-display text-xl font-semibold text-warn'>—</p>
                                                <p className='label-mono mt-0.5'>unfinished</p>
                                            </div>
                                        )}

                                        <span className={`hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border ${completed ? "bg-accent-soft text-accent border-accent/30" : "bg-amber-400/10 text-warn border-amber-400/30"}`}>{interview.status}</span>

                                        {/* primary action */}
                                        <span className={`hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${completed ? 'text-muted group-hover:text-accent' : 'text-accent'}`}>
                                            {completed ? <>View <FaArrowRight size={12} /></> : <><FaArrowRotateLeft size={12} /> Resume</>}
                                        </span>

                                        {/* delete */}
                                        <button
                                            onClick={(e) => handleDelete(e, interview._id)}
                                            disabled={deletingId === interview._id}
                                            aria-label='Delete interview'
                                            className='w-10 h-10 flex items-center justify-center rounded-full border border-line text-muted hover:text-bad hover:border-bad/40 hover:bg-bad/10 transition disabled:opacity-50'>
                                            <FaRegTrashCan size={15} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

export default InterviewHistory