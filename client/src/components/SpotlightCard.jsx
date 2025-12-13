import { useRef } from 'react';
import { Link } from 'react-router-dom';

const SpotlightCard = ({ 
  children, 
  to, 
  className = "", 
  spotlightColor = "rgba(99, 102, 241, 0.15)" // Indigo default
}) => {
  const divRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;

    const el = divRef.current;
    const rect = el.getBoundingClientRect();
    
    // Coordinates relative to the element
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Center coordinates
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Maximum tilt angle (degrees)
    const maxTilt = 10;

    // Calculate rotation:
    // When mouse is at top (y < centerY), we want negative rotateX (tilt up) - wait, css logic:
    // rotateX positive tips top away (back), bottom towards.
    // We want "pushing down". Pushing top-left should tip top-left away.
    // Actually standard "tilt towards current mouse" usually means looking AT the point.
    // Let's go with: mouse top -> rotateX positive? No.
    // Let's define: Mouse Y = 0 (top) -> rotateX = -maxTilt (top comes closer? no)
    
    // Standard effect: "Push" where you touch.
    // Mouse Top -> Top goes away (recede) -> RotateX > 0.
    // Mouse Bottom -> Bottom goes away -> RotateX < 0.
    const rotateX = ((y - centerY) / centerY) * -maxTilt; // Inverted for "look at" feel, or removal of inversion for "push"
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--bg-opacity', '1');
    
    // Apply Transform with smooth perspective
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!divRef.current) return;
    const el = divRef.current;
    
    el.style.setProperty('--bg-opacity', '0');
    el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  const Component = to ? Link : 'div';

  return (
    <Component
      ref={divRef}
      to={to}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-3xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-200 ease-out hover:shadow-xl dark:bg-gray-900 dark:border-gray-800 ${className}`}
      style={{
         willChange: 'transform',
         transformStyle: 'preserve-3d'
      }}
    >
      {/* Spotlight Gradient Overlay (Background) */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-in-out z-0"
        style={{
          opacity: 'var(--bg-opacity, 0)',
          background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor}, transparent 40%)`,
        }}
      />

       {/* Spotlight Border (High Intensity) */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 ease-in-out rounded-[inherit]"
        style={{
          opacity: 'var(--bg-opacity, 0)',
          background: `radial-gradient(400px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor.replace(', 0.1)', ', 1').replace(', 0.15)', ', 1').replace(/rgba\((.*?),.*?\)/, 'rgba($1, 0.8)')}, transparent 40%)`,
           // Mask technique to show only border
          padding: '1px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
        }}
      />
      
      {/* Content Container (z-10 to stay above background spotlight but below border) */}
      <div className="relative z-10 h-full transform-gpu">
        {children}
      </div>
    </Component>
  );
};

export default SpotlightCard;
