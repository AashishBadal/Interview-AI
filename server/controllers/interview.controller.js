import fs from 'fs'
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { askAi } from '../services/openRouter.service.js'
import User from '../models/user.model.js';
import Interview from '../models/interview.model.js';

export const analyseResume = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" })
        }
        const filepath = req.file.path;

        const fileBuffer = await fs.promises.readFile(filepath);

        const uint8Array = new Uint8Array(fileBuffer);

        const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

        let resumeText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum)
            const content = await page.getTextContent();
            const pageText = content.items.map(item => item.str).join(' ');
            resumeText += pageText + '\n';
        }

        resumeText = resumeText.replace(/\s+/g, ' ').trim();

        const messages = [
            {
                role: "system",
                content: `
Extract structured data from resume.

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]
}
`
            },
            {
                role: "user",
                content: resumeText
            }
        ];

        const aiResponse = await askAi(messages);

        const parsed = JSON.parse(aiResponse);

        fs.unlinkSync(filepath);

        res.json({
            role: parsed.role || "",
            experience: parsed.experience || "",
            projects: parsed.projects || [],
            skills: parsed.skills || [], resumeText
        })


    }
    catch (error) {
        console.error("Error analyzing resume:", error);

        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path)
        }

        return res.status(500).json({ message: `Failed to analyze resume ${error.message}` })
    }
}

export const generateQuestions = async (req, res) => {
    try {
        let { role, experience, mode, resumeText, projects, skills } = req.body;

        if (!role || !experience || !mode) {
            return res.status(400).json({ message: "Role,Experience and Mode are required" });
        }

        role = role?.trim();
        experience = experience?.trim();
        mode = mode?.trim();

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.credits < 50) {
            return res.status(400).json({ message: "Insufficient credits. Minimum 50 credits required" });
        }

        const projectText = Array.isArray(projects) && projects.length ? projects.join(",") : "None";

        const skillsText = Array.isArray(skills) && skills.length ? skills.join(",") : "None";

        const safeResume = resumeText?.trim() || "None";

        const userPrompt = `
        Role: ${role}
        Experience: ${experience}
        InterviewMode: ${mode}
        Resume Text: ${safeResume}
        Projects: ${projectText}
        Skills: ${skillsText}
        `

        if (!userPrompt.trim()) {
            return res.status(400).json({ message: "Prompt content is empty" });
        }

        const messages = [

            {
                role: "system",
                content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly 5 interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.

Difficulty progression:
Question 1 → easy 
Question 2 → easy 
Question 3 → medium 
Question 4 → medium
Question 5 → hard 

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
            }
            ,
            {
                role: "user",
                content: userPrompt
            }
        ];

        const aiResponse = await askAi(messages);

        if (!aiResponse || !aiResponse.trim()) {
            return res.status(400).json({ message: "AI returned empty response" });
        }

        const questionsArray = aiResponse.split("\n")
            .map(q => q.trim())
            .filter(q => q.length > 0)
            .slice(0, 5);

        if (questionsArray.length === 0) {
            return res.status(500).json({
                message: "AI failed to generate questions."
            })
        }

        user.credits -= 50;
        await user.save();

        const interview = await Interview.create({
            userId: user._id,
            role,
            experience,
            mode,
            questions: questionsArray.map((q, index) => ({
                question: q,
                timeLimit: [60, 60, 90, 90, 120][index],
                difficulty: ["easy", "easy", "medium", "medium", "Hard"][index],
            })),
        });

        res.json({
            interviewId: interview._id,
            creditsLeft: user.credits,
            userName: user.name,
            questions: interview.questions
        })

    } catch (error) {
        console.error("Error generating questions:", error);
        res.status(500).json({ message: "Failed to generate questions" });
    }
};

// Generates a concise, strong model answer for a question — used as a
// "suggested answer" the candidate can study before retrying.
const buildSuggestedAnswer = async (questionText) => {
    try {
        const messages = [
            {
                role: "system",
                content: `
You are an expert interview coach.

Given an interview question, write ONE strong example answer that a top candidate could give.

Rules:
- 40 to 80 words.
- Natural, first-person spoken English.
- Specific and well structured, no preamble or labels.
- Return ONLY the answer text.
`
            },
            {
                role: "user",
                content: `Question: ${questionText}`
            }
        ];
        const aiResponse = await askAi(messages);
        return (aiResponse || "").trim();
    } catch (error) {
        console.error("Error building suggested answer:", error);
        return "";
    }
}

