import React, { useState } from 'react';
import { Segment, StudentIOData, WorkMetadata } from '../types';
import { BookOpen, Sparkles, CheckCircle, ShieldAlert, Edit3, ChevronDown, ChevronUp } from 'lucide-react';

interface QuadrantCanvasProps {
  segments: Segment[];
  activeSegmentIndex: number;
  onSelectSegment: (index: number) => void;
  segmentElapsedSeconds: number;
  isRunning: boolean;
  studentData: StudentIOData;
  onUpdateBullet?: (index: number, text: string) => void;
  onUpdateStudentData?: (newData: StudentIOData) => void;
}

export const QuadrantCanvas: React.FC<QuadrantCanvasProps> = ({
  segments,
  activeSegmentIndex,
  onSelectSegment,
  segmentElapsedSeconds,
  isRunning,
  studentData,
  onUpdateBullet,
  onUpdateStudentData,
}) => {
  const [expandedGuidance, setExpandedGuidance] = useState<Record<string, boolean>>({});
  const [editingMetadata, setEditingMetadata] = useState<Record<string, boolean>>({});

  const toggleGuidance = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedGuidance((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleEditMetadata = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMetadata((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatMinSec = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBulletChange = (idx: number, text: string) => {
    if (onUpdateBullet) {
      onUpdateBullet(idx, text);
    } else if (onUpdateStudentData) {
      const newBullets = [...studentData.bullets];
      while (newBullets.length <= idx) {
        newBullets.push('');
      }
      newBullets[idx] = text;
      onUpdateStudentData({ ...studentData, bullets: newBullets });
    }
  };

  const getWordCount = (str?: string) => {
    if (!str || !str.trim()) return 0;
    return str.trim().split(/\s+/).length;
  };

  // Find segments by role
  const introSegment = segments.find((s) => s.type === 'intro') || segments[0];
  const textAWorkSegment = segments.find((s) => s.type === 'textA_work') || segments[1];
  const textAExtractSegment = segments.find((s) => s.type === 'textA_extract') || segments[2];
  const textBWorkSegment = segments.find((s) => s.type === 'textB_work') || segments[3];
  const textBExtractSegment = segments.find((s) => s.type === 'textB_extract') || segments[4];
  const conclusionSegment = segments.find((s) => s.type === 'conclusion') || segments[segments.length - 1];

  const renderQuadrantCard = (
    segment: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    workKey: 'textA' | 'textB',
    workMetadata: WorkMetadata,
    bulletIndices: number[],
    bulletLabels: string[],
    bulletPlaceholders: string[],
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
    const cardKey = `card_${blockNum}`;
    const showGuidance = !!expandedGuidance[cardKey];
    const isEditingMeta = !!editingMetadata[cardKey];

    return (
      <div
        onClick={() => onSelectSegment(segIdx)}
        className={`group relative flex flex-col justify-between p-5 transition-all duration-300 cursor-pointer overflow-hidden border shadow-sm ${positionClass} ${
          isActive
            ? 'bg-rose-50/95 dark:bg-rose-950/40 border-rose-500 shadow-[0_0_35px_rgba(244,63,94,0.2)] ring-1 ring-rose-500/40'
            : isCompleted
              ? 'bg-slate-100/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-90 hover:opacity-100'
              : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
        }`}
      >
        {/* Top bar in card: Number badge and titles */}
        <div className="relative z-10 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 text-lg font-bold shadow-sm transition-all ${
                  isActive
                    ? 'border-rose-500 bg-rose-500 text-white scale-105'
                    : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
                }`}
              >
                {isCompleted ? <CheckCircle className="h-5 w-5" /> : blockNum}
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-400">
                    {labelHeader}
                  </span>
                  <span className="text-slate-400 dark:text-slate-600">·</span>
                  <span className="text-[11px] font-mono-nums font-semibold text-slate-600 dark:text-slate-400">
                    {Math.round(segment.durationSeconds / 60)} min
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
                  {subtitleLabel}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {icon}
            </div>
          </div>

          {/* Student Work details banner (with inline quick edit) */}
          <div className="rounded-xl bg-slate-50 dark:bg-slate-950/60 p-2.5 border border-slate-200 dark:border-slate-800/80 text-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white truncate">
                <span>{workMetadata.title}</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">by {workMetadata.creator}</span>
              </div>
              <button
                type="button"
                onClick={(e) => toggleEditMetadata(cardKey, e)}
                className="text-[10px] text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-0.5 ml-2 shrink-0"
              >
                <Edit3 className="h-2.5 w-2.5" />
                <span>{isEditingMeta ? 'Done' : 'Edit Text Details'}</span>
              </button>
            </div>

            {isEditingMeta ? (
              <div onClick={(e) => e.stopPropagation()} className="mt-2 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={workMetadata.title}
                    onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                      ...studentData,
                      [workKey]: { ...workMetadata, title: e.target.value }
                    })}
                    placeholder="Work Title"
                    className="w-1/2 p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={workMetadata.creator}
                    onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                      ...studentData,
                      [workKey]: { ...workMetadata, creator: e.target.value }
                    })}
                    placeholder="Creator / Author"
                    className="w-1/2 p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
                <input
                  type="text"
                  value={workMetadata.extractDetails}
                  onChange={(e) => onUpdateStudentData && onUpdateStudentData({
                    ...studentData,
                    [workKey]: { ...workMetadata, extractDetails: e.target.value }
                  })}
                  placeholder="Extract Details (e.g. Lines 24-65)"
                  className="w-full p-1 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                />
              </div>
            ) : (
              workMetadata.extractDetails && (
                <p className="mt-1 text-[11px] text-amber-900 dark:text-amber-300 font-semibold truncate">
                  Extract: {workMetadata.extractDetails}
                </p>
              )
            )}
          </div>

          {/* Synchronized Candidate Bullets for this Quadrant */}
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 block">
              Candidate Speaking Points (Editable):
            </span>

            {bulletIndices.map((bIdx, i) => {
              const bulletVal = studentData.bullets[bIdx] || '';
              const wordCount = getWordCount(bulletVal);

              return (
                <div
                  key={bIdx}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-2.5 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400">
                      • {bulletLabels[i]}
                    </span>
                    <span className="text-[10px] font-mono-nums text-slate-500 font-semibold">
                      {wordCount} words {wordCount > 25 && <span className="text-rose-600 font-bold ml-1">(too long)</span>}
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={bulletVal}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    placeholder={bulletPlaceholders[i]}
                    className="w-full bg-slate-50/60 dark:bg-slate-900/40 p-1.5 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium leading-relaxed"
                  />
                </div>
              );
            })}
          </div>

          {/* Collapsible Rubric Guidance */}
          <div className="pt-1">
            <button
              type="button"
              onClick={(e) => toggleGuidance(cardKey, e)}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex items-center gap-1"
            >
              {showGuidance ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>{showGuidance ? 'Hide Examiner Advice' : 'View Examiner Advice'}</span>
            </button>

            {showGuidance && (
              <div className="mt-2 space-y-1.5 rounded-lg bg-slate-50 dark:bg-slate-950/40 p-2 text-xs text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                {segment.keyPrompts.map((p, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-1.5 leading-snug">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Floating Timer Card when Active */}
        <div className="relative z-10 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800/60">
          {isActive ? (
            <div className="rounded-xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-950 p-3 shadow-xl text-slate-950 dark:text-white transition-all transform animate-pulse-glow">
              <div className="flex items-center justify-between">
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Speaking Now · {segment.title}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
                  <span>{formatMinSec(segmentElapsedSeconds)} elapsed</span>
                </div>
              </div>

              <div className="mt-1.5 flex items-baseline justify-between">
                <span className="font-mono-nums text-xl sm:text-2xl font-extrabold tracking-tight">
                  {formatMinSec(remaining)}
                </span>
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Target: {Math.round(segment.durationSeconds / 60)} min
                </span>
              </div>

              <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span>{isCompleted ? 'Completed ✓' : 'Click to jump to quadrant'}</span>
              <span className="font-mono-nums">{formatMinSec(segment.durationSeconds)}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCenterPill = (
    segment: Segment | undefined,
    blockNum: number,
    labelHeader: string,
    subtitleLabel: string,
    bulletIndices: number[],
    bulletLabels: string[],
    bulletPlaceholders: string[],
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
        className={`group relative flex flex-col justify-between p-4 transition-all duration-300 cursor-pointer overflow-hidden border shadow-sm ${
          isTop ? 'rounded-2xl' : 'rounded-2xl'
        } ${
          isActive
            ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 shadow-lg z-20 ring-1 ring-rose-500/40'
            : isCompleted
              ? 'bg-slate-100 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800'
              : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/70'
        }`}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-2.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border-2 text-sm font-bold shadow-sm ${
                isActive
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : isCompleted
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200'
              }`}
            >
              {isCompleted ? <CheckCircle className="h-4 w-4" /> : blockNum}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                <span>{labelHeader}</span>
                <span className="text-slate-400 dark:text-slate-600">·</span>
                <span className="font-mono-nums font-semibold text-slate-600 dark:text-slate-400">1 min</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{subtitleLabel}</h4>
            </div>
          </div>

          {/* Editable bullets for Intro or Conclusion */}
          <div className="space-y-2">
            {bulletIndices.map((bIdx, i) => {
              const bulletVal = studentData.bullets[bIdx] || '';
              const wordCount = getWordCount(bulletVal);

              return (
                <div
                  key={bIdx}
                  onClick={(e) => e.stopPropagation()}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 p-2 shadow-xs"
                >
                  <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 uppercase">
                      • {bulletLabels[i]}
                    </span>
                    <span className="text-[9px] font-mono-nums text-slate-500 font-semibold">
                      {wordCount}w
                    </span>
                  </div>

                  <textarea
                    rows={2}
                    value={bulletVal}
                    onChange={(e) => handleBulletChange(bIdx, e.target.value)}
                    placeholder={bulletPlaceholders[i]}
                    className="w-full bg-slate-50/70 dark:bg-slate-900/40 p-1.5 rounded border border-slate-200 dark:border-slate-700/80 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 resize-none font-medium leading-snug"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Active mini timer */}
        {isActive && (
          <div className="mt-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-2 text-slate-950 dark:text-white shadow-md animate-pulse-glow">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-600 dark:text-rose-400 uppercase text-[10px]">Active</span>
              <span className="font-mono-nums font-extrabold text-sm">
                {formatMinSec(remaining)}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 mt-1.5 overflow-hidden">
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
      <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/80 p-3 sm:p-5 backdrop-blur-md shadow-xl dark:shadow-2xl transition-colors">

        {/* 50/50 Balance Indicator Banner */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 px-2 text-xs text-slate-700 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-200">IB Balance Check:</span>
            <span className="rounded-lg bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-blue-900 dark:text-blue-300 font-mono-nums border border-blue-200 dark:border-blue-500/20 font-bold">
              Literary Work: ~4m
            </span>
            <span className="text-slate-400 dark:text-slate-600">+</span>
            <span className="rounded-lg bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 text-emerald-900 dark:text-emerald-300 font-mono-nums border border-emerald-200 dark:border-emerald-500/20 font-bold">
              Non-Lit BOW: ~4m
            </span>
            <span className="text-slate-400 dark:text-slate-600">+</span>
            <span className="rounded-lg bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 text-amber-900 dark:text-amber-300 font-mono-nums border border-amber-200 dark:border-amber-500/20 font-bold">
              Intro & Concl: ~2m
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
            <span className="text-[11px] font-medium">Equal weight between Extracts & Entire Works required</span>
          </div>
        </div>

        {/* Main Grid: 3 columns on large screens (Left Quadrants, Center Column, Right Quadrants) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px_1fr] gap-4 relative">

          {/* Left Column: TEXT A (Literary) */}
          <div className="flex flex-col gap-4">
            {renderQuadrantCard(
              textAWorkSegment,
              2,
              'TEXT A: Overall Work',
              'Macro Techniques & Overarching Themes',
              'textA',
              studentData.textA,
              [2],
              ['Bullet #3 · Overall Literary Work'],
              ['Macro authorial choices, structural patterns, context, and connection to GI...'],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-blue-500" />,
            )}

            {renderQuadrantCard(
              textAExtractSegment,
              3,
              'TEXT A: Extract (Micro)',
              '1–2 Specific Literary Choices in Passage',
              'textA',
              studentData.textA,
              [3, 4],
              ['Bullet #4 · Extract Choice 1', 'Bullet #5 · Extract Choice 2'],
              [
                'Close analysis of 1st choice: diction, syntax, figurative language, tone...',
                'Close analysis of 2nd choice: structural shifts, characterization, effect on audience...',
              ],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-purple-500" />,
            )}
          </div>

          {/* Center Column: 1. Intro (Top) & 6. Conclusion (Bottom) */}
          <div className="flex flex-col justify-between gap-4">
            {renderCenterPill(
              introSegment,
              1,
              '1. Intro',
              'Global Issue & Organization',
              [0, 1],
              ['Bullet #1: Global Issue', 'Bullet #2: Works & Thesis'],
              [
                'Define GI and its transnational/local importance...',
                'Thesis: How both works present the GI independently...',
              ],
              true,
            )}

            {/* Central Visual Hub / GI Target Shield */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center my-auto shadow-sm">
              <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1.5">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-300">
                Independent Anchor
              </span>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5 leading-snug max-w-[220px]">
                Both texts anchor independently to the Global Issue with equal weight.
              </p>
            </div>

            {renderCenterPill(
              conclusionSegment,
              6,
              '6. Conclusion',
              'Value of Each Work’s GI Presentation',
              [8, 9],
              ['Bullet #9: GI Synthesis', 'Bullet #10: Final Takeaway'],
              [
                'Synthesis: Compare creator approaches to the GI...',
                'Evaluation: Creator efficacy and enduring impact...',
              ],
              false,
            )}
          </div>

          {/* Right Column: TEXT B (Non-Literary) */}
          <div className="flex flex-col gap-4">
            {renderQuadrantCard(
              textBWorkSegment,
              4,
              'TEXT B: Overall Body of Work',
              'Macro Strategies across the Creator’s Works',
              'textB',
              studentData.textB,
              [5],
              ['Bullet #6 · Overall Non-Lit Body of Work'],
              ['Creator broader portfolio/campaign strategies, intended audience, and GI...'],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-emerald-500" />,
            )}

            {renderQuadrantCard(
              textBExtractSegment,
              5,
              'TEXT B: Extract (Micro)',
              '1–2 Specific Multimodal / Rhetorical Choices',
              'textB',
              studentData.textB,
              [6, 7],
              ['Bullet #7 · Non-Lit Extract Choice 1', 'Bullet #8 · Non-Lit Extract Choice 2'],
              [
                'Micro analysis of 1st choice: visual hierarchy, typography, framing...',
                'Micro analysis of 2nd choice: rhetorical appeal, color, contrast, effect on viewer...',
              ],
              'rounded-2xl',
              <BookOpen className="h-5 w-5 text-rose-500" />,
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
