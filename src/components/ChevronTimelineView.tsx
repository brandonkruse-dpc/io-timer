import React, { useState } from 'react';
import { Segment, StudentIOData } from '../types';
import { Check, Sparkles, AlertCircle } from 'lucide-react';

interface ChevronTimelineViewProps {
  segments: Segment[];
  activeSegmentIndex: number;
  onSelectSegment: (index: number) => void;
  segmentElapsedSeconds: number;
  isRunning: boolean;
  studentData: StudentIOData;
  includeDiscussion: boolean;
}

export const ChevronTimelineView: React.FC<ChevronTimelineViewProps> = ({
  segments,
  activeSegmentIndex,
  onSelectSegment,
  segmentElapsedSeconds,
  isRunning,
  studentData,
  includeDiscussion,
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

  // Philpot items mapping
  const chevronItems = [
    {
      id: 'c_intro',
      timeLabel: '1 min',
      timeDurationSec: 60,
      title: 'Introduce global issue & works',
      bullets: [
        'What is the global issue (GI)? Why does it matter?',
        `How is your GI presented in your literary work (${studentData.textA.title}) and non-lit BOW (${studentData.textB.title})? (Answer = thesis statement)`,
      ],
      colorBg: 'from-[#8B1E1E] to-[#A02828]',
      badgeColor: 'bg-[#E56A20]',
      segmentIdx: 0,
    },
    {
      id: 'c_lit',
      timeLabel: '4 min',
      timeDurationSec: 240,
      title: 'Literary work and passage',
      features: [
        {
          num: 1,
          label: 'Feature 1',
          steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
        },
        {
          num: 2,
          label: 'Feature 2',
          steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
        },
        {
          num: 3,
          label: 'Feature 3',
          steps: ['example from passage', 'effects', 'examples from entire work', 'effects', 'relevance to GI'],
        },
      ],
      colorBg: 'from-[#8B1E1E] to-[#A02828]',
      badgeColor: 'bg-[#E56A20]',
      segmentIdx: 1,
    },
    {
      id: 'c_nonlit',
      timeLabel: '4 min',
      timeDurationSec: 240,
      title: 'Non-literary BOW and passage',
      features: [
        {
          num: 4,
          label: 'Feature 4',
          steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
        },
        {
          num: 5,
          label: 'Feature 5',
          steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
        },
        {
          num: 6,
          label: 'Feature 6',
          steps: ['example from passage', 'effects', 'examples from BOW', 'effects', 'relevance to GI'],
        },
      ],
      colorBg: 'from-[#8B1E1E] to-[#A02828]',
      badgeColor: 'bg-[#E56A20]',
      segmentIdx: 2,
    },
    {
      id: 'c_conclusion',
      timeLabel: '1 min',
      timeDurationSec: 60,
      title: 'Conclusion',
      bullets: [
        'How do the BOW and Lit work present the GI similarly and differently?',
        'How effective are the writers in achieving their aims regarding the GI?',
      ],
      colorBg: 'from-[#8B1E1E] to-[#A02828]',
      badgeColor: 'bg-[#E56A20]',
      segmentIdx: 3,
    },
    ...(includeDiscussion ? [{
      id: 'c_discussion',
      timeLabel: '5 min',
      timeDurationSec: 300,
      title: 'Discussion (Teacher Follow-up)',
      bullets: [
        '“You said... Could you elaborate on...?”',
        '“What are other similarities and differences between the work and BOW?”',
      ],
      colorBg: 'from-[#8B1E1E] to-[#A02828]',
      badgeColor: 'bg-[#E56A20]',
      segmentIdx: 4,
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

                {/* Bullets view (Intro & Conclusion) */}
                {item.bullets && (
                  <ul className="space-y-2.5">
                    {item.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-start gap-2.5 text-sm text-slate-800 dark:text-slate-200">
                        <span className="text-rose-600 dark:text-rose-500 font-bold text-base leading-none mt-0.5">•</span>
                        <span className="font-medium leading-relaxed">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Features Checklist view (Literary 1-3 & Non-Literary 4-6) */}
                {item.features && (
                  <div className="space-y-3">
                    {item.features.map((feat) => {
                      const featKey = `${item.id}_${feat.num}`;
                      const isChecked = !!checkedFeatures[featKey];

                      return (
                        <div
                          key={feat.num}
                          onClick={(e) => toggleFeature(featKey, e)}
                          className={`rounded-xl p-2.5 transition-colors border ${
                            isChecked
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-500/40 text-emerald-950 dark:text-emerald-200'
                              : 'bg-white dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 text-slate-900 dark:text-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                              • {feat.label}
                            </span>
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <div
                                className={`flex h-4 w-4 items-center justify-center rounded border transition-colors ${
                                  isChecked
                                    ? 'bg-emerald-500 border-emerald-400 text-white'
                                    : 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900'
                                }`}
                              >
                                {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
                              </div>
                              <span className="text-slate-600 dark:text-slate-400 text-[10px] font-medium">
                                {isChecked ? 'Delivered' : 'Check-off'}
                              </span>
                            </div>
                          </div>

                          <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-slate-800 dark:text-slate-300">
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
