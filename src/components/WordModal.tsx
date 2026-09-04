import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Volume2, Sparkles, ArrowRight, Turtle, Repeat } from 'lucide-react';
import { JellyfishData } from '../types';
import { JellyfishGraphic } from './JellyfishGraphic';
import { soundEngine } from '../utils/audio';

interface Props {
  jellyfish: JellyfishData | null;
  onContinue: () => void;
}

export const WordModal: React.FC<Props> = ({ jellyfish, onContinue }) => {
  const [activeSyllable, setActiveSyllable] = useState<number | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (jellyfish) {
      // Auto-pronounce when opened for immediate reinforcement
      const timer = setTimeout(() => {
        handleSpeakNormal();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [jellyfish]);

  if (!jellyfish) return null;

  const handleSpeakNormal = () => {
    setIsSpeaking(true);
    soundEngine.speakJellyfish(false, undefined, () => setIsSpeaking(false));
  };

  const handleSpeakSlow = () => {
    setIsSpeaking(true);
    soundEngine.speakJellyfish(true, undefined, () => setIsSpeaking(false));
  };

  const handleSyllableClick = (syllable: string, index: number) => {
    setActiveSyllable(index);
    soundEngine.playSyllableClickSound(index);
    soundEngine.speakSyllable(syllable);
    setTimeout(() => setActiveSyllable(null), 800);
  };

  const handleClose = () => {
    soundEngine.playContinueSound();
    onContinue();
  };

  const syllables = [
    { text: 'jel', phonetic: 'dʒel', tip: '音节 1' },
    { text: 'ly', phonetic: 'i', tip: '音节 2' },
    { text: 'fish', phonetic: 'fɪʃ', tip: '音节 3' },
  ];

  const modalContent = (
    <div
      id="word-modal-overlay"
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      style={{
        zIndex: 999999,
        position: 'fixed',
        inset: 0,
        pointerEvents: 'auto',
      }}
      onClick={handleClose}
    >
      <div
        id="word-modal-card"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-cyan-300 p-6 md:p-8 text-center flex flex-col items-center overflow-hidden"
        style={{
          zIndex: 1000000,
          backgroundColor: '#ffffff',
          boxShadow: '0 25px 50px -12px rgba(6, 182, 212, 0.35), 0 0 0 8px rgba(255, 255, 255, 0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Decorative Ocean Watermark */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-cyan-100/50 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-36 h-36 bg-pink-100/50 rounded-full blur-2xl pointer-events-none -ml-10 -mb-10" />

        {/* Jellyfish Catch Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-cyan-600 animate-spin" style={{ animationDuration: '4s' }} />
          <span>你发现了特别的水母：{jellyfish.nameZh}</span>
          <span className="text-cyan-500 font-normal">({jellyfish.nameEn})</span>
        </div>

        {/* Captured Jellyfish Preview Showcase */}
        <div className="relative w-28 h-28 my-1 flex items-center justify-center filter drop-shadow-md">
          <JellyfishGraphic jellyfish={jellyfish} isPulsing={true} showBadge={false} />
        </div>

        {/* Large Prominent English Word for Classroom Reading */}
        <div className="my-2">
          <h1
            id="modal-word-title"
            className="text-5xl md:text-6xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-cyan-600 to-indigo-600 filter drop-shadow-sm select-all"
            style={{ fontFamily: "'Fredoka', cursive, sans-serif" }}
          >
            jellyfish
          </h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <span className="text-sm md:text-base text-slate-500 font-mono font-medium">
              /ˈdʒel.i.fɪʃ/
            </span>
            <span className="text-sm font-semibold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded-md">
              n. 水母
            </span>
          </div>
        </div>

        {/* Syllables Interactive Learning: jel - ly - fish */}
        <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 my-3 shadow-inner">
          <p className="text-xs font-semibold text-slate-500 mb-2 flex items-center justify-center gap-1">
            <span>💡 拼读拆分（点击音节听发音）：</span>
          </p>
          <div className="flex items-center justify-center gap-2 md:gap-3">
            {syllables.map((s, idx) => (
              <button
                key={s.text}
                id={`syllable-btn-${s.text}`}
                type="button"
                onClick={() => handleSyllableClick(s.text, idx)}
                className={`relative group px-4 py-2 rounded-xl font-bold text-lg md:text-xl transition-all duration-200 transform cursor-pointer ${
                  activeSyllable === idx
                    ? 'bg-amber-400 text-slate-900 scale-110 shadow-md ring-4 ring-amber-200'
                    : 'bg-white hover:bg-sky-50 text-sky-800 border-2 border-sky-200 hover:border-sky-400 shadow-xs hover:scale-105'
                }`}
              >
                <span>{s.text}</span>
                <span className="block text-[10px] font-normal text-slate-400">/{s.phonetic}/</span>
              </button>
            ))}
          </div>
        </div>

        {/* Audio Pronunciation Buttons for Teacher & Kids */}
        <div className="flex flex-wrap items-center justify-center gap-3 my-2 w-full">
          <button
            id="btn-speak-normal"
            type="button"
            onClick={handleSpeakNormal}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm shadow-sm transition-all cursor-pointer ${
              isSpeaking
                ? 'bg-sky-600 text-white scale-105 ring-4 ring-sky-200'
                : 'bg-sky-500 hover:bg-sky-600 text-white hover:shadow-md active:scale-95'
            }`}
          >
            <Volume2 className="w-4 h-4 animate-pulse" />
            <span>听标准发音 (Listen)</span>
          </button>

          <button
            id="btn-speak-slow"
            type="button"
            onClick={handleSpeakSlow}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-all cursor-pointer active:scale-95"
          >
            <Turtle className="w-4 h-4 text-indigo-500" />
            <span>慢速跟读 (Slow)</span>
          </button>
        </div>

        {/* Explicit Prompt: Jellyfish does not disappear! */}
        <p className="text-xs text-slate-400 mt-2">
          ✨ 水母很喜欢和你一起玩，点击继续后它会继续游动哦！
        </p>

        {/* Big "Continue / 继续游戏" Button */}
        <button
          id="btn-continue-game"
          type="button"
          onClick={handleClose}
          className="mt-4 w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98"
          style={{
            boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)',
          }}
        >
          <span>继续游戏 (Continue)</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};
