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
- **Auto-save** progress to localStorage
- **Time's up modal** with automatic submission
- **Results screen** showing correct/incorrect/skipped breakdown
- **Animated preview** demonstrating expected form behavior
- **Show Solution** toggle with explanation for each question

## Sections & Questions

| Section | Questions | Type |
|---------|-----------|------|
| S1 | Q1: Flight Validation | Angular coding (TS + HTML) |
| S2 | Q2-Q4: AWS Cloud | Single choice with diagrams |
| S3 | Q5-Q9: HTML/DOM/CSS | Single & multiple choice |
| S4 | Q10: List Segregation | TypeScript coding |
| S5 | Q11-Q13: Angular/RxJS | Single choice |

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** for fast dev/build
- **Monaco Editor** (@monaco-editor/react) - VSCode's editor engine
- **CSS** custom dark theme (no framework)
- **localStorage** for persistence

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
├── App.tsx                           # Main app with questions data & routing
├── styles.css                        # All styles (dark theme)
├── utils/
│   └── storage.ts                    # localStorage helpers
├── components/
│   ├── Header.tsx                    # Timer + Save & Proceed
│   ├── Sidebar.tsx                   # S1-S5 navigation with saved indicators
│   ├── QuestionSection.tsx           # Generic question renderer (left desc + right options)
│   ├── Section1FlightValidation.tsx  # Coding challenge with Monaco + Preview + Tests
│   ├── Section4Challenge.tsx         # List Segregation coding challenge
│   ├── TimeUpModal.tsx               # Modal when time expires
│   └── ResultsScreen.tsx             # Final results with score breakdown
public/
└── images/                           # SVG diagrams for AWS questions
```

## Key Behaviors

### Timer
- Starts at 90 minutes (configurable in `Header.tsx` → `INITIAL_TIME`)
- Persists in localStorage (survives page reloads)
- Turns red and pulses when < 5 minutes remain
- When it hits 0: auto-saves, shows modal, locks assessment

### Saving
- **Save & Next →**: Saves selected answer(s) and advances to next question
- **Save & Proceed** (header): Saves all progress globally
- Saved questions show ✓ green checkmark in sidebar
- All data persists in localStorage

### Coding Challenges (Q1, Q10)
- Start with incomplete skeleton code (must be filled in)
- **Run**: Compiles and shows live preview
- **Run Tests**: Validates code against test cases (pattern matching)
- **Show Solution**: Reveals complete solution with "Load into Editor" button
- Resizable panels (horizontal columns + vertical bottom panel)

### Results
- Shows after time expires or manual submission
- Compares user answers vs correct answers
- Displays: score circle, correct/incorrect/skipped counts, per-question breakdown
- "Restart Assessment" clears everything and starts fresh

## Configuration

To change the timer duration, edit `src/components/Header.tsx`:

```typescript
const INITIAL_TIME = 90 * 60  // seconds (90 minutes)
```

Remember to clear `hackerrank-timer` from localStorage after changing this value.

## License

MIT
