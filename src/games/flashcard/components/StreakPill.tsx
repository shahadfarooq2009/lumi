import { useEffect, useRef, useState } from 'react'

interface StreakPillProps {
  count: number
}

export function StreakPill({ count }: StreakPillProps) {
  const prevCountRef = useRef(count)
  const [isBumping, setIsBumping] = useState(false)
  const [showPlus, setShowPlus] = useState(false)

  useEffect(() => {
    if (count > prevCountRef.current) {
      setIsBumping(true)
      setShowPlus(true)

      const bumpTimer = window.setTimeout(() => setIsBumping(false), 720)
      const plusTimer = window.setTimeout(() => setShowPlus(false), 900)
      prevCountRef.current = count

      return () => {
        window.clearTimeout(bumpTimer)
        window.clearTimeout(plusTimer)
      }
    }

    prevCountRef.current = count
  }, [count])

  return (
    <div className={isBumping ? 'fc-streak-pill is-bump' : 'fc-streak-pill'}>
      {showPlus ? (
        <span className="fc-streak-pill__plus" aria-hidden="true">
          +1
        </span>
      ) : null}
      <span className="fc-streak-pill__icon">🔥</span>
      <span>
        <strong>{count}</strong> Streak
      </span>
    </div>
  )
}
