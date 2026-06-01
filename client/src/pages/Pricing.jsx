import { motion } from 'motion/react';
import React, { useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa';
import { FaArrowLeft } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { ServerUrl } from '../App';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const Pricing = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedPlan, setSelectedPlan] = useState("free")
  const [loadingPlan, setLoadingPlan] = useState(null)


  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      credits: 100,
      description: "Perfect for quick practice",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Reports",
        "Voice Interview Access",
        "Limited History Tracking"
      ],
      default: true
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: 199,
      credits: 150,
      description: "Perfect for regular practice",
      features: [
        "150 AI Interview Credits",
        "Detailed Feedback & Suggestions",
        "Performance Analytics",
        "Full History Tracking"
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: 499,
      credits: 600,
      description: "Best value for serious job preparation",
      features: [
        "600 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value"
    }
  ]
  const handlePayment = async (plan) => {
    try {
      setLoadingPlan(plan.id);
      const amount = plan.id === "basic" ? 199
        : plan.id === "pro" ? 499 : 0;
      const result = await axios.post(ServerUrl + "/payment/order", {
        amount,
        planId: plan.id,
        credits: plan.credits
      }, {
        withCredentials: true
      })
      console.log(result.data)

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: result.data.order.amount,
        currency: "INR",
        order_id: result.data.order.id,
        name: "Interview AI",
        description: `${plan.name} - ${plan.credits} Credits`,
        handler: async function (response) {
          try {
            const verifyResult = await axios.post(ServerUrl + "/payment/verify-payment", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            }, {
              withCredentials: true
            });
            
            if (verifyResult.data.success) {
              alert("Payment verified successfully! Credits added.");
              dispatch(setUserData(verifyResult.data.user));
              navigate("/");
            } else {
              alert(verifyResult.data.message || "Payment verification failed.");
            }
          } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Payment verification failed.");
          }
        },
        theme: {
          color: "#10b981"
        }
      }
      const rzp = new window.Razorpay(options);

      rzp.open()
      setLoadingPlan(null);

    } catch (error) {
      console.error(error)
      alert(error.response?.data?.message || "Order creation failed.");
      setLoadingPlan(null);
    }
  }
  return (
    <div className='min-h-screen lg:h-screen w-full flex flex-col justify-center items-center bg-gradient-to-br from-gray-50 to-emerald-50 py-6 px-4 overflow-y-auto'>
      <div className='w-full max-w-6xl'>
        <div className='relative w-full mb-10 flex items-center justify-center px-4 md:px-0'>
          <button onClick={() => navigate("/")} className='absolute left-4 md:left-0 p-3 rounded-full bg-white shadow hover:shadow-md transition hover:scale-105'>
            <FaArrowLeft className='text-gray-700' />
          </button>
          <div className='text-center'>
            <h1 className='text-4xl font-bold text-gray-900 mb-2'>
              Choose Your Plan
            </h1>
            <p className='text-gray-600'>
              Flexible pricing to match your interview preparation goals
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 w-full'>
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;
            return (

              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={!plan.default ? {
                  y: -8,
                  scale: 1.02,
                  boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)"
                } : {
                  scale: 1.01
                }}
                whileTap={!plan.default ? { scale: 0.98 } : undefined}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`bg-white rounded-2xl p-8 shadow-lg relative ${!plan.default ? "cursor-pointer" : ""
                  } ${isSelected ? "border-4 border-emerald-500" : "border border-gray-200 hover:border-emerald-300"}`}
              >
                {plan.badge && (
                  <div className='absolute top-0 right-0 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-bl-2xl rounded-tr-2xl'>
                    {plan.badge}
                  </div>
                )}
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                  {plan.name}
                </h2>
                <p className='text-gray-600'>
                  {plan.description}
                </p>
                <div className='my-6'>
                  {plan.price === 0 ? (
                    <span className='text-4xl font-bold text-gray-900'>Free</span>
                  ) : (
                    <span className='text-4xl font-bold text-gray-900'>
                      ₹{plan.price}
                    </span>
                  )}
                </div>
                <div className='mb-6'>
                  <span className='text-3xl font-bold text-gray-900'>
                    {plan.credits}
                  </span>
                  <span className='text-gray-500 ml-1'>
                    credits
                  </span>
                </div>
                <ul className='space-y-2 mb-6'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-2'>
                      <FaCheckCircle className='text-emerald-500' />
                      <span className='text-gray-600'>{feature}</span>
                    </li>
                  ))}
                </ul>
                <motion.button
                  disabled={plan.price !== 0 && !isSelected}
                  whileHover={!(plan.price !== 0 && !isSelected) ? { scale: 1.02 } : {}}
                  whileTap={!(plan.price !== 0 && !isSelected) ? { scale: 0.98 } : {}}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (!selectedPlan) {
                      setSelectedPlan(plan.id)
                    } else {
                      handlePayment(plan)
                    }
                  }}
                  className={`w-full py-3 rounded-lg text-lg font-bold transition-all duration-300 ${plan.default
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : isSelected
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-gray-200 text-gray-400 cursor-not-allowed opacity-60"
                    }`}
                >
                  {loadingPlan === plan.id ? (
                    "Processing..."
                  ) : plan.price === 0 ? (
                    "Get Started Free"
                  ) : (
                    "Buy Now"
                  )}
                </motion.button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Pricing