import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';
import ScratchCard from './ScratchCard';

const GlobalScratcher = () => {
    const [showScratcher, setShowScratcher] = useState(false);
    const [scratcherUsed, setScratcherUsed] = useState(true); // Default to true to prevent flash

    useEffect(() => {
        const used = localStorage.getItem('scratcher_used');
        if (!used) {
            setScratcherUsed(false);
        }
    }, []);

    const handleReveal = () => {
        setScratcherUsed(true);
        localStorage.setItem('scratcher_used', 'true');
    };

    if (scratcherUsed) return null;

    return (
        <>
            <button 
                onClick={() => setShowScratcher(true)}
                className="fixed bottom-8 right-8 z-[100] bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform animate-bounce group"
            >
                <span className="absolute -top-2 -right-2 flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-pink-500"></span>
                </span>
                <Gift size={28} className="group-hover:rotate-12 transition-transform" />
            </button>

            {/* Scratcher Modal */}
            {showScratcher && (
                <div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowScratcher(false)}></div>
                    <div className="relative z-10 animate-in zoom-in-90 duration-300">
                        <ScratchCard 
                            onClose={() => setShowScratcher(false)} 
                            onReveal={handleReveal}
                        />
                    </div>
                </div>
            )}
        </>
    );
};

export default GlobalScratcher;
