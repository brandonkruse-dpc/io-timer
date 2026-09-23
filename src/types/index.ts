export type QuadrantPosition = 
  | 'center-top' 
  | 'top-left' 
  | 'bottom-left' 
  | 'top-right' 
  | 'bottom-right' 
  | 'center-bottom'
  | 'extra';

export type SegmentType =
  | 'intro'
  | 'textA_work'
  | 'textA_extract'
  | 'textB_work'
  | 'textB_extract'
  | 'textA_combined'
  | 'textB_combined'
  | 'conclusion'
  | 'discussion';

export interface Segment {
  id: string;
  orderNumber: number;
  type: SegmentType;
  title: string;
  subtitle: string;
  quadrant: QuadrantPosition;
  durationSeconds: number; // in seconds
  colorKey: 'amber' | 'emerald' | 'blue' | 'purple' | 'rose' | 'teal' | 'orange' | 'slate';
  keyPrompts: string[];
  guidancePoints: string[];
  giCheckinReminder: string;
  studentNotes?: string;
}

export type TemplateId = 'quadrant_balanced' | 'philpot_method1' | 'extract_first' | 'custom';

export interface TemplatePreset {
  id: TemplateId;
  name: string;
  badge: string;
  description: string;
  targetDescription: string;
  segments: Segment[];
}

export interface WorkMetadata {
  title: string;
  creator: string; // author or creator
  medium: string; // e.g. Novel, Play, Poetry, Advertisement, Editorial cartoon, Photojournalism
  extractDetails: string; // e.g. "Lines 24-58" or "Print Ad #2"
  isLiterary: boolean;
}

export interface StudentIOData {
  studentName: string;
  candidateNumber?: string;
  schoolName: string;
  examDate?: string;
  globalIssue: string;
  globalIssueField: string;
  thesisStatement: string;
  textA: WorkMetadata;
  textB: WorkMetadata;
  bullets: string[]; // up to 10 bullet points allowed by IB
  bulletSegmentMapping?: Record<number, string>; // Maps bullet index 0..9 to segment ID
  activeTemplateId: TemplateId;
  customSegments: Segment[];
  soundEnabled: boolean;
  voiceSpeechEnabled: boolean;
  giCheckinFrequency: 'high' | 'normal' | 'low'; // high = 45s, normal = 90s, low = halfway
  includeDiscussion: boolean; // 5 min discussion
}
