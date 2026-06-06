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
          color: "#c6f24e"
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
    <div className='min-h-screen w-full flex flex-col justify-center items-center bg-bg text-ink py-12 px-4 relative overflow-hidden'>
      <div className='pointer-events-none absolute top-[-20%] left-1/2 -translate-x-1/2 w-[70vw] h-[55vh] rounded-full bg-accent/10 blur-[150px]' />
      <div className='pointer-events-none absolute inset-0 bg-grid opacity-40' />
      <div className='relative z-10 w-full max-w-6xl'>
        <div className='relative w-full mb-12 flex items-center justify-center px-4 md:px-0'>
          <button onClick={() => navigate("/")} className='absolute left-4 md:left-0 w-11 h-11 flex items-center justify-center rounded-full bg-surface border border-line hover:border-line-strong transition'>
            <FaArrowLeft className='text-muted' />
          </button>
          <div className='text-center'>
            <span className='label-mono'>pricing</span>
            <h1 className='font-display text-4xl md:text-5xl font-semibold tracking-tight mt-3 mb-2'>
              Choose your plan
            </h1>
            <p className='text-muted'>
              Flexible pricing to match your interview preparation goals
            </p>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                whileHover={!plan.default ? { y: -6 } : undefined}
                whileTap={!plan.default ? { scale: 0.99 } : undefined}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative card p-8 transition-colors ${!plan.default ? "cursor-pointer" : ""} ${isSelected ? "!border-accent bg-surface-2" : "hover:border-line-strong"}`}
              >
                {plan.badge && (
                  <div className='absolute -top-3 right-6 bg-accent text-bg text-[10px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full'>
                    {plan.badge}
                  </div>
                )}
                <h2 className='font-display text-2xl font-semibold mb-2'>
                  {plan.name}
                </h2>
                <p className='text-muted text-sm'>
                  {plan.description}
                </p>
                <div className='my-6 flex items-baseline gap-1'>
                  {plan.price === 0 ? (
                    <span className='font-display text-4xl font-semibold'>Free</span>
                  ) : (
                    <span className='font-display text-4xl font-semibold'>₹{plan.price}</span>
                  )}
                </div>
                <div className='mb-6 flex items-baseline gap-2'>
                  <span className='font-display text-3xl font-semibold text-accent'>{plan.credits}</span>
                  <span className='label-mono'>credits</span>
                </div>
                <div className='h-px bg-line mb-6' />
                <ul className='space-y-3 mb-7'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-2.5'>
                      <FaCheckCircle className='text-accent shrink-0' size={15} />
                      <span className='text-muted text-sm'>{feature}</span>
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
                  className={`w-full py-3 rounded-full text-[15px] font-semibold transition-all duration-200 ${plan.default
                    ? "btn-accent"
                    : isSelected
                      ? "btn-accent"
                      : "bg-surface-2 text-faint border border-line cursor-not-allowed"
                    }`}
                >
                  {loadingPlan === plan.id ? (
                    "Processing…"
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