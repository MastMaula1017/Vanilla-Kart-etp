import React from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    Target,
    ShieldCheck,
    Globe,
    Award,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import SpotlightCard from '../components/SpotlightCard';

const About = () => {
    return (
        <div className="space-y-24 pb-12 dark:bg-gray-950 transition-colors duration-300">
            {/* 1. Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-20 px-6 text-center lg:pt-32">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-transparent dark:from-indigo-950/20 -z-10"></div>
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-600 mb-6 border border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800">
                        <Sparkles size={14} className="mr-2" />
                        About ConsultPro
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6 dark:text-white">
                        Connecting You with <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">World-Class Expertise</span>
                    </h1>
                    <p className="text-xl text-gray-600 mb-10 leading-relaxed dark:text-gray-300">
                        We are on a mission to democratize access to elite professional guidance. ConsultPro bridges the gap between those who need answers and those who have them.
                    </p>
                </div>
            </section>

            {/* 2. Our Mission */}
            <section className="px-4 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -top-4 -left-4 w-24 h-24 bg-purple-100 rounded-full blur-2xl opacity-70"></div>
                        <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-indigo-100 rounded-full blur-2xl opacity-70"></div>
                        <div className="relative overflow-hidden rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                                alt="Team working together"
                                className="w-full h-auto object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            <div className="absolute bottom-6 left-6 text-white p-4">
                                <p className="font-bold text-lg">Founded in 2024</p>
                                <p className="text-sm opacity-80">Building the future of consulting.</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6 dark:text-white">Our Mission</h2>
                        <p className="text-lg text-gray-600 mb-6 leading-relaxed dark:text-gray-300">
                            At ConsultPro, we believe that <strong className="text-gray-900 dark:text-white">access to knowledge should be universal</strong>. Whether you're a startup founder looking for strategic advice, a student seeking career mentorship, or an individual needing specialized help, finding the right expert shouldn't be hard.
                        </p>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed dark:text-gray-300">
                            We've built a platform that removes the friction of traditional consulting — verifying experts, handling scheduling, and facilitating secure 1:1 video calls instantly.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: ShieldCheck, label: "Verified Experts" },
                                { icon: Globe, label: "Global Reach" },
                                { icon: Users, label: "Community First" },
                                { icon: Target, label: "Result Oriented" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                    <item.icon size={20} className="text-primary" />
                                    <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Values Section */}
            <section className="px-4 container mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 dark:text-white">Our Core Values</h2>
                    <p className="text-gray-600 max-w-2xl mx-auto dark:text-gray-300">Built on trust, transparency, and excellence. These principles guide everything we do.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            title: "Trust & Safety",
                            desc: "We rigorously vet every expert on our platform to ensure you get high-quality, reliable advice.",
                            icon: ShieldCheck,
                            color: "text-blue-600",
                            bg: "bg-blue-50 dark:bg-blue-900/20"
                        },
                        {
                            title: "Excellence",
                            desc: "We are committed to delivering a superior user experience, from seamless booking to high-definition video calls.",
                            icon: Award,
                            color: "text-purple-600",
                            bg: "bg-purple-50 dark:bg-purple-900/20"
                        },
                        {
                            title: "Empowerment",
                            desc: "We empower individuals to grow by connecting them with mentors who have walked the path before.",
                            icon: Users,
                            color: "text-green-600",
                            bg: "bg-green-50 dark:bg-green-900/20"
                        }
                    ].map((value, index) => (
                        <SpotlightCard
                            key={index}
                            className="p-8 h-full flex flex-col items-center text-center dark:bg-gray-900"
                            spotlightColor="rgba(99, 102, 241, 0.15)"
                        >
                            <div className={`w-16 h-16 rounded-2xl ${value.bg} ${value.color} flex items-center justify-center mb-6`}>
                                <value.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">{value.title}</h3>
                            <p className="text-gray-600 leading-relaxed dark:text-gray-400">
                                {value.desc}
                            </p>
                        </SpotlightCard>
                    ))}
                </div>
            </section>

            {/* 4. Join Us CTA */}
            <section className="relative px-4 pb-12">
                <div className="container mx-auto">
                    <div className="relative overflow-hidden rounded-3xl bg-indigo-900 px-8 py-20 text-center shadow-2xl md:px-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-gray-900"></div>

                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight text-white mb-6 md:text-5xl">
                                Part of the Revolution?
                            </h2>
                            <p className="text-lg text-indigo-200 mb-10">
                                Whether you are an expert looking to share your knowledge or a learner seeking guidance, ConsultPro is your home.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    to="/register"
                                    className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-indigo-900 transition-all hover:bg-yellow-50 hover:scale-105 shadow-lg"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                                <Link
                                    to="/contact"
                                    className="inline-flex items-center justify-center rounded-full bg-transparent border-2 border-indigo-300 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-white/10"
                                >
                                    Contact Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
