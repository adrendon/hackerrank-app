# HackerRank Assessment App

A fully functional HackerRank-style assessment simulator built with React + TypeScript + Vite. Features a dark theme IDE interface with Monaco Editor, timed assessments, and automatic grading.

## Features

- **90-minute countdown timer** with persistence across page reloads
- **5 sections (S1-S5)** with 13 questions total
- **Monaco Editor** (VSCode engine) for coding challenges with syntax highlighting
- **3-column resizable layout**: Description | Code Editor | Live Preview
- **Run & Run Tests** with simulated test execution and results
- **Live Preview** rendering of Angular form with real validations
- **Multiple question types**: single choice, multiple choice, and coding
- **Auto-save** selections to localStorage (saved even if time runs out)
- **Time's up modal** with automatic submission of current progress
- **Results screen** with score breakdown, correct/incorrect per question, and expandable explanations
- **Animated preview** demonstrating expected form behavior (with hide toggle)
- **Show Solution** toggle with explanation and "Load into Editor" for coding questions
- **Smart navigation**: "Save & Next" goes to next unanswered question (not just +1)
- **Finish Assessment** button appears when all questions are answered

## Sections & Questions

| Section | Questions | Type |
|---------|-----------|------|
| S1 | Q1: Flight Validation | Angular coding (TS + HTML) |
| S2 | Q2: AWS Serverless Application | Single choice with diagram |
| S2 | Q3: AWS Web App: Load Balancing | Single choice with diagram |
| S2 | Q4: AWS EC2 - Remove a Load Balancer | Single choice with diagram |
| S3 | Q5: DOM | Multiple choice |
| S3 | Q6: Image Lists | Multiple choice with image |
| S3 | Q7: Output Prediction | Single choice |
| S3 | Q8: Link Opening | Multiple choice |
| S3 | Q9: Mailto | Multiple choice |
| S4 | Q10: List Segregation | TypeScript coding |
| S5 | Q11: RxJS Operator Marble Diagrams | Single choice with diagram |
| S5 | Q12: Cache Reused Components | Single choice with code blocks |
| S5 | Q13: Named Routes With Lazy-Loading | Single choice with code options |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast dev/build
- **Monaco Editor** (@monaco-editor/react) - VSCode's editor engine
- **CSS** custom dark theme (no framework)
- **localStorage** for full state persistence

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── main.tsx                          # Entry point
├── App.tsx                           # Main app with questions data, routing & state
├── styles.css                        # All styles (dark theme)
├── utils/
│   └── storage.ts                    # localStorage helpers
├── components/
│   ├── Header.tsx                    # Timer + Save & Proceed / Finish Assessment
│   ├── Sidebar.tsx                   # S1-S5 navigation with saved ✓ indicators
│   ├── QuestionSection.tsx           # Generic question renderer (left desc + right options)
│   ├── Section1FlightValidation.tsx  # Coding challenge with Monaco + Preview + Tests
│   ├── Section4Challenge.tsx         # List Segregation coding challenge
│   ├── TimeUpModal.tsx               # Modal when time expires
│   └── ResultsScreen.tsx             # Final results with score, accordion for incorrect
public/
└── images/                           # SVG diagrams for AWS/RxJS questions
```

## Key Behaviors

### Timer
- Starts at 90 minutes (configurable in `Header.tsx` → `INITIAL_TIME`)
- Persists in localStorage (survives page reloads)
- Turns red and pulses when < 5 minutes remain
- When hits 0: auto-saves current selections, shows modal, locks assessment
- Header disappears on results screen

### Saving & Navigation
- **Selecting an option**: auto-saves to localStorage immediately (no button needed)
- **Save & Next →**: formally marks question complete + navigates to next unanswered
- **Save & Proceed** (header): saves current progress (marks coding questions as complete)
- **Finish Assessment** (header): appears when all 13 questions answered, shows results
- Smart navigation finds next unanswered question (wraps around from end to beginning)

### Sidebar
- Shows ✓ green checkmark circle for saved questions
- Code icon (</>) for coding questions (Q1, Q10)
- Document icon for multiple choice questions
- S1-S5 labels separate the sections visually

### Coding Challenges (Q1, Q10)
- Start with incomplete skeleton code (must be filled in)
- **Run**: compiles and shows live preview (Q1) or output (Q10)
- **Run Tests**: validates code against test cases (pattern matching)
- Tests fail if code is incomplete → incorrect on results
- Tests pass if code has all required patterns → correct on results
- **Show Solution**: reveals complete solution with "Load into Editor" button
- Resizable panels (horizontal columns + vertical bottom panel)
- Bottom panel: Problems | Output | Terminal (resizable)

### Results Screen
- Shows after time expires or clicking "Finish Assessment"
- Score circle with percentage
- Stats: Correct (green) | Incorrect (red) | Skipped (gray)
- Per-question breakdown with colored left border
- **Incorrect questions are expandable (accordion)**:
  - Shows your answer vs correct answer
  - Shows explanation
- "Restart Assessment" clears all localStorage and reloads

### Question Descriptions
- Support code blocks with ` ``` ` delimiters (rendered with dark background, monospace)
- Support images (SVG diagrams)
- Support "Show Answer" toggle with correct answers + explanation

## Configuration

To change the timer duration, edit `src/components/Header.tsx`:

```typescript
const INITIAL_TIME = 90 * 60  // seconds (90 minutes)
```

After changing, clear `hackerrank-timer` from browser localStorage for the new value to take effect.

## localStorage Keys

| Key | Purpose |
|-----|---------|
| `hackerrank-timer` | Current countdown value in seconds |
| `hackerrank-saved-questions` | Array of question IDs formally saved |
| `hackerrank-user-answers` | Object mapping question ID to selected option indices |
| `hackerrank-finished` | "true" when assessment is complete (locks UI) |
| `hackerrank-code1-passed` | "true" if Q1 tests all passed |
| `hackerrank-code10-passed` | "true" if Q10 tests all passed |
| `hackerrank-code-results` | Object mapping coding question IDs to pass/fail |
| `hackerrank-assessment` | General assessment metadata |

## License

MIT
