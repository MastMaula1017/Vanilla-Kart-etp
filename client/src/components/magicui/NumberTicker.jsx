import { useEffect, useRef } from "react";

export default function NumberTicker({ value, className = "" }) {
  const ref = useRef(null);
  const motionValue = useRef(0);
  const springValue = useRef(0);

  useEffect(() => {
    const numericValue = parseInt(value.replace(/\D/g, ""), 10); // Extract number
    if (isNaN(numericValue)) return;

    const duration = 2000; // ms
    const startTime = performance.now();

    const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease out
        
        const current = Math.floor(easeOut * numericValue);
        
        if (ref.current) {
            // Keep the suffix/prefix if any (basic handling)
            // Ideally we just animate the number.
            ref.current.textContent = current.toLocaleString();
        }

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
             if (ref.current) {
                ref.current.textContent = value; // Restore full string (e.g. "500+")
            }
        }
    };

    requestAnimationFrame(animate);

  }, [value]);

  return (
    <span
      ref={ref}
      className={`inline-block tabular-nums tracking-wider ${className}`}
    >
      0
    </span>
  );
}
