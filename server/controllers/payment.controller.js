import paymentModel from "../models/payment.model.js";
import User from "../models/user.model.js";
import razorpay from "../services/razorpay.service.js";
import crypto from "crypto";

export const createOrder = async(req,res)=>{
    try {
        const {planId,amount,credits} = req.body;

        if(!amount || !credits) return res.status(400).json({message:"Invalid plan details"});

        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        }; 

        const order = await razorpay.orders.create(options);
        
        await paymentModel.create({
            userId:req.userId,
            planId,
            amount,
            credits,
            razorpayOrderId:order.id,
            status:"created"
        })

        return res.status(200).json({success:true,order})
    } catch (error) {
        return res.status(500).json({message:`Order creation failed! ${error.message}`})
    }
}

export const verifyPayment = async(req,res)=>{
    try {
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
        .createHmac("sha256",process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

        if(expectedSignature !== razorpay_signature){
            return res.status(400).json({success:false,message:"Invalid payment signature"})
        }

        const payment = await paymentModel.findOne({razorpayOrderId:razorpay_order_id})

        if(!payment) return res.status(404).json({success:false,message:"Payment not found"});

        if(payment.status === "paid"){
            return res.status(400).json({success:false,message:"Payment already verified"})
        }

        payment.status = "paid"
        payment.razorpayPaymentId = razorpay_payment_id
        await payment.save();

        // update user credits
        const updatedUser = await User.findByIdAndUpdate(
            payment.userId,
            {$inc: {credits:payment.credits}},
            {new: true}
        )

        return res.status(200).json({success:true,message:"Payment verified successfully",user:updatedUser})
    } catch (error) {
        return res.status(500).json({message:`Payment verification failed! ${error.message}`})
    }
}