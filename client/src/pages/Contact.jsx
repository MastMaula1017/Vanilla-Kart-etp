import { Mail, MapPin, Phone, Twitter, Linkedin, Github, Instagram } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
    return (
        <div className="min-h-screen py-12 dark:bg-gray-950 transition-colors duration-300">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 dark:text-white">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto dark:text-gray-300">
                        We'd love to hear from you. Whether you have a question about features, pricing, or just want to say hi, our team is ready to answer all your questions.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Left Side: Contact Info & Socials */}
                    <div className="space-y-8">
                        {/* Contact Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-4 dark:bg-indigo-900/30 dark:text-indigo-400">
                                    <Mail size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Email Us</h3>
                                <p className="text-gray-600 dark:text-gray-400">support@consultpro.com</p>
                                <p className="text-gray-600 dark:text-gray-400">partners@consultpro.com</p>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 mt-2 dark:text-white">Contact Developer</h3>
                                <p className="text-gray-600 dark:text-gray-400">riderknight6789@gmail.com</p>
                                <p className="text-gray-600 dark:text-gray-400">vansh14raturi@gmail.com</p>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 mb-4 dark:bg-purple-900/30 dark:text-purple-400">
                                    <MapPin size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2 dark:text-white">Visit Us</h3>
                                <p className="text-gray-600 dark:text-gray-400">LPU, Jalandhar-Delhi G.T. Road</p>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Punjab, India 144411</p>
                                <a 
                                    href="https://maps.app.goo.gl/TFAAXdkVqLpBThby8" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/50 dark:text-indigo-300 dark:hover:bg-indigo-900 transition-colors"
                                >
                                    <MapPin size={16} className="mr-2" />
                                    Set GPS
                                </a>
                            </div>
                        </div>

        

                        {/* Social Media Links */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 dark:bg-gray-900 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 dark:text-white">Connect on Social Media</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <a
                                    href="#"
                                    target=""
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                >
                                    <Twitter className="text-gray-700 mr-3 dark:text-white" size={24} />
                                    <span className="font-semibold text-gray-900 dark:text-white">Twitter</span>
                                </a>
                                <a
                                    href="https://www.linkedin.com/in/003va/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                >
                                    <Linkedin className="text-blue-700 mr-3 dark:text-blue-500" size={24} />
                                    <span className="font-semibold text-gray-900 dark:text-white">LinkedIn</span>
                                </a>
                                <a
                                    href="https://github.com/MastMaula1017"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                >
                                    <Github className="text-gray-900 mr-3 dark:text-white" size={24} />
                                    <span className="font-semibold text-gray-900 dark:text-white">GitHub</span>
                                </a>
                                <a
                                    href="#"
                                    target=""
                                    rel="noopener noreferrer"
                                    className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700/50"
                                >
                                    <Instagram className="text-pink-600 mr-3 dark:text-pink-500" size={24} />
                                    <span className="font-semibold text-gray-900 dark:text-white">Instagram</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Contact Form */}
                    <div className="relative">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
