import { useState } from 'react'
import { QuestionData } from '../App'

interface QuestionSectionProps {
  question: QuestionData
  onSave?: (answers: number[]) => void
  allSaved?: boolean
  savedAnswers?: number[]
}

function renderDescription(text: string) {
  const parts = text.split('```')
  return parts.map((part, i) => {
    if (i % 2 === 1) {
      // Code block
      return (
        <pre key={i} className="desc-code-block">
          {part.startsWith('\n') ? part.slice(1) : part}
        </pre>
      )
    }
    // Text block
    return part.split('\n').map((line, j) => (
      line ? <p key={`${i}-${j}`}>{line}</p> : <br key={`${i}-${j}`} />
    ))
  })
}

function QuestionSection({ question, onSave, allSaved, savedAnswers }: QuestionSectionProps) {
  const [selected, setSelected] = useState<number[]>(savedAnswers || [])
  const [showAnswer, setShowAnswer] = useState(false)
  const toggleOption = (idx: number) => {
    let newSelected: number[]
    if (question.type === 'single') {
      newSelected = [idx]
    } else {
      if (selected.includes(idx)) {
        newSelected = selected.filter((i) => i !== idx)
      } else {
        newSelected = [...selected, idx]
      }
    }
    setSelected(newSelected)
    // Auto-save selection (without navigating) so if time runs out it's saved
    if (newSelected.length > 0) {
      const prev = JSON.parse(localStorage.getItem('hackerrank-user-answers') || '{}')
      prev[question.id] = newSelected
      localStorage.setItem('hackerrank-user-answers', JSON.stringify(prev))
    }
  }

  const clearSelection = () => {
    setSelected([])
  }

  return (
    <div className="question-layout">
      {/* Left panel - Question description + image */}
      <div className="question-left-panel">
        <div className="question-left-header">
          <span className="question-left-icon">📋</span>
          <h2 className="question-left-title">{question.text}</h2>
        </div>

        {question.description && (
          <div className="question-left-description">
            {renderDescription(question.description)}
          </div>
        )}

        {question.image && (
          <div className="question-left-image">
            <img src={question.image} alt="Question diagram" />
          </div>
        )}

        {question.additionalText && (
          <div className="question-left-additional">
            {question.additionalText.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        )}

        {question.finalQuestion && (
          <p className="question-left-final">{question.finalQuestion}</p>
        )}

        {/* Answer panel */}
        {question.correctAnswers && (
          <div className="answer-panel">
            <button className="answer-toggle" onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? '▾ Hide Answer' : '▸ Show Answer'}
            </button>
            {showAnswer && (
              <div className="answer-content">
                <div className="answer-correct">
                  <strong>Correct answer{question.correctAnswers.length > 1 ? 's' : ''}:</strong>
                  <ul>
                    {question.correctAnswers.map((idx) => (
                      <li key={idx}>{question.options[idx]}</li>
                    ))}
                  </ul>
                </div>
                {question.explanation && (
                  <div className="answer-explanation">
                    <strong>Explanation:</strong>
                    <p>{question.explanation}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right panel - Options */}
      <div className="question-right-panel">
        <p className="question-right-instruction">{question.instruction}</p>

        <div className="options-list">
          {question.options.map((option, idx) => (
            <div
              key={idx}
              className={`option-item ${selected.includes(idx) ? 'selected' : ''}`}
              onClick={() => toggleOption(idx)}
            >
              <div className={`option-radio ${question.type === 'single' ? 'radio' : 'checkbox'} ${selected.includes(idx) ? 'checked' : ''}`}>
                {selected.includes(idx) && (question.type === 'single' ? '●' : '✓')}
              </div>
              <span className="option-text">{option}</span>
            </div>
          ))}
        </div>

        <div className="options-actions">
          <button className="clear-selection" onClick={clearSelection}>
            Clear Selection
          </button>
          {selected.length > 0 && onSave && !allSaved && (
            <button className="save-question-btn" onClick={() => onSave(selected)}>
              Save &amp; Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default QuestionSection
