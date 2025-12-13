import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import SpotlightCard from '../components/SpotlightCard';
import { 
  Star, 
  Clock, 
  MapPin, 
  Shield, 
  MessageSquare, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  User,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const ExpertProfile = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [expert, setExpert] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [notes, setNotes] = useState('');
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(true);

  useEffect(() => {
    const fetchExpert = async () => {
      try {
        const { data } = await axios.get(`/experts/${id}`);
        setExpert(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchExpert();
    
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`/reviews/${id}`);
        setReviews(data);
      } catch (error) {
        console.error(error);
      } finally {
        setReviewLoading(false);
      }
    };
    fetchReviews();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/reviews', {
        expertId: id,
        rating,
        comment
      });
      setReviews([...reviews, { ...data, customer: { name: user.name } }]); // Optimistic update
      setComment('');
      setRating(5);
    } catch (error) {
       alert(error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await axios.post('/appointments', {
        expertId: id,
        date,
        startTime,
        endTime,
        notes
      });
      alert('Appointment booked successfully!');
      navigate('/dashboard');
    } catch (error) {
      alert('Error booking appointment');
    }
  };

  if (loading) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
  
  if (!expert) return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-gray-500">
      <User size={64} className="mb-4 text-gray-300" />
      <p className="text-xl font-medium">Expert not found</p>
      <button onClick={() => navigate('/experts')} className="mt-4 text-indigo-600 hover:underline">Go back to experts</button>
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      {/* Premium Header with Noise Texture */}
      <div className="relative h-64 w-full overflow-hidden bg-[#0A0A0A]">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0A0A0A] to-[#0A0A0A]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0A0A0A]/90"></div>
         
         <div className="container mx-auto px-6 h-full flex items-center relative z-10">
            <button onClick={() => navigate('/experts')} className="absolute top-8 left-6 md:left-0 text-white/50 hover:text-white transition-colors flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>
         </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Profile & Content */}
            <div className="flex-1">
                {/* Profile Card */}
                <SpotlightCard className="p-8 mb-8" spotlightColor="rgba(255, 255, 255, 0.1)">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-4 border-[#0A0A0A] shadow-2xl flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden">
                             <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
                             {expert.name[0]}
                        </div>
                        <div className="flex-1 mb-2">
                             <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-4xl font-bold text-white tracking-tight">{expert.name}</h1>
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                                    <CheckCircle size={12} className="mr-1" /> Verified
                                </span>
                             </div>
                             <p className="text-indigo-400 font-medium text-lg flex items-center">
                                {expert.expertProfile.specialization}
                             </p>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                            <Star fill="#EAB308" className="text-yellow-500" size={20} />
                            <span className="font-bold text-white">4.9</span>
                            <span className="text-zinc-500 text-sm">(12 reviews)</span>
                        </div>
                    </div>
                </SpotlightCard>

                {/* About Section */}
                <div className="space-y-8">
                    <section>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            About
                        </h3>
                        <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                             <p>{expert.expertProfile.bio || "No bio provided."}</p>
                        </div>
                    </section>

                    {/* Reviews */}
                    <section>
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Expert Reviews</h3>
                        </div>

                        {user && user.role === 'customer' && (
                           <div className="mb-10 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6">
                             <h4 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Leave a Review</h4>
                             <form onSubmit={handleReviewSubmit}>
                               <div className="mb-4">
                                 <div className="flex gap-2">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                     <button
                                       key={star}
                                       type="button"
                                       onClick={() => setRating(star)}
                                       className={`p-1 transition-transform hover:scale-110 ${rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-zinc-700'}`}
                                     >
                                       <Star fill="currentColor" size={28} />
                                     </button>
                                   ))}
                                 </div>
                               </div>
                               <textarea
                                 className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:text-white"
                                 placeholder="Share your experience..."
                                 rows="3"
                                 value={comment}
                                 onChange={(e) => setComment(e.target.value)}
                                 required
                               ></textarea>
                               <div className="mt-4 flex justify-end">
                                 <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors">
                                   Post Review
                                 </button>
                               </div>
                             </form>
                           </div>
                         )}

                        <div className="space-y-4">
                           {reviews.length === 0 ? (
                                <p className="text-gray-500">No reviews yet.</p>
                           ) : (
                               reviews.map((review) => (
                                   <div key={review._id} className="bg-white dark:bg-zinc-900/50 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800/50">
                                       <div className="flex justify-between items-start mb-2">
                                           <div className="font-bold text-gray-900 dark:text-white">{review.customer?.name || 'Anonymous user'}</div>
                                           <div className="flex text-yellow-400">
                                               {[...Array(5)].map((_, i) => (
                                                   <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i < review.rating ? "text-yellow-400" : "text-gray-700"} />
                                               ))}
                                           </div>
                                       </div>
                                       <p className="text-gray-600 dark:text-gray-400">{review.comment}</p>
                                   </div>
                               ))
                           )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Column: Booking Card */}
            <div className="lg:w-96">
                <div className="sticky top-8">
                    <SpotlightCard className="p-6 md:p-8" spotlightColor="rgba(168, 85, 247, 0.2)">
                        <div className="flex items-baseline justify-between mb-8 pb-6 border-b border-gray-100 dark:border-white/10">
                            <div>
                                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Hourly Rate</span>
                                <div className="flex items-baseline text-gray-900 dark:text-white mt-1">
                                    <span className="text-4xl font-bold">₹{expert.expertProfile.hourlyRate}</span>
                                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">/hr</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleBook} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                                    <input 
                                       type="date"
                                       required
                                       className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 pl-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                       value={date}
                                       min={new Date().toISOString().split('T')[0]}
                                       onChange={(e) => setDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Start</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                           type="time"
                                           required
                                           className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 pl-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                           value={startTime}
                                           onChange={(e) => setStartTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">End</label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                                        <input 
                                           type="time"
                                           required
                                           className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2.5 pl-10 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
                                           value={endTime}
                                           onChange={(e) => setEndTime(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                                <textarea
                                   className="w-full bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all resize-none min-h-[100px]"
                                   placeholder="What would you like to discuss?"
                                   value={notes}
                                   onChange={(e) => setNotes(e.target.value)}
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transform transition hover:-translate-y-0.5 relative overflow-hidden group">
                                <span className="relative z-10 flex items-center justify-center">
                                    Confirm Booking <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </button>
                        </form>
                    </SpotlightCard>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
