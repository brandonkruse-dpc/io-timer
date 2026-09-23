import React, { useState } from 'react';
import { StudentIOData, Segment, TemplateId } from '../types';
import { TEMPLATE_PRESETS, GLOBAL_ISSUE_FIELDS, saveStudentData } from '../utils/templates';
import { X, ArrowUp, ArrowDown, ArrowLeftRight, Clock, Plus, Trash2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

interface CustomizerDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  studentData: StudentIOData;
  onUpdateStudentData: (newData: StudentIOData) => void;
  onResetTimer: () => void;
}

export const CustomizerDrawer: React.FC<CustomizerDrawerProps> = ({
  isOpen,
  onClose,
  studentData,
  onUpdateStudentData,
  onResetTimer,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'structure' | 'texts' | 'settings'>('structure');
  const [localData, setLocalData] = useState<StudentIOData>(studentData);

  // Sync if prop changes and drawer opens
  React.useEffect(() => {
    if (isOpen) {
      setLocalData(studentData);
    }
  }, [isOpen, studentData]);

  if (!isOpen) return null;

  // Calculate total seconds of current segments
  const totalSeconds = localData.customSegments.reduce((sum, s) => sum + s.durationSeconds, 0);
  const isExactTenMinutes = totalSeconds === 600;
  const deltaMinutes = (totalSeconds - 600) / 60;

  const handleApplyPreset = (presetId: TemplateId) => {
    const preset = TEMPLATE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    const updated: StudentIOData = {
      ...localData,
      activeTemplateId: presetId,
      customSegments: JSON.parse(JSON.stringify(preset.segments)),
    };
    setLocalData(updated);
    onUpdateStudentData(updated);
    saveStudentData(updated);
    onResetTimer();
  };

  const handleMoveSegment = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= localData.customSegments.length) return;

    const items = [...localData.customSegments];
    const [moved] = items.splice(index, 1);
    items.splice(newIdx, 0, moved);

    // Re-index order numbers
    const reordered = items.map((seg, i) => ({ ...seg, orderNumber: i + 1 }));
    const updated = {
      ...localData,
      activeTemplateId: 'custom' as TemplateId,
      customSegments: reordered,
    };
    setLocalData(updated);
    onUpdateStudentData(updated);
    saveStudentData(updated);
  };

  const handleDurationChange = (index: number, newSeconds: number) => {
    if (newSeconds < 15) return;
    const items = [...localData.customSegments];
    items[index] = { ...items[index], durationSeconds: newSeconds };

    const updated = {
      ...localData,
      activeTemplateId: 'custom' as TemplateId,
      customSegments: items,
    };
    setLocalData(updated);
    onUpdateStudentData(updated);
    saveStudentData(updated);
  };

  const handleSwapTexts = () => {
    // Swap text A and text B metadata
    const updated = {
      ...localData,
      textA: { ...localData.textB },
      textB: { ...localData.textA },
    };
    setLocalData(updated);
    onUpdateStudentData(updated);
    saveStudentData(updated);
  };

  const handleSaveAll = () => {
    onUpdateStudentData(localData);
    saveStudentData(localData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-2xl bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-900/80">
          <div>
            <h3 className="font-display text-lg font-bold text-white">Customize & Plan Oral Structure</h3>
            <p className="text-xs text-slate-400">Arrange oral segments to meet the strict 10-minute IB requirement</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 10-Minute Total Calculator Banner */}
        <div className={`px-5 py-3 border-b flex items-center justify-between text-xs ${
          isExactTenMinutes
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
            : 'bg-amber-950/40 border-amber-500/30 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {isExactTenMinutes ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
            )}
            <div>
              <span className="font-bold">
                Total Oral Duration: {Math.floor(totalSeconds / 60)}m {(totalSeconds % 60).toString().padStart(2, '0')}s
              </span>
              <span className="text-slate-400 ml-2">
                {isExactTenMinutes
                  ? '· Perfect! Exactly 10:00 IB limit'
                  : deltaMinutes > 0
                    ? `· Warning: Exceeds 10m by ${Math.abs(deltaMinutes)}m!`
                    : `· Warning: Under 10m by ${Math.abs(deltaMinutes)}m!`}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 font-mono-nums font-bold">
            <span>600s IB target</span>
          </div>
        </div>

        {/* Sub-Tabs: Structure / Texts & GI / Settings */}
        <div className="flex border-b border-slate-800 bg-slate-900/40 px-5 pt-2 gap-2 text-xs">
          <button
            onClick={() => setActiveSubTab('structure')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSubTab === 'structure'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Arrange Segments & Timing
          </button>

          <button
            onClick={() => setActiveSubTab('texts')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSubTab === 'texts'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            2. Global Issue & Works
          </button>

          <button
            onClick={() => setActiveSubTab('settings')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition-colors ${
              activeSubTab === 'settings'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            3. Timer & Audio Alerts
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">

          {/* TAB 1: STRUCTURE & TIMING */}
          {activeSubTab === 'structure' && (
            <div className="space-y-6">
              
              {/* Presets Selector */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Select Structure Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {TEMPLATE_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handleApplyPreset(preset.id)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        localData.activeTemplateId === preset.id
                          ? 'border-amber-500 bg-amber-500/10 text-white'
                          : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{preset.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {preset.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Swap Text A & B */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">Oral Order Flexibility:</span>
                <button
                  onClick={handleSwapTexts}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 transition-colors"
                >
                  <ArrowLeftRight className="h-3.5 w-3.5 text-amber-400" />
                  <span>Swap Text A ⇄ Text B Order</span>
                </button>
              </div>

              {/* Segment List with Drag/Move & Timing Controls */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-[11px]">
                    Segments Sequence ({localData.customSegments.length} items)
                  </span>
                  <span>Duration (Seconds)</span>
                </div>

                {localData.customSegments.map((segment, idx) => (
                  <div
                    key={segment.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-slate-800 bg-slate-900/70"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-200">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate max-w-xs sm:max-w-sm">
                          {segment.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate">
                          {segment.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Seconds Adjustment */}
                      <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded-lg border border-slate-800">
                        <Clock className="h-3 w-3 text-slate-500" />
                        <input
                          type="number"
                          step={15}
                          min={15}
                          max={360}
                          value={segment.durationSeconds}
                          onChange={(e) => handleDurationChange(idx, parseInt(e.target.value) || 60)}
                          className="w-12 bg-transparent text-right font-mono-nums text-xs font-bold text-amber-300 focus:outline-none"
                        />
                        <span className="text-[11px] text-slate-500">s</span>
                      </div>

                      {/* Move Up / Down Buttons */}
                      <button
                        onClick={() => handleMoveSegment(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-20"
                        title="Move segment earlier"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>

                      <button
                        onClick={() => handleMoveSegment(idx, 'down')}
                        disabled={idx === localData.customSegments.length - 1}
                        className="p-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-20"
                        title="Move segment later"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: GLOBAL ISSUE & WORKS */}
          {activeSubTab === 'texts' && (
            <div className="space-y-5">
              
              {/* Global Issue Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                  <span>Your Global Issue</span>
                  <span className="text-[11px] text-amber-400 font-normal">Must connect to both texts!</span>
                </label>
                <textarea
                  rows={2}
                  value={localData.globalIssue}
                  onChange={(e) => setLocalData({ ...localData, globalIssue: e.target.value })}
                  placeholder="e.g. The erosion of personal privacy and autonomy under systemic surveillance"
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-sm text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Field of Inquiry */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  IB Field of Inquiry
                </label>
                <select
                  value={localData.globalIssueField}
                  onChange={(e) => setLocalData({ ...localData, globalIssueField: e.target.value })}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-xs text-slate-200 focus:border-amber-500 focus:outline-none"
                >
                  {GLOBAL_ISSUE_FIELDS.map((field) => (
                    <option key={field} value={field}>
                      {field}
                    </option>
                  ))}
                </select>
              </div>

              {/* Thesis Statement */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Working Thesis Statement
                </label>
                <textarea
                  rows={2}
                  value={localData.thesisStatement}
                  onChange={(e) => setLocalData({ ...localData, thesisStatement: e.target.value })}
                  placeholder="How each work uniquely presents the global issue..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 text-xs text-slate-100 placeholder-slate-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Text A (Literary) Details */}
              <div className="rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                    TEXT A: Literary Work
                  </span>
                  <span className="text-[11px] text-slate-400">Novel, Play, Poetry</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Work Title</label>
                    <input
                      type="text"
                      value={localData.textA.title}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          textA: { ...localData.textA, title: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Author</label>
                    <input
                      type="text"
                      value={localData.textA.creator}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          textA: { ...localData.textA, creator: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Extract Description (approx 40 lines)</label>
                  <input
                    type="text"
                    value={localData.textA.extractDetails}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        textA: { ...localData.textA, extractDetails: e.target.value },
                      })
                    }
                    placeholder="e.g. Act III, Scene 2 (Lines 45–80)"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Text B (Non-Literary) Details */}
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    TEXT B: Non-Literary Body of Work (BOW)
                  </span>
                  <span className="text-[11px] text-slate-400">Campaign, Cartoon, Photo, Speech</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Body of Work Title</label>
                    <input
                      type="text"
                      value={localData.textB.title}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          textB: { ...localData.textB, title: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">Creator / Organization</label>
                    <input
                      type="text"
                      value={localData.textB.creator}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          textB: { ...localData.textB, creator: e.target.value },
                        })
                      }
                      className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">Extract Description</label>
                  <input
                    type="text"
                    value={localData.textB.extractDetails}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        textB: { ...localData.textB, extractDetails: e.target.value },
                      })
                    }
                    placeholder="e.g. Campaign poster #3 / Episode 2 opening scene"
                    className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SETTINGS & AUDIO */}
          {activeSubTab === 'settings' && (
            <div className="space-y-4">
              
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Global Issue Reminder Frequency
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {(['high', 'normal', 'low'] as const).map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setLocalData({ ...localData, giCheckinFrequency: freq })}
                      className={`p-2.5 rounded-lg border font-semibold capitalize transition-all ${
                        localData.giCheckinFrequency === freq
                          ? 'border-amber-500 bg-amber-500/10 text-amber-300'
                          : 'border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {freq === 'high' ? 'High (45s)' : freq === 'normal' ? 'Normal (90s)' : 'Low (Halfway)'}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-slate-400">
                  Flashes a reminder prompt to keep your delivery anchored in the Global Issue without digressing.
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Audio Chimes & Warnings</h4>
                    <p className="text-[11px] text-slate-400">Synthesized bells at segment changes and 30s remaining</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localData.soundEnabled}
                    onChange={(e) => setLocalData({ ...localData, soundEnabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Voice Speech Synthesis</h4>
                    <p className="text-[11px] text-slate-400">Speaks verbal cues: "Check-in with Global Issue", "Next segment"</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localData.voiceSpeechEnabled}
                    onChange={(e) => setLocalData({ ...localData, voiceSpeechEnabled: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Include 5-Min Q&A Discussion</h4>
                    <p className="text-[11px] text-slate-400">Follows the 10-minute presentation for full 15-minute mock oral practice</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localData.includeDiscussion}
                    onChange={(e) => setLocalData({ ...localData, includeDiscussion: e.target.checked })}
                    className="h-4 w-4 rounded accent-amber-500"
                  />
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
          <button
            onClick={() => handleApplyPreset('quadrant_balanced')}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Reset to Standard 4-Quadrant</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg shadow-sm transition-colors"
            >
              Save & Apply
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
