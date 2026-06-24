interface ResumeSessionDialogProps {
  questionNumber: number
  onResume: () => void
  onStartOver: () => void
}

export function ResumeSessionDialog({
  questionNumber,
  onResume,
  onStartOver,
}: ResumeSessionDialogProps) {
  return (
    <div
      className="fc-exit-dialog fc-resume-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fc-resume-dialog-title"
      aria-describedby="fc-resume-dialog-desc"
    >
      <div className="fc-exit-dialog__panel">
        <h2 id="fc-resume-dialog-title" className="fc-exit-dialog__title">
          Resume your last session?
        </h2>
        <p id="fc-resume-dialog-desc" className="fc-exit-dialog__desc">
          You left off at question {questionNumber}.
        </p>

        <div className="fc-exit-dialog__actions">
          <button
            type="button"
            className="fc-exit-dialog__btn fc-exit-dialog__btn--resume"
            onClick={onResume}
          >
            Resume
          </button>
          <button
            type="button"
            className="fc-exit-dialog__btn fc-exit-dialog__btn--start-over"
            onClick={onStartOver}
          >
            Start Over
          </button>
        </div>
      </div>
    </div>
  )
}
