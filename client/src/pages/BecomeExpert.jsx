import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, DollarSign, Globe, Shield, Users, Zap } from 'lucide-react';

const BecomeExpert = () => {
  return (
    <div className="bg-white dark:bg-gray-950 transition-colors duration-300">
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-200 via-white to-white dark:from-indigo-950/40 dark:via-gray-950 dark:to-gray-950"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span>Join 500+ Top Experts</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
              Share your expertise. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Monetize your time.</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with ambitious individuals seeking your guidance. Set your own rates, manage your schedule, and build your personal brand on a global stage.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register?role=expert"
                className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:scale-105 transition-transform shadow-xl flex items-center"
              >
                Become an Advisor <ArrowRight className="ml-2" size={20} />
              </Link>
              <Link
                to="/about"
                className="px-8 py-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-800 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Abstract Shapes */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Why join ConsultPro?</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              We provide the tools, platform, and audience. You bring the expertise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <DollarSign size={32} />,
                title: "High Earning Potential",
                desc: "Set your own hourly rates (in ₹) and keep 90% of your earnings. Top experts earn over ₹2L/month."
              },
              {
                icon: <Globe size={32} />,
                title: "Global Reach",
                desc: "Your profile is instantly accessible to thousands of users worldwide. Break geographical barriers."
              },
              {
                icon: <Zap size={32} />,
                title: "Seamless Tech",
                desc: "Built-in video calls, scheduling, payments, and messaging. We handle the admin so you can focus on advising."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24 border-y border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-gray-900 dark:bg-indigo-950 rounded-3xl p-12 relative overflow-hidden text-center md:text-left">
            <div className="absolute top-0 right-0 w-full h-full opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
               <div className="flex-1">
                 <div className="flex text-yellow-400 mb-6 justify-center md:justify-start">
                   {[...Array(5)].map((_, i) => <StarIcon key={i} />)}
                 </div>
                 <h2 className="text-3xl font-bold text-white mb-6 leading-tigher">
                   "This platform completely changed my career. I went from occasional consulting to a full-time advisory role in 3 months."
                 </h2>
                 <div>
                   <p className="font-bold text-white text-lg">Dr. Vansh Raturi</p>
                   <p className="text-indigo-300">Senior Financial Consultant</p>
                 </div>
               </div>
               <div className="w-48 h-48 rounded-full border-4 border-white/10 overflow-hidden shrink-0">
                  <div className="w-full h-full bg-indigo-500 flex items-center justify-center text-4xl font-bold text-white">VR</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container mx-auto px-4">
           <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How it works</h2>
          </div>
          
          <div className="max-w-4xl mx-auto space-y-12">
            {[
              { step: "01", title: "Create your profile", desc: "Highlight your expertise, set your rates, and upload a professional photo." },
              { step: "02", title: "Set availability", desc: "Connect your calendar and choose when you want to take calls." },
              { step: "03", title: "Start earning", desc: "Receive bookings, conduct sessions via our secure video platform, and get paid." }
            ].map((item, i) => (
              <div key={i} className="flex items-start md:items-center space-x-6 md:space-x-12">
                <div className="text-6xl font-black text-gray-100 dark:text-gray-800 select-none">
                  {item.step}
                </div>
                <div>
                   <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                   <p className="text-lg text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/30">
        <div className="container mx-auto px-4 text-center">
           <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">Ready to inspire the next generation?</h2>
           <Link
                to="/register?role=expert"
                className="inline-flex px-10 py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/20 text-lg transition-all hover:-translate-y-1"
          >
              Apply as an Expert
           </Link>
           <p className="mt-6 text-gray-500 dark:text-gray-400 text-sm">
             No credit card required for sign up. Vetted verification process.
           </p>
        </div>
      </section>

    </div>
  );
};

const StarIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default BecomeExpert;
