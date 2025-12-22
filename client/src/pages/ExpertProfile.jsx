import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../utils/axios';
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
  ArrowRight,
  Loader,
  AlertCircle,
  X,
  Trash2,
  Edit2
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
  const [bookedSlots, setBookedSlots] = useState([]);
  
  // Reviews State
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewLoading, setReviewLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [editComment, setEditComment] = useState('');
  const [editRating, setEditRating] = useState(5);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(null);
  const [isVerifyingCoupon, setIsVerifyingCoupon] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [notification, setNotification] = useState(null); // { type: 'success' | 'error', message: '' }

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

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

  const fetchBookedSlots = async (selectedDate) => {
      if (!selectedDate || !id) return;
      try {
          const { data } = await axios.get(`/appointments/booked-slots?expertId=${id}&date=${selectedDate}`);
          setBookedSlots(data);
      } catch (error) {
          console.error("Error fetching booked slots:", error);
      }
  };

  useEffect(() => {
    fetchExpert();
    fetchReviews();
  }, [id]);

  useEffect(() => {
      if (date) {
          setStartTime('');
          setEndTime('');
          fetchBookedSlots(date);
      }
  }, [date, id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/reviews', {
        expertId: id,
        rating,
        comment
      });
      const newReview = { ...data, customer: { _id: user._id, name: user.name } };
      setReviews([...reviews, newReview]); 
      
      // Update local expert stats immediately
      setExpert(prev => {
          const currentTotal = prev.expertProfile.totalReviews || 0;
          const currentAvg = prev.expertProfile.averageRating || 0;
          const newTotal = currentTotal + 1;
          const newAvg = ((currentAvg * currentTotal) + rating) / newTotal;
          
          return {
              ...prev,
              expertProfile: {
                  ...prev.expertProfile,
                  totalReviews: newTotal,
                  averageRating: newAvg.toFixed(1)
              }
          };
      });

      setComment('');
      setRating(5);
      showNotification('success', 'Review posted successfully!');
    } catch (error) {
       showNotification('error', error.response?.data?.message || 'Error submitting review');
    }
  };

  const handleDeleteReview = async (reviewId) => {
      if (!window.confirm('Are you sure you want to delete this review?')) return;
      try {
          await axios.delete(`/reviews/${reviewId}`);
          setReviews(reviews.filter(r => r._id !== reviewId));
          
          // Optimistic update for stats (approximate, hard to get perfect without refetch but user feedback is key)
           setExpert(prev => {
              // Re-fetch expert to get accurate stats or just decrement count
              // Best to just re-fetch expert profile silently?
              // For now, simpler to just notify.
              return prev; 
          });
          // Actually, let's just fetch expert again to be safe
          fetchExpert();

          showNotification('success', 'Review deleted successfully');
      } catch (error) {
          showNotification('error', error.response?.data?.message || 'Error deleting review');
      }
  };

  const startEditing = (review) => {
      setEditingReview(review._id);
      setEditComment(review.comment);
      setEditRating(review.rating);
  };

  const saveEditReview = async (reviewId) => {
      try {
          const { data } = await axios.put(`/reviews/${reviewId}`, {
              rating: editRating,
              comment: editComment
          });
          
          setReviews(reviews.map(r => r._id === reviewId ? { ...r, rating: editRating, comment: editComment } : r));
          setEditingReview(null);
          
          // Re-fetch expert to update stats
          fetchExpert();
          
          showNotification('success', 'Review updated successfully');
      } catch (error) {
          console.error("Edit Review Error Details:", error);
          showNotification('error', error.response?.data?.message || 'Error updating review');
      }
  };
  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };



  const generateTimeSlots = () => {
      if (!expert || !date) return [];
      
      const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
      const dayRule = expert.expertProfile.availability?.find(d => d.day === dayName);

      if (!dayRule || !dayRule.isActive || !dayRule.startTime || !dayRule.endTime) return [];

      const slots = [];
      const [startHour, startMin] = dayRule.startTime.split(':').map(Number);
      const [endHour, endMin] = dayRule.endTime.split(':').map(Number);

      let currentHour = startHour;
      let currentMin = startMin;

      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
          // Format Start Time
          const slotStart = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
          
          // Calculate End Time (Add 1 hour)
          let endH = currentHour + 1;
          let endM = currentMin;
          const slotEnd = `${endH.toString().padStart(2, '0')}:${endM.toString().padStart(2, '0')}`;

          // Check if this slot exceeds the expert's end time
          if (endH > endHour || (endH === endHour && endM > endMin)) {
              break; 
          }

          // Check overlap with booked slots
          const isBooked = bookedSlots.some(booked => {
             // Simple overlap check for exact matches or overlaps
             // Since we force 1 hour slots, exact match on startTime is usually enough if grid is aligned
             // But let's stay robust: (StartA < EndB) and (EndA > StartB)
             return (slotStart < booked.endTime && slotEnd > booked.startTime);
          });
          
          // Check if slot is in the past (if today)
          let isPast = false;
          const today = new Date();
          const selectedDate = new Date(date);
          if (selectedDate.toDateString() === today.toDateString()) {
              const nowMinutes = today.getHours() * 60 + today.getMinutes();
              const slotStartMinutes = currentHour * 60 + currentMin;
              if (slotStartMinutes <= nowMinutes) {
                  isPast = true;
              }
          }

          slots.push({
              start: slotStart,
              end: slotEnd,
              available: !isBooked && !isPast
          });

          // Increment by 1 hour
          currentHour += 1;
      }

      return slots;
  };

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (!startTime || !endTime) {
        showNotification('error', 'Please select a time slot.');
        return;
    }
    
    setBookingLoading(true);

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');

    if (!res) {
      showNotification('error', 'Razorpay SDK failed to load. Are you online?');
      setBookingLoading(false);
      return;
    }

    try {
      // 1. Create Order
      const amount = expert.expertProfile.hourlyRate; // Assuming hourly rate is the total cost for now
      const { data: order } = await axios.post('/payment/create-order', { 
        amount,
        couponCode: discountApplied ? couponCode : undefined
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount,
        currency: order.currency,
        name: "ConsultPro",
        description: `Consultation with ${expert.name}`,
        image: "https://placehold.co/512", // TODO: Replace with actual logo URL
        order_id: order.id, 
        handler: async function (response) {
            // 2. Verified Payment & Create Appointment
            try {
                await axios.post('/appointments', {
                    expertId: id,
                    date,
                    startTime,
                    endTime,
                    payment: {
                        razorpayOrderId: response.razorpay_order_id,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpaySignature: response.razorpay_signature,
                        amount: order.amount / 100 // Use the actual paid amount (converted from paise)
                    },
                    couponCode: discountApplied ? couponCode : undefined
                });
                showNotification('success', 'Payment Successful & Appointment Booked!');
                setTimeout(() => navigate('/dashboard'), 2000);
            } catch (err) {
                console.error(err);
                showNotification('error', 'Payment successful but appointment creation failed. Contact support.');
            } finally {
                setBookingLoading(false);
            }
        },
        modal: {
            ondismiss: function() {
                setBookingLoading(false);
            }
        },
        prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || "9999999999" 
        },
        theme: {
            color: "#6366f1"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      showNotification('error', 'Error initiating payment');
      setBookingLoading(false);
    }
  };

  const renderBookingCard = () => (
    <div className="bg-white dark:bg-zinc-900/80 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-gray-100 dark:border-white/10 shadow-2xl">
        <div className="flex items-baseline justify-between mb-8 pb-6 border-b border-gray-100 dark:border-white/10">
            <div>
                <span className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider">Hourly Rate</span>
                <div className="flex items-baseline text-gray-900 dark:text-white mt-1">
                    <span className="text-4xl font-bold">₹{expert.expertProfile.hourlyRate}</span>
                    <span className="text-lg text-gray-500 dark:text-gray-400 ml-1">/hr</span>
                </div>
            </div>
        </div>

        {/* Availability Schedule Display */}
        {expert.expertProfile.availability && expert.expertProfile.availability.length > 0 && (
            <div className="mb-8">
                <h4 className="text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-3">Weekly Availability</h4>
                <div className="space-y-2">
                    {expert.expertProfile.availability.map((slot) => (
                        <div key={slot.day} className="flex justify-between items-center text-sm">
                            <span className={`font-medium ${slot.isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
                                {slot.day.slice(0, 3)}
                            </span>
                            {slot.isActive ? (
                                <span className="text-gray-600 dark:text-gray-300">
                                    {slot.startTime} - {slot.endTime}
                                </span>
                            ) : (
                                <span className="text-gray-400 dark:text-gray-600 italic">Unavailable</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {user && expert && user._id === expert._id ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/50 rounded-xl p-6 text-center">
                <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
                <h3 className="text-lg font-bold text-yellow-800 dark:text-yellow-500 mb-2">You cannot book yourself</h3>
                <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                    As an expert, you cannot book appointments with yourself. Please view your profile as a customer using a different account to test booking.
                </p>
            </div>
        ) : (
        <form onSubmit={handleBook} className="space-y-5">
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Select Date</label>
                <div className="relative group">
                    <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" size={18} />
                    <input 
                       type="date"
                       required
                       className="w-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 pl-11 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all text-sm font-medium [color-scheme:light] dark:[color-scheme:dark]"
                       value={date}
                       min={new Date().toISOString().split('T')[0]}
                       onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Time Slot Grid */}
            {date && (
                <div>
                   <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Select Time Slot</label>
                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar p-1">
                       {generateTimeSlots().length > 0 ? (
                           generateTimeSlots().map((slot, index) => (
                               <button
                                   key={index}
                                   type="button"
                                   disabled={!slot.available}
                                   onClick={() => {
                                       setStartTime(slot.start);
                                       setEndTime(slot.end);
                                   }}
                                   className={`py-2 px-3 rounded-lg text-sm font-medium transition-all border ${
                                       startTime === slot.start
                                           ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-200 dark:ring-indigo-900'
                                           : slot.available
                                           ? 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-zinc-700 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400'
                                           : 'bg-gray-100 dark:bg-zinc-900 text-gray-400 dark:text-gray-600 border-transparent cursor-not-allowed opacity-60'
                                   }`}
                               >
                                   {slot.start}
                               </button>
                           ))
                       ) : (
                           <p className="col-span-full text-sm text-gray-500 italic">No available slots for this date.</p>
                       )}
                   </div>
                </div>
            )}
            


            {/* Coupon Input */}
             <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Coupon Code</label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        className="flex-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:text-white transition-all text-sm font-medium"
                        placeholder="Enter code"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        disabled={!!discountApplied}
                    />
                    {discountApplied ? (
                        <button
                            type="button"
                            onClick={() => {
                                setDiscountApplied(null);
                                setCouponCode('');
                            }}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-medium text-sm hover:bg-red-200"
                        >
                            Remove
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={async () => {
                                if (!couponCode) return;
                                setIsVerifyingCoupon(true);
                                try {
                                    const { data } = await axios.post('/coupons/verify', { code: couponCode });
                                    setDiscountApplied(data);
                                } catch (error) {
                                    showNotification('error', error.response?.data?.message || 'Invalid Coupon');
                                    setCouponCode('');
                                } finally {
                                    setIsVerifyingCoupon(false);
                                }
                            }}
                            disabled={isVerifyingCoupon || !couponCode}
                            className="px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-xl font-medium text-sm hover:bg-gray-300 dark:hover:bg-zinc-700 disabled:opacity-50"
                        >
                            {isVerifyingCoupon ? '...' : 'Apply'}
                        </button>
                    )}
                </div>
                {discountApplied && (
                    <p className="mt-2 text-sm text-green-600 flex items-center">
                        <CheckCircle size={14} className="mr-1" />
                        Coupon applied! You save {discountApplied.discountType === 'percentage' ? `${discountApplied.value}%` : `₹${discountApplied.value}`}
                    </p>
                )}
            </div>

            <button 
                type="submit" 
                disabled={bookingLoading}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transform transition hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
            >
                <span className="relative z-10 flex items-center justify-center">
                    {bookingLoading ? (
                        <>
                            <Loader size={20} className="animate-spin mr-2" />
                            Processing...
                        </>
                    ) : (
                        <>
                            Confirm Booking <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </span>
            </button>
        </form>
        )}
    </div>
  );

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
      <div className="relative h-56 md:h-64 w-full overflow-hidden bg-[#0A0A0A]">
         {/* Notification Toast */}
         {notification && (
            <div className={`fixed top-24 right-4 z-50 max-w-md w-full animate-in slide-in-from-right fade-in duration-300`}>
                <div className={`flex items-start p-4 rounded-xl shadow-2xl border backdrop-blur-md ${
                    notification.type === 'success' 
                    ? 'bg-green-500/10 border-green-500/20 text-green-500' 
                    : 'bg-red-500/10 border-red-500/20 text-red-500'
                }`}>
                    {notification.type === 'success' ? <CheckCircle className="flex-shrink-0 mt-0.5" size={20} /> : <AlertCircle className="flex-shrink-0 mt-0.5" size={20} />}
                    <div className="ml-3 flex-1">
                        <h3 className="text-sm font-bold">{notification.type === 'success' ? 'Success' : 'Error'}</h3>
                        <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                    </div>
                    <button onClick={() => setNotification(null)} className="ml-3 opacity-70 hover:opacity-100 transition-opacity">
                        <X size={18} />
                    </button>
                </div>
            </div>
         )}

         {expert.coverImage ? (
            <div className="absolute inset-0">
                <img src={expert.coverImage} alt="Cover" className="w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-transparent"></div>
            </div>
         ) : (
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-[#0A0A0A] to-[#0A0A0A]"></div>
         )}
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-[#0A0A0A]/90"></div>
         
         <div className="container mx-auto px-6 h-full flex items-center relative z-10">
            <button onClick={() => navigate('/experts')} className="absolute top-8 left-6 md:left-0 text-white/50 hover:text-white transition-colors flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
            </button>
         </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 -mt-24 md:-mt-32 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column: Profile & Content */}
            <div className="flex-1">
                {/* Profile Card */}
                <SpotlightCard className="p-8 mb-8" spotlightColor="rgba(255, 255, 255, 0.1)">
                    <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
                        <div className="w-32 h-32 rounded-3xl bg-zinc-800 border-4 border-[#0A0A0A] shadow-2xl flex items-center justify-center text-5xl font-bold text-white relative overflow-hidden">
                             {expert.profileImage ? (
                                <img src={expert.profileImage} alt={expert.name} className="w-full h-full object-cover object-top" />
                             ) : (
                                <>
                                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20"></div>
                                    {expert.name[0]}
                                </>
                             )}
                        </div>
                        <div className="flex-1 mb-2">
                             <div className="flex items-center space-x-3 mb-2">
                                <h1 className="text-4xl font-bold text-white tracking-tight">{expert.name}</h1>
                                {expert.expertProfile.verificationStatus === 'verified' && (
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-500/10 text-green-400 border border-green-500/20" title="Verified Expert">
                                        <CheckCircle size={12} className="mr-1" /> Verified
                                    </span>
                                )}

                             </div>
                             <p className="text-indigo-400 font-medium text-lg flex items-center">
                                {expert.expertProfile.specialization}
                             </p>
                        </div>
                        <div className="flex items-center space-x-1 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-md border border-white/10">
                            <Star fill="#EAB308" className="text-yellow-500" size={20} />
                            <span className="font-bold text-white">{expert.expertProfile.averageRating || 0}</span>
                            <span className="text-zinc-500 text-sm">({expert.expertProfile.totalReviews || 0} reviews)</span>
                        </div>
                    </div>
                </SpotlightCard>

                {/* Mobile Booking Card (Visible only on small screens) */}
                <div className="lg:hidden mb-8">
                    {renderBookingCard()}
                </div>

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

                        {user && user.roles?.includes('customer') && (
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

                        {!user && (
                            <div className="mb-10 p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl text-center border border-gray-200 dark:border-zinc-800">
                                <p className="text-gray-600 dark:text-gray-400 mb-4">Please log in to leave a review.</p>
                                <button onClick={() => navigate('/login')} className="px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors">
                                    Log In
                                </button>
                            </div>
                        )}
                        
                        {user && user.roles?.includes('expert') && (
                             <div className="mb-10 p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-2xl text-center border border-yellow-100 dark:border-yellow-900/20">
                                <p className="text-yellow-700 dark:text-yellow-500 font-medium">Only users with confirmed appointments can write a review.</p>
                            </div>
                        )}

                        <div className="space-y-4">
                           {reviews.length === 0 ? (
                                <p className="text-gray-500">No reviews yet.</p>
                           ) : (
                               reviews.map((review) => (
                                   <div key={review._id} className="p-6 rounded-2xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 transition-all hover:border-gray-200 dark:hover:border-zinc-700">
                                    {editingReview === review._id ? (
                                        // Edit Form
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button key={star} onClick={() => setEditRating(star)} type="button" className={`${editRating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-zinc-700'}`}>
                                                        <Star size={20} fill="currentColor" />
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                className="w-full bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                                                rows="3"
                                                value={editComment}
                                                onChange={(e) => setEditComment(e.target.value)}
                                            ></textarea>
                                            <div className="flex justify-end gap-2">
                                                <button onClick={() => setEditingReview(null)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">Cancel</button>
                                                <button onClick={() => saveEditReview(review._id)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Save</button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold">
                                                        {review.customer?.name?.charAt(0) || 'U'}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900 dark:text-white">{review.customer?.name}</h4>
                                                        <div className="flex text-yellow-400">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} size={14} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300 dark:text-zinc-700" : ""} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
                                                {review.comment}
                                            </p>
                                            
                                            {/* Action Buttons */}
                                            <div className="flex justify-end gap-2">
                                                {user && user._id === review.customer?._id && (
                                                    <button 
                                                        onClick={() => startEditing(review)}
                                                        className="p-1.5 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="Edit Review"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                )}
                                                {user && (user.roles?.includes('admin') || user.roles?.includes('moderator') || user._id === review.customer?._id) && (
                                                    <button 
                                                        onClick={() => handleDeleteReview(review._id)}
                                                        className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete Review"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                               ))
                           )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Right Column: Booking Card (Hidden on mobile, visible on lg) */}
            <div className="hidden lg:block lg:w-96">
                <div className="sticky top-8">
                   {renderBookingCard()}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
