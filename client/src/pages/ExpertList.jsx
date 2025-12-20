import { useState, useEffect, useCallback } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';
import SpotlightCard from '../components/SpotlightCard';
import WordRotate from '../components/magicui/WordRotate';
import { Search, MapPin, Star, ArrowRight, CheckCircle, Filter, X } from 'lucide-react';

const ExpertList = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    specialization: '',
    day: '', // 'Monday', etc.
    rating: ''
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch Experts
  const fetchExperts = useCallback(async () => {
    setLoading(true);
    try {
        const queryParams = new URLSearchParams();
        if (debouncedSearch) queryParams.append('search', debouncedSearch);
        if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
        if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
        if (filters.specialization) queryParams.append('specialization', filters.specialization);
        if (filters.day) queryParams.append('day', filters.day);
        if (filters.rating) queryParams.append('rating', filters.rating);

        const { data } = await axios.get(`/experts?${queryParams.toString()}`);
        setExperts(data);
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  }, [debouncedSearch, filters]);

  useEffect(() => {
    fetchExperts();
  }, [fetchExperts]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
        minPrice: '',
        maxPrice: '',
        specialization: '',
        day: '',
        rating: '' 
    });
    setSearchTerm('');
  };

  const categories = [
    "Software Development", "Marketing", "Business", "Finance", "Legal", "Design", "Health", "Career Coaching"
  ];

  const days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold mb-6 flex flex-col items-center justify-center gap-2">
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white">
            Find Your
           </span>
           <WordRotate 
             className="text-4xl md:text-5xl font-bold text-indigo-600 dark:text-indigo-400"
             words={["Expert", "Mentor", "Guide", "Coach", "Advisor"]} 
           />
        </h2>
      </div>

      <div className="sticky top-24 max-w-2xl mx-auto mb-12 group z-30">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center p-2 border border-gray-100 dark:border-white/10">
            <Search className="ml-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={24} />
            <input 
                type="text" 
                placeholder="Search by name, skill, or role..." 
                className="w-full px-4 py-3 bg-transparent outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            {/* Filter Toggle Button */}
            <div className="relative">
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium ${isFilterOpen ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
                >
                    <Filter size={20} />
                    <span className="hidden sm:inline">Filters</span>
                </button>

                {/* Filter Dropdown */}
                {isFilterOpen && (
                    <div className="absolute right-0 top-full mt-4 w-80 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-xl p-6 rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Filter Experts</h3>
                            <button onClick={clearFilters} className="text-xs text-indigo-500 hover:underline font-medium">Reset All</button>
                        </div>

                        <div className="space-y-6">
                             {/* Price Range */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Hourly Rate</h4>
                                <div className="flex items-center gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Min" 
                                            className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-lg text-sm dark:text-white outline-none focus:border-indigo-500 transition-colors"
                                            value={filters.minPrice}
                                            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                                        />
                                    </div>
                                    <span className="text-gray-400">-</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                                        <input 
                                            type="number" 
                                            placeholder="Max" 
                                            className="w-full pl-6 pr-2 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-lg text-sm dark:text-white outline-none focus:border-indigo-500 transition-colors"
                                            value={filters.maxPrice}
                                            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Specialization</h4>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-lg text-sm dark:text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                    value={filters.specialization}
                                    onChange={(e) => handleFilterChange('specialization', e.target.value)}
                                >
                                    <option value="">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Availability */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Availability</h4>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-lg text-sm dark:text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                    value={filters.day}
                                    onChange={(e) => handleFilterChange('day', e.target.value)}
                                >
                                    <option value="">Any Day</option>
                                    {days.map(day => (
                                        <option key={day} value={day}>{day}</option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Rating Filter */}
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">Rating</h4>
                                <select 
                                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-white/10 rounded-lg text-sm dark:text-white outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                                    value={filters.rating}
                                    onChange={(e) => handleFilterChange('rating', e.target.value)}
                                >
                                    <option value="">Any Rating</option>
                                    <option value="4.5">4.5+ Stars</option>
                                    <option value="4">4+ Stars</option>
                                    <option value="3">3+ Stars</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Results Grid - Full Width */}
        <div className="w-full">


             {loading ? (
                <div className="min-h-[40vh] flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
             ) : experts.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-200 dark:border-zinc-800">
                    <p className="text-gray-500 text-lg font-medium">No experts found matching your criteria.</p>
                    <button onClick={clearFilters} className="mt-4 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full font-bold text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                        Clear all filters
                    </button>
                </div>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                    {experts.map(expert => (
                    <SpotlightCard key={expert._id} className="h-full flex flex-col group bg-white dark:bg-zinc-900 border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-300" spotlightColor="rgba(99, 102, 241, 0.15)">
                        <div className="p-8 flex flex-col h-full relative z-10">
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                            <div className="relative">
                                {expert.profileImage ? (
                                    <img 
                                        src={expert.profileImage} 
                                        alt={expert.name} 
                                        className="w-16 h-16 rounded-2xl object-cover object-top shadow-md ring-4 ring-white dark:ring-zinc-900"
                                    />
                                ) : (
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 flex items-center justify-center text-2xl font-bold text-indigo-600 dark:text-indigo-300 shadow-inner ring-4 ring-white dark:ring-zinc-900">
                                    {expert.name[0]}
                                    </div>
                                )}
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-zinc-900 rounded-full"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-bold text-xl text-gray-900 dark:text-white group-hover:text-indigo-500 transition-colors line-clamp-1">
                                        {expert.name}
                                    </h3>
                                    {expert.expertProfile?.verificationStatus === 'verified' && (
                                        <div className="relative group/verify">
                                            <CheckCircle size={16} className="text-blue-500 fill-blue-500 text-white flex-shrink-0 cursor-help" />
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs font-bold rounded opacity-0 group-hover/verify:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                Verified Expert
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 dark:text-indigo-400 mt-1">
                                {expert.expertProfile.specialization}
                                </p>
                            </div>
                            </div>
                            <div className="flex flex-col items-end pl-4">
                            <span className="font-bold text-xl text-gray-900 dark:text-white">₹{expert.expertProfile.hourlyRate}</span>
                            <span className="text-xs font-medium text-gray-400">per hour</span>
                            </div>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-8 line-clamp-2 text-sm leading-relaxed flex-grow font-medium">
                            {expert.expertProfile.bio || "Availability for 1:1 mentorship and guidance."}
                        </p>

                        <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between mt-auto">
                            <div className="flex items-center space-x-1.5 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1.5 rounded-lg border border-yellow-100 dark:border-yellow-900/30">
                            <Star fill="currentColor" className="text-yellow-500" size={14} />
                            <span className="font-bold text-sm text-yellow-700 dark:text-yellow-500">
                                {expert.expertProfile?.averageRating || '0.0'}
                                <span className="ml-1 text-xs text-yellow-600/70 dark:text-yellow-500/70">
                                    ({expert.expertProfile?.totalReviews || 0} reviews)
                                </span>
                            </span>
                            </div>
                            
                            <Link 
                            to={`/experts/${expert._id}`} 
                            className="inline-flex items-center space-x-2 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors group/link"
                            >
                            <span>View Profile</span>
                            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                        </div>
                    </SpotlightCard>
                    ))}
                </div>
             )}
      </div>
    </div>
  );
};

export default ExpertList;
