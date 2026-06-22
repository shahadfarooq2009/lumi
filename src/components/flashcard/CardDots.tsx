import { useEffect, useRef } from 'react'

const VISIBLE_DOTS = 4
const DOT_SIZE = 7
const DOT_GAP = 8
const DOT_STEP = DOT_SIZE + DOT_GAP

export function getDotWindow(activeIndex: number, total: number) {
  if (total <= 1) {
    return { windowStart: 0, activeDot: 0, visibleCount: 1 }
  }

  if (total <= VISIBLE_DOTS) {
    return { windowStart: 0, activeDot: activeIndex, visibleCount: total }
  }

  const maxWindowStart = total - VISIBLE_DOTS

  if (activeIndex >= total - 1) {
    return {
      windowStart: maxWindowStart,
      activeDot: VISIBLE_DOTS - 1,
      visibleCount: VISIBLE_DOTS,
    }
  }

  // Q1–Q4: white dot travels 1st → 2nd → 3rd → 4th
  if (activeIndex < VISIBLE_DOTS) {
    return { windowStart: 0, activeDot: activeIndex, visibleCount: VISIBLE_DOTS }
  }

  // Q5+: alternate 3rd/4th dot while window scrolls forward
  const stepsPastQ4 = activeIndex - (VISIBLE_DOTS - 1)
  const windowStart = Math.min(1 + Math.floor((stepsPastQ4 - 1) / 2), maxWindowStart)
  const activeDot = VISIBLE_DOTS - 2 + ((stepsPastQ4 - 1) % 2)

  return { windowStart, activeDot, visibleCount: VISIBLE_DOTS }
}

interface CardDotsProps {
  activeIndex: number
  total: number
  navDirection?: 'next' | 'prev' | null
}

export function CardDots({ activeIndex, total, navDirection = null }: CardDotsProps) {
  const { windowStart, activeDot, visibleCount } = getDotWindow(activeIndex, total)
  const prevStateRef = useRef({ activeIndex, windowStart, activeDot })

  const didAdvance = prevStateRef.current.activeIndex < activeIndex
  const didRetreat = prevStateRef.current.activeIndex > activeIndex
  const didWindowShift = prevStateRef.current.windowStart !== windowStart
  const didDotMove = prevStateRef.current.activeDot !== activeDot
  const didMove = prevStateRef.current.activeIndex !== activeIndex

  useEffect(() => {
    prevStateRef.current = { activeIndex, windowStart, activeDot }
  }, [activeIndex, windowStart, activeDot])

  const dotsClass = [
    'fc-card__dots',
    navDirection === 'next' && didMove ? 'fc-card__dots--next' : '',
    navDirection === 'prev' && didMove ? 'fc-card__dots--prev' : '',
    didWindowShift && didAdvance ? 'fc-card__dots--window-next' : '',
    didWindowShift && didRetreat ? 'fc-card__dots--window-prev' : '',
    didDotMove && didAdvance && !didWindowShift ? 'fc-card__dots--dot-advance' : '',
    didDotMove && didRetreat && !didWindowShift ? 'fc-card__dots--dot-retreat' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const markerClass = 'fc-card__dot-marker'

  return (
    <div className={dotsClass} aria-label={`Card ${activeIndex + 1} of ${total}`}>
      <span
        className={markerClass}
        style={{ transform: `translateX(${activeDot * DOT_STEP}px)` }}
        aria-hidden="true"
      />
      {Array.from({ length: visibleCount }).map((_, i) => (
        <span key={i} className="fc-card__dot" />
      ))}
    </div>
  )
}
