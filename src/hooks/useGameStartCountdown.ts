import { useCallback, useEffect, useRef, useState } from 'react'
import { getUserSettings } from '../lib/userSettings'

const TICK_MS = 1000
const START_VALUE = 3

export function useGameStartCountdown() {
  const timerEnabled = getUserSettings().game.timerEnabled
  const [count, setCount] = useState<number | null>(timerEnabled ? START_VALUE : null)
  const skippedRef = useRef(false)

  const skip = useCallback(() => {
    skippedRef.current = true
    setCount(null)
  }, [])

  useEffect(() => {
    if (count === null || skippedRef.current) return

    const timer = window.setTimeout(() => {
      if (skippedRef.current) return
      setCount((current) => {
        if (current === null || current <= 1) return null
        return current - 1
      })
    }, TICK_MS)

    return () => window.clearTimeout(timer)
  }, [count])

  return {
    count,
    isActive: count !== null,
    skip,
  }
}
