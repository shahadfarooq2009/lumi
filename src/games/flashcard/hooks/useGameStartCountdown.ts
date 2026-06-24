import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { playCountdownTick, prepareCountdownAudio } from '../lib/playCountdownTick'
import { getUserSettings } from '../../../lib/userSettings'

const TICK_MS = 1000
const START_VALUE = 3

export function useGameStartCountdown(paused = false) {
  const timerEnabled = getUserSettings().game.timerEnabled
  const [count, setCount] = useState<number | null>(null)
  const skippedRef = useRef(false)
  const lastPlayedRef = useRef<number | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (paused || startedRef.current) return
    startedRef.current = true
    setCount(timerEnabled ? START_VALUE : null)
  }, [paused, timerEnabled])

  const skip = useCallback(() => {
    skippedRef.current = true
    setCount(null)
  }, [])

  useLayoutEffect(() => {
    prepareCountdownAudio()
  }, [])

  useLayoutEffect(() => {
    if (count === null || skippedRef.current) return
    if (lastPlayedRef.current === count) return

    lastPlayedRef.current = count
    playCountdownTick(count)
  }, [count])

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
