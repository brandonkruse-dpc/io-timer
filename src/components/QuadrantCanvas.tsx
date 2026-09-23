import React from 'react';
import { Segment, StudentIOData } from '../types';
import { Sparkles, BookOpen, Newspaper, ShieldAlert, CheckCircle } from 'lucide-react';

interface QuadrantCanvasProps {
  segments: Segment[];
  activeSegmentIndex: number;
  onSelectSegment: (index: number) => void;
  segmentElapsedSeconds: number;
  isRunning: boolean;
  studentData: StudentIOData;
}

export const QuadrantCanvas: React.FC<QuadrantCanvasProps> = ({
  segments,
  activeSegmentIndex,
  onSelectSegment,
  segmentElapsedSeconds,
  isRunning,
  studentData,
}) => {
  const currentSegment = segments[activeSegmentIndex];

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}m ${secs.toString().padStart(2, '0')}s`;
  };

  // Find segments by their target role or quadrant position
  const introSegment = segments.find((s) => s.type === 'intro') || segments[0];
  const conclusionSegment = segments.find((s) => s.type === 'conclusion') || segments[segments.length - 1];

  const textAWorkSegment = segments.find((s) => s.type === 'textA_work') || segments[1];
  const textAExtractSegment = segments.find((s) => s.type === 'textA_extract') || segments[2];

  const textBWorkSegment = segments.find((s) => s.type === 'textB_work') || segments[3];
  const textBExtractSegment = segments.find((s) => s.type === 'textB_extract') || segments[4];

  // Helper to render quadrant card
  const renderQuadrantCard = (
    segment: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    workMetadata: { title: string; creator: string; extractDetails?: string; isLiterary: boolean },
    positionClass: string,
    icon: React.ReactNode,
  ) => {
    if (!segment) return null;
    const segIdx = segments.findIndex((s) => s.id === segment.id);
    const isActive = activeSegmentIndex === segIdx;
    const isCompleted = activeSegmentIndex > segIdx;
    const remaining = Math.max(0, segment.durationSeconds - (isActive ? segmentElapsedSeconds : 0));
    const percent = isActive
      ? Math.min(100, Math.round((segmentElapsedSeconds / segment.durationSeconds) * 100))
      : isCompleted ? 100 : 0;

    return (
      <div
        onClick={() => onSelectSegment(segIdx)}
        className={`group relative flex flex-col justify-between p-6 transition-all duration-300 cursor-pointer overflow-hidden border ${positionClass} ${
          isActive
            ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.25)]'
            : isCompleted
              ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
              : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/50'
        }`}
      >
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent pointer-events-none" />

        {/* Top bar in card: Number badge and titles */}
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              {/* Number box matching Image 2 */}
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 text-lg font-bold shadow-md transition-all ${
                  isActive
                    ? 'border-white bg-white text-slate-950 scale-105'
                    : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 bg-slate-950 text-slate-300'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : blockNum}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {labelHeader}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-[11px] font-mono-nums text-slate-400">
                    {Math.round(segment.durationSeconds / 60)} min
                  </span>
                </div>
                <h3 className="text-base font-bold text-white leading-snug">
                  {subtitleLabel}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {icon}
            </div>
          </div>

          {/* Student Work details */}
          <div className="mt-3 rounded-lg bg-slate-950/60 p-2.5 border border-slate-800/60 text-xs">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span className="font-semibold text-slate-300 truncate">{workMetadata.title}</span>
              <span className="text-slate-500 truncate ml-2">by {workMetadata.creator}</span>
            </div>
            {workMetadata.extractDetails && (
              <p className="mt-1 text-[11px] text-amber-300/80 truncate">
                Extract: {workMetadata.extractDetails}
              </p>
            )}
          </div>

          {/* Key Prompts & Checklist */}
          <div className="mt-3 space-y-1.5">
            {segment.keyPrompts.slice(0, 2).map((prompt, pIdx) => (
              <div key={pIdx} className="flex items-start gap-1.5 text-xs text-slate-300">
                <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                <span className="line-clamp-2 leading-relaxed">{prompt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Timer Card when Active (Directly inspired by Image 2 1m 59s box!) */}
        <div className="relative z-10 mt-6 pt-3 border-t border-slate-800/60">
          {isActive ? (
            <div className="rounded-xl border-2 border-white/90 bg-white p-4 shadow-2xl text-slate-950 transition-all transform animate-pulse-glow">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  {isRunning ? 'Speaking Now' : 'Paused'}
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600">
                  <Sparkles className="h-3 w-3 text-rose-500" />
                  <span>Connect to GI!</span>
                </div>
              </div>

              {/* Big High-Contrast Timer Box like Image 2 */}
              <div className="my-1 flex items-baseline justify-between">
                <div className="font-mono-nums text-3xl font-extrabold tracking-tight text-slate-950">
                  {formatMinSec(remaining)}
                </div>
                <div className="text-xs font-semibold text-slate-500 font-mono-nums">
                  / {formatMinSec(segment.durationSeconds)}
                </div>
              </div>

              {/* Progress bar in active card */}
              <div className="h-1.5 w-full rounded-full bg-slate-200 overflow-hidden mt-1">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Specific GI reminder */}
              <p className="mt-2 text-[11px] font-medium text-slate-700 italic border-t border-slate-100 pt-1.5 line-clamp-1">
                “{segment.giCheckinReminder}”
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px]">
                {isCompleted ? 'Segment Completed' : 'Click to jump to this stage'}
              </span>
              <span className="font-mono-nums font-semibold text-slate-300">
                {formatMinSec(segment.durationSeconds)}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Center column pills: 1. Intro & 6. Conclusion
  const renderCenterPill = (
    segment: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    isTop: boolean,
  ) => {
    if (!segment) return null;
    const segIdx = segments.findIndex((s) => s.id === segment.id);
    const isActive = activeSegmentIndex === segIdx;
    const isCompleted = activeSegmentIndex > segIdx;
    const remaining = Math.max(0, segment.durationSeconds - (isActive ? segmentElapsedSeconds : 0));
    const percent = isActive
      ? Math.min(100, Math.round((segmentElapsedSeconds / segment.durationSeconds) * 100))
      : isCompleted ? 100 : 0;

    return (
      <div
        onClick={() => onSelectSegment(segIdx)}
        className={`group relative flex flex-col justify-between p-5 transition-all duration-300 cursor-pointer overflow-hidden border ${
          isTop ? 'rounded-t-3xl border-b-0' : 'rounded-b-3xl border-t-0'
        } ${
          isActive
            ? 'bg-rose-950/40 border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)] z-20'
            : isCompleted
              ? 'bg-slate-900/80 border-slate-800'
              : 'bg-slate-900/50 border-slate-800 hover:bg-slate-900/70'
        }`}
      >
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 text-base font-bold shadow ${
              isActive
                ? 'border-white bg-white text-slate-950'
                : isCompleted
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-slate-700 bg-slate-950 text-slate-300'
            }`}
          >
            {isCompleted ? <CheckCircle className="h-4 w-4" /> : blockNum}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <span>{labelHeader}</span>
              <span className="text-slate-600">·</span>
              <span className="font-mono-nums text-slate-400">1 min</span>
            </div>
            <h4 className="text-sm font-bold text-white truncate">{subtitleLabel}</h4>
            <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
              {segment.keyPrompts[0]}
            </p>
          </div>
        </div>

        {/* Active mini timer */}
        {isActive && (
          <div className="mt-3 rounded-lg bg-white p-2.5 text-slate-950 shadow-lg animate-pulse-glow">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-600 uppercase text-[10px]">Active</span>
              <span className="font-mono-nums font-extrabold text-base">
                {formatMinSec(remaining)}
              </span>
            </div>
            <div className="h-1 w-full rounded-full bg-slate-200 mt-1">
              <div className="h-full bg-rose-500" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {/* Visual Canvas Container - 4 Quadrants + Center Pill */}
      <div className="relative rounded-3xl border border-slate-800 bg-slate-950/80 p-2 sm:p-4 backdrop-blur-md shadow-2xl">

        {/* 50/50 Balance Indicator Banner */}
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">IB Balance Check:</span>
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-blue-300 font-mono-nums border border-blue-500/20">
              Literary Work: ~4m
            </span>
            <span className="text-slate-600">+</span>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-300 font-mono-nums border border-emerald-500/20">
              Non-Lit BOW: ~4m
            </span>
            <span className="text-slate-600">+</span>
            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-amber-300 font-mono-nums border border-amber-500/20">
              Intro & Concl: ~2m
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-[11px]">Equal weight between Extracts & Entire Works required</span>
          </div>
        </div>

        {/* Main Grid: 3 columns on large screens (Left Quadrants, Center Pill, Right Quadrants) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_260px_1fr] gap-3 relative">

          {/* Left Column: TEXT A (Literary) */}
          <div className="flex flex-col gap-3">
            {renderQuadrantCard(
              textAWorkSegment,
              2,
              'TEXT A: Overall Work / Body of Work',
              'Macro Techniques & Overarching Themes',
              studentData.textA,
              'rounded-2xl min-h-[220px]',
              <BookOpen className="h-5 w-5 text-blue-400" />,
            )}

            {renderQuadrantCard(
              textAExtractSegment,
              3,
              'TEXT A: Extract (Micro)',
              '1–2 Specific Literary Choices in Passage',
              studentData.textA,
              'rounded-2xl min-h-[220px]',
              <BookOpen className="h-5 w-5 text-purple-400" />,
            )}
          </div>

          {/* Center Column: 1. Intro (Top) & 6. Conclusion (Bottom) */}
          <div className="order-first lg:order-none flex flex-col justify-between gap-3">
            {renderCenterPill(
              introSegment,
              1,
              '1. Intro',
              'Global Issue & Organization',
              true,
            )}

            {/* Central Visual Hub / GI Target Shield */}
            <div className="hidden lg:flex flex-col items-center justify-center p-4 rounded-2xl border border-slate-800 bg-slate-900/40 text-center my-auto">
              <div className="h-10 w-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                Independent Link
              </span>
              <p className="text-[11px] text-slate-400 mt-1 leading-snug max-w-[200px]">
                Both sides anchor into the Global Issue with zero direct comparison.
              </p>
            </div>

            {renderCenterPill(
              conclusionSegment,
              6,
              '6. Conclusion',
              'Value of Each Work’s GI Presentation',
              false,
            )}
          </div>

          {/* Right Column: TEXT B (Non-Literary) */}
          <div className="flex flex-col gap-3">
            {renderQuadrantCard(
              textBWorkSegment,
              4,
              'TEXT B: Overall Work / Body of Work',
              'Wider Repertoire, Campaigns & Medium',
              studentData.textB,
              'rounded-2xl min-h-[220px]',
              <Newspaper className="h-5 w-5 text-emerald-400" />,
            )}

            {renderQuadrantCard(
              textBExtractSegment,
              5,
              'TEXT B: Extract (Micro)',
              '1–2 Specific Multimodal / Rhetorical Choices',
              studentData.textB,
              'rounded-2xl min-h-[220px]',
              <Newspaper className="h-5 w-5 text-rose-400" />,
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
