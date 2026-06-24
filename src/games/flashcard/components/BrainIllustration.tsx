import { Brain } from 'lucide-react'

interface BrainIllustrationProps {
  className?: string
  /** Icon size in pixels */
  size?: number
}

const BRAIN_COLOR = '#ff6b85'
const BRAIN_FILL = '#ffb8c6'

/** Brain icon — shared by setup hero and generating card */
export function BrainIllustration({ className, size = 48 }: BrainIllustrationProps) {
  return (
    <Brain
      className={className}
      size={size}
      color={BRAIN_COLOR}
      strokeWidth={2.2}
      fill={BRAIN_FILL}
      fillOpacity={0.45}
      aria-hidden
    />
  )
}

interface SparkleAccentProps {
  color: string
  className?: string
  withDot?: boolean
}

export function SparkleAccent({ color, className, withDot = true }: SparkleAccentProps) {
  return (
    <span className={className}>
      <svg viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M10 2.5 L11.1 7.8 L16 9 L11.1 10.2 L10 15.5 L8.9 10.2 L4 9 L8.9 7.8 Z"
          fill={color}
        />
      </svg>
      {withDot ? (
        <span className="fc-brain-sparkle__dot" style={{ backgroundColor: color }} />
      ) : null}
    </span>
  )
}
