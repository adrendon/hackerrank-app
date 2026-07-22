const STORAGE_KEY = 'hackerrank-assessment'

export interface AssessmentState {
  answers: Record<number, number[]>
  code1Ts: string
  code1Html: string
  code10: string
  submittedAt?: string
  timeRemaining?: number
}

export function saveAssessment(state: AssessmentState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function loadAssessment(): AssessmentState | null {
  const data = localStorage.getItem(STORAGE_KEY)
  if (data) {
    try {
      return JSON.parse(data)
    } catch {
      return null
    }
  }
  return null
}

export function clearAssessment() {
  localStorage.removeItem(STORAGE_KEY)
}
