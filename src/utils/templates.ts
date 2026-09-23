import { Segment, StudentIOData, TemplatePreset } from '../types';

export const GLOBAL_ISSUE_FIELDS = [
  'Culture, identity and community',
  'Beliefs, values and education',
  'Politics, power and justice',
  'Art, creativity and the imagination',
  'Science, technology and the environment',
];

export const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'quadrant_balanced',
    name: '4-Quadrant Balance Model',
    badge: 'Video Thumbnail (Image 2)',
    description: 'Separates Extract vs Overall Work into 2-minute balanced quarters. Perfect for ensuring equal 50/50 balance between extract and broader work.',
    targetDescription: 'Intro (1m) → Text A Work (2m) → Text A Extract (2m) → Text B Work (2m) → Text B Extract (2m) → Conclusion (1m)',
    segments: [
      {
        id: 'qb_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Intro: Global Issue & Works',
        subtitle: 'GI definition, thesis & presentation roadmap',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'amber',
        keyPrompts: [
          'Define Global Issue clearly (broad significance, transnational, local impact)',
          'Identify Literary Work (author, title) & Non-Literary BOW (creator, title)',
          'Deliver clear thesis: How does each work uniquely explore this Global Issue?',
          'Outline roadmap of presentation (strict: no direct comparison between texts!)',
        ],
        guidancePoints: [
          'Keep introduction strictly under 1 minute',
          'Make your Global Issue specific and grounded in the prompt',
          'Clarify the extracts you have selected',
        ],
        giCheckinReminder: 'Have you clearly stated your Global Issue and why it matters globally and locally?',
      },
      {
        id: 'qb_2',
        orderNumber: 2,
        type: 'textA_work',
        title: 'TEXT A: Overall Work',
        subtitle: 'Literary Work: Macro techniques, context & overarching themes',
        quadrant: 'top-left',
        durationSeconds: 120,
        colorKey: 'blue',
        keyPrompts: [
          'Examine macro authorial choices across the entire literary work',
          'Structural patterns, recurring motifs, character development across the work',
          'Socio-historical or cultural context shaping the Global Issue representation',
          'Directly connect macro findings to the Global Issue',
        ],
        guidancePoints: [
          'Reference at least 2 broader moments/themes from the full work',
          'Demonstrate broad knowledge of the author’s craft',
          'Check-in: Relate every observation to the Global Issue',
        ],
        giCheckinReminder: 'Check-in: How does this broader motif in the entire literary work reveal the Global Issue?',
      },
      {
        id: 'qb_3',
        orderNumber: 3,
        type: 'textA_extract',
        title: 'TEXT A: Extract (Micro Analysis)',
        subtitle: 'Literary Extract: 1–2 specific authorial choices in passage',
        quadrant: 'bottom-left',
        durationSeconds: 120,
        colorKey: 'purple',
        keyPrompts: [
          'Close micro-analysis of 1–2 specific authorial choices in the 40-line extract',
          'Quote exact diction, syntax, figurative language, tone, or structural shifts',
          'Explain the nuanced effect on the reader/audience',
          'Ground every literary device directly into your Global Issue',
        ],
        guidancePoints: [
          'Anchor your claims with short, embedded textual quotations',
          'Avoid mere plot narration—focus strictly on technique and effect',
          'Equal 2-minute balance with the broader work',
        ],
        giCheckinReminder: 'Check-in: Does this specific metaphor/device highlight the conflict of the Global Issue?',
      },
      {
        id: 'qb_4',
        orderNumber: 4,
        type: 'textB_work',
        title: 'TEXT B: Overall Body of Work',
        subtitle: 'Non-Literary BOW: Broader corpus, campaigns & thematic scope',
        quadrant: 'top-right',
        durationSeconds: 120,
        colorKey: 'emerald',
        keyPrompts: [
          'Analyze the creator’s broader Body of Work (campaign, series, articles, portfolio)',
          'Identify recurring visual, rhetorical, multimodal, or persuasive strategies',
          'Discuss intended audience, medium constraints, and contextual relevance',
          'Explicit link to the Global Issue (no comparison to Text A!)',
        ],
        guidancePoints: [
          'Show deep familiarity with the creator’s wider repertoire',
          'Analyze how medium-specific choices target the chosen audience',
          'Maintain independent focus on the Global Issue',
        ],
        giCheckinReminder: 'Check-in: How does the creator’s broader campaign reflect the reality of the Global Issue?',
      },
      {
        id: 'qb_5',
        orderNumber: 5,
        type: 'textB_extract',
        title: 'TEXT B: Extract (Micro Analysis)',
        subtitle: 'Non-Literary Extract: 1–2 specific multimodal / rhetorical choices',
        quadrant: 'bottom-right',
        durationSeconds: 120,
        colorKey: 'rose',
        keyPrompts: [
          'Detailed micro-analysis of 1–2 choices in the selected non-literary extract',
          'Composition, typography, visual hierarchy, camera angle, ethos/pathos/logos',
          'Explain the immediate rhetorical impact on the viewer/reader',
          'Synthesize back directly to the Global Issue',
        ],
        guidancePoints: [
          'Point to specific visual or textual details in the extract',
          'Discuss how form and medium shape meaning',
          'Wrap up before the final minute for the conclusion',
        ],
        giCheckinReminder: 'Check-in: How does this visual/rhetorical choice influence the public perception of the Global Issue?',
      },
      {
        id: 'qb_6',
        orderNumber: 6,
        type: 'conclusion',
        title: 'Conclusion: Evaluation of Both Works',
        subtitle: 'Value of each work’s representation of the Global Issue',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'teal',
        keyPrompts: [
          'Synthesize the unique value of each work’s representation of the Global Issue',
          'Evaluate the effectiveness of each creator in achieving their purpose',
          'Provide a final resonant takeaway on the significance of the Global Issue',
          'Strong closing sentence (leave 5–10 seconds buffer before 10:00 cutoff)',
        ],
        guidancePoints: [
          'Do not introduce brand new evidence or plot points',
          'Do NOT do a direct comparison matrix—focus on how both illuminate the GI',
          'Finish cleanly right at or just before 10 minutes',
        ],
        giCheckinReminder: 'Check-in: What lasting perspective on the Global Issue do both creators offer the audience?',
      },
    ],
  },
  {
    id: 'philpot_method1',
    name: 'Philpot Education Outline Method 1',
    badge: 'Chevron Chart (Image 1)',
    description: 'Sequenced flow with 1 min Intro, 4 min dedicated Literary analysis, 4 min dedicated Non-Literary analysis, and 1 min Conclusion.',
    targetDescription: 'Intro (1m) → Literary Work & Passage (4m) → Non-Literary BOW & Passage (4m) → Conclusion (1m)',
    segments: [
      {
        id: 'pm_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Introduce Global Issue & Works',
        subtitle: 'What is the GI? Why does it matter? Thesis statement & Works',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'orange',
        keyPrompts: [
          'What is the Global Issue (GI)? Why does it matter across time, space, and cultures?',
          'How is your GI presented in your literary work and non-lit BOW? (Answer = Thesis)',
          'Introduce texts clearly (Author, Literary Work, Creator, Non-Literary BOW)',
          'Clear organizational roadmap without reading a script',
        ],
        guidancePoints: [
          'Adhere strictly to 1 minute to preserve analytical time',
          'State thesis with conviction',
        ],
        giCheckinReminder: 'Check-in: Is your Global Issue clear, transnational, and significant?',
      },
      {
        id: 'pm_2',
        orderNumber: 2,
        type: 'textA_combined',
        title: 'Literary Work & Passage (Features 1, 2, 3)',
        subtitle: '4 minutes: Passage examples → Entire work context → Relevance to GI',
        quadrant: 'top-left',
        durationSeconds: 240,
        colorKey: 'rose',
        keyPrompts: [
          'Feature 1: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Feature 2: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Feature 3: Example from passage → Effects → Examples from entire work → Effects → Relevance to GI',
          'Maintain 50/50 balance between the extract and the broader literary work',
        ],
        guidancePoints: [
          'Aim for ~1m15s to 1m20s per feature checkpoint',
          'Explicitly transition from extract micro-quotes to whole-work macro motifs',
          'Every feature must close with explicit relevance to the Global Issue',
        ],
        giCheckinReminder: 'Check-in: Have you connected Feature 2 back to the Global Issue?',
      },
      {
        id: 'pm_3',
        orderNumber: 3,
        type: 'textB_combined',
        title: 'Non-Literary BOW & Passage (Features 4, 5, 6)',
        subtitle: '4 minutes: Passage examples → BOW examples → Relevance to GI',
        quadrant: 'top-right',
        durationSeconds: 240,
        colorKey: 'rose',
        keyPrompts: [
          'Feature 4: Example from passage → Effects → Examples from BOW → Effects → Relevance to GI',
          'Feature 5: Example from passage → Effects → Examples from BOW → Effects → Relevance to GI',
          'Feature 6: Example from passage → Effects → Examples from BOW → Effects → Relevance to GI',
          'Balance specific visual/rhetorical choices in extract with the broader campaign/portfolio',
        ],
        guidancePoints: [
          'Address multimodal elements, visual layout, medium, and authorial intention',
          'Do NOT compare with Text A—analyze independently through the lens of the GI',
          'Watch the 8-minute mark closely to prepare for conclusion',
        ],
        giCheckinReminder: 'Check-in: Have you linked this non-literary feature directly to the Global Issue?',
      },
      {
        id: 'pm_4',
        orderNumber: 4,
        type: 'conclusion',
        title: 'Conclusion: Synthesis & Evaluation',
        subtitle: 'How do BOW and Lit work present GI similarly/differently? Writer efficacy',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'orange',
        keyPrompts: [
          'How do the BOW and Lit work present the GI similarly and differently in terms of approach and perspective?',
          'How effective are the writers and creators in achieving their aims regarding the Global Issue?',
          'Final authoritative statement on the real-world significance of the GI',
          'Finish cleanly within the 10-minute limit',
        ],
        guidancePoints: [
          'Summarize insights concisely without reading new quotes',
          'End precisely at 9:55–10:00 to avoid examiner penalties',
        ],
        giCheckinReminder: 'Check-in: Final synthesis of how both texts independently illuminate the Global Issue!',
      },
    ],
  },
  {
    id: 'extract_first',
    name: 'Extract-First Balanced Model',
    badge: 'Micro-to-Macro',
    description: 'Begins with intense micro-analysis of the extract before zooming out to the broader work for both texts.',
    targetDescription: 'Intro (1m) → Text A Extract (2m) → Text A Work (2m) → Text B Extract (2m) → Text B Work (2m) → Conclusion (1m)',
    segments: [
      {
        id: 'ef_1',
        orderNumber: 1,
        type: 'intro',
        title: 'Intro: Global Issue & Works',
        subtitle: 'Definition of GI, works introduced, thesis stated',
        quadrant: 'center-top',
        durationSeconds: 60,
        colorKey: 'amber',
        keyPrompts: [
          'Define Global Issue clearly (broad significance, transnational, local impact)',
          'Identify Literary Work & Non-Literary BOW',
          'Deliver clear thesis and roadmap',
        ],
        guidancePoints: ['Keep intro under 1 minute'],
        giCheckinReminder: 'Check-in: Global Issue defined and justified?',
      },
      {
        id: 'ef_2',
        orderNumber: 2,
        type: 'textA_extract',
        title: 'TEXT A: Extract (Micro Analysis First)',
        subtitle: 'Literary Extract: 1–2 specific textual choices & technique',
        quadrant: 'bottom-left',
        durationSeconds: 120,
        colorKey: 'purple',
        keyPrompts: [
          'Detailed close reading of specific lines in the literary extract',
          'Analyze diction, metaphor, syntax, rhythm, and immediate tone',
          'Connect specific technique directly to Global Issue',
        ],
        guidancePoints: ['Analyze 1-2 powerful micro choices in depth'],
        giCheckinReminder: 'Check-in: Does this literary device reveal the Global Issue?',
      },
      {
        id: 'ef_3',
        orderNumber: 3,
        type: 'textA_work',
        title: 'TEXT A: Overall Work (Macro Scope)',
        subtitle: 'Literary Work: Broader character arc, motifs, and context',
        quadrant: 'top-left',
        durationSeconds: 120,
        colorKey: 'blue',
        keyPrompts: [
          'Zoom out to 1–2 key moments or structural motifs across the entire work',
          'Show how the author develops the Global Issue across the full text',
          'Demonstrate equal balance between extract and whole work',
        ],
        guidancePoints: ['Connect extract findings to the full text arc'],
        giCheckinReminder: 'Check-in: How does the whole literary work contextualize the Global Issue?',
      },
      {
        id: 'ef_4',
        orderNumber: 4,
        type: 'textB_extract',
        title: 'TEXT B: Extract (Micro Analysis First)',
        subtitle: 'Non-Literary Extract: 1–2 specific multimodal / visual choices',
        quadrant: 'bottom-right',
        durationSeconds: 120,
        colorKey: 'rose',
        keyPrompts: [
          'Detailed analysis of 1–2 choices in the non-literary extract',
          'Visual composition, framing, headline, rhetorical appeal',
          'Connect choice to effect and the Global Issue',
        ],
        guidancePoints: ['Specific multimodal analysis of chosen extract'],
        giCheckinReminder: 'Check-in: How does this visual detail communicate the Global Issue?',
      },
      {
        id: 'ef_5',
        orderNumber: 5,
        type: 'textB_work',
        title: 'TEXT B: Overall Body of Work',
        subtitle: 'Non-Literary BOW: Wider campaign, portfolio, context',
        quadrant: 'top-right',
        durationSeconds: 120,
        colorKey: 'emerald',
        keyPrompts: [
          'Expand to creator’s broader portfolio, campaign, or editorial body of work',
          'Show recurring visual or rhetorical style across other pieces',
          'Tie whole body of work to the Global Issue',
        ],
        guidancePoints: ['Show breadth of knowledge across the BOW'],
        giCheckinReminder: 'Check-in: How does the overall body of work sustain the Global Issue?',
      },
      {
        id: 'ef_6',
        orderNumber: 6,
        type: 'conclusion',
        title: 'Conclusion: Evaluation & Takeaway',
        subtitle: 'Value of both works in presenting the Global Issue',
        quadrant: 'center-bottom',
        durationSeconds: 60,
        colorKey: 'teal',
        keyPrompts: [
          'Synthesize value of both works’ representation of the Global Issue',
          'Evaluate creator effectiveness and craftsmanship',
          'Final conclusion on the enduring relevance of the Global Issue',
        ],
        guidancePoints: ['Wrap up cleanly before 10:00 cutoff'],
        giCheckinReminder: 'Check-in: Final synthesis of Global Issue understanding.',
      },
    ],
  },
];

