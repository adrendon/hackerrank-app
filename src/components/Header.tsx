import { useState, useEffect } from 'react'

interface HeaderProps {
  onTimeUp: () => void
  onSave: () => void
}

const INITIAL_TIME = 90 * 60 // Change to 90 * 60 for 90 minutes

function Header({ onTimeUp, onSave }: HeaderProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    const saved = localStorage.getItem('hackerrank-timer')
    if (saved) {
      const val = parseInt(saved, 10)
      if (val > 0 && val <= INITIAL_TIME) return val
    }
    return INITIAL_TIME
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1
        localStorage.setItem('hackerrank-timer', String(next))
        if (next <= 0) {
          clearInterval(timer)
          onTimeUp()
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onTimeUp])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins} min ${secs.toString().padStart(2, '0')} sec`
  }

  const isLowTime = timeLeft < 300 // Less than 5 minutes

  return (
    <header className="header">
      <div className="header-left">
        <div className={`timer ${isLowTime ? 'timer-warning' : ''}`}>
          <svg className="timer-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12,6 12,12 16,14" />
          </svg>
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>
      <div className="header-right">
        <button className="btn-save" onClick={onSave}>Save &amp; Proceed</button>
      </div>
    </header>
  )
}

export default Header
