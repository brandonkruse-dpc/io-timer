/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { HeaderNav, ActiveTab } from './components/HeaderNav';
import { QuadrantCanvas } from './components/QuadrantCanvas';
import { ChevronTimelineView } from './components/ChevronTimelineView';
import { FocusMockStage } from './components/FocusMockStage';
import { TenBulletSheet } from './components/TenBulletSheet';
import { RubricReferenceModal } from './components/RubricReferenceModal';
import { TimerControls } from './components/TimerControls';
import { GlobalIssueReminder } from './components/GlobalIssueReminder';
import { CustomizerDrawer } from './components/CustomizerDrawer';
import { StudentIOData, Segment } from './types';
import { loadStudentData, saveStudentData, DISCUSSION_SEGMENT } from './utils/templates';
import { audioSynth } from './utils/audio';

export default function App() {
  const [studentData, setStudentData] = useState<StudentIOData>(() => loadStudentData());
  const [activeTab, setActiveTab] = useState<ActiveTab>('quadrant');
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Timer states
  const [isRunning, setIsRunning] = useState(false);
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(0);
  const [segmentElapsedSeconds, setSegmentElapsedSeconds] = useState(0);

  // Global Issue check-in trigger
  const [isCheckinAlertActive, setIsCheckinAlertActive] = useState(false);
  const [checkinInterval, setCheckinInterval] = useState(90); // default 90s
  const [secondsUntilNextCheckin, setSecondsUntilNextCheckin] = useState(90);

  // Track whether 30s warning chime has already sounded in current segment
  const hasTriggeredWarningRef = useRef(false);

  // Determine active segments list (including discussion segment if enabled)
  const segments: Segment[] = React.useMemo(() => {
    if (studentData.includeDiscussion) {
      const exists = studentData.customSegments.some((s) => s.type === 'discussion');
      if (exists) return studentData.customSegments;
      return [...studentData.customSegments, DISCUSSION_SEGMENT];
    }
    return studentData.customSegments.filter((s) => s.type !== 'discussion');
  }, [studentData.customSegments, studentData.includeDiscussion]);

  const currentSegment: Segment = segments[activeSegmentIndex] || segments[0];

  // Calculate total oral presentation duration and elapsed
  const totalDurationSeconds = React.useMemo(() => {
    return segments.reduce((sum, s) => sum + s.durationSeconds, 0);
  }, [segments]);

  const totalElapsedSeconds = React.useMemo(() => {
    let completedSec = 0;
    for (let i = 0; i < activeSegmentIndex; i++) {
      completedSec += segments[i]?.durationSeconds || 0;
    }
    return completedSec + segmentElapsedSeconds;
  }, [segments, activeSegmentIndex, segmentElapsedSeconds]);

  // Adjust checkin interval based on settings
  useEffect(() => {
    const sec = studentData.giCheckinFrequency === 'high' ? 45 : studentData.giCheckinFrequency === 'low' ? 120 : 90;
    setCheckinInterval(sec);
    setSecondsUntilNextCheckin(sec);
  }, [studentData.giCheckinFrequency]);

  // Main 1-second interval loop
  useEffect(() => {
    let intervalId: number | undefined;

    if (isRunning) {
      intervalId = window.setInterval(() => {
        setSegmentElapsedSeconds((prev) => {
          const nextSec = prev + 1;
          const remainingInSeg = currentSegment.durationSeconds - nextSec;

          // 30 seconds warning sound check
          if (remainingInSeg === 30 && !hasTriggeredWarningRef.current) {
            hasTriggeredWarningRef.current = true;
            if (studentData.soundEnabled) {
              audioSynth.playWarning30s();
            }
            if (studentData.voiceSpeechEnabled) {
              audioSynth.speakPrompt('Thirty seconds remaining in this segment.');
            }
          }

          // Check if segment duration reached
          if (nextSec >= currentSegment.durationSeconds) {
            // Auto advance to next segment if available
            if (activeSegmentIndex < segments.length - 1) {
              setActiveSegmentIndex((idx) => idx + 1);
              hasTriggeredWarningRef.current = false;
              if (studentData.soundEnabled) {
                audioSynth.playSegmentStart();
              }
              if (studentData.voiceSpeechEnabled) {
                const nextSeg = segments[activeSegmentIndex + 1];
                audioSynth.speakPrompt(`Moving to ${nextSeg.title}`);
              }
              return 0; // reset elapsed for next segment
            } else {
              // Final segment finished!
              setIsRunning(false);
              if (studentData.soundEnabled) {
                audioSynth.playTenMinuteFinish();
              }
              if (studentData.voiceSpeechEnabled) {
                audioSynth.speakPrompt('Ten minute oral presentation complete.');
              }
              return currentSegment.durationSeconds;
            }
          }

          return nextSec;
        });

        // GI Check-in countdown
        setSecondsUntilNextCheckin((prev) => {
          if (prev <= 1) {
            setIsCheckinAlertActive(true);
            if (studentData.soundEnabled) {
              audioSynth.playGICheckin();
            }
            if (studentData.voiceSpeechEnabled) {
              audioSynth.speakPrompt('Global issue check in: connect your point to the global issue.');
            }
            return checkinInterval;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [
    isRunning,
    currentSegment.durationSeconds,
    activeSegmentIndex,
    segments,
    studentData.soundEnabled,
    studentData.voiceSpeechEnabled,
    checkinInterval,
  ]);

  // Controls Handlers
  const handleTogglePlay = useCallback(() => {
    setIsRunning((prev) => {
      const willRun = !prev;
      if (willRun && studentData.soundEnabled) {
        audioSynth.playSegmentStart();
      }
      return willRun;
    });
  }, [studentData.soundEnabled]);

  const handleNextSegment = useCallback(() => {
    if (activeSegmentIndex < segments.length - 1) {
      setActiveSegmentIndex((prev) => prev + 1);
      setSegmentElapsedSeconds(0);
      hasTriggeredWarningRef.current = false;
      if (studentData.soundEnabled) {
        audioSynth.playSegmentStart();
      }
    }
  }, [activeSegmentIndex, segments.length, studentData.soundEnabled]);

  const handlePrevSegment = useCallback(() => {
    if (activeSegmentIndex > 0) {
      setActiveSegmentIndex((prev) => prev - 1);
      setSegmentElapsedSeconds(0);
      hasTriggeredWarningRef.current = false;
      if (studentData.soundEnabled) {
        audioSynth.playSegmentStart();
      }
    }
  }, [activeSegmentIndex, studentData.soundEnabled]);

  const handleResetTimer = useCallback(() => {
    setIsRunning(false);
    setActiveSegmentIndex(0);
    setSegmentElapsedSeconds(0);
    hasTriggeredWarningRef.current = false;
    setIsCheckinAlertActive(false);
    setSecondsUntilNextCheckin(checkinInterval);
  }, [checkinInterval]);

  const handleSelectSegment = useCallback((index: number) => {
    if (index >= 0 && index < segments.length) {
      setActiveSegmentIndex(index);
      setSegmentElapsedSeconds(0);
      hasTriggeredWarningRef.current = false;
      if (studentData.soundEnabled) {
        audioSynth.playSegmentStart();
      }
    }
  }, [segments.length, studentData.soundEnabled]);

  const handleManualGIPing = useCallback(() => {
    setIsCheckinAlertActive(true);
    if (studentData.soundEnabled) {
      audioSynth.playGICheckin();
    }
    if (studentData.voiceSpeechEnabled) {
      audioSynth.speakPrompt('Global issue check in: remember to relate this to the global issue.');
    }
  }, [studentData.soundEnabled, studentData.voiceSpeechEnabled]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in form inputs or textareas
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNextSegment();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrevSegment();
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        handleResetTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTogglePlay, handleNextSegment, handlePrevSegment, handleResetTimer]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 3-Zone Top Navigation Bar */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCustomizer={() => setIsCustomizerOpen(true)}
        onResetTimer={handleResetTimer}
        totalElapsedSeconds={totalElapsedSeconds}
        totalDurationSeconds={totalDurationSeconds}
        isRunning={isRunning}
      />

      {/* Main App Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Global Issue Reminder & Check-in Alert Bar (Sticky across views) */}
        <div className="no-print">
          <GlobalIssueReminder
            globalIssue={studentData.globalIssue}
            globalIssueField={studentData.globalIssueField}
            isCheckinAlertActive={isCheckinAlertActive}
            onDismissCheckinAlert={() => setIsCheckinAlertActive(false)}
            secondsUntilNextCheckin={secondsUntilNextCheckin}
            currentSegmentTitle={currentSegment.title}
          />
        </div>

        {/* View 1: 4-Quadrant Visual Layout (Directly from Image 2 maxresdefault.jpg) */}
        {activeTab === 'quadrant' && (
          <QuadrantCanvas
            segments={segments}
            activeSegmentIndex={activeSegmentIndex}
            onSelectSegment={handleSelectSegment}
            segmentElapsedSeconds={segmentElapsedSeconds}
            isRunning={isRunning}
            studentData={studentData}
          />
        )}

        {/* View 2: Chevron Flow (Directly from Image 1 images.png - Philpot Method 1) */}
        {activeTab === 'chevron' && (
          <ChevronTimelineView
            segments={segments}
            activeSegmentIndex={activeSegmentIndex}
            onSelectSegment={handleSelectSegment}
            segmentElapsedSeconds={segmentElapsedSeconds}
            isRunning={isRunning}
            studentData={studentData}
            includeDiscussion={studentData.includeDiscussion}
          />
        )}

        {/* View 3: Full-screen Focus Stage for live rehearsal */}
        {activeTab === 'focus' && (
          <FocusMockStage
            currentSegment={currentSegment}
            segmentIndex={activeSegmentIndex}
            totalSegments={segments.length}
            segmentElapsedSeconds={segmentElapsedSeconds}
            totalElapsedSeconds={totalElapsedSeconds}
            totalDurationSeconds={totalDurationSeconds}
            isRunning={isRunning}
            onTogglePlay={handleTogglePlay}
            onNextSegment={handleNextSegment}
            onPrevSegment={handlePrevSegment}
            studentData={studentData}
            isCheckinAlertActive={isCheckinAlertActive}
            onDismissCheckinAlert={() => setIsCheckinAlertActive(false)}
          />
        )}

        {/* View 4: IB 10-Bullet Outline Form (Printable & Editable) */}
        {activeTab === 'outline' && (
          <TenBulletSheet
            studentData={studentData}
            onUpdateStudentData={(newData) => {
              setStudentData(newData);
              saveStudentData(newData);
            }}
          />
        )}

        {/* View 5: IB Criteria Rubric Guide */}
        {activeTab === 'rubric' && (
          <RubricReferenceModal />
        )}

        {/* Universal Docked Timer Controls (Visible on all views except print) */}
        <div className="no-print pt-2">
          <TimerControls
            isRunning={isRunning}
            onTogglePlay={handleTogglePlay}
            onPrevSegment={handlePrevSegment}
            onNextSegment={handleNextSegment}
            onReset={handleResetTimer}
            currentSegment={currentSegment}
            segmentIndex={activeSegmentIndex}
            totalSegments={segments.length}
            segmentElapsedSeconds={segmentElapsedSeconds}
            totalElapsedSeconds={totalElapsedSeconds}
            totalDurationSeconds={totalDurationSeconds}
            soundEnabled={studentData.soundEnabled}
            onToggleSound={() => {
              const updated = { ...studentData, soundEnabled: !studentData.soundEnabled };
              setStudentData(updated);
              saveStudentData(updated);
            }}
            voiceSpeechEnabled={studentData.voiceSpeechEnabled}
            onToggleVoice={() => {
              const updated = { ...studentData, voiceSpeechEnabled: !studentData.voiceSpeechEnabled };
              setStudentData(updated);
              saveStudentData(updated);
            }}
            onManualGIPing={handleManualGIPing}
            includeDiscussion={studentData.includeDiscussion}
            onToggleDiscussion={() => {
              const updated = { ...studentData, includeDiscussion: !studentData.includeDiscussion };
              setStudentData(updated);
              saveStudentData(updated);
            }}
          />
        </div>

      </main>

      {/* Customize & Plan Drawer */}
      <CustomizerDrawer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        studentData={studentData}
        onUpdateStudentData={(newData) => {
          setStudentData(newData);
          saveStudentData(newData);
        }}
        onResetTimer={handleResetTimer}
      />

      {/* Quiet Academic Footer */}
      <footer className="no-print border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>IB English A: Language & Literature</span>
            <span aria-hidden="true">·</span>
            <span>Individual Oral (IO) 10-Minute Assessment</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>Client-side Web App</span>
            <span aria-hidden="true">·</span>
            <span>Ready for GitHub Pages Deployment</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
