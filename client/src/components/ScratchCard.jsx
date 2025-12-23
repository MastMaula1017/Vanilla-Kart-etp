import { useRef, useEffect, useState } from 'react';
import axios from '../utils/axios';
import { useAuth } from '../context/AuthContext';
import { Loader, Copy, CheckCircle, X } from 'lucide-react';
import confetti from 'canvas-confetti';

const ScratchCard = ({ onClose, onReveal, className = "" }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const { data } = await axios.get('/coupons/random');
        setCoupon(data);
      } catch (err) {
        console.error("Failed to fetch coupon:", err);
        setError("No lucky coupons available right now. Try again later!");
      } finally {
        setLoading(false);
      }
    };

    fetchCoupon();
  }, []);

  useEffect(() => {
    if (!loading && !error && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      // Set canvas size to match parent size exactly
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      // Fill with gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#9ca3af'); // gray-400
      gradient.addColorStop(0.5, '#d1d5db'); // gray-300
      gradient.addColorStop(1, '#9ca3af');
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add text "Scratch Here!"
      ctx.fillStyle = '#4b5563'; // gray-600
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Scratch Here!', canvas.width / 2, canvas.height / 2);
      
      // Add subtle pattern or glint
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(255,255,255,0.4)';
      ctx.lineWidth = 2;
      for(let i=0; i<canvas.width; i+=20) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i-50, canvas.height);
          ctx.stroke();
      }
    }
  }, [loading, error]);

  const getMousePos = (canvas, evt) => {
    const rect = canvas.getBoundingClientRect();
    const clientX = evt.clientX || (evt.touches && evt.touches[0].clientX);
    const clientY = evt.clientY || (evt.touches && evt.touches[0].clientY);
    
    if (!clientX || !clientY) return { x: 0, y: 0 };
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const scratch = (x, y) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 25, 0, 2 * Math.PI);
    ctx.fill();

    checkReveal();
  };

  const checkReveal = () => {
    if (revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // We throttle this check ideally, but for now purely on every scratch is expensive? 
    // Optimized: Only check every 10th pixel or so, but `getImageData` is the heavy part.
    // Let's do it less frequently or just assume after X events? 
    // Better: Just check center point or a few points? No, user might scratch corners.
    
    // Simple approach: Check just a grid of points
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    // Check 10x10 grid points
    let clearedPoints = 0;
    const rows = 10;
    const cols = 10;
    
    // Note: getPixel data might still be slow if called every move. 
    // Let's use a throttle logic or just check on mouseUp?
    // User wants "Scratch to Win", visual feedback is key.
    
    // Let's stick to ImageData but maybe smaller area logic?
    // Actually, simple counter of "scratch distance" might be enough to guess?
    // No, let's use the real pixels on MouseUp for performance, 
    // and maybe every 20 moves during move.
  };
  
  // Actually implementing the check inside scratch is fine for modern devices if not too high res.
  // We'll trust the browser. 
  
  // Re-implementing a safer checkReveal that doesn't lag
  
  const handleRevealLogic = () => {
      if (revealed) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      let alphaSum = 0; // Sum of alpha channel
      
      // Check every 16th pixel (stride of 4 in each dimension approx) for speed
      for (let i = 3; i < data.length; i += 64) {
          alphaSum += data[i];
      }
      
      const maxAlpha = (data.length / 64) * 255;
      const currentAlpha = alphaSum;
      const percentage = 1 - (currentAlpha / maxAlpha);

      if (percentage > 0.4) { // 40% cleared
          setRevealed(true);
          if (onReveal) onReveal();
          
          // Send Notification
          if (user && coupon) {
              axios.post('/notifications', {
                  recipient: user._id, // Self-notification
                  message: `🎉 Congratulations! You won a coupon: ${coupon.code}. Use it for ${coupon.discountType === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`} OFF!`,
                  type: 'system',
                  link: '/experts' // Redirect to experts page to use it
              }).catch(err => console.error("Failed to send notification", err));
          }

          canvas.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
          canvas.style.opacity = '0';
          canvas.style.transform = 'scale(1.1)';
          setTimeout(() => {
             if(canvas) canvas.style.display = 'none';
             triggerConfetti();
          }, 600);
      }
  }

  const triggerConfetti = () => {
      const duration = 2000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7', '#ec4899', '#facc15']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
           colors: ['#6366f1', '#a855f7', '#ec4899', '#facc15']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
  };

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const { x, y } = getMousePos(canvasRef.current, e);
    scratch(x, y);
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;
    const { x, y } = getMousePos(canvasRef.current, e);
    scratch(x, y);
    // Optimization: Check reveal only occasionally if needed, but here we do it on MouseUp mainly?
    // Let's do it here every time, optimistically assuming user isn't on a potato.
    // If it lags, we move it to MouseUp.
    handleRevealLogic(); 
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const copyToClipboard = () => {
      if (!coupon) return;
      navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
      <div className={`flex items-center justify-center bg-white dark:bg-zinc-800 rounded-2xl shadow-xl border border-gray-100 dark:border-zinc-700 w-80 h-48 animate-pulse ${className}`}>
         <Loader className="animate-spin text-indigo-500" />
      </div>
  );

  if (error) return null; // Or return a simple message component

  return (
    <div className={`relative w-80 h-48 rounded-2xl overflow-hidden shadow-2xl transform transition-all hover:scale-105 select-none ${className}`}>
       {/* Background (Reward) */}
       <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-[3px]">
           <div className="h-full w-full bg-white dark:bg-zinc-900 rounded-[14px] flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
               {/* Decorative background elements */}
               <div className="absolute top-0 left-0 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl -translate-x-10 -translate-y-10"></div>
               <div className="absolute bottom-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl translate-x-10 translate-y-10"></div>
               
               <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 z-10">Congratulations!</h3>
               <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-3 z-10 drop-shadow-sm">
                   {coupon.discountType === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
               </div>
               
               <div className="bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 w-full rounded-xl p-1.5 flex items-center shadow-inner z-10">
                   <code className="text-xl font-mono font-bold text-gray-800 dark:text-white flex-1 text-center tracking-wider">{coupon.code}</code>
                   <button 
                       onClick={copyToClipboard}
                       className={`p-2 rounded-lg transition-colors ${copied ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-white dark:bg-zinc-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-600'}`}
                       title="Copy Code"
                   >
                       {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                   </button>
               </div>
               
               <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 z-10">Valid for your next session</p>
           </div>
       </div>

       {/* Overlay (Canvas) */}
       <canvas
         ref={canvasRef}
         className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none z-20"
         onMouseDown={handleMouseDown}
         onMouseMove={handleMouseMove}
         onMouseUp={handleMouseUp}
         onMouseLeave={handleMouseUp}
         onTouchStart={handleMouseDown}
         onTouchMove={handleMouseMove}
         onTouchEnd={handleMouseUp}
       />
       
       {onClose && (
           <button 
               onClick={onClose}
               className="absolute top-2 right-2 w-7 h-7 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full text-white/70 hover:text-white flex items-center justify-center transition-all z-30"
           >
               <X size={16} />
           </button>
       )}
    </div>
  );
};

export default ScratchCard;
