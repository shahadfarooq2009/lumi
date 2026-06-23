interface GameStartCountdownProps {
  count: number
  onSkip: () => void
}

export function GameStartCountdown({ count, onSkip }: GameStartCountdownProps) {
  return (
    <div
      className="fc-start-countdown"
      role="dialog"
      aria-modal="true"
      aria-label="Game starting countdown"
    >
      <div className="fc-start-countdown__backdrop" aria-hidden="true" />

      <div className="fc-start-countdown__content">
        <div key={count} className="fc-start-countdown__number-wrap">
          <span className="fc-start-countdown__ring" aria-hidden="true" />
          <span
            className="fc-start-countdown__number"
            aria-live="assertive"
          >
            {count}
          </span>
        </div>

        <button
          type="button"
          className="fc-start-countdown__skip"
          onClick={onSkip}
        >
          Skip Countdown
        </button>
      </div>
    </div>
  )
}
