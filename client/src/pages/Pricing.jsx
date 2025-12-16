import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, ArrowRight, User, Users, Building } from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';
import axios from '../utils/axios';
import AuthContext from '../context/AuthContext';

const Pricing = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleSubscription = async (plan) => {
        if (!user) {
            navigate('/login');
            return;
        }

        const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

        if (!res) {
            alert('Razorpay SDK failed to load. Are you online?');
            return;
        }

        // Convert price string "₹850" to number 850
        const amount = parseInt(plan.price.replace(/[^0-9]/g, ''), 10);

        try {
            // 1. Create Order
            const { data: order } = await axios.post('/payment/create-order', { amount });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "ConsultPro",
                description: `Subscription: ${plan.name}`,
                image: "https://your-logo-url.com/logo.png",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verifyRes = await axios.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });
                        if (verifyRes.status === 200) {
                            alert(`Subscription to ${plan.name} successful!`);
                            navigate('/dashboard');
                        }
                    } catch (err) {
                        console.error(err);
                        alert('Payment verification failed.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                    contact: user.phone || "9999999999"
                },
                theme: {
                    color: "#6366f1"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error(error);
            alert('Error initiating payment');
        }
    };
    const plans = [
        {
            name: "Personal Plan",
            subtitle: "For you",
            icon: User,
            audience: "Individual",
            price: "₹850",
            period: "per month",
            billing: "Billed monthly or annually. Cancel anytime.",
            buttonText: "Start subscription",
            buttonLink: "#",
            features: [
                "Access to verified experts",
                "2 sessions per month",
                "Goal-focused recommendations",
                "AI-powered session summaries"
            ],
            highlight: false,
            spotlight: "rgba(168, 85, 247, 0.2)" // Purple
        },
        {
            name: "Team Plan",
            subtitle: "For your team",
            icon: Users,
            audience: "2 to 10 people",
            price: "₹2,000",
            period: "per user / month",
            billing: "Billed annually. Cancel anytime.",
            buttonText: "Start subscription",
            buttonLink: "#",
            features: [
                "Access to top-tier consultants",
                "5 sessions per user / month",
                "Priority booking",
                "Team analytics dashboard",
                "Consolidated billing"
            ],
            highlight: true,
            spotlight: "rgba(79, 70, 229, 0.2)" // Indigo
        },
        {
            name: "Enterprise Plan",
            subtitle: "For your organization",
            icon: Building,
            audience: "More than 20 people",
            price: "Custom",
            period: "",
            billing: "Contact sales for pricing",
            buttonText: "Request a demo",
            buttonLink: "/contact",
            features: [
                "Unlimited access to all experts",
                "Dedicated customer success team",
                "International expert collection",
                "Customizable branding",
                "SLA & Priority Support",
                "Strategic implementation services"
            ],
            highlight: false,
            spotlight: "rgba(59, 130, 246, 0.2)" // Blue
        }
    ];

    return (
        <div className="min-h-screen py-20 px-4 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto max-w-7xl">

                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 dark:text-white">
                        Choose a plan for success
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                        Don't want to pay per session? Pick a plan to help you, your team, or your organization achieve outcomes faster.
                    </p>
                </div>

                {/* Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, index) => (
                        <SpotlightCard
                            key={index}
                            className={`flex flex-col p-8 h-full border ${plan.highlight
                                ? 'border-indigo-500 shadow-indigo-500/20 shadow-2xl relative overflow-hidden'
                                : 'border-gray-200 dark:border-gray-800'
                                } rounded-2xl bg-white dark:bg-gray-900`}
                            spotlightColor={plan.spotlight}
                        >
                            {plan.highlight && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-b-lg shadow-sm">
                                    POPULAR
                                </div>
                            )}

                            {/* Card Header */}
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">{plan.subtitle}</p>
                                    </div>
                                    <div className={`p-3 rounded-xl bg-gray-50 dark:bg-gray-800`}>
                                        <plan.icon size={24} className="text-gray-700 dark:text-gray-300" />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    <User size={14} />
                                    <span>{plan.audience}</span>
                                </div>

                                <div className="mb-2">
                                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{plan.price}</span>
                                    {plan.period && <span className="text-gray-500 dark:text-gray-400 ml-2">{plan.period}</span>}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 min-h-[20px]">{plan.billing}</p>
                            </div>

                            {/* Button */}
                            {plan.price !== "Custom" ? (
                                <button
                                    onClick={() => handleSubscription(plan)}
                                    className={`w-full block text-center py-3 rounded-lg font-bold transition-all mb-8 ${plan.highlight
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60'
                                        }`}
                                >
                                    {plan.buttonText}
                                </button>
                            ) : (
                                <Link
                                    to={plan.buttonLink}
                                    className={`w-full block text-center py-3 rounded-lg font-bold transition-all mb-8 ${plan.highlight
                                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/30'
                                        : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60'
                                        }`}
                                >
                                    {plan.buttonText}
                                </Link>
                            )}

                            {/* Features */}
                            <div className="flex-grow">
                                <ul className="space-y-4">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start">
                                            <div className="flex-shrink-0 mt-0.5">
                                                <Check size={18} className="text-green-500" />
                                            </div>
                                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </SpotlightCard>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default Pricing;