export const submitAnswer = async (req, res) => {
    try {
        const { answer, questionIndex, interviewId, timeTaken } = req.body

        const interview = await Interview.findById(interviewId)

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }

        const question = interview.questions[questionIndex]

        question.attempts = (question.attempts || 0) + 1;

        if (!answer) {
            question.score = 0;
            question.feedback = "You did not submit an answer"
            question.answer = ""
            question.suggestedAnswer = await buildSuggestedAnswer(question.question);

            await interview.save();

            return res.json({
                feedback: question.feedback,
                suggestedAnswer: question.suggestedAnswer
            });
        }

        if (timeTaken > question.timeLimit + 30) {
            question.score = 0;
            question.feedback = "Time limit exceeded. No score awarded.";
            question.answer = answer;
            question.suggestedAnswer = await buildSuggestedAnswer(question.question);

            await interview.save();

            return res.json({
                feedback: question.feedback,
                suggestedAnswer: question.suggestedAnswer
            })
        }

        const messages = [
            {
                role: "system",
                content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Suggested Answer Rules:
- Also provide a strong example answer the candidate could have given.
- 40 to 80 words, natural first-person spoken English.
- Specific and well structured, no preamble or labels.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback",
  "suggestedAnswer": "a strong concise example answer to the question"
}
`
            }
            ,
            {
                role: "user",
                content: `
Question: ${question.question}
Answer: ${answer}
`
            }
        ];

        const aiResponse = await askAi(messages);

        const parsed = JSON.parse(aiResponse);

        question.answer = answer;

        question.confidence = parsed.confidence;
        question.communication = parsed.communication;
        question.correctness = parsed.correctness;
        question.score = parsed.finalScore;
        question.feedback = parsed.feedback;
        question.suggestedAnswer = parsed.suggestedAnswer || await buildSuggestedAnswer(question.question);

        await interview.save();

        return res.status(200).json({
            feedback: parsed.feedback,
            suggestedAnswer: question.suggestedAnswer
        });

    } catch (error) {
        console.error("Error submitting answer:", error);
        res.status(500).json({ message: "Failed to submit answer" });
    }
}

export const finishInterview = async (req, res) => {
    try {
        const { interviewId } = req.body;
        const interview = await Interview.findById(interviewId);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" })
        }

        const totalQuestions = interview.questions.length;
        let totalScore = 0;
        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((question) => {
            totalScore += question.score || 0;
            totalConfidence += question.confidence || 0;
            totalCommunication += question.communication || 0;
            totalCorrectness += question.correctness || 0;
        })

        const finalScore = totalQuestions ? totalScore / totalQuestions : 0;

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;

        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        interview.finalScore = finalScore;
        interview.status = "Completed";
        await interview.save();

        return res.status(200).json({
            finalScore: Number(finalScore.toFixed(1)),
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions.map(q => (
                {
                    question: q.question,
                    score: q.score || 0,
                    confidence: q.confidence || 0,
                    communication: q.communication || 0,
                    correctness: q.correctness || 0,
                    feedback: q.feedback || "",
                    suggestedAnswer: q.suggestedAnswer || ""
                }
            ))

        })

    } catch (error) {
        return res.status(500).json({ message: `Failed to finish interview ${error}` })
    }
}

export const getMyInterviews = async (req, res) => {
    try {
        const interviews = await Interview.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .select("role experience mode finalScore status createdAt")

        return res.status(200).json({
            interviews
        })

    }
    catch (error) {
        return res.status(500).json({ message: `Failed to get your interviews ${error}` })
    }
}

// Loads a full interview so an incomplete one can be resumed mid-way.
export const getInterviewToResume = async (req, res) => {
    try {
        const interview = await Interview.findOne({ _id: req.params.id, userId: req.userId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const user = await User.findById(req.userId).select("name");

        // answers are filled in order, so the first unanswered question is the resume point
        const answeredCount = interview.questions.filter(
            (q) => q.answer && q.answer.trim() !== ""
        ).length;
        const resumeIndex = Math.min(answeredCount, interview.questions.length - 1);

        return res.status(200).json({
            interviewId: interview._id,
            userName: user?.name || "",
            questions: interview.questions,
            resumeIndex,
            status: interview.status,
        });
    } catch (error) {
        return res.status(500).json({ message: `Failed to load interview ${error}` });
    }
}

export const deleteInterview = async (req, res) => {
    try {
        const interview = await Interview.findOneAndDelete({ _id: req.params.id, userId: req.userId });

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        return res.status(200).json({ message: "Interview deleted", id: req.params.id });
    } catch (error) {
        return res.status(500).json({ message: `Failed to delete interview ${error}` });
    }
}

export const getInterviewReport = async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);

        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        const totalQuestions = interview.questions.length;

        let totalConfidence = 0;
        let totalCommunication = 0;
        let totalCorrectness = 0;

        interview.questions.forEach((question) => {
            totalConfidence += question.confidence || 0;
            totalCommunication += question.communication || 0;
            totalCorrectness += question.correctness || 0;
        })

        const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;

        const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;

        const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

        return res.status(200).json({
            finalScore: interview.finalScore,
            confidence: Number(avgConfidence.toFixed(1)),
            communication: Number(avgCommunication.toFixed(1)),
            correctness: Number(avgCorrectness.toFixed(1)),
            questionWiseScore: interview.questions
        })
    }
    catch (error) {
        return res.status(500).json({ message: `Failed to get interview report ${error}` })
    }
}