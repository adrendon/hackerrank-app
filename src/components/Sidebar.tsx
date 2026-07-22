interface SidebarProps {
  activeQuestion: number
  onQuestionChange: (question: number) => void
  savedQuestions: Set<number>
}

interface SidebarItem {
  type: 'section' | 'question'
  id: number | string
  label: string
  questionNum?: number
  icon?: 'code' | 'question'
}

const sidebarItems: SidebarItem[] = [
  { type: 'section', id: 'S1', label: 'S1' },
  { type: 'question', id: 1, label: '1', questionNum: 1, icon: 'code' },
  { type: 'section', id: 'S2', label: 'S2' },
  { type: 'question', id: 2, label: '2', questionNum: 2, icon: 'question' },
  { type: 'question', id: 3, label: '3', questionNum: 3, icon: 'question' },
  { type: 'question', id: 4, label: '4', questionNum: 4, icon: 'question' },
  { type: 'section', id: 'S3', label: 'S3' },
  { type: 'question', id: 5, label: '5', questionNum: 5, icon: 'question' },
  { type: 'question', id: 6, label: '6', questionNum: 6, icon: 'question' },
  { type: 'question', id: 7, label: '7', questionNum: 7, icon: 'question' },
  { type: 'question', id: 8, label: '8', questionNum: 8, icon: 'question' },
  { type: 'question', id: 9, label: '9', questionNum: 9, icon: 'question' },
  { type: 'section', id: 'S4', label: 'S4' },
  { type: 'question', id: 10, label: '10', questionNum: 10, icon: 'code' },
  { type: 'section', id: 'S5', label: 'S5' },
  { type: 'question', id: 11, label: '11', questionNum: 11, icon: 'question' },
  { type: 'question', id: 12, label: '12', questionNum: 12, icon: 'question' },
  { type: 'question', id: 13, label: '13', questionNum: 13, icon: 'question' },
]

function Sidebar({ activeQuestion, onQuestionChange, savedQuestions }: SidebarProps) {
  return (
    <aside className="sidebar">
      {sidebarItems.map((item) => {
        if (item.type === 'section') {
          return (
            <div key={item.id} className="sidebar-section-label">
              {item.label}
            </div>
          )
        }

        const isActive = activeQuestion === item.questionNum
        const isSaved = savedQuestions.has(item.questionNum!)

        return (
          <button
            key={item.id}
            className={`sidebar-question-btn ${isActive ? 'active' : ''} ${isSaved ? 'saved' : ''}`}
            onClick={() => onQuestionChange(item.questionNum!)}
            title={`Question ${item.questionNum}`}
          >
            {isSaved ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="9,12 11,14 15,10" />
              </svg>
            ) : item.icon === 'code' ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16,18 22,12 16,6" />
                <polyline points="8,6 2,12 8,18" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="7" y1="8" x2="17" y2="8" />
                <line x1="7" y1="12" x2="17" y2="12" />
                <line x1="7" y1="16" x2="12" y2="16" />
              </svg>
            )}
            {!isSaved && <span className="sidebar-question-num">{item.label}</span>}
          </button>
        )
      })}
    </aside>
  )
}

export default Sidebar
