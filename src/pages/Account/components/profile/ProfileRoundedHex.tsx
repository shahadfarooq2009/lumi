import type { CSSProperties, ReactNode } from 'react'
import { useId } from 'react'

/** Pointy-top hexagon with rounded corners — shared by Level + Achievements. */
const ROUNDED_HEX_PATH =
  'M26 3 L43.5 12.2 Q47 14 47 17.5 L47 40.5 Q47 44 43.5 45.8 L26 55 L8.5 45.8 Q5 44 5 40.5 L5 17.5 Q5 14 8.5 12.2 Z'

type ProfileRoundedHexProps = {
  size?: number
  gradient?: [string, string]
  locked?: boolean
  glow?: string
  children: ReactNode
  className?: string
}

export function ProfileRoundedHex({
  size = 42,
  gradient,
  locked = false,
  glow,
  children,
  className = '',
}: ProfileRoundedHexProps) {
  const uid = useId().replace(/:/g, '')
  const height = Math.round(size * (58 / 52))
  const gradId = `hex-grad-${uid}`

  return (
    <div
      className={`profile-level-hex${locked ? ' profile-level-hex--locked' : ''} ${className}`.trim()}
      style={
        {
          width: size,
          height,
          '--hex-glow': glow ?? 'transparent',
        } as CSSProperties
      }
    >
      <svg
        viewBox="0 0 52 58"
        width={size}
        height={height}
        className="profile-level-hex__svg"
        aria-hidden
      >
        {gradient && !locked && (
          <defs>
            <linearGradient id={gradId} x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor={gradient[0]} />
              <stop offset="100%" stopColor={gradient[1]} />
            </linearGradient>
          </defs>
        )}
        <path d={ROUNDED_HEX_PATH} fill={locked ? '#ddd9e4' : `url(#${gradId})`} />
      </svg>
      <div className="profile-level-hex__icon">{children}</div>
    </div>
  )
}
