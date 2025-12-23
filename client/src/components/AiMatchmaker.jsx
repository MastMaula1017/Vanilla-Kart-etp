
import { useState, useRef, useEffect } from 'react';
import axios from '../utils/axios';
import { MessageSquare, Send, X, Bot, User, Sparkles, ChevronRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AiMatchmaker = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: "Hi! I'm your AI Expert Matchmaker. I can help you find the perfect mentor. First, what specific area do you need help with?",
      type: 'question',
      options: ['Career Guidance', 'Technical Skills', 'Business Strategy', 'Health & Wellness', 'Other']
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [step, setStep] = useState(1); // 1: Category, 2: Description, 3: Budget, 4: Results
  const [formData, setFormData] = useState({ category: '', problem: '', budget: '' });
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text = inputText) => {
    if (!text.trim()) return;

    // Add User Message
    const userMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    
    // Process based on current step
    setTimeout(async () => {
        if (step === 1) {
            setFormData(prev => ({ ...prev, category: text }));
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Great! Can you describe your specific problem or goal in a few sentences?",
                type: 'text'
            }]);
            setStep(2);
        } else if (step === 2) {
            setFormData(prev => ({ ...prev, problem: text }));
            setMessages(prev => [...prev, {
                id: Date.now() + 1,
                sender: 'bot',
                text: "Got it. Lastly, do you have a budget preference?",
                type: 'options',
                options: ['Low (< ₹500/hr)', 'Medium (₹500 - ₹1500)', 'High (> ₹1500)', 'No Preference']
            }]);
            setStep(3);
        } else if (step === 3) {
            // Map budget text to internal value
            let budgetVal = '';
            if (text.includes('Low')) budgetVal = 'low';
            else if (text.includes('Medium')) budgetVal = 'medium';
            else if (text.includes('High')) budgetVal = 'high';
            
            const finalData = { ...formData, budget: budgetVal };
            setFormData(finalData);
            
            // Fetch Recommendations
            setLoading(true);
            try {
                const { data } = await axios.post('/experts/match', finalData);
                setRecommendations(data);
                
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: `I found ${data.length} experts who look like a great match for you!`,
                    type: 'results', 
                    data: data
                }]);
            } catch (error) {
                setMessages(prev => [...prev, {
                    id: Date.now() + 1,
                    sender: 'bot',
                    text: "I'm sorry, I ran into an issue finding experts. Please try browsing the list manually.",
                    type: 'error'
                }]);
            } finally {
                setLoading(false);
                setStep(4);
            }
        }
    }, 600); // Simulate typing delay
  };

  const handleOptionClick = (option) => {
      handleSend(option);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
        <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-48px)] h-[600px] max-h-[80vh] bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-zinc-800 flex flex-col overflow-hidden z-[100]"
        >
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-white/20 rounded-full">
                        <Sparkles size={18} />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">AI Matchmaker</h3>
                        <p className="text-xs text-indigo-200">Help me choose</p>
                    </div>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-zinc-950/50">
                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] rounded-2xl p-3 text-sm ${
                            msg.sender === 'user' 
                                ? 'bg-indigo-600 text-white rounded-br-none' 
                                : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 shadow-sm border border-gray-100 dark:border-zinc-700 rounded-bl-none'
                        }`}>
                            {msg.text}
                            
                            {/* Options Buttons */}
                            {msg.options && step < 4 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {msg.options.map(opt => (
                                        <button 
                                            key={opt} 
                                            onClick={() => handleOptionClick(opt)}
                                            className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 text-xs font-bold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors border border-indigo-100 dark:border-indigo-500/20"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Results Cards */}
                            {msg.type === 'results' && msg.data && (
                                <div className="mt-4 space-y-3">
                                    {msg.data.length === 0 ? (
                                        <p className="text-xs text-gray-500 italic">No exact matches found. Try broadening your problem description.</p>
                                    ) : (
                                        msg.data.map(expert => (
                                            <div key={expert._id} className="bg-gray-50 dark:bg-zinc-900 rounded-xl p-3 border border-gray-200 dark:border-zinc-700 hover:border-indigo-500 transition-colors cursor-pointer group" onClick={() => navigate(`/experts/${expert._id}`)}>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-sm shrink-0">
                                                        {expert.name[0]}
                                                    </div>
                                                    <div className="overflow-hidden">
                                                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{expert.name}</h4>
                                                        <p className="text-xs text-gray-500 truncate">{expert.expertProfile?.specialization}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Match: {expert.matchScore * 2}%</span>
                                                    <button className="text-xs flex items-center gap-1 text-gray-400 group-hover:text-indigo-500 transition-colors">
                                                        View <ChevronRight size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <button 
                                        onClick={() => {
                                            setMessages(prev => [...prev, { id: Date.now(), sender: 'bot', text: 'Resetting...', type: 'text' }]);
                                            setTimeout(() => {
                                                setStep(1);
                                                setMessages([{ id: 1, sender: 'bot', text: "Let's try again. What area do you need help with?", options: ['Career Guidance', 'Technical Skills', 'Business Strategy', 'Health & Wellness', 'Other'] }]);
                                            }, 500);
                                        }}
                                        className="w-full py-2 mt-2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border-t border-gray-100 dark:border-zinc-700"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white dark:bg-zinc-800 p-3 rounded-2xl rounded-bl-none shadow-sm">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {step < 4 && (
                <div className="p-3 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800">
                    <div className="relative flex items-center">
                        <input 
                            type="text" 
                            className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors dark:text-white"
                            placeholder="Type your answer..."
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={() => handleSend()}
                            className="absolute right-2 p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}
        </motion.div>
    </AnimatePresence>
  );
};

export default AiMatchmaker;
