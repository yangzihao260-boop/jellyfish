import React, { useState } from 'react';
import {
  Volume2,
  VolumeX,
  Music,
  Maximize2,
  Minimize2,
  HelpCircle,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { FilterSpeedMode } from '../types';
import { soundEngine } from '../utils/audio';

interface Props {
  isBgmPlaying: boolean;
  onToggleBgm: () => void;
  speedFilter: FilterSpeedMode;
  onSpeedFilterChange: (mode: FilterSpeedMode) => void;
  showBadges: boolean;
  onToggleBadges: () => void;
  practiceCount: number;
  onQuickSpeak: () => void;
}

export const TeacherToolbar: React.FC<Props> = ({
  isBgmPlaying,
  onToggleBgm,
  speedFilter,
  onSpeedFilterChange,
  showBadges,
  onToggleBadges,
  practiceCount,
  onQuickSpeak,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch((err) => {
          console.warn("Exit fullscreen error:", err);
        });
      }
    }
  };

  return (
    <>
      {/* Top Floating Control Bar */}
      <header className="relative z-30 w-full px-4 py-3 flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/60 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
        {/* Left: App Title and Lesson Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-400 to-sky-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <span className="text-xl">🪼</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold tracking-wide flex items-center gap-2">
              <span>Jellyfish 海底认读小游戏</span>
              <span className="hidden sm:inline-block text-[11px] font-semibold bg-cyan-500/30 text-cyan-200 border border-cyan-400/40 px-2 py-0.5 rounded-full">
                小学英语互动备课
              </span>
            </h1>
            <p className="text-xs text-cyan-200/80 hidden md:block">
              让孩子们认识单词 <strong className="text-amber-300 font-bold tracking-wider">jellyfish</strong>（水母）
            </p>
          </div>
        </div>

        {/* Center: Classroom Speed Filters (10 Slow, 10 Fast, 20 All) */}
        <div className="flex items-center bg-black/30 p-1 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            id="filter-all-btn"
            type="button"
            onClick={() => onSpeedFilterChange('all')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              speedFilter === 'all'
                ? 'bg-cyan-500 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            全部 (20只)
          </button>
          <button
            id="filter-slow-btn"
            type="button"
            onClick={() => onSpeedFilterChange('slow')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              speedFilter === 'slow'
                ? 'bg-emerald-500 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="10只慢速水母，动作平缓，适合初学和低年级互动"
          >
            <span>🐢 慢速 (10只)</span>
          </button>
          <button
            id="filter-fast-btn"
            type="button"
            onClick={() => onSpeedFilterChange('fast')}
            className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              speedFilter === 'fast'
                ? 'bg-amber-500 text-white shadow-sm font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
            title="10只快速水母，考验反应，适合进阶互动挑战"
          >
            <span>⚡ 快速 (10只)</span>
          </button>
        </div>

        {/* Right Tools: BGM, Quick Voice, Star Counter, Fullscreen, Guide */}
        <div className="flex items-center gap-2">
          {/* Quick Repeat Word Audio Button */}
          <button
            id="btn-quick-voice"
            type="button"
            onClick={onQuickSpeak}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/80 hover:bg-sky-500 border border-sky-300/40 text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
            title="教师一键领读发音"
          >
            <Volume2 className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">读 jellyfish</span>
          </button>

          {/* Background Music Toggle */}
          <button
            id="btn-toggle-bgm"
            type="button"
            onClick={onToggleBgm}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
              isBgmPlaying
                ? 'bg-emerald-500/30 border-emerald-400/50 text-emerald-200 hover:bg-emerald-500/40'
                : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700'
            }`}
            title={isBgmPlaying ? '暂停欢快背景音乐' : '播放欢快背景音乐'}
          >
            <Music className={`w-3.5 h-3.5 ${isBgmPlaying ? 'animate-bounce text-emerald-300' : ''}`} />
            <span>{isBgmPlaying ? '音乐中' : '音乐关'}</span>
          </button>

          {/* Speed Badge Toggle */}
          <button
            id="btn-toggle-badges"
            type="button"
            onClick={onToggleBadges}
            className={`p-2 rounded-xl text-xs transition-all border cursor-pointer ${
              showBadges
                ? 'bg-amber-500/30 border-amber-400/50 text-amber-200'
                : 'bg-slate-800/40 border-white/10 text-slate-400 hover:text-white'
            }`}
            title={showBadges ? '隐藏速度标签' : '显示速度标签（慢速/快速）'}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Practice Count / Classroom Star */}
          <div
            id="practice-counter"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-200 text-xs font-bold"
            title="课堂认读练习次数"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>已认读: {practiceCount}</span>
          </div>

          {/* Fullscreen Button for Classroom Projector/Smartboard */}
          <button
            id="btn-fullscreen"
            type="button"
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="全屏显示（适合电子白板/投影仪）"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {/* Teacher Teaching Guide Tooltip Button */}
          <button
            id="btn-teaching-guide"
            type="button"
            onClick={() => setShowGuide(!showGuide)}
            className="p-2 rounded-xl bg-indigo-500/40 hover:bg-indigo-500/60 border border-indigo-400/40 text-indigo-200 transition-all cursor-pointer"
            title="备课助手教学建议"
          >
            <GraduationCap className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Classroom Teaching Instructions Popover Modal */}
      {showGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setShowGuide(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-2xl p-6 text-slate-800 shadow-2xl border-2 border-indigo-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">👩‍🏫 备课助手：课堂互动建议</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold px-2 py-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-slate-600">
              <div className="p-3 bg-indigo-50/70 rounded-xl border border-indigo-100">
                <p className="font-bold text-indigo-900 mb-1">🎯 教学目标</p>
                <p>让孩子们掌握单词 <strong className="text-indigo-700">jellyfish</strong> 的发音、拼写与音节拆分（jel · ly · fish）。</p>
              </div>

              <div className="space-y-2">
                <p className="font-semibold text-slate-800">📌 建议课堂互动步骤：</p>
                <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-600">
                  <li><strong>热身观察</strong>：播放欢快背景音乐，全班观察20只各具特色的水母游动，讨论不同的颜色与形状。</li>
                  <li><strong>初阶探索（慢速10只）</strong>：请低年级同学上台触摸点击慢速水母，集体大声跟读 "Jellyfish!"。</li>
                  <li><strong>音节分解</strong>：在弹出的卡片中，点击 "jel"、"ly"、"fish" 三个音节，进行节奏拍手拼读练习。</li>
                  <li><strong>进阶挑战（快速10只）</strong>：切换为快速模式，学生比拼眼力和手速抓水母，活跃课堂氛围！</li>
                  <li><strong>安心互动</strong>：水母被点击后不会消失，点击“继续”即可无限次复现游戏，适合每位同学轮流参与。</li>
                </ol>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              我知道了，开始上课！
            </button>
          </div>
        </div>
      )}
    </>
  );
};
