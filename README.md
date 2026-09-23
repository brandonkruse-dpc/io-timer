# IB English A: Language & Literature – Individual Oral (IO) Visual Timer

A responsive visual timer and structural planner designed for the International Baccalaureate (IB) Diploma Programme Language A Individual Oral (IO) 10-minute presentation.

Based directly on two primary instructional frameworks used by IB educators worldwide:
1. **The 4-Quadrant Balance Model**: Separates the oral into balanced 2-minute quadrants (Text A Whole Work, Text A Extract, Text B Whole BOW, Text B Extract) flanked by 1-minute Introduction and 1-minute Conclusion.
2. **Philpot Education Outline Method 1**: Features the classic 1-4-4-1 chevron sequence with 3 analytical feature checkpoints per work connecting back to the Global Issue.

---

## Key Features

- **Strict 10-Minute Timing Enforcement**:
  - Live segment and total oral timers with color-coded warning states (Amber at 9:00, Crimson at 10:00).
  - Optional 5-minute Teacher Discussion (Q&A) period.
- **Global Issue Check-in Alerts**:
  - Reminds students at configurable intervals to anchor every literary and multimodal choice back to their Global Issue.
  - Enforces the crucial IB requirement: **no direct comparison between extracts**; both must relate independently to the Global Issue.
- **Multiple Visual Perspectives**:
  - **Quadrant View**: Illuminated quadrant dashboard directly adapted from the IB English Guys / LitLearn model, highlighting the active segment and remaining seconds.
  - **Chevron Flow**: Color-coded chevron timeline inspired by Philpot Education Outline Method 1 with interactive feature-level checkoffs.
  - **Focus Rehearsal Stage**: Distraction-free, large-clock display ideal for mock presentation practice and exam rehearsal.
  - **Official 10-Bullet Outline Form**: Editable, word-counted, printable cheat sheet adhering strictly to the maximum 10-bullet IB regulation.
  - **Assessment Criteria Guide**: Comprehensive breakdown of Criterion A, B, C, and D (40 marks total).
- **Customization & Arrangement**:
  - Select between presets or customize order (e.g., Extract-first, swap Text A and Text B order).
  - Tweak segment seconds with a live 10:00 balance calculator.
  - Save candidate details, Global Issue, and works to browser local storage.
- **Self-Contained & Web Audio Synth**:
  - Zero external media assets; all alert chimes and bells are generated in real-time via the Web Audio API.
  - Optional Web Speech API synthesis for spoken verbal cues.

---

## Deploying to GitHub Pages

This application has zero server-side or third-party backend dependencies and is configured with relative base paths (`base: './'`) in `vite.config.ts`.

### Method A: GitHub Pages via GitHub Actions (Recommended)

1. Push this repository to GitHub.
2. In your repository on GitHub, navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Source** as **GitHub Actions**.
4. Choose the default **Static HTML** or **Vite** action. A simple `.github/workflows/deploy.yml` can build with:
   ```bash
   npm ci
   npm run build
   ```
   and upload the `dist` folder.

### Method B: Manual Deployment with `gh-pages`

```bash
npm install
npm run build
npx gh-pages -d dist
```

---

## License

Apache-2.0
