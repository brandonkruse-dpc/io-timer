import React from 'react';
import { Award, BookOpen, Clock, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface RubricReferenceModalProps {
  onClose?: () => void;
}

export const RubricReferenceModal: React.FC<RubricReferenceModalProps> = () => {
  const criteria = [
    {
      code: 'Criterion A',
      title: 'Knowledge, Understanding & Interpretation',
      marks: '10 Marks',
      color: 'border-blue-500/30 bg-blue-500/5 text-blue-400',
      keyQuestions: [
        'How well does the candidate demonstrate knowledge and understanding of both extracts and the broader works?',
        'How well are ideas supported by relevant textual evidence, quotations, and visual details?',
        'Is the interpretation of the Global Issue nuanced and persuasive?',
      ],
      highBandTip: 'Level 9–10: The oral shows insightful, convincing knowledge and understanding of both the extracts and whole works/BOWs, with all points thoroughly substantiated by precise references.',
    },
    {
      code: 'Criterion B',
      title: 'Analysis & Evaluation',
      marks: '10 Marks',
      color: 'border-purple-500/30 bg-purple-500/5 text-purple-400',
      keyQuestions: [
        'How effectively does the candidate analyze the authorial/creator choices?',
        'Do they discuss both micro techniques in the extract AND macro choices across the broader work?',
        'How well do they evaluate how these choices present and amplify the Global Issue?',
      ],
      highBandTip: 'Level 9–10: Analysis and evaluation of authorial choices are insightful, nuanced, and convincingly focused on how meaning and the Global Issue are constructed.',
    },
    {
      code: 'Criterion C',
      title: 'Focus & Organisation',
      marks: '10 Marks',
      color: 'border-amber-500/30 bg-amber-500/5 text-amber-400',
      keyQuestions: [
        'How well-balanced is the presentation between Text A and Text B (approx 4m each)?',
        'How well-balanced is each text between the extract and the broader work (approx 2m + 2m)?',
        'Does the candidate adhere strictly to the 10-minute presentation limit?',
        'Is the structure coherent and cohesive with smooth transitions without comparing texts directly?',
      ],
      highBandTip: 'Level 9–10: The oral is effectively balanced, purposefully organized, sustained throughout the 10 minutes, and transitions seamlessly between parts.',
    },
    {
      code: 'Criterion D',
      title: 'Language',
      marks: '10 Marks',
      color: 'border-emerald-500/30 bg-emerald-500/5 text-emerald-400',
      keyQuestions: [
        'Is the language clear, varied, accurate, and appropriate for an academic oral?',
        'Does the candidate use accurate literary and rhetorical terminology?',
        'Is the delivery natural, authentic, and engaging rather than read off a script?',
      ],
      highBandTip: 'Level 9–10: Language is clear, varied, precise, with an effective register, correct terminology, and fluent oral delivery.',
    },
  ];

  return (
    <div className="w-full space-y-6">
      
      {/* Overview Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 backdrop-blur-sm shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="h-6 w-6 text-amber-400" />
              <h2 className="font-display text-xl font-bold text-white">
                IB DP Individual Oral Assessment Criteria
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              The Individual Oral is assessed out of <strong>40 marks</strong> across 4 criteria. Total weight: <strong>30% for SL</strong> and <strong>20% for HL</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 text-xs font-mono-nums font-bold text-amber-300">
              Total: 40 Marks (10m strict)
            </span>
          </div>
        </div>

        {/* Essential Rules Check-in */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs border-t border-slate-800/80 pt-4">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <Clock className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">Strict 10-Minute Limit</strong>
              <span className="text-slate-400">Examiners must stop timing at 10:00. Anything said past 10:00 is ignored.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">50/50 Balance Rule</strong>
              <span className="text-slate-400">Equal balance between extract & whole work, and between Lit & Non-Lit texts.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <AlertCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200 block">No Text Comparison</strong>
              <span className="text-slate-400">Never compare the two extracts. Anchor each text independently to the GI!</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Criteria Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {criteria.map((c) => (
          <div
            key={c.code}
            className={`rounded-2xl border p-5 bg-slate-950 shadow-lg flex flex-col justify-between ${c.color}`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                <span className="text-xs font-bold uppercase tracking-wider">{c.code}</span>
                <span className="font-mono-nums text-xs font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {c.marks}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mt-2 leading-snug">
                {c.title}
              </h3>

              <div className="mt-3 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Examiner Guiding Questions:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {c.keyQuestions.map((q, qIdx) => (
                    <li key={qIdx} className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0 mt-0.5">•</span>
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 text-[11px] rounded-lg bg-slate-900/60 p-2.5">
              <strong className="text-amber-300 block mb-0.5">Top Markband Advice:</strong>
              <span className="text-slate-300 italic">{c.highBandTip}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
