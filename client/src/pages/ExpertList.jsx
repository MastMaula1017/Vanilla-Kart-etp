import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/SpotlightCard';
import WordRotate from '../components/magicui/WordRotate';
import { Search, MapPin, Star, ArrowRight } from 'lucide-react';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const { data } = await axios.get('/experts');
        setExperts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  const filteredExperts = experts.filter(expert => 
    expert.expertProfile.specialization.toLowerCase().includes(filter.toLowerCase()) ||
    expert.name.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 flex flex-col items-center justify-center gap-2">
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white">
            Find Your
           </span>
           <WordRotate 
             className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400"
             words={["Expert", "Mentor", "Guide", "Coach", "Advisor"]} 
           />
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10">
          Connect with top-tier professionals for instant 1:1 guidance, mentorship, and technical support.
        </p>
        
        <div className="relative max-w-xl mx-auto group">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-xl flex items-center p-2 border border-gray-100 dark:border-gray-800">
            <Search className="ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input 
              type="text" 
              placeholder="Search by name, skill, or role..." 
              className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredExperts.map(expert => (
          <SpotlightCard key={expert._id} className="h-full flex flex-col group" spotlightColor="rgba(99, 102, 241, 0.15)">
            <div className="p-6 flex flex-col h-full relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300 shadow-inner">
                      {expert.name[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors">
                      {expert.name}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-center bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded-full w-fit mt-1">
                      {expert.expertProfile.specialization}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-bold text-lg text-gray-900 dark:text-white">₹{expert.expertProfile.hourlyRate}</span>
                  <span className="text-xs text-gray-500">/hr</span>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm leading-relaxed flex-grow">
                {expert.expertProfile.bio || "No bio available. This expert specializes in providing high-quality mentorship and advice in their field."}
              </p>

              <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-1 text-yellow-500">
                  <Star fill="currentColor" size={16} />
                  <span className="font-bold text-sm text-gray-700 dark:text-gray-300">5.0</span>
                  <span className="text-xs text-gray-400">(New)</span>
                </div>
                
                <Link 
                  to={`/experts/${expert._id}`} 
                  className="inline-flex items-center space-x-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                >
                  <span>View Profile</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </div>
  );
};

export default ExpertList;
