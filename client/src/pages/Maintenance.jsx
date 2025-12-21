import React from 'react';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import maintenanceAnimation from '../assets/maintenance_animation.json';
import { FaTwitter, FaLinkedin, FaGithub, FaInstagram } from 'react-icons/fa';

const Maintenance = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <div className="max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12 relative z-10 glass-panel">
        {/* Lottie Animation Section */}
        <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <Lottie 
              animationData={maintenanceAnimation} 
              loop={true} 
              className="relative z-10 w-full h-full drop-shadow-2xl"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="w-full md:w-1/2 text-center md:text-left space-y-8 order-1 md:order-2">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 leading-tight">
              We'll be <br /> back soon!
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-lg mx-auto md:mx-0">
              Our site is currently undergoing scheduled maintenance. We're making improvements to serve you better.
            </p>
          </div>

          {/* Status Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full sm:w-auto">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">System Upgrade</span>
            </div>
            
            <div className="flex items-center gap-3 px-5 py-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 w-full sm:w-auto">
               <svg className="w-5 h-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Back in ~2h</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
            <button 
              onClick={() => window.location.reload()}
              className="group relative inline-flex items-center px-8 py-3.5 text-base font-semibold text-white transition-all duration-300 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-blue-500/30 overflow-hidden w-full sm:w-auto justify-center"
            >
              <span>Check Status</span>
              <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            {/* Social Links using react-icons */}
            <div className="flex items-center gap-4">
               {[
                 { Icon: FaTwitter, href: "#" },
                 { Icon: FaGithub, href: "#" },
                 { Icon: FaLinkedin, href: "#" },
                 { Icon: FaInstagram, href: "#" }
               ].map(({ Icon, href }, index) => (
                 <a 
                   key={index}
                   href={href}
                   className="p-3 text-gray-500 transition-colors duration-300 bg-white/50 dark:bg-gray-800/50 rounded-full hover:bg-white hover:text-blue-600 dark:hover:bg-gray-800 dark:hover:text-blue-400 shadow-sm border border-gray-100 dark:border-gray-700 backdrop-blur-sm"
                 >
                   <Icon size={20} />
                 </a>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Maintenance;
