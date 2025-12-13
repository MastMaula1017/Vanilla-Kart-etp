import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

import SpotlightCard from './SpotlightCard';

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    }, 1500);
  };

  return (
    <SpotlightCard 
      className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-800"
      spotlightColor="rgba(168, 85, 247, 0.2)"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">Still have questions?</h3>
      <p className="text-gray-600 mb-6 dark:text-gray-400">Drop us a message and we'll get back to you ASAP.</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Name</label>
          <input
            type="text"
            id="name"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email Address</label>
          <input
            type="email"
            id="email"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="john@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Message</label>
          <textarea
            id="message"
            rows="4"
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-none"
            placeholder="How can we help you?"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center transition-all ${
            status === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-primary text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl'
          }`}
        >
          {status === 'submitting' ? (
            <span className="animate-pulse">Sending...</span>
          ) : status === 'success' ? (
            <>
              <CheckCircle className="mr-2" size={20} />
              Message Sent!
            </>
          ) : (
            <>
              <Send className="mr-2" size={20} />
              Send Message
            </>
          )}
        </button>
      </form>
    </SpotlightCard>
  );
};

export default ContactForm;
