import { Link } from 'react-router-dom';
import { Twitter, Linkedin, Github, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 dark:bg-gray-950 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="text-2xl font-bold text-primary">ConsultPro</Link>
            <p className="text-gray-500 leading-relaxed dark:text-gray-400">
              Connecting you with top-tier verified experts for instant 1:1 guidance.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Twitter size={20} />
              </a>
              <a href="https://www.linkedin.com/in/003va/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="https://github.com/MastMaula1017" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 dark:text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/experts" className="hover:text-primary transition-colors">Browse Experts</Link></li>
              <li><Link to="/get-the-app" className="hover:text-primary transition-colors">Get the app</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/become-expert" className="hover:text-primary transition-colors">Become an Advisor</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 dark:text-white">Company</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

           {/* Newsletter / Legal */}
           <div>
            <h4 className="font-bold text-gray-900 mb-6 dark:text-white">Legal</h4>
            <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center dark:border-gray-800">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} ConsultPro Inc. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
             <span className="text-sm text-gray-400 flex items-center">
               <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
               All Systems Operational
             </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
