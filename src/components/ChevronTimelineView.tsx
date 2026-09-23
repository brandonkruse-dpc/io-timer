import React, { useState } from 'react';
import { Segment, StudentIOData } from '../types';
import { Check, Sparkles, AlertCircle, Edit3, ArrowLeftRight } from 'lucide-react';

interface ChevronBulletItem {
  bulletIdx: number;
  label: string;
  placeholder: string;
  promptGuide: string;
}

interface ChevronFeatureItem {
  num: number;
  bulletIdx: number;
  label: string;
  bulletLabel: string;
  placeholder: string;
  steps: string[];
}

interface ChevronItem {
  id: string;
  timeLabel: string;
  timeDurationSec: number;
  title: string;
  segmentIdx: number;
  badgeColor: string;
  bullets?: ChevronBulletItem[];
  features?: ChevronFeatureItem[];
}

interface ChevronTimelineViewProps {
  segments: Segment[];
  activeSegmentIndex: number;
  onSelectSegment: (index: number) => void;
  segmentElapsedSeconds: number;
  isRunning: boolean;
  studentData: StudentIOData;
  includeDiscussion: boolean;
  onUpdateBullet?: (index: number, text: string) => void;
  onUpdateStudentData?: (newData: StudentIOData) => void;
  onSwapAnalysisOrder?: () => void;
}

