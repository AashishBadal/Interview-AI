import express from "express";
import {
    createOrder,
    verifyPayment
} from "../controllers/payment.controller.js";
import { isAuth } from "../middlewares/isAuth.middleware.js";

const paymentRouter = express.Router();

paymentRouter.post("/order",isAuth,createOrder);
paymentRouter.post("/verify-payment",isAuth,verifyPayment);

export default paymentRouter;