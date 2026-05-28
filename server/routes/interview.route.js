import express from 'express'
import {upload} from "../middlewares/multer.js";
import { analyseResume, finishInterview, generateQuestions, submitAnswer } from '../controllers/interview.controller.js';
import {isAuth} from '../middlewares/isAuth.middleware.js';

const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyseResume);

interviewRouter.post("/generate-questions",isAuth,generateQuestions);

interviewRouter.post("/submit-answer",isAuth,submitAnswer);

interviewRouter.post("/finish",isAuth,finishInterview);

export default interviewRouter;