import React from 'react';
import { Segment, StudentIOData } from '../types';
import { Play, Pause, SkipForward, SkipBack, Globe, BellRing, Sparkles } from 'lucide-react';

interface FocusMockStageProps {
  currentSegment: Segment;
  segmentIndex: number;
  totalSegments: number;
  segmentElapsedSeconds: number;
  totalElapsedSeconds: number;
  totalDurationSeconds: number;
  isRunning: boolean;
  onTogglePlay: () => void;
  onNextSegment: () => void;
  onPrevSegment: () => void;
  studentData: StudentIOData;
  isCheckinAlertActive: boolean;
  onDismissCheckinAlert: () => void;
}

export const FocusMockStage: React.FC<FocusMockStageProps> = ({
  currentSegment,
  segmentIndex,
  totalSegments,
  segmentElapsedSeconds,
  totalElapsedSeconds,
  totalDurationSeconds,
  isRunning,
  onTogglePlay,
  onNextSegment,
  onPrevSegment,
  studentData,
  isCheckinAlertActive,
  onDismissCheckinAlert,
}) => {
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const segmentRemaining = Math.max(0, currentSegment.durationSeconds - segmentElapsedSeconds);
  const totalRemaining = Math.max(0, totalDurationSeconds - totalElapsedSeconds);
  const isOvertime = totalElapsedSeconds > 600;
  const isSegmentWarning = segmentRemaining <= 30 && isRunning;

  return (
    <div className="relative min-h-[580px] w-full flex flex-col justify-between rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-10 shadow-2xl overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className={`absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
        isSegmentWarning ? 'bg-rose-600/20' : isRunning ? 'bg-amber-500/10' : 'bg-slate-800/10'
      }`} />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Top bar: Global Issue Prompter */}
      <div className="relative z-10 w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Target Global Issue
            </span>
            <p className="text-sm sm:text-base font-semibold text-white truncate max-w-xl">
              {studentData.globalIssue}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider">Total Oral</span>
            <div className={`font-mono-nums font-bold text-lg leading-tight ${isOvertime ? 'text-rose-400 animate-pulse' : 'text-slate-200'}`}>
              {formatTime(totalElapsedSeconds)} <span className="text-slate-500 text-sm">/ {formatTime(totalDurationSeconds)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active GI Check-in Toast if fired */}
      {isCheckinAlertActive && (
        <div className="relative z-20 my-4 rounded-2xl border-2 border-amber-400 bg-amber-500/20 p-4 shadow-xl backdrop-blur-md animate-bounce">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <BellRing className="h-6 w-6 text-amber-300" />
              <div>
                <h4 className="font-bold text-white text-base">Check-in with Global Issue!</h4>
                <p className="text-xs text-amber-200">
                  Are you explaining the effects of this technique on the understanding of "{studentData.globalIssue}"?
                </p>
              </div>
            </div>
            <button
              onClick={onDismissCheckinAlert}
              className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-300 transition-colors whitespace-nowrap"
            >
              Checked In ✓
            </button>
          </div>
        </div>
      )}

      {/* Centerpiece: Massive Stage Timer */}
      <div className="relative z-10 my-auto py-8 text-center flex flex-col items-center">
        
        {/* Segment pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/90 px-4 py-1.5 text-xs text-slate-300 shadow-md">
          <span className="font-bold uppercase tracking-wider text-amber-400">
            Segment {segmentIndex + 1} of {totalSegments}
          </span>
          <span className="text-slate-600">·</span>
          <span className="font-medium text-white">{currentSegment.title}</span>
        </div>

        {/* GI Check-in reminder quote */}
        <p className="mt-3 text-sm text-amber-300/90 max-w-lg font-medium italic">
          “{currentSegment.giCheckinReminder}”
        </p>

        {/* Giant Monospace Timer display */}
        <div className="mt-6 flex flex-col items-center">
          <span
            className={`font-mono-nums text-7xl sm:text-9xl font-black tracking-tight select-none transition-colors duration-300 ${
              isSegmentWarning
                ? 'text-rose-500 drop-shadow-[0_0_40px_rgba(244,63,94,0.4)] animate-pulse'
                : isRunning
                  ? 'text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.15)]'
                  : 'text-slate-400'
            }`}
          >
            {formatTime(segmentRemaining)}
          </span>

          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-slate-400 mt-2">
            Remaining in this segment ({formatTime(currentSegment.durationSeconds)} total)
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-full max-w-md h-3 rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isSegmentWarning ? 'bg-rose-500' : 'bg-amber-500'
            }`}
            style={{
              width: `${Math.min(100, Math.round((segmentElapsedSeconds / currentSegment.durationSeconds) * 100))}%`,
            }}
          />
        </div>

        {/* Live Speaking Cue from 10-Bullet Plan */}
        {studentData.bullets && studentData.bullets.length > 0 && (
          <div className="mt-6 w-full max-w-2xl rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
              Your 10-Bullet Speaking Cues for this segment:
            </span>
            <div className="space-y-1">
              {(segmentIndex === 0
                ? [studentData.bullets[0], studentData.bullets[1]]
                : segmentIndex === 1
                  ? [studentData.bullets[2]]
                  : segmentIndex === 2
                    ? [studentData.bullets[3], studentData.bullets[4]]
                    : segmentIndex === 3
                      ? [studentData.bullets[5]]
                      : segmentIndex === 4
                        ? [studentData.bullets[6], studentData.bullets[7]]
                        : [studentData.bullets[8], studentData.bullets[9]]
              ).filter(Boolean).map((b, bIdx) => (
                <div key={bIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-100 font-medium">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Bottom bar: Controls & Rehearsal Bullets */}
      <div className="relative z-10 w-full pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Next segment preview */}
        <div className="text-left text-xs text-slate-400 hidden sm:block">
          <span className="text-[10px] uppercase font-bold text-slate-500">Coming Up Next:</span>
          <p className="text-slate-300 font-semibold truncate max-w-xs">
            {segmentIndex < totalSegments - 1 ? studentData.customSegments[segmentIndex + 1]?.title : 'Finish & Discussion'}
          </p>
        </div>

        {/* Center transport controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPrevSegment}
            disabled={segmentIndex === 0}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous (Left Arrow)"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`flex h-16 w-16 items-center justify-center rounded-2xl font-bold shadow-xl transition-all transform active:scale-95 ${
              isRunning
                ? 'bg-rose-500 hover:bg-rose-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
            }`}
          >
            {isRunning ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
          </button>

          <button
            onClick={onNextSegment}
            disabled={segmentIndex >= totalSegments - 1}
            className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next (Right Arrow)"
          >
            <SkipForward className="h-5 w-5" />
          </button>
        </div>

        <div className="text-right text-xs text-slate-400">
          <span>Oral Countdown:</span>
          <div className="font-mono-nums font-bold text-amber-300 text-sm">
            {formatTime(totalRemaining)} remaining
          </div>
        </div>

      </div>

    </div>
  );
};
