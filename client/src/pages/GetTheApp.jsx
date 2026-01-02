import { useState } from 'react';
import { Apple, Play, Shield, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GetTheApp = () => {
    const [activeStats, setActiveStats] = useState({
        rating: '4.8',
        downloads: '50M+',
        platform: 'Android'
    });

    return (
        <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]"></div>
            </div>

            <div className="container mx-auto px-4 py-20 relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

                    {/* Left Content */}
                    <div className="lg:w-1/2 space-y-8 animate-fade-in-up">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                            <span className="text-sm font-medium text-gray-300">Available on Android</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
                            Expertise in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                                Your Pocket.
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
                            Experience the future of consultation. Connect with elite experts instantly, manage sessions, and track your growth—all from a stunningly designed mobile interface.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <a
                                href="/ConsultPro_1_1.0.apk"
                                download="ConsultPro_1_1.0.apk"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative overflow-hidden rounded-xl bg-white text-gray-900 px-8 py-4 transition-all hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
                            >
                                <div className="relative z-10 flex items-center justify-center gap-3">
                                    <div className="bg-gray-900 text-white p-1 rounded-full">
                                      <Zap size={20} className="fill-current" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-[10px] uppercase font-bold tracking-wider opacity-60">Download APK</div>
                                        <div className="text-xl font-bold leading-none">For Android</div>
                                    </div>
                                </div>
                            </a>
                        </div>

                        <div className="flex items-center gap-8 pt-8 border-t border-white/10">
                            <div className="text-center min-w-[80px]">
                                <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 transform" key={activeStats.rating}>{activeStats.rating}<span className="text-yellow-400 text-xl">★</span></div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Rating</div>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center min-w-[100px]">
                                <div className="text-3xl font-bold text-white mb-1 transition-all duration-300 transform" key={activeStats.downloads}>{activeStats.downloads}</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Downloads</div>
                            </div>
                            <div className="w-px h-12 bg-white/10"></div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                                <div className="text-sm text-gray-500 uppercase tracking-wider font-medium">Support</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:w-1/2 relative perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full -z-10"></div>
                        <img
                            src="/app-mockup.png"
                            alt="App Interface"
                            className="relative z-10 w-full max-w-md mx-auto transform hover:scale-105 transition-transform duration-700 ease-out drop-shadow-2xl"
                            style={{
                                filter: "drop-shadow(0 20px 50px rgba(0,0,0,0.5))"
                            }}
                        />

                        {/* Floating Elements */}
                        <div className="absolute top-1/4 -right-4 md:right-10 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-float-slow z-20">
                            <Shield className="w-8 h-8 text-green-400 mb-2" />
                            <div className="text-xs text-gray-400">Status</div>
                            <div className="font-bold text-white">Verified Expert</div>
                        </div>

                        <div className="absolute bottom-1/4 -left-4 md:left-10 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-xl border border-white/10 shadow-2xl animate-float-delayed z-20">
                            <Zap className="w-8 h-8 text-yellow-400 mb-2" />
                            <div className="text-xs text-gray-400">Response Time</div>
                            <div className="font-bold text-white">&lt; 30 Mins</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default GetTheApp;
