/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { INITIAL_JELLYFISH } from './data/jellyfishList';
import { JellyfishData, FilterSpeedMode } from './types';
import { JellyfishGraphic } from './components/JellyfishGraphic';
import { UnderseaBackground } from './components/UnderseaBackground';
import { WordModal } from './components/WordModal';
import { TeacherToolbar } from './components/TeacherToolbar';
import { soundEngine } from './utils/audio';
import { Music, Volume2, Sparkles } from 'lucide-react';

export default function App() {
  const [jellyfishList, setJellyfishList] = useState<JellyfishData[]>(INITIAL_JELLYFISH);
  const [selectedJellyfish, setSelectedJellyfish] = useState<JellyfishData | null>(null);
  const [speedFilter, setSpeedFilter] = useState<FilterSpeedMode>('all');
  const [showBadges, setShowBadges] = useState<boolean>(false);
  const [practiceCount, setPracticeCount] = useState<number>(0);
  const [isBgmPlaying, setIsBgmPlaying] = useState<boolean>(false);
  const [hasInteractedAudio, setHasInteractedAudio] = useState<boolean>(false);

  // Physics animation reference
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const jellyfishRef = useRef<JellyfishData[]>(INITIAL_JELLYFISH);

  // Keep ref synchronized
  useEffect(() => {
    jellyfishRef.current = jellyfishList;
  }, [jellyfishList]);

  // Handle music toggle
  const handleToggleBgm = () => {
    const playing = soundEngine.toggleBGM();
    setIsBgmPlaying(playing);
    setHasInteractedAudio(true);
  };

  // Quick word pronunciation by teacher
  const handleQuickSpeak = () => {
    soundEngine.speakJellyfish(false);
  };

  // Handle clicking a jellyfish
  const handleJellyfishClick = (jelly: JellyfishData, e: React.MouseEvent) => {
    e.stopPropagation();

    // Unlock audio context on first click if needed
    if (!hasInteractedAudio) {
      soundEngine.startBGM();
      setIsBgmPlaying(true);
      setHasInteractedAudio(true);
    }

    // Play specific sound effect on click
    soundEngine.playJellyfishClickSound();

    // Increment practice count & jellyfish individual score
    setPracticeCount((prev) => prev + 1);

    // Set selected to open WordModal
    setSelectedJellyfish(jelly);

    // Update jellyfish caught counter without removing it
    setJellyfishList((prev) =>
      prev.map((item) =>
        item.id === jelly.id ? { ...item, caughtCount: item.caughtCount + 1 } : item
      )
    );
  };

  // Close modal and continue game
  const handleContinue = () => {
    setSelectedJellyfish(null);
  };

  // Filtered jellyfish view (all 20, 10 slow, or 10 fast)
  const visibleJellyfish = jellyfishList.filter((j) => {
    if (speedFilter === 'all') return true;
    return j.speedType === speedFilter;
  });

  // Physics update loop
  useEffect(() => {
    const updatePhysics = (now: number) => {
      const dt = Math.min((now - lastTimeRef.current) / 1000, 0.1);
      lastTimeRef.current = now;

      // When the word modal is open, pause translation so children focus on the card
      if (!selectedJellyfish) {
        jellyfishRef.current = jellyfishRef.current.map((j) => {
          // Update pulse phase
          const newPhase = (j.pulsePhase + j.pulseSpeed * dt * 2.5) % (Math.PI * 2);

          // Pulse propulsion factor: jellyfish shoots forward during bell contraction
          const pulseFactor = Math.sin(newPhase) > 0.2 ? 1.4 : 0.6;
          const currentSpeed = j.baseSpeed * pulseFactor * (j.speedType === 'fast' ? 1.25 : 0.85);

          // Update position
          let newX = j.x + j.vx * currentSpeed * dt * 8;
          let newY = j.y + j.vy * currentSpeed * dt * 8;
          let newVx = j.vx;
          let newVy = j.vy;

          // Boundary bounce with gentle cushion (keep jellyfish safely inside viewport)
          const minX = 4;
          const maxX = 90;
          const minY = 10;
          const maxY = 78;

          if (newX <= minX) {
            newX = minX;
            newVx = Math.abs(newVx);
          } else if (newX >= maxX) {
            newX = maxX;
            newVx = -Math.abs(newVx);
          }

          if (newY <= minY) {
            newY = minY;
            newVy = Math.abs(newVy);
          } else if (newY >= maxY) {
            newY = maxY;
            newVy = -Math.abs(newVy);
          }

          // Gentle random drift steering
          if (Math.random() < 0.02) {
            newVx += (Math.random() - 0.5) * 0.4;
            newVy += (Math.random() - 0.5) * 0.4;
            // Normalize velocity
            const mag = Math.sqrt(newVx * newVx + newVy * newVy) || 1;
            newVx = (newVx / mag) * (j.speedType === 'fast' ? 1.6 : 0.8);
            newVy = (newVy / mag) * (j.speedType === 'fast' ? 1.2 : 0.6);
          }

          // Tilt slightly towards travel direction
          const targetRot = Math.max(-25, Math.min(25, newVx * 12));

          return {
            ...j,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
            rotation: targetRot,
            pulsePhase: newPhase,
          };
        });

        // Batch update state for rendering
        setJellyfishList([...jellyfishRef.current]);
      }

      animRef.current = requestAnimationFrame(updatePhysics);
    };

    animRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [selectedJellyfish]);

  return (
    <div
      id="jellyfish-game-root"
      className="relative w-screen h-screen overflow-hidden select-none bg-[#041a38] font-sans"
    >
      {/* Dynamic Undersea Marine World Background */}
      <UnderseaBackground />

      {/* Classroom Teacher Floating Toolbar */}
      <TeacherToolbar
        isBgmPlaying={isBgmPlaying}
        onToggleBgm={handleToggleBgm}
        speedFilter={speedFilter}
        onSpeedFilterChange={setSpeedFilter}
        showBadges={showBadges}
        onToggleBadges={() => setShowBadges(!showBadges)}
        practiceCount={practiceCount}
        onQuickSpeak={handleQuickSpeak}
      />

      {/* First-time Classroom Audio Prompt Banner if not started */}
      {!hasInteractedAudio && (
        <div
          id="audio-start-banner"
          onClick={handleToggleBgm}
          className="absolute top-18 left-1/2 -translate-x-1/2 z-40 bg-white/95 text-slate-800 px-5 py-2.5 rounded-full shadow-2xl border-2 border-cyan-400 flex items-center gap-3 cursor-pointer hover:scale-105 transition-all animate-bounce"
        >
          <div className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <span className="text-xs md:text-sm font-bold text-slate-800">
            🎵 点击此处开启轻松欢快的海底背景音乐
          </span>
          <span className="text-xs bg-cyan-100 text-cyan-800 font-bold px-2 py-0.5 rounded-md">
            开启
          </span>
        </div>
      )}

      {/* Main Undersea Stage with 20 Swimming Jellyfish */}
      <main
        id="undersea-stage"
        className="absolute inset-0 top-16 bottom-0 overflow-hidden cursor-crosshair"
        style={{ zIndex: 1, isolation: 'isolate' }}
      >
        {/* Dimming layer over stage when modal is active */}
        {selectedJellyfish && (
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px] transition-all duration-300 pointer-events-auto"
            style={{ zIndex: 50 }}
            onClick={handleContinue}
          />
        )}

        {visibleJellyfish.map((jelly) => {
          // Pulse scale based on swimming rhythm
          const pulseScale = selectedJellyfish ? 1 : 0.94 + Math.sin(jelly.pulsePhase) * 0.08;

          return (
            <div
              key={jelly.id}
              id={`jellyfish-item-${jelly.id}`}
              onClick={(e) => handleJellyfishClick(jelly, e)}
              className="absolute group transition-transform duration-100 cursor-pointer"
              style={{
                left: `${jelly.x}%`,
                top: `${jelly.y}%`,
                width: `${jelly.size}px`,
                height: `${jelly.size * 1.15}px`,
                transform: `translate(-50%, -50%) rotate(${jelly.rotation}deg) scale(${pulseScale})`,
                zIndex: Math.round((jelly.size - 50) / 2) + 1, // Scaled strictly to 1-30 within isolated stage
                opacity: selectedJellyfish ? 0.25 : 1,
                pointerEvents: selectedJellyfish ? 'none' : 'auto',
                filter: selectedJellyfish ? 'blur(1px)' : 'none',
              }}
              title={`点击认读: ${jelly.nameZh} (${jelly.speedType === 'slow' ? '慢速' : '快速'})`}
            >
              {/* Click Ripple feedback ring on hover */}
              <div className="absolute inset-0 rounded-full group-hover:ring-4 group-hover:ring-cyan-300/60 group-hover:bg-cyan-400/10 transition-all pointer-events-none" />

              {/* Unique Jellyfish Graphic */}
              <JellyfishGraphic
                jellyfish={jelly}
                isPulsing={!selectedJellyfish}
                showBadge={showBadges}
              />

              {/* Caught Counter Badge (small star if caught multiple times) */}
              {jelly.caughtCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-amber-400 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-md border border-white">
                  {jelly.caughtCount}
                </div>
              )}
            </div>
          );
        })}
      </main>

      {/* Bottom Floating Classroom Quick Prompt */}
      <footer className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none text-center">
        <div className="inline-flex items-center gap-2 bg-slate-900/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-cyan-200 text-xs shadow-md">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          <span>点击画面中任意一只水母，学习英文单词 <strong>jellyfish</strong> 吧！</span>
          <span className="hidden sm:inline text-white/50">| 共有20只独特水母</span>
        </div>
      </footer>

      {/* English Word Learning Modal (Pops up when any jellyfish is clicked) */}
      <WordModal
        jellyfish={selectedJellyfish}
        onContinue={handleContinue}
      />
    </div>
  );
}
