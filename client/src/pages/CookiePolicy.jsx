import { Cookie } from 'lucide-react';

const CookiePolicy = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 dark:text-gray-300">
            <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center p-4 bg-orange-50 rounded-full text-orange-600 mb-6 dark:bg-orange-900/30 dark:text-orange-400">
                    <Cookie size={32} />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 dark:text-white">Cookie Policy</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400">Last updated: December 15, 2025</p>
            </div>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">1. What Are Cookies?</h2>
                    <p className="leading-relaxed">
                        Cookies are small text files that are placed on your computer or mobile device when you visit a website.
                        They are widely use in order to make websites work, or work more efficiently, as well as to provide information to the owners of the site.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">2. How We Use Cookies</h2>
                    <p className="leading-relaxed mb-6">
                        ConsultPro uses cookies to enhance your browsing experience, analyze site traffic, and personalize content. We use the following types of cookies:
                    </p>

                    <div className="grid grid-cols-1 gap-6">
                        <div className="bg-gray-50 p-6 rounded-2xl dark:bg-gray-800/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Essential Cookies</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                These cookies are necessary for the website to function and cannot be switched off in our systems. They are usually only set in response to actions made by you which amount to a request for services, such as logging in or filling in forms.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl dark:bg-gray-800/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Performance & Analytics Cookies</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                These allow us to count visits and traffic sources so we can measure and improve the performance of our site. Everyone uses them to know which pages are the most and least popular.
                            </p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl dark:bg-gray-800/50">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Functional Cookies</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                These enable the website to provide enhanced functionality and personalization. They may be set by us or by third-party providers whose services we have added to our pages.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">3. Third-Party Cookies</h2>
                    <p className="leading-relaxed">
                        In addition to our own cookies, we may also use various third-parties cookies to report usage statistics of the Service, deliver advertisements on and through the Service, and so on. Be aware that these parties may use cookies and other technologies to track your behavior on the web.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">4. Managing Cookies</h2>
                    <p className="leading-relaxed">
                        Most web browsers allow some control of most cookies through the browser settings. To find out more about cookies, including how to see what cookies have been set, visit <a href="https://www.aboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.aboutcookies.org</a> or <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">www.allaboutcookies.org</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 dark:text-white">5. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have any questions about our use of cookies, please contact us at: <br />
                        <a href="mailto:privacy@consultpro.com" className="text-indigo-600 hover:underline">privacy@consultpro.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default CookiePolicy;
