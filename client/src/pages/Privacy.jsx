import { Shield } from 'lucide-react';

const Privacy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 dark:text-gray-300">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-indigo-50 rounded-full text-indigo-600 mb-6 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Shield size={32} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">Privacy Policy</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: December 15, 2025</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">1. Introduction</h2>
                    <p className="leading-relaxed">
                        ConsultPro ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use,
                        disclose, and safeguard your information when you visit our website and use our application. Please read this privacy policy carefully.
                        If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">2. Information We Collect</h2>
                    <div className="bg-gray-50 p-6 rounded-2xl dark:bg-gray-800/50">
                        <ul className="space-y-3 list-disc list-inside">
                            <li><strong>Personal Data:</strong> Name, email address, phone number when you register.</li>
                            <li><strong>Payment Data:</strong> Credit card information (processed securely by Stripe).</li>
                            <li><strong>Usage Data:</strong> Information about how you use our platform, including session duration and features accessed.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">3. How We Use Your Information</h2>
                    <p className="leading-relaxed mb-4">
                        We use the information we collect to:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {['Provide and manage your account', 'Process transactions', 'Email you regarding your account', 'Improve our application'].map((item, i) => (
                            <div key={i} className="flex items-center space-x-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">4. Data Security</h2>
                    <p className="leading-relaxed">
                        We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">5. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have questions or comments about this Privacy Policy, please contact us at: <br />
                        <a href="mailto:privacy@consultpro.com" className="text-indigo-600 hover:underline">privacy@consultpro.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default Privacy;
