import { FileText } from 'lucide-react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 dark:text-gray-300">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full text-indigo-600 mb-6 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <FileText size={32} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">Terms of Service</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: December 15, 2025</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">1. Agreement to Terms</h2>
                    <p className="leading-relaxed">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ConsultPro ("we," "us" or "our"), concerning your access to and use of the ConsultPro website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">2. Intellectual Property Rights</h2>
                    <p className="leading-relaxed">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">3. User Representations</h2>
                    <div className="bg-gray-50 p-6 rounded-2xl dark:bg-gray-800/50">
                        <p className="mb-4">By using the Site, you represent and warrant that:</p>
                        <ul className="space-y-3 list-disc list-inside">
                            <li>All registration information you submit will be true, accurate, current, and complete.</li>
                            <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                            <li>You have the legal capacity and you agree to comply with these Terms of Service.</li>
                            <li>You are not a minor in the jurisdiction in which you reside.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">4. Prohibited Activities</h2>
                    <p className="leading-relaxed">
                        You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">5. Governing Law</h2>
                    <p className="leading-relaxed">
                        These Terms shall be governed by and defined following the laws of United States. ConsultPro and yourself irrevocably consent that the courts of United States shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Terms;
