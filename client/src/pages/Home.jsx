import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  BookOpen, 
  Briefcase, 
  Users, 
  Clock, 
  ShieldCheck,
  Search,
  MessageSquare,
  CalendarCheck,
  Star,
  Monitor,
  Heart,
  Scale
} from 'lucide-react';
import { Marquee3D } from '@/components/magicui/ReviewMarquee';
import BrandTicker from '../components/BrandTicker';
import SpotlightCard from '../components/SpotlightCard';

import ContactForm from '../components/ContactForm';

import { Globe } from '@/components/magicui/Globe';
import NumberTicker from '@/components/magicui/NumberTicker';
import ShimmerButton from '@/components/magicui/ShimmerButton';

import WordPullUp from '@/components/magicui/WordPullUp';

const Home = () => {
  return (
    <div className="space-y-24 pb-12 dark:bg-gray-950 transition-colors duration-300">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-dark text-white shadow-xl mt-4 dark:border dark:border-gray-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-purple-700 opacity-90 dark:opacity-80"></div>
        <div className="relative z-10 px-8 py-20 text-center md:py-32">
          <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-purple-100 backdrop-blur-xl mb-6 border border-white/20">
             <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
             New Experts Added Daily
          </div>
          <div className="mb-6 flex flex-col items-center justify-center">
            <WordPullUp 
                words="Expert Advice," 
                className="text-4xl font-extrabold tracking-tight md:text-7xl"
            />
            <span className="text-4xl font-extrabold tracking-tight md:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400 animate-[pulse_3s_ease-in-out_infinite]">
              Instantly Accessible
            </span>
          </div>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-100 md:text-xl dark:text-gray-300">
            Connect with verified top-tier consultants in Finance, Education, and Business. 
            Book 1:1 sessions and get the answers you need today.
          </p>
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
            <Link to="/experts">
               <ShimmerButton className="shadow-2xl">
                  <span className="flex items-center text-base font-bold">
                    Find an Expert <Search className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
               </ShimmerButton>
            </Link>
            <Link 
              to="/register?role=expert" 
              className="group inline-flex items-center rounded-full border-2 border-indigo-300 px-8 py-3 text-lg font-bold text-white transition-all hover:bg-white/10 hover:border-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Join as Advisor
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
        
        {/* Globe Background */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none translate-y-32 scale-150 md:scale-100 md:translate-y-20">
           <Globe />
        </div>
      </section>

      {/* 2. Brand Ticker */}
      <BrandTicker />

      {/* 3. Stats Section */}
      <section className="grid grid-cols-2 gap-6 md:grid-cols-4 px-4">
        {[
          { label: 'Verified Experts', value: '500+', icon: ShieldCheck, color: 'text-indigo-600', spotlight: 'rgba(79, 70, 229, 0.15)' },
          { label: 'Sessions Completed', value: '10k+', icon: Users, color: 'text-purple-600', spotlight: 'rgba(147, 51, 234, 0.15)' },
          { label: 'Average Rating', value: '4.9/5', icon: TrendingUp, color: 'text-green-600', spotlight: 'rgba(34, 197, 94, 0.15)' },
          { label: 'Response Time', value: '< 1hr', icon: Clock, color: 'text-orange-600', spotlight: 'rgba(234, 88, 12, 0.15)' },
        ].map((stat, index) => (
          <SpotlightCard 
            key={index} 
            spotlightColor={stat.spotlight}
            className="flex flex-col items-center p-8 text-center hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 dark:bg-gray-900 dark:border-gray-800"
          >
            <div className={`p-3 rounded-xl bg-gray-50 mb-4 ${stat.color} bg-opacity-10 dark:bg-gray-800`}>
               <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
            <div className="text-3xl font-extrabold text-gray-900 mb-1 dark:text-white">
                <NumberTicker value={stat.value} />
            </div>
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
          </SpotlightCard>
        ))}
      </section>

      {/* 4. Explore Categories (Moved Up) */}
      <section className="px-4">
        <div className="mb-10 flex flex-col md:flex-row justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Explore Categories</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Find the right professional for your specific needs</p>
          </div>
          <Link to="/experts" className="text-primary font-semibold flex items-center hover:text-indigo-800 transition mt-4 md:mt-0 dark:hover:text-indigo-400">
            View All Categories <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Finance Card */}
          <SpotlightCard to="/experts?category=finance" className="p-8" spotlightColor="rgba(34, 197, 94, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <TrendingUp size={120} />
            </div>
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400">
                <TrendingUp size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Finance</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                Investment strategies, tax planning, crypto advice, and wealth management.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-green-600 dark:text-green-400">
                Explore Finance <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>

          {/* Education Card */}
           <SpotlightCard to="/experts?category=education" className="p-8" spotlightColor="rgba(59, 130, 246, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <BookOpen size={120} />
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
                <BookOpen size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Education</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                College counseling, career guidance, language tutoring, and test prep.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400">
                Explore Education <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>

          {/* Business Card */}
          <SpotlightCard to="/experts?category=business" className="p-8" spotlightColor="rgba(249, 115, 22, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <Briefcase size={120} />
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400">
                <Briefcase size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Business</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                 Startup strategy, marketing, specialized operations, and leadership coaching.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-orange-600 dark:text-orange-400">
                Explore Business <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>

          {/* Technology Card */}
          <SpotlightCard to="/experts?category=technology" className="p-8" spotlightColor="rgba(168, 85, 247, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <Monitor size={120} />
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400">
                <Monitor size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Technology</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                 Software development, cybersecurity, AI consultation, and IT support.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-purple-600 dark:text-purple-400">
                Explore Tech <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>

          {/* Health Card */}
          <SpotlightCard to="/experts?category=health" className="p-8" spotlightColor="rgba(239, 68, 68, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <Heart size={120} />
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                <Heart size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Health</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                 Nutrition planning, mental wellness, fitness coaching, and medical advice.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-red-600 dark:text-red-400">
                Explore Health <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>

          {/* Legal Card */}
          <SpotlightCard to="/experts?category=legal" className="p-8" spotlightColor="rgba(8, 145, 178, 0.15)">
            <div className="absolute top-0 right-0 p-8 opacity-5 dark:opacity-10 dark:text-gray-600">
              <Scale size={120} />
            </div>
            <div>
               <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400">
                <Scale size={24} />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">Legal</h3>
              <p className="text-gray-600 leading-relaxed mb-6 dark:text-gray-400">
                 Contract review, intellectual property, family law, and corporate counsel.
              </p>
              <div className="inline-flex items-center text-sm font-bold text-cyan-600 dark:text-cyan-400">
                Explore Legal <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </SpotlightCard>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="px-4">
        <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">How It Works</h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">Three simple steps to expert guidance.</p>
        </div>
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {/* Connector Line (Desktop) */}
          <div className="absolute top-8 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-200 to-transparent hidden md:block -z-10 transform translate-y-4 dark:via-indigo-900 opacity-50"></div>

          {[
            { title: 'Search', desc: 'Browse hundreds of verified experts by category or skill.', icon: Search },
            { title: 'Book', desc: 'Select a time that works for you and secure your session.', icon: CalendarCheck },
            { title: 'Connect', desc: 'Jump on a 1:1 call and resolve your doubts instantly.', icon: MessageSquare }
          ].map((step, i) => (
             <SpotlightCard 
                key={i} 
                className="relative flex flex-col items-center text-center bg-white p-8 rounded-3xl border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
                spotlightColor="rgba(168, 85, 247, 0.2)"
             >
               <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-50 to-white shadow-xl flex items-center justify-center mb-6 text-primary border border-white/50 relative z-10 dark:from-gray-800 dark:to-gray-900 dark:border-gray-700">
                 <step.icon size={36} className="text-purple-600 dark:text-purple-400" />
               </div>
               <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-3 dark:text-white">{step.title}</h3>
               <p className="relative z-10 text-gray-600 leading-relaxed max-w-xs dark:text-gray-400">{step.desc}</p>
             </SpotlightCard>
          ))}
        </div>
      </section>

      {/* 6. Reviews Marquee Section */}
      <section className="overflow-hidden py-10 bg-gray-50/50 -mx-4 px-4 dark:bg-gray-900/50">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">What Users Say</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Join thousands of satisfied users.</p>
        </div>
        <Marquee3D />
      </section>

      {/* 7. FAQ & Contact Section */}
      <section className="px-4 max-w-6xl mx-auto">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl dark:text-white">Frequently Asked Questions</h2>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Everything you need to know about the platform.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          {/* FAQ List */}
          <div className="space-y-6">
             <div className="space-y-4">
              {[
                { q: "How do I book an expert?", a: "Simply browse our categories, select an expert, choose a time slot, and confirm your booking. You'll receive a meeting link instantly." },
                { q: "Are the experts verified?", a: "Yes, every expert goes through a rigorous vetting process including background checks and skill verification." },
                { q: "Can I cancel a session?", a: "You can cancel up to 24 hours before the session for a full refund. Late cancellations may be subject to a fee." },
                { q: "How does the video call work?", a: "We have an integrated secure video platform. No downloads required - just click the link in your dashboard." }
              ].map((faq, index) => (
                <SpotlightCard 
                  key={index} 
                  className="border border-gray-200 rounded-xl p-6 bg-white hover:border-primary/50 transition-colors dark:bg-gray-900 dark:border-gray-800"
                  spotlightColor="rgba(168, 85, 247, 0.2)"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">{faq.q}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="relative">
             <div className="sticky top-24">
                <ContactForm />
             </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA */}
      <section className="relative overflow-hidden rounded-3xl bg-indigo-900 px-6 py-20 text-center shadow-2xl sm:px-12 sm:py-24">
         <div className="absolute inset-0 bg-gradient-to-br from-indigo-800 to-gray-900"></div>
         {/* Decorative Stars */}
         <Star className="absolute top-12 left-12 text-yellow-400 opacity-20" size={48} />
         <Star className="absolute bottom-12 right-12 text-yellow-400 opacity-20" size={64} />
         
         <div className="relative z-10 max-w-3xl mx-auto">
           <h2 className="text-3xl font-bold tracking-tight text-white mb-6 md:text-4xl">
             Ready to take your career or business to the next level?
           </h2>
           <p className="text-lg text-indigo-200 mb-10">
             Join our community of experts and learners today. It takes less than 2 minutes to get started.
           </p>
           <Link 
              to="/register" 
              className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-bold text-indigo-900 transition-all hover:bg-yellow-50 hover:scale-105 shadow-lg"
            >
              Get Started for Free
           </Link>
         </div>
      </section>
    </div>
  );
};

export default Home;
