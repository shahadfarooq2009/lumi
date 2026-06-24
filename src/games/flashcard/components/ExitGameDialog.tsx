interface ExitGameDialogProps {
  onStay: () => void
  onLeave: () => void
}

export function ExitGameDialog({ onStay, onLeave }: ExitGameDialogProps) {
  return (
    <div
      className="fc-exit-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="fc-exit-dialog-title"
      aria-describedby="fc-exit-dialog-desc"
    >
      <button
        type="button"
        className="fc-exit-dialog__backdrop"
        aria-label="Stay in game"
        onClick={onStay}
      />

      <div className="fc-exit-dialog__panel">
        <h2 id="fc-exit-dialog-title" className="fc-exit-dialog__title">
          Leave Game?
        </h2>
        <p id="fc-exit-dialog-desc" className="fc-exit-dialog__desc">
          Are you sure you want to leave? Your current progress will be lost.
        </p>

        <div className="fc-exit-dialog__actions">
          <button
            type="button"
            className="fc-exit-dialog__btn fc-exit-dialog__btn--stay"
            onClick={onStay}
          >
            Stay
          </button>
          <button
            type="button"
            className="fc-exit-dialog__btn fc-exit-dialog__btn--leave"
            onClick={onLeave}
          >
            Leave
          </button>
        </div>
      </div>
    </div>
  )
}
