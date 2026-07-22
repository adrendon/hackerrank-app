import { useState } from 'react'

interface ResultsScreenProps {
  savedQuestions: Set<number>
  userAnswers: Record<number, number[]>
  codeResults: Record<number, boolean>
  onRestart: () => void
}

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

const questionNames: Record<number, string> = {
  1: 'Flight Validation',
  2: 'AWS Serverless Application',
  3: 'AWS Web App: Load Balancing',
  4: 'AWS EC2 - Remove a Load Balancer',
  5: 'DOM',
  6: 'Image Lists',
  7: 'Output Prediction',
  8: 'Link Opening',
  9: 'Mailto',
  10: 'List Segregation',
  11: 'RxJS Operator Marble Diagrams',
  12: 'Cache Reused Components',
  13: 'Named Routes With Lazy-Loading',
}

const explanations: Record<number, string> = {
  2: 'DAX helps with read/write throttling on DynamoDB.',
  3: 'With cross-zone disabled, 50% to each AZ: AZ A gets 25% per target (2 targets), AZ B gets 16.67% per target (3 targets).',
  4: 'Auto-scaling is independent of the load balancer and will continue to work.',
  5: 'DOM is a tree structure and interaction is through event handlers. It can be manipulated with multiple languages, not just JavaScript.',
  6: 'Correct HTML description list uses <dt> for terms and <dd> for descriptions.',
  7: '<abbr> shows content text "HTML" (not title), <bdo dir="rtl"> reverses text.',
  8: 'iframe target must match iframe name attribute. href (not src) is used. HTML attributes are case-insensitive.',
  9: 'mailto: (case insensitive) with href attribute is valid. "mail:" and "link=" are not.',
  11: 'combineLatest + retry + debounceTime + catchError meets all requirements.',
  12: 'The new Angular 13 event for router-outlet is "activate".',
  13: 'URL pattern aux(outlet1:route1/details) requires path:"" > children > path:"aux" > children with outlet.',
}

function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false
  const sorted1 = [...a].sort()
  const sorted2 = [...b].sort()
  return sorted1.every((v, i) => v === sorted2[i])
}

function ResultsScreen({ savedQuestions, userAnswers, codeResults, onRestart }: ResultsScreenProps) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const totalQuestions = 13

  let correctCount = 0
  let incorrectCount = 0
  const questionResults: { id: number; label: string; status: 'correct' | 'incorrect' | 'skipped' }[] = []

  for (let i = 1; i <= 13; i++) {
    if (i === 1 || i === 10) {
      const testsPassed = codeResults[i] === true
      if (!savedQuestions.has(i)) {
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'skipped' })
      } else if (testsPassed) {
        correctCount++
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'correct' })
      } else {
        incorrectCount++
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'incorrect' })
      }
    } else {
      const userAns = userAnswers[i]
      const correct = correctAnswers[i]
      if (!userAns || !savedQuestions.has(i)) {
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'skipped' })
      } else if (correct && arraysEqual(userAns, correct)) {
        correctCount++
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'correct' })
      } else {
        incorrectCount++
        questionResults.push({ id: i, label: `Q${i} - ${questionNames[i]}`, status: 'incorrect' })
      }
    }
  }

  const percentage = Math.round((correctCount / totalQuestions) * 100)

  const toggleExpand = (id: number) => {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
            <span className="stat-num">{totalQuestions - correctCount - incorrectCount}</span>
            <span className="stat-label">Skipped</span>
          </div>
        </div>

        <div className="results-breakdown">
          <h3>Question Details</h3>
          <div className="breakdown-grid">
            {questionResults.map((q) => (
              <div key={q.id}>
                <div
                  className={`breakdown-item breakdown-${q.status} ${q.status === 'incorrect' ? 'clickable' : ''}`}
                  onClick={() => q.status === 'incorrect' && toggleExpand(q.id)}
                >
                  <span className="breakdown-label">
                    {q.status === 'incorrect' && (expanded.has(q.id) ? '▾ ' : '▸ ')}
                    {q.label}
                  </span>
                  <span className={`breakdown-status ${q.status}`}>
                    {q.status === 'correct' && '✓ Correct'}
                    {q.status === 'incorrect' && '✗ Incorrect'}
                    {q.status === 'skipped' && '○ Skipped'}
                  </span>
                </div>
                {q.status === 'incorrect' && expanded.has(q.id) && (
                  <div className="breakdown-detail">
                    {userAnswers[q.id] && (
                      <p className="detail-your-answer">
                        <strong>Your answer:</strong> Option {userAnswers[q.id].map(i => i + 1).join(', ')}
                      </p>
                    )}
                    {correctAnswers[q.id] && (
                      <p className="detail-correct-answer">
                        <strong>Correct answer:</strong> Option {correctAnswers[q.id].map(i => i + 1).join(', ')}
                      </p>
                    )}
                    {(q.id === 1 || q.id === 10) && (
                      <p className="detail-correct-answer">
                        <strong>Note:</strong> All tests must pass for this coding question.
                      </p>
                    )}
                    {explanations[q.id] && (
                      <p className="detail-explanation">{explanations[q.id]}</p>
                    )}
                  </div>
                )}
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
