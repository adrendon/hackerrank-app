interface TimeUpModalProps {
  onClose: () => void
}

function TimeUpModal({ onClose }: TimeUpModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-icon">⏰</div>
        <h2 className="modal-title">Time's Up!</h2>
        <p className="modal-text">
          Your assessment time has expired. All your progress has been automatically saved and submitted.
        </p>
        <div className="modal-details">
          <span>✓ Answers saved</span>
          <span>✓ Code submitted</span>
          <span>✓ Assessment completed</span>
        </div>
        <button className="modal-btn" onClick={onClose}>
          View Results
        </button>
      </div>
    </div>
  )
}

export default TimeUpModal
