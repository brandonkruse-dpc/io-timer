import React, { useState } from 'react';
import { StudentIOData } from '../types';
import { saveStudentData } from '../utils/templates';
import { Printer, Plus, Trash2, CheckCircle2, AlertCircle, FileText, Info } from 'lucide-react';

interface TenBulletSheetProps {
  studentData: StudentIOData;
  onUpdateStudentData: (newData: StudentIOData) => void;
}

export const TenBulletSheet: React.FC<TenBulletSheetProps> = ({
  studentData,
  onUpdateStudentData,
}) => {
  const [candidateNumber, setCandidateNumber] = useState('');
  const [examDate, setExamDate] = useState(() => new Date().toISOString().slice(0, 10));

  const bullets = studentData.bullets || [];

  const handleUpdateBullet = (index: number, value: string) => {
    const updated = [...bullets];
    updated[index] = value;
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  const handleAddBullet = () => {
    if (bullets.length >= 10) return;
    const updated = [...bullets, ''];
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  const handleRemoveBullet = (index: number) => {
    const updated = bullets.filter((_, i) => i !== index);
    const newData = { ...studentData, bullets: updated };
    onUpdateStudentData(newData);
    saveStudentData(newData);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Top Banner with Print and Instructions (Hidden when printing) */}
      <div className="no-print rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-amber-400" />
            <h3 className="font-display text-lg font-bold text-white">
              Official IB 10-Bullet Outline Form
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            IB rules permit candidates to take a maximum of <strong>10 bullet points</strong> into the oral examination room.
            Points must be concise memory prompts, not full continuous prose or essays.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400">Permitted Points:</span>
            <div className="font-mono-nums font-bold text-amber-300">
              {bullets.length} / 10 Bullets Used
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 shadow-md transition-colors"
          >
            <Printer className="h-4 w-4" />
            <span>Print Form (PDF)</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet Card (Styled for screen & pristine printout) */}
      <div className="mx-auto max-w-4xl rounded-3xl border border-slate-800 bg-slate-950 p-6 sm:p-10 shadow-2xl print:border-none print:shadow-none print:p-0 print:bg-white print:text-black">
        
        {/* IB Header (Classic Diploma Programme style) */}
        <div className="border-b-2 border-slate-700 print:border-black pb-5 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-400 print:text-black">
                International Baccalaureate · Diploma Programme
              </span>
              <h2 className="font-display text-2xl font-bold text-white print:text-black mt-1">
                Individual Oral Outline Sheet (10-Minute Assessment)
              </h2>
              <p className="text-xs text-slate-400 print:text-gray-700">
                Language A: Language and Literature
              </p>
            </div>
            
            <div className="text-right text-xs space-y-1">
              <div className="font-mono text-slate-300 print:text-black font-semibold">
                Form: IO-OUTLINE-10
              </div>
              <div className="text-slate-500 print:text-gray-600 text-[11px]">
                Strict Limit: 10 Bullet Points
              </div>
            </div>
          </div>

          {/* Student metadata fields */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/60 print:bg-gray-100 p-3.5 rounded-xl print:rounded-none border border-slate-800 print:border-gray-300">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600 block">Candidate Name</span>
              <input
                type="text"
                value={studentData.studentName}
                onChange={(e) => onUpdateStudentData({ ...studentData, studentName: e.target.value })}
                placeholder="Student Name"
                className="w-full bg-transparent font-semibold text-white print:text-black focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600 block">Candidate Session Number</span>
              <input
                type="text"
                value={candidateNumber}
                onChange={(e) => setCandidateNumber(e.target.value)}
                placeholder="e.g. 001234-0042"
                className="w-full bg-transparent font-mono font-semibold text-white print:text-black focus:outline-none"
              />
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 print:text-gray-600 block">Date of Oral</span>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-transparent font-semibold text-white print:text-black focus:outline-none"
              />
            </div>
          </div>

          {/* Global Issue & Texts declaration */}
          <div className="mt-4 space-y-2 text-xs">
            <div className="p-3 rounded-lg bg-slate-900/40 print:bg-gray-50 border border-slate-800 print:border-gray-200">
              <strong className="text-amber-300 print:text-black">Global Issue: </strong>
              <span className="text-slate-200 print:text-gray-800">{studentData.globalIssue}</span>
              <span className="text-slate-500 print:text-gray-600 ml-2">({studentData.globalIssueField})</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-500/10 print:bg-gray-50 border border-blue-500/20 print:border-gray-200">
                <strong className="text-blue-300 print:text-black">Text A (Literary): </strong>
                <span className="text-slate-200 print:text-black">{studentData.textA.title} by {studentData.textA.creator}</span>
                <div className="text-[11px] text-slate-400 print:text-gray-600">Extract: {studentData.textA.extractDetails}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-emerald-500/10 print:bg-gray-50 border border-emerald-500/20 print:border-gray-200">
                <strong className="text-emerald-300 print:text-black">Text B (Non-Literary): </strong>
                <span className="text-slate-200 print:text-black">{studentData.textB.title} ({studentData.textB.creator})</span>
                <div className="text-[11px] text-slate-400 print:text-gray-600">Extract: {studentData.textB.extractDetails}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 10 Bullets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 print:text-gray-600 pb-1">
            <span className="font-bold uppercase tracking-wider text-[11px]">
              Candidate Speaking Points (Maximum 10 Allowed)
            </span>
            <span className="text-[11px] no-print">Keep under ~15-20 words per bullet</span>
          </div>

          {bullets.map((bullet, idx) => {
            const wordCount = bullet.trim() ? bullet.trim().split(/\s+/).length : 0;
            const isTooLong = wordCount > 25;

            return (
              <div
                key={idx}
                className="group relative flex items-start gap-3 p-2.5 rounded-xl border border-slate-800 print:border-gray-200 bg-slate-900/40 print:bg-white"
              >
                {/* Bullet number */}
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/10 print:bg-gray-200 text-amber-300 print:text-black font-mono text-xs font-bold mt-0.5">
                  {idx + 1}
                </div>

                {/* Textarea for bullet */}
                <div className="flex-1 min-w-0">
                  <textarea
                    rows={2}
                    value={bullet}
                    onChange={(e) => handleUpdateBullet(idx, e.target.value)}
                    placeholder={`Bullet Point #${idx + 1} memory cue...`}
                    className="w-full bg-transparent text-sm text-slate-100 print:text-black placeholder-slate-500 focus:outline-none resize-none leading-relaxed"
                  />
                  
                  {/* Word count & suggestion (screen only) */}
                  <div className="no-print flex items-center justify-between text-[10px] text-slate-500 pt-1">
                    <span>
                      {wordCount} words {isTooLong && <span className="text-rose-400 font-semibold">(Warning: too long for a single cue)</span>}
                    </span>
                    <button
                      onClick={() => handleRemoveBullet(idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 transition-opacity flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Bullet Button (If under 10) */}
          {bullets.length < 10 && (
            <button
              onClick={handleAddBullet}
              className="no-print w-full py-3 rounded-xl border border-dashed border-slate-700 hover:border-amber-500 hover:bg-amber-500/5 text-slate-400 hover:text-amber-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span>Add Bullet Point ({bullets.length + 1} of 10)</span>
            </button>
          )}
        </div>

        {/* Declaration signature box for official print */}
        <div className="mt-8 pt-6 border-t border-slate-800 print:border-gray-300 text-xs text-slate-400 print:text-gray-700">
          <div className="grid grid-cols-2 gap-8 print:grid">
            <div className="space-y-6">
              <p className="text-[11px] leading-relaxed">
                Candidate Declaration: I confirm that this outline sheet consists of 10 or fewer bullet points, and that I will adhere to the strict 10-minute presentation guidelines.
              </p>
              <div className="border-b border-slate-700 print:border-black pt-4">
                <span className="text-[10px] uppercase text-slate-500 print:text-gray-500">Candidate Signature</span>
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[11px] leading-relaxed">
                Teacher Verification: I confirm that the candidate has prepared 10 bullet points and unannotated extracts in compliance with IB DP regulations.
              </p>
              <div className="border-b border-slate-700 print:border-black pt-4">
                <span className="text-[10px] uppercase text-slate-500 print:text-gray-500">Teacher / Invigilator Signature</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
