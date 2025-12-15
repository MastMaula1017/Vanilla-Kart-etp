import { ArrowRight, Briefcase, Building, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SuccessStoriesMarquee } from '../components/SuccessStoriesMarquee';

const Careers = () => {
    return (
        <div className="space-y-24 pb-16 dark:bg-gray-950 transition-colors duration-300">
            {/* 1. Hero */}
            <section className="text-center max-w-4xl mx-auto px-4 pt-10">
                <div className="inline-flex items-center rounded-full bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-700 mb-6 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Briefcase size={16} className="mr-2" />
                    We make people industry ready
                </div>
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6 dark:text-white">
                    Join our mission to <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                        Empower Careers.
                    </span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                    Help us build the bridge between ambition and achievement. We're a remote-first team passionate about education and growth.
                </p>
            </section>

            {/* 2. Success Stories */}
            <section className="bg-gray-50 py-20 dark:bg-gray-900/50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Success Stories</h2>
                        <p className="mt-4 text-gray-600 dark:text-gray-300">
                            See how our courses have transformed careers and opened doors to industry giants.
                        </p>
                    </div>

                    <div className="w-full -mx-4 md:mx-0">
                        <SuccessStoriesMarquee />
                    </div>
                </div>
            </section>

            {/* 3. Company Partners */}
            <section className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trusted by Industry Leaders</h2>
                    <p className="mt-4 text-gray-600 dark:text-gray-300">
                        Top companies that approve our curriculum and hire our graduates.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
                    {/* Logos (Using text for simplicity as placeholders, but designed to look like logos) */}
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Building /> Google</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Briefcase /> Amazon</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><TrendingUp /> Microsoft</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Building /> Netflix</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Briefcase /> Meta</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><TrendingUp /> Tesla</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Building /> Airbnb</div>
                    <div className="text-2xl font-bold text-gray-400 flex items-center gap-2 dark:text-gray-500"><Briefcase /> Stripe</div>
                </div>
            </section>

            {/* 4. Open Roles (Optional Stub) */}
            <section className="container mx-auto px-4 text-center">
                <div className="bg-indigo-600 rounded-3xl p-12 text-white">
                    <h2 className="text-3xl font-bold mb-4">Ready to start your journey?</h2>
                    <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">Check out our open positions and find your next challenge.</p>
                    <Link to="/experts" className="bg-white text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors inline-block">
                        Find expert now
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Careers;
