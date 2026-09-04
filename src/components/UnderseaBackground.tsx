import React, { useMemo } from 'react';
import { soundEngine } from '../utils/audio';

interface Props {
  onPopBubble?: () => void;
}

export const UnderseaBackground: React.FC<Props> = ({ onPopBubble }) => {
  // Generate stable random bubbles
  const bubbles = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      left: 3 + (i * 4) + (Math.random() * 3),
      size: 10 + Math.random() * 26,
      duration: 7 + Math.random() * 10,
      delay: Math.random() * 8,
      wobble: 10 + Math.random() * 20,
    }));
  }, []);

  const handleBubbleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    soundEngine.playBubblePopSound();
    if (onPopBubble) onPopBubble();
    // Quick pop animation
    const target = e.currentTarget;
    target.style.transform = 'scale(1.8)';
    target.style.opacity = '0';
    setTimeout(() => {
      target.style.transform = '';
      target.style.opacity = '';
    }, 1500);
  };

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Deep Sea Gradient Background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0e5c94] via-[#093766] to-[#041a38]"
        style={{
          background: 'linear-gradient(180deg, #10729e 0%, #0c4d7d 35%, #082d56 70%, #03142e 100%)',
        }}
      />

      {/* Sunlight Beams / Caustics */}
      <div className="absolute top-0 left-0 right-0 h-96 opacity-25 mix-blend-screen pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 400">
          <defs>
            <linearGradient id="sunbeam" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#67e8f9" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#0c4d7d" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="0,0 120,0 260,400 90,400" fill="url(#sunbeam)" className="animate-pulse" style={{ animationDuration: '6s' }} />
          <polygon points="200,0 350,0 520,400 320,400" fill="url(#sunbeam)" className="animate-pulse" style={{ animationDuration: '8s', animationDelay: '1s' }} />
          <polygon points="450,0 600,0 800,400 580,400" fill="url(#sunbeam)" className="animate-pulse" style={{ animationDuration: '7s', animationDelay: '2.5s' }} />
          <polygon points="750,0 900,0 1050,400 850,400" fill="url(#sunbeam)" className="animate-pulse" style={{ animationDuration: '9s', animationDelay: '1.5s' }} />
        </svg>
      </div>

      {/* Gentle Floating Water Bubbles (clickable for fun interactive sounds!) */}
      {bubbles.map((b) => (
        <div
          key={b.id}
          id={`bubble-${b.id}`}
          onClick={handleBubbleClick}
          className="absolute rounded-full cursor-pointer pointer-events-auto transition-transform active:scale-125"
          style={{
            left: `${b.left}%`,
            bottom: '-40px',
            width: `${b.size}px`,
            height: `${b.size}px`,
            background: 'radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 0.8) 0%, rgba(186, 230, 253, 0.4) 40%, rgba(14, 165, 233, 0.15) 80%, rgba(255, 255, 255, 0.6) 100%)',
            boxShadow: 'inset 0 0 6px rgba(255, 255, 255, 0.6), 0 0 4px rgba(186, 230, 253, 0.3)',
            animation: `floatBubble ${b.duration}s linear infinite`,
            animationDelay: `${b.delay}s`,
          }}
          title="Pop the bubble!"
        >
          {/* Bubble reflection highlight */}
          <div className="absolute top-1 left-1.5 w-1/3 h-1/3 rounded-full bg-white/70" />
        </div>
      ))}

      {/* Seabed Corals and Seaweed at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-36 md:h-44 pointer-events-none">
        {/* Sandy Seabed */}
        <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-[#152e4d] via-[#102742] to-transparent" />

        <svg
          viewBox="0 0 1200 180"
          className="w-full h-full absolute bottom-0 left-0 right-0"
          preserveAspectRatio="none"
        >
          {/* Seaweed Cluster Left */}
          <path
            d="M 40 180 Q 25 120 45 80 T 35 20 Q 55 70 45 120 T 55 180 Z"
            fill="#059669"
            opacity="0.85"
            style={{ animation: 'swaySeaweed 4s ease-in-out infinite alternate', transformOrigin: 'bottom center' }}
          />
          <path
            d="M 65 180 Q 80 130 60 90 T 75 35 Q 85 85 75 130 T 80 180 Z"
            fill="#10B981"
            opacity="0.75"
            style={{ animation: 'swaySeaweed 5s ease-in-out infinite alternate-reverse', transformOrigin: 'bottom center' }}
          />

          {/* Seaweed Cluster Right */}
          <path
            d="M 1120 180 Q 1100 120 1130 80 T 1115 25 Q 1135 75 1125 125 T 1135 180 Z"
            fill="#059669"
            opacity="0.8"
            style={{ animation: 'swaySeaweed 4.5s ease-in-out infinite alternate', transformOrigin: 'bottom center' }}
          />
          <path
            d="M 1150 180 Q 1170 130 1145 90 T 1165 40 Q 1175 90 1160 130 T 1170 180 Z"
            fill="#34D399"
            opacity="0.7"
            style={{ animation: 'swaySeaweed 5.5s ease-in-out infinite alternate-reverse', transformOrigin: 'bottom center' }}
          />

          {/* Colorful Corals and Shells */}
          <g transform="translate(140, 95) scale(0.7)">
            {/* Pink Coral */}
            <path
              d="M 20 80 C 15 50, 5 45, 10 30 C 15 15, 30 25, 30 40 C 35 20, 50 15, 55 30 C 60 45, 45 60, 45 80 Z"
              fill="#F43F5E"
              opacity="0.9"
            />
            <circle cx="12" cy="28" r="4" fill="#FDA4AF" />
            <circle cx="53" cy="28" r="5" fill="#FDA4AF" />
            <circle cx="32" cy="18" r="4" fill="#FDA4AF" />
          </g>

          <g transform="translate(980, 100) scale(0.65)">
            {/* Orange Branch Coral */}
            <path
              d="M 25 80 C 20 55, 10 40, 15 25 C 20 10, 35 20, 35 35 C 40 18, 55 10, 60 25 C 65 40, 50 55, 50 80 Z"
              fill="#F97316"
              opacity="0.85"
            />
            <circle cx="16" cy="23" r="4.5" fill="#FED7AA" />
            <circle cx="58" cy="23" r="5" fill="#FED7AA" />
          </g>

          {/* Cute Starfish on the Seabed */}
          <polygon
            points="260,165 264,153 276,153 266,145 270,133 260,141 250,133 254,145 244,153 256,153"
            fill="#FBBF24"
            stroke="#D97706"
            strokeWidth="1.5"
            transform="scale(0.8) translate(80, 40)"
          />
          <polygon
            points="890,165 894,155 905,155 896,148 899,138 890,144 881,138 884,148 875,155 886,155"
            fill="#FB7185"
            stroke="#E11D48"
            strokeWidth="1.5"
            transform="scale(0.7) translate(380, 65)"
          />
        </svg>
      </div>

      {/* Water Shimmer Line at Top */}
      <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-b from-cyan-300/40 to-transparent" />
    </div>
  );
};
