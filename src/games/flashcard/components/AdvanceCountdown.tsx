import { ADVANCE_COUNTDOWN_SECONDS } from '../hooks/useFlashcardDeck'

const RING_R = 15
const RING_C = 2 * Math.PI * RING_R

interface AdvanceCountdownProps {
  seconds: number
}

export function AdvanceCountdown({ seconds }: AdvanceCountdownProps) {
  const progress = seconds / ADVANCE_COUNTDOWN_SECONDS
  const dashOffset = RING_C * (1 - progress)

  return (
    <div
      className="fc-advance-countdown"
      aria-live="polite"
      aria-label={`Next card in ${seconds} seconds`}
    >
      <svg className="fc-advance-countdown__svg" viewBox="0 0 36 36" aria-hidden>
        <circle
          className="fc-advance-countdown__track"
          cx="18"
          cy="18"
          r={RING_R}
        />
        <circle
          className="fc-advance-countdown__progress"
          cx="18"
          cy="18"
          r={RING_R}
          strokeDasharray={RING_C}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="fc-advance-countdown__label" key={seconds}>
        <span className="fc-advance-countdown__value">{seconds}</span>
        <span className="fc-advance-countdown__unit">s</span>
      </div>
    </div>
  )
}