export const DISCUSSION_SEGMENT: Segment = {
  id: 'discussion_period',
  orderNumber: 7,
  type: 'discussion',
  title: 'Teacher Discussion & Follow-up Q&A',
  subtitle: '5 minutes: Teacher questions, elaboration, and deeper inquiry',
  quadrant: 'extra',
  durationSeconds: 300,
  colorKey: 'slate',
  keyPrompts: [
    '“You mentioned... could you elaborate further on...?”',
    '“How does the historical context of the work amplify this aspect of the GI?”',
    '“What other subtleties or tensions did you notice in the extract?”',
    'Demonstrate authentic, conversational mastery without scripted recitations',
  ],
  guidancePoints: [
    'Teacher guides questions to help you hit higher criteria bands',
    'Listen carefully, breathe, and refer back to your extracts or broader texts',
    'Keep answers focused on authorial choices and the Global Issue',
  ],
  giCheckinReminder: 'Check-in: Ground your responses in specific textual evidence and the Global Issue!',
};

export const DEFAULT_STUDENT_DATA: StudentIOData = {
  studentName: 'Alex Mercer',
  schoolName: 'International School',
  globalIssue: 'The erosion of individual autonomy and psychological freedom under systemic state surveillance',
  globalIssueField: 'Politics, power and justice',
  thesisStatement: 'Both George Orwell’s novel 1984 and Shepard Fairey’s propaganda poster campaign demonstrate how authoritarian surveillance dismantles personal privacy, using psychological coercion to enforce ideological conformity.',
  textA: {
    title: '1984',
    creator: 'George Orwell',
    medium: 'Dystopian Fiction (Novel)',
    extractDetails: 'Part I, Chapter 1 (Lines 24–65: Winston encountering telescreen and Big Brother poster)',
    isLiterary: true,
  },
  textB: {
    title: 'Obey Giant / Surveillance Campaign',
    creator: 'Shepard Fairey',
    medium: 'Screenprint & Street Art Propaganda',
    extractDetails: '“Obey with Caution / Big Brother Is Watching” Screenprint (2012)',
    isLiterary: false,
  },
  bullets: [
    'Global Issue: Systemic state surveillance destroying individual psychological freedom & autonomy.',
    'Works: Orwell’s 1984 (Text A) & Fairey’s Obey street-art campaign (Text B). Focus on propaganda mechanics.',
    'Text A Whole Work: Telescreen ubiquity, Thought Police, doublethink eroding Winston’s cognitive independence.',
    'Text A Extract: Personification of telescreen, claustrophobic sensory imagery, menacing stare of Big Brother poster.',
    'Text A Extract: Oxymoronic party slogans (“War is Peace”) showing semantic inversion to suppress dissent.',
    'Text B Whole BOW: Fairey’s repurposing of fascist iconography to expose public complacency in modern surveillance.',
    'Text B Extract: Harsh monochromatic contrast & stark high-angle gaze creating psychological intimidation.',
    'Text B Extract: Direct imperative typography (“OBEY”) forcing viewer to question blind institutional compliance.',
    'GI Synthesis: Orwell uses narrative dread while Fairey uses disruptive visual dissonance to expose surveillance.',
    'Conclusion: Enduring warning that unchecked state surveillance requires vigilant resistance to preserve human autonomy.',
  ],
  activeTemplateId: 'quadrant_balanced',
  customSegments: TEMPLATE_PRESETS[0].segments,
  soundEnabled: true,
  voiceSpeechEnabled: false,
  giCheckinFrequency: 'normal',
  includeDiscussion: false,
};

const STORAGE_KEY = 'ib_oral_visual_timer_data_v1';

export function loadStudentData(): StudentIOData {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_DATA;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_STUDENT_DATA, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load student data from localStorage', e);
  }
  return DEFAULT_STUDENT_DATA;
}

export function saveStudentData(data: StudentIOData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save student data to localStorage', e);
  }
}
