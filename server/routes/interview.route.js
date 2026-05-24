import express from 'express'
import {upload} from "../middlewares/multer.js";
import { analyseResume } from '../controllers/interview.controller.js';
import {isAuth} from '../middlewares/isAuth.middleware.js';

const interviewRouter = express.Router();

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyseResume);

export default interviewRouter;