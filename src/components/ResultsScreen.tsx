interface ResultsScreenProps {
  savedQuestions: Set<number>
  userAnswers: Record<number, number[]>
  onRestart: () => void
}

// Correct answers for each question (imported from data)
const correctAnswers: Record<number, number[]> = {
  2: [0],
  3: [0],
  4: [0],
  5: [0, 3],
  6: [3],
  7: [0],
  8: [2, 5, 6],
  9: [0, 2],
  11: [0],
  12: [2],
  13: [0],
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sorted1 = [...a].sort()
  const sorted2 = [...b].sort()
  return sorted1.every((v, i) => v === sorted2[i])
}

function ResultsScreen({ savedQuestions, userAnswers, onRestart }: ResultsScreenProps) {
  const totalQuestions = 13
  const completed = savedQuestions.size

  // Calculate correct answers
  let correctCount = 0
  let incorrectCount = 0
  const questionResults: { id: number; label: string; status: 'correct' | 'incorrect' | 'submitted' | 'skipped' }[] = []

  for (let i = 1; i <= 13; i++) {
    if (i === 1 || i === 10) {
      // Coding questions - just submitted or not
      questionResults.push({
        id: i,
        label: `Q${i} - ${i === 1 ? 'Flight Validation' : 'List Segregation'}`,
        status: savedQuestions.has(i) ? 'submitted' : 'skipped'
      })
      if (savedQuestions.has(i)) correctCount++
    } else {
      const userAns = userAnswers[i]
      const correct = correctAnswers[i]
      if (!userAns || !savedQuestions.has(i)) {
        questionResults.push({ id: i, label: `Q${i}`, status: 'skipped' })
      } else if (correct && arraysEqual(userAns, correct)) {
        correctCount++
        questionResults.push({ id: i, label: `Q${i}`, status: 'correct' })
      } else {
        incorrectCount++
        questionResults.push({ id: i, label: `Q${i}`, status: 'incorrect' })
      }
    }
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100)

  return (
    <div className="results-screen">
      <div className="results-card">
        <div className="results-header">
          <h1>Assessment Complete</h1>
          <p>Your responses have been submitted successfully.</p>
        </div>

        <div className="results-score">
          <div className="score-circle">
            <svg viewBox="0 0 100 100" width="140" height="140">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#1f2937" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8"
                strokeDasharray={`${percentage * 2.64} 264`}
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{correctCount}</span>
              <span className="score-total">/ {totalQuestions}</span>
            </div>
          </div>
          <p className="score-label">{percentage}% Score</p>
        </div>

        <div className="results-stats">
          <div className="stat-item stat-correct">
            <span className="stat-num">{correctCount}</span>
            <span className="stat-label">Correct</span>
          </div>
          <div className="stat-item stat-incorrect">
            <span className="stat-num">{incorrectCount}</span>
            <span className="stat-label">Incorrect</span>
          </div>
          <div className="stat-item stat-skipped">
            <span className="stat-num">{totalQuestions - completed}</span>
            <span className="stat-label">Skipped</span>
          </div>
        </div>

        <div className="results-breakdown">
          <h3>Question Details</h3>
          <div className="breakdown-grid">
            {questionResults.map((q) => (
              <div key={q.id} className={`breakdown-item breakdown-${q.status}`}>
                <span className="breakdown-label">{q.label}</span>
                <span className={`breakdown-status ${q.status}`}>
                  {q.status === 'correct' && '✓ Correct'}
                  {q.status === 'incorrect' && '✗ Incorrect'}
                  {q.status === 'submitted' && '✓ Submitted'}
                  {q.status === 'skipped' && '○ Skipped'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="results-actions">
          <button className="results-restart-btn" onClick={onRestart}>
            Restart Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultsScreen
