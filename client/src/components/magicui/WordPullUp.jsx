import { useRef, useEffect } from "react";

export default function WordPullUp({ words, className = "" }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Simple staggered animation using native DOM API to avoid Framer Motion bloat if not needed
    // or just use CSS animations. 
    // Let's use a simple CSS keyframe injection approach for simplicity and performance
    const spans = container.querySelectorAll('span');
    
    spans.forEach((span, i) => {
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `opacity 0.5s ease-out ${i * 0.1}s, transform 0.5s ease-out ${i * 0.1}s`;
        
        // Trigger animation
        requestAnimationFrame(() => {
          setTimeout(() => {
             span.style.opacity = '1';
             span.style.transform = 'translateY(0)';
          }, 50);
        });
    });

  }, [words]);

  return (
    <div ref={containerRef} className={className}>
      {words.split(" ").map((word, i) => (
        <span key={i} className="inline-block mr-[0.25em]">
          {word}
        </span>
      ))}
    </div>
  );
}