export const ChevronTimelineView: React.FC<ChevronTimelineViewProps> = ({
  segments,
  activeSegmentIndex,
  onSelectSegment,
  segmentElapsedSeconds,
  isRunning,
  studentData,
  includeDiscussion,
  onUpdateBullet,
  onUpdateStudentData,
  onSwapAnalysisOrder,
}) => {
  // Checkbox state for features during presentation rehearsal
  const [checkedFeatures, setCheckedFeatures] = useState<Record<string, boolean>>({});

  const toggleFeature = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCheckedFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
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

  const isNonLitFirst = studentData.analysisOrder === 'non_literary_first';

  // Philpot items mapping directly connected to user's 10-bullet plan & analysis order
  const introChevron = {
    id: 'c_intro',
    timeLabel: '1 min',
    timeDurationSec: 60,
    title: 'Introduce global issue & works',
    segmentIdx: 0,
    badgeColor: 'bg-[#E56A20]',
    bullets: [
      {
        bulletIdx: 0,
        label: 'Bullet #1 · Global Issue Definition',
        placeholder: 'Define Global Issue clearly, transnational significance, and why it matters...',
        promptGuide: 'What is the global issue (GI)? Why does it matter across cultures?',
      },
      {
        bulletIdx: 1,
        label: 'Bullet #2 · Works & Thesis Statement',
        placeholder: `How is the GI presented in ${studentData.textA.title} and ${studentData.textB.title}? State your thesis...`,
        promptGuide: 'Identify both works and state how each uniquely explores the Global Issue (no direct comparison).',
      },
    ],
  };

  const litChevron = {
    id: 'c_lit',
    timeLabel: '4 min',
    timeDurationSec: 240,
    title: `Literary work and passage: ${studentData.textA.title || 'Text A'}`,
    segmentIdx: isNonLitFirst ? (segments.length > 4 ? 3 : 2) : 1,
    badgeColor: 'bg-[#E56A20]',
    features: [
      {
        num: isNonLitFirst ? 4 : 1,
        bulletIdx: isNonLitFirst ? 5 : 2,
        label: `Feature ${isNonLitFirst ? 4 : 1}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 6 : 3} · Overall Literary Work`,
        placeholder: 'Macro authorial choices across the entire literary work, motifs, and relevance to GI...',
        steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
      },
      {
        num: isNonLitFirst ? 5 : 2,
        bulletIdx: isNonLitFirst ? 6 : 3,
        label: `Feature ${isNonLitFirst ? 5 : 2}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 7 : 4} · Literary Extract (Micro 1)`,
        placeholder: 'Close reading of extract: specific diction, imagery, syntax, tone, and link to GI...',
        steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
      },
      {
        num: isNonLitFirst ? 6 : 3,
        bulletIdx: isNonLitFirst ? 7 : 4,
        label: `Feature ${isNonLitFirst ? 6 : 3}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 8 : 5} · Literary Extract (Micro 2)`,
        placeholder: 'Second extract technique: structural shifts, characterization, authorial craft, and GI...',
        steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
      },
    ],
  };

  const nonLitChevron = {
    id: 'c_nonlit',
    timeLabel: '4 min',
    timeDurationSec: 240,
    title: `Non-literary BOW and passage: ${studentData.textB.title || 'Text B'}`,
    segmentIdx: isNonLitFirst ? 1 : (segments.length > 4 ? 3 : 2),
    badgeColor: 'bg-[#E56A20]',
    features: [
      {
        num: isNonLitFirst ? 1 : 4,
        bulletIdx: isNonLitFirst ? 2 : 5,
        label: `Feature ${isNonLitFirst ? 1 : 4}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 3 : 6} · Overall Non-Lit Body of Work`,
        placeholder: 'Broader portfolio/campaign, recurring visual or rhetorical strategies, audience, and GI...',
        steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
      },
      {
        num: isNonLitFirst ? 2 : 5,
        bulletIdx: isNonLitFirst ? 3 : 6,
        label: `Feature ${isNonLitFirst ? 2 : 5}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 4 : 7} · Non-Lit Extract (Micro 1)`,
        placeholder: 'Extract micro-analysis: visual hierarchy, typography, composition, rhetorical appeal, and GI...',
        steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
      },
      {
        num: isNonLitFirst ? 3 : 6,
        bulletIdx: isNonLitFirst ? 4 : 7,
        label: `Feature ${isNonLitFirst ? 3 : 6}`,
        bulletLabel: `Bullet #${isNonLitFirst ? 5 : 8} · Non-Lit Extract (Micro 2)`,
        placeholder: 'Second extract choice: framing, color, ethos/pathos/logos, immediate effect on viewer, and GI...',
        steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
      },
    ],
  };

  const conclusionChevron = {
    id: 'c_conclusion',
    timeLabel: '1 min',
    timeDurationSec: 60,
    title: 'Conclusion',
    segmentIdx: segments.length > 4 ? 5 : 3,
    badgeColor: 'bg-[#E56A20]',
    bullets: [
      {
        bulletIdx: 8,
        label: 'Bullet #9 · Synthesis of Both Works',
        placeholder: 'How do the BOW and Lit work present the GI similarly and differently in perspective?',
        promptGuide: 'Synthesize the unique approaches of both creators without direct point-by-point comparison.',
      },
      {
        bulletIdx: 9,
        label: 'Bullet #10 · Evaluation & Final Perspective',
        placeholder: 'How effective are both creators? Final authoritative statement on the enduring relevance of the GI...',
        promptGuide: 'Evaluate creator efficacy and deliver a memorable closing takeaway before 10:00.',
      },
    ],
  };

  const chevronItems: ChevronItem[] = [
    introChevron,
    ...(isNonLitFirst ? [nonLitChevron, litChevron] : [litChevron, nonLitChevron]),
    conclusionChevron,
    ...(includeDiscussion ? [{
      id: 'c_discussion',
      timeLabel: '5 min',
      timeDurationSec: 300,
      title: 'Discussion (Teacher Follow-up)',
      segmentIdx: segments.length > 4 ? 6 : 4,
      badgeColor: 'bg-[#E56A20]',
      bullets: [
        {
          bulletIdx: -1,
          label: 'Teacher Follow-up & Discussion Guidance',
          placeholder: 'Notes on possible teacher questions: contextual nuances, subtle ambiguities, or authorial choices...',
          promptGuide: '“You mentioned... could you elaborate on...?” Listen carefully and refer back to extracts.',
        },
      ],
    }] : []),
  ];

  return (
    <div className="w-full space-y-6">
      {/* Title header */}
      <div className="text-center">
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Individual Oral
        </h2>
        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-0.5">
          Philpot Education Outline Method 1 · 10-Minute Structural Flow
        </p>
      </div>

      {/* Synchronized Practice Banner & Swap Control */}
      <div className="no-print space-y-2">
        <div className="rounded-2xl border border-amber-300 dark:border-amber-500/30 bg-amber-50/90 dark:bg-amber-950/30 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200 shadow-sm">
          <div className="flex items-center gap-2.5">
            <Edit3 className="h-4 w-4 text-amber-700 dark:text-amber-400 shrink-0" />
            <p className="font-medium">
              <strong className="font-bold">Two-Way Practice Editing:</strong> The text fields inside each chevron correspond directly to your <strong className="font-bold">10 Bullet Points</strong>. Any edits made here sync live.
            </p>
          </div>
          {onSwapAnalysisOrder && (
            <button
              type="button"
              onClick={onSwapAnalysisOrder}
              className="self-start sm:self-auto shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-300 dark:border-amber-500/40 bg-white dark:bg-slate-900 hover:bg-amber-100 dark:hover:bg-amber-500/20 text-amber-950 dark:text-amber-300 text-xs font-bold transition-colors shadow-xs"
              title="Swap which text is analyzed first"
            >
              <ArrowLeftRight className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span>Order: {isNonLitFirst ? 'Non-Lit First ⇄' : 'Lit First ⇄'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Chevrons Container - Full width matching header */}
      <div className="space-y-4 w-full">
        {chevronItems.map((item) => {
          // Check if this chevron corresponds to active segment
          const isCurrentActive = activeSegmentIndex === item.segmentIdx || 
            (item.segmentIdx === 1 && (activeSegmentIndex === 1 || activeSegmentIndex === 2) && segments.length > 4) ||
            (item.segmentIdx === 2 && (activeSegmentIndex === 3 || activeSegmentIndex === 4) && segments.length > 4);

          const isCompleted = activeSegmentIndex > (item.segmentIdx === 1 && segments.length > 4 ? 2 : item.segmentIdx);

          const currentSecRemaining = isCurrentActive 
            ? Math.max(0, item.timeDurationSec - segmentElapsedSeconds)
            : item.timeDurationSec;

          return (
            <div
              key={item.id}
              onClick={() => onSelectSegment(item.segmentIdx)}
              className={`group relative flex flex-col md:flex-row items-stretch rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer shadow-sm ${
                isCurrentActive
                  ? 'border-amber-500 ring-2 ring-amber-500/40 shadow-amber-500/10 scale-[1.005]'
                  : isCompleted
                    ? 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 opacity-80 hover:opacity-100'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              {/* Left Arrow Banner / Chevron Block */}
              <div className="relative flex items-stretch md:w-80 shrink-0">
                {/* Time Badge block */}
                <div className={`flex flex-col items-center justify-center px-5 py-6 ${item.badgeColor} text-white font-bold shrink-0 min-w-[70px]`}>
                  <span className="text-xl font-mono-nums font-extrabold leading-none">
                    {item.timeLabel.split(' ')[0]}
                  </span>
                  <span className="text-xs uppercase tracking-wider opacity-90">min</span>
                </div>

                {/* Arrow Shaped Header Block */}
                <div className="relative flex flex-1 items-center bg-gradient-to-r from-[#942222] to-[#B32D2D] px-5 py-6 text-white pr-10">
                  <h3 className="text-base sm:text-lg font-bold leading-tight drop-shadow-sm">
                    {item.title}
                  </h3>

                  {/* Angled Chevron Point for Desktop */}
                  <div
                    className="hidden md:block absolute right-0 top-0 bottom-0 w-6 translate-x-full z-10"
                    style={{
                      clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
                      backgroundColor: '#B32D2D',
                    }}
                  />
                </div>
              </div>

              {/* Right Content / Bullet Points Area */}
              <div className="flex-1 bg-slate-50/70 dark:bg-white/[0.04] p-5 md:pl-10 flex flex-col justify-center transition-colors">
                {/* Active time indicator header */}
                {isCurrentActive && (
                  <div className="mb-3 flex items-center justify-between rounded-lg bg-amber-50 dark:bg-amber-500/10 px-3 py-1.5 border border-amber-300 dark:border-amber-500/30">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300">
                        {isRunning ? 'Currently Speaking' : 'Paused at this stage'}
                      </span>
                    </div>
                    <span className="font-mono-nums text-sm font-bold text-slate-900 dark:text-white">
                      {formatMinSec(currentSecRemaining)} remaining
                    </span>
                  </div>
                )}

                {/* Bullets view (Intro, Conclusion & Discussion) */}
                {item.bullets && (
                  <div className="space-y-3">
                    {item.bullets.map((bObj, bIdx) => {
                      const bulletVal = bObj.bulletIdx >= 0 ? (studentData.bullets[bObj.bulletIdx] || '') : '';
                      const wordCount = getWordCount(bulletVal);

                      return (
                        <div
                          key={bIdx}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded-xl p-3 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/70 transition-colors shadow-xs"
                        >
                          <div className="flex items-center justify-between pb-1.5 border-b border-slate-100 dark:border-slate-800/80 mb-2">
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                              • {bObj.label}
                            </span>
                            {bObj.bulletIdx >= 0 && (
                              <span className="text-[11px] font-mono-nums text-slate-500 dark:text-slate-400 font-semibold">
                                {wordCount} words {wordCount > 25 && <span className="text-rose-600 font-bold ml-1">(too long)</span>}
                              </span>
                            )}
                          </div>

                          {bObj.bulletIdx >= 0 ? (
                            <textarea
                              rows={2}
                              value={bulletVal}
                              onChange={(e) => handleBulletChange(bObj.bulletIdx, e.target.value)}
                              placeholder={bObj.placeholder}
                              className="w-full bg-slate-50/50 dark:bg-slate-900/40 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium leading-relaxed"
                            />
                          ) : (
                            <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                              {bObj.placeholder}
                            </p>
                          )}

                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
                            Guidance: {bObj.promptGuide}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Features Checklist view (Literary 1-3 & Non-Literary 4-6) */}
                {item.features && (
                  <div className="space-y-3">
                    {item.features.map((feat) => {
                      const featKey = `${item.id}_${feat.num}`;
                      const isChecked = !!checkedFeatures[featKey];
                      const bulletVal = studentData.bullets[feat.bulletIdx] || '';
                      const wordCount = getWordCount(bulletVal);

                      return (
                        <div
                          key={feat.num}
                          className={`rounded-xl p-3 transition-colors border shadow-xs ${
                            isChecked
                              ? 'bg-emerald-50/80 dark:bg-emerald-950/25 border-emerald-400 dark:border-emerald-500/40'
                              : 'bg-white dark:bg-slate-950/60 border-slate-200 dark:border-slate-800'
                          }`}
                        >
                          {/* Feature Header + Checkbox */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                                • {feat.label}
                              </span>
                              <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-500/20 text-amber-950 dark:text-amber-300 font-bold border border-amber-300 dark:border-amber-500/30">
                                {feat.bulletLabel}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-mono-nums text-slate-500 dark:text-slate-400 font-semibold">
                                {wordCount} words
                              </span>
                              <button
                                type="button"
                                onClick={(e) => toggleFeature(featKey, e)}
                                className="flex items-center gap-1.5 text-[11px] font-medium"
                              >
                                <div
                                  className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                    isChecked
                                      ? 'bg-emerald-500 border-emerald-400 text-white'
                                      : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900'
                                  }`}
                                >
                                  {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                                </div>
                                <span className="text-slate-600 dark:text-slate-400 text-[10px] font-semibold">
                                  {isChecked ? 'Delivered' : 'Check-off'}
                                </span>
                              </button>
                            </div>
                          </div>

                          {/* Editable Bullet Textarea */}
                          <div onClick={(e) => e.stopPropagation()}>
                            <textarea
                              rows={2}
                              value={bulletVal}
                              onChange={(e) => handleBulletChange(feat.bulletIdx, e.target.value)}
                              placeholder={feat.placeholder}
                              className="w-full bg-slate-50/70 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700/80 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 resize-none font-medium leading-relaxed"
                            />
                          </div>

                          {/* Step chips progression */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs text-slate-800 dark:text-slate-300">
                            {feat.steps.map((st, sIdx) => (
                              <React.Fragment key={sIdx}>
                                <span className={`px-1.5 py-0.5 rounded text-[11px] ${
                                  sIdx === feat.steps.length - 1
                                    ? 'bg-amber-100 text-amber-950 font-bold border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                                    : 'bg-slate-100 text-slate-800 font-medium border border-slate-200 dark:border-transparent dark:bg-slate-800/60 dark:text-slate-300'
                                }`}>
                                  {st}
                                </span>
                                {sIdx < feat.steps.length - 1 && (
                                  <span className="text-slate-500 dark:text-slate-400 text-[10px]">→</span>
                                )}
                              </React.Fragment>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Philpot credit footer & IB reminder */}
      <div className="w-full flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-900">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-500" />
          <span>Philpot Education Outline Method 1 Structure</span>
        </div>
        <span>IB English A: Language & Literature</span>
      </div>
    </div>
  );
};
