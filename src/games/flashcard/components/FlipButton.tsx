import { RotateCcw } from 'lucide-react'

interface FlipButtonProps {
  onClick: () => void
  isFlipping: boolean
}

export function FlipButton({ onClick, isFlipping }: FlipButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isFlipping}
      aria-busy={isFlipping}
      className={isFlipping ? 'fc-flip-btn is-flipping' : 'fc-flip-btn'}
    >
      <span className="fc-flip-btn__icon">
        <RotateCcw strokeWidth={2.2} />
      </span>
      Flip Card
    </button>
  )
}
