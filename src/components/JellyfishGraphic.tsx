import React from 'react';
import { JellyfishData } from '../types';

interface Props {
  jellyfish: JellyfishData;
  isPulsing?: boolean;
  showBadge?: boolean;
}

export const JellyfishGraphic: React.FC<Props> = ({ jellyfish, isPulsing = true, showBadge = false }) => {
  const {
    bellShape,
    pattern,
    face,
    colorPrimary,
    colorSecondary,
    glowColor,
    tentacleColor,
    tentacleStyle,
    tentacleCount,
    speedType,
  } = jellyfish;

  // Render the bell path based on bellShape
  const renderBellPath = () => {
    switch (bellShape) {
      case 'mushroom':
        return "M 15 55 C 10 30, 25 8, 50 8 C 75 8, 90 30, 85 55 C 80 58, 65 52, 50 54 C 35 52, 20 58, 15 55 Z";
      case 'umbrella':
        return "M 10 52 C 15 24, 30 12, 50 12 C 70 12, 85 24, 90 52 C 75 48, 60 55, 50 50 C 40 55, 25 48, 10 52 Z";
      case 'crown':
        return "M 12 50 C 14 26, 28 10, 50 14 C 72 10, 86 26, 88 50 C 76 56, 68 48, 50 56 C 32 48, 24 56, 12 50 Z";
      case 'crystal':
        return "M 16 50 L 28 20 L 50 8 L 72 20 L 84 50 L 68 54 L 50 49 L 32 54 Z";
      case 'scalloped':
        return "M 12 52 C 12 25, 28 8, 50 8 C 72 8, 88 25, 88 52 C 80 57, 72 52, 64 56 C 56 52, 44 52, 36 56 C 28 52, 20 57, 12 52 Z";
      case 'drop':
        return "M 20 56 C 15 36, 32 10, 50 6 C 68 10, 85 36, 80 56 C 68 53, 58 57, 50 54 C 42 57, 32 53, 20 56 Z";
      case 'dome':
      default:
        return "M 12 52 C 12 22, 28 8, 50 8 C 72 8, 88 22, 88 52 C 75 56, 62 50, 50 54 C 38 50, 25 56, 12 52 Z";
    }
  };

  // Render patterns inside the bell
  const renderPattern = () => {
    switch (pattern) {
      case 'dots':
        return (
          <g fill={colorSecondary} opacity="0.8">
            <circle cx="35" cy="24" r="3.5" />
            <circle cx="50" cy="20" r="4.5" />
            <circle cx="65" cy="24" r="3.5" />
            <circle cx="28" cy="36" r="2.8" />
            <circle cx="42" cy="33" r="3.2" />
            <circle cx="58" cy="33" r="3.2" />
            <circle cx="72" cy="36" r="2.8" />
          </g>
        );
      case 'stripes':
        return (
          <g stroke={colorSecondary} strokeWidth="3" strokeLinecap="round" opacity="0.65">
            <path d="M 32 46 C 35 32, 40 22, 48 16" />
            <path d="M 50 48 L 50 14" />
            <path d="M 68 46 C 65 32, 60 22, 52 16" />
          </g>
        );
      case 'rings':
        return (
          <g stroke={colorSecondary} strokeWidth="2.5" fill="none" opacity="0.75">
            <ellipse cx="50" cy="26" rx="16" ry="9" />
            <ellipse cx="50" cy="36" rx="24" ry="7" />
          </g>
        );
      case 'hearts':
        return (
          <g fill={colorSecondary} opacity="0.85">
            <path d="M 38 28 C 38 24, 32 24, 32 28 C 32 32, 38 36, 38 36 C 38 36, 44 32, 44 28 C 44 24, 38 24, 38 28 Z" transform="scale(0.7) translate(14, 5)" />
            <path d="M 62 28 C 62 24, 56 24, 56 28 C 56 32, 62 36, 62 36 C 62 36, 68 32, 68 28 C 68 24, 62 24, 62 28 Z" transform="scale(0.7) translate(30, 5)" />
          </g>
        );
      case 'stars':
        return (
          <g fill={colorSecondary} opacity="0.9">
            {/* Cute mini four-point star */}
            <path d="M 36 24 Q 38 26 40 24 Q 38 26 38 28 Q 38 26 36 24 Z" transform="scale(1.3) translate(-8,-4)" />
            <path d="M 50 18 Q 52 20 54 18 Q 52 20 52 22 Q 52 20 50 18 Z" transform="scale(1.5) translate(-14,-4)" />
            <path d="M 64 24 Q 66 26 68 24 Q 66 26 66 28 Q 66 26 64 24 Z" transform="scale(1.3) translate(-18,-4)" />
          </g>
        );
      case 'sparkles':
      default:
        return (
          <g fill="#FFFFFF" opacity="0.9">
            <circle cx="34" cy="24" r="2.5" />
            <circle cx="50" cy="20" r="3" />
            <circle cx="66" cy="24" r="2.5" />
            <polygon points="50,28 52,32 56,32 53,35 54,39 50,37 46,39 47,35 44,32 48,32" transform="scale(0.65) translate(28, 14)" fill={colorSecondary} />
          </g>
        );
    }
  };

  // Cute face expressions for kids
  const renderFace = () => {
    switch (face) {
      case 'winking':
        return (
          <g>
            {/* Open eye with shine */}
            <circle cx="40" cy="42" r="3.2" fill="#1E293B" />
            <circle cx="39" cy="41" r="1.2" fill="#FFFFFF" />
            {/* Winking eye */}
            <path d="M 57 42 Q 62 38 67 42" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Smile */}
            <path d="M 48 45 Q 52 49 56 45" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Blushes */}
            <ellipse cx="34" cy="45" rx="3" ry="2" fill="#FF8DA1" opacity="0.7" />
            <ellipse cx="69" cy="45" rx="3" ry="2" fill="#FF8DA1" opacity="0.7" />
          </g>
        );
      case 'sparkle':
        return (
          <g>
            {/* Anime sparkle eyes */}
            <circle cx="40" cy="41" r="3.8" fill="#1E293B" />
            <circle cx="38.5" cy="39.5" r="1.6" fill="#FFFFFF" />
            <circle cx="41.5" cy="42.5" r="0.8" fill="#FFFFFF" />
            <circle cx="60" cy="41" r="3.8" fill="#1E293B" />
            <circle cx="58.5" cy="39.5" r="1.6" fill="#FFFFFF" />
            <circle cx="61.5" cy="42.5" r="0.8" fill="#FFFFFF" />
            {/* Open happy mouth */}
            <path d="M 47 45 Q 50 51 53 45 Z" fill="#E11D48" stroke="#1E293B" strokeWidth="1" />
            <ellipse cx="32" cy="44" rx="3.5" ry="2" fill="#FB7185" opacity="0.75" />
            <ellipse cx="68" cy="44" rx="3.5" ry="2" fill="#FB7185" opacity="0.75" />
          </g>
        );
      case 'shy':
        return (
          <g>
            <circle cx="41" cy="42" r="2.8" fill="#1E293B" />
            <circle cx="40" cy="41" r="1.0" fill="#FFFFFF" />
            <circle cx="59" cy="42" r="2.8" fill="#1E293B" />
            <circle cx="58" cy="41" r="1.0" fill="#FFFFFF" />
            {/* Shy gentle mouth */}
            <path d="M 47 45 Q 50 47 53 45" stroke="#1E293B" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            {/* Rosy cheeks */}
            <ellipse cx="34" cy="44" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.9" />
            <ellipse cx="66" cy="44" rx="4.5" ry="2.5" fill="#FDA4AF" opacity="0.9" />
          </g>
        );
      case 'excited':
        return (
          <g>
            {/* Happy arch eyes ^^ */}
            <path d="M 37 42 Q 41 36 45 42" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            <path d="M 55 42 Q 59 36 63 42" stroke="#1E293B" strokeWidth="2.4" strokeLinecap="round" fill="none" />
            {/* Big grin */}
            <path d="M 46 45 Q 50 52 54 45 Z" fill="#F43F5E" stroke="#1E293B" strokeWidth="1.2" />
            <ellipse cx="33" cy="45" rx="3.5" ry="2.2" fill="#FB7185" opacity="0.7" />
            <ellipse cx="67" cy="45" rx="3.5" ry="2.2" fill="#FB7185" opacity="0.7" />
          </g>
        );
      case 'happy':
      default:
        return (
          <g>
            <circle cx="39" cy="41" r="3.2" fill="#1E293B" />
            <circle cx="38" cy="40" r="1.2" fill="#FFFFFF" />
            <circle cx="61" cy="41" r="3.2" fill="#1E293B" />
            <circle cx="60" cy="40" r="1.2" fill="#FFFFFF" />
            <path d="M 47 45 Q 50 49 53 45" stroke="#1E293B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            <ellipse cx="33" cy="44" rx="3.5" ry="2.2" fill="#FF85A1" opacity="0.7" />
            <ellipse cx="67" cy="44" rx="3.5" ry="2.2" fill="#FF85A1" opacity="0.7" />
          </g>
        );
    }
  };

  // Generate unique tentacles
  const renderTentacles = () => {
    const tentacles = [];
    const step = 60 / (tentacleCount + 1);

    for (let i = 1; i <= tentacleCount; i++) {
      const startX = 20 + i * step;
      const isOdd = i % 2 === 1;
      const waveOffset = isOdd ? 8 : -8;
      const length = 40 + (i % 3) * 8;

      let d = '';
      let strokeW = 2.5;

      switch (tentacleStyle) {
        case 'ribbon':
          d = `M ${startX} 52 Q ${startX + waveOffset} ${52 + length * 0.3}, ${startX} ${52 + length * 0.6} T ${startX + waveOffset * 0.5} ${52 + length}`;
          strokeW = 3.5;
          break;
        case 'curly':
          d = `M ${startX} 52 C ${startX - 10} 65, ${startX + 10} 78, ${startX - 5} 90 S ${startX + 8} 102, ${startX} ${52 + length}`;
          strokeW = 2.4;
          break;
        case 'spiral':
          d = `M ${startX} 52 Q ${startX + waveOffset * 1.5} 66, ${startX} 78 Q ${startX - waveOffset * 1.5} 90, ${startX} ${52 + length}`;
          strokeW = 2.8;
          break;
        case 'beaded':
          d = `M ${startX} 52 Q ${startX + waveOffset * 0.7} 75, ${startX} ${52 + length}`;
          strokeW = 2.2;
          break;
        case 'straight':
        default:
          d = `M ${startX} 52 Q ${startX + waveOffset * 0.5} 75, ${startX + (isOdd ? 3 : -3)} ${52 + length}`;
          strokeW = 2.6;
          break;
      }

      tentacles.push(
        <g key={`tentacle-${i}`}>
          <path
            d={d}
            stroke={tentacleColor}
            strokeWidth={strokeW}
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
            style={{
              animation: isPulsing ? `swayTentacle ${2 + (i % 3) * 0.4}s ease-in-out infinite alternate` : 'none',
              transformOrigin: `${startX}px 52px`,
            }}
          />
          {/* If beaded, add little beads */}
          {tentacleStyle === 'beaded' && (
            <>
              <circle cx={startX + waveOffset * 0.4} cy="68" r="2" fill="#FFFFFF" opacity="0.8" />
              <circle cx={startX} cy="86" r="2.2" fill={colorSecondary} opacity="0.9" />
              <circle cx={startX} cy={52 + length} r="2.5" fill={colorPrimary} />
            </>
          )}
        </g>
      );
    }

    return tentacles;
  };

  const gradientId = `jelly-grad-${jellyfish.id}`;
  const glowFilterId = `jelly-glow-${jellyfish.id}`;

  return (
    <div className="relative select-none pointer-events-none w-full h-full flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 100 115"
        className="w-full h-full filter drop-shadow-md transition-transform duration-300 overflow-visible"
      >
        <defs>
          {/* Radial Gradient for bioluminescent translucent bell */}
          <radialGradient id={gradientId} cx="50%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="40%" stopColor={colorSecondary} stopOpacity="0.88" />
            <stop offset="85%" stopColor={colorPrimary} stopOpacity="0.75" />
            <stop offset="100%" stopColor={colorPrimary} stopOpacity="0.9" />
          </radialGradient>

          {/* Bioluminescent Glow */}
          <filter id={glowFilterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Tentacles (drawn behind bell) */}
        <g id={`tentacles-${jellyfish.id}`}>
          {renderTentacles()}
        </g>

        {/* Outer Glow Halo */}
        <path
          d={renderBellPath()}
          fill={glowColor}
          opacity="0.5"
          transform="scale(1.08) translate(-4, -2)"
          filter={`url(#${glowFilterId})`}
        />

        {/* Main Jellyfish Bell Body */}
        <path
          d={renderBellPath()}
          fill={`url(#${gradientId})`}
          stroke={colorPrimary}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />

        {/* Shiny Highlight on Bell */}
        <path
          d="M 28 20 C 35 14, 52 14, 60 18"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <circle cx="68" cy="22" r="2" fill="#FFFFFF" opacity="0.9" />

        {/* Unique Patterns */}
        {renderPattern()}

        {/* Expressive Cute Face */}
        {renderFace()}

        {/* Bottom Bell Rim Frills */}
        <g opacity="0.6">
          <ellipse cx="30" cy="54" rx="4" ry="2" fill={colorSecondary} />
          <ellipse cx="50" cy="53" rx="5" ry="2.2" fill={colorSecondary} />
          <ellipse cx="70" cy="54" rx="4" ry="2" fill={colorSecondary} />
        </g>
      </svg>

      {/* Speed badge if enabled for classroom visual comparison */}
      {showBadge && (
        <span
          className={`absolute -bottom-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm whitespace-nowrap ${
            speedType === 'slow'
              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
              : 'bg-amber-100 text-amber-800 border border-amber-300'
          }`}
        >
          {speedType === 'slow' ? '🐢 Slow' : '⚡ Fast'}
        </span>
      )}
    </div>
  );
};
