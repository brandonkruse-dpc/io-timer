import React from 'react';
import { Clock, LayoutGrid, Milestone, Eye, FileText, BookOpen, RotateCcw } from 'lucide-react';

export type ActiveTab = 'quadrant' | 'chevron' | 'focus' | 'outline' | 'rubric';

interface HeaderNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onResetTimer: () => void;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  onResetTimer,
  totalElapsedSeconds,
  totalDurationSeconds,
  isRunning,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const remaining = Math.max(0, totalDurationSeconds - totalElapsedSeconds);
  const isOvertime = totalElapsedSeconds > totalDurationSeconds;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <a href="/" className="font-display text-lg font-semibold tracking-tight text-white hover:text-amber-300 transition-colors">
              IB Oral Visual Timer
            </a>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-slate-400">
              <span>Language A</span>
              <span aria-hidden="true">·</span>
              <span>10-Minute Individual Oral</span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation views */}
        <nav className="hidden md:flex items-center gap-1 rounded-xl bg-slate-900/90 p-1 border border-slate-800">
          <button
            onClick={() => setActiveTab('quadrant')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'quadrant'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="4-Quadrant Balanced Visual Layout (Thumbnail Mode)"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>Quadrant View</span>
          </button>

          <button
            onClick={() => setActiveTab('chevron')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'chevron'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="Philpot Education Outline Method 1 (Chevron Flow)"
          >
            <Milestone className="h-3.5 w-3.5" />
            <span>Chevron Flow</span>
          </button>

          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'focus'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="Full Screen Practice & Recording Stage"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Focus Rehearsal</span>
          </button>

          <button
            onClick={() => setActiveTab('outline')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'outline'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="IB 10-Bullet Master Plan & Form (CSV Import/Export & Timer Source)"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>10-Bullet Plan & Form</span>
          </button>

          <button
            onClick={() => setActiveTab('rubric')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'rubric'
                ? 'bg-amber-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
            title="IB Scoring Criteria A, B, C, D"
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Criteria Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions and Quick Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live Mini Time Indicator */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs">
            <span className="text-slate-400">Total:</span>
            <span className={`font-mono-nums font-semibold ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-slate-100'}`}>
              {formatTime(totalElapsedSeconds)} / {formatTime(totalDurationSeconds)}
            </span>
            <span className="text-slate-500">·</span>
            <span className={`text-[11px] ${remaining <= 60 && isRunning ? 'text-amber-400 font-medium' : 'text-slate-400'}`}>
              {remaining > 0 ? `${formatTime(remaining)} left` : '10m Finish'}
            </span>
          </div>

          <button
            onClick={onResetTimer}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset timer to beginning (Shortcut: R)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

      </div>

      {/* Mobile Nav Bar */}
      <div className="flex md:hidden border-t border-slate-800/80 bg-slate-950 px-2 py-1.5 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('quadrant')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'quadrant' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Quadrant
        </button>
        <button
          onClick={() => setActiveTab('chevron')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'chevron' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Chevron Flow
        </button>
        <button
          onClick={() => setActiveTab('focus')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'focus' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Focus
        </button>
        <button
          onClick={() => setActiveTab('outline')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'outline' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          10-Bullet
        </button>
        <button
          onClick={() => setActiveTab('rubric')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'rubric' ? 'bg-amber-500 text-slate-950 font-semibold' : 'text-slate-400'
          }`}
        >
          Rubric
        </button>
      </div>
    </header>
  );
};
