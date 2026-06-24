import { useCallback, useEffect, useRef, useState } from 'react'
import { playCorrectSound } from '../lib/playCorrectSound'
import type { Deck } from '../types/flashcard'

export const ADVANCE_COUNTDOWN_SECONDS = 5
const FLIP_ANIMATION_MS = 780
const NAV_ANIMATION_MS = 560
const COMPLETE_DELAY_MS = 1400

export interface FlashcardGameStats {
  correctCount: number
  total: number
  accuracy: number
  elapsedMs: number
  bestStreak: number
  completedAll: boolean
}

interface UseFlashcardDeckOptions {
  initialIndex?: number
  timerStarted?: boolean
}

export function useFlashcardDeck(deck: Deck, options: UseFlashcardDeckOptions = {}) {
  const timerStarted = options.timerStarted ?? true
  const [index, setIndex] = useState(() => {
    const start = options.initialIndex ?? 0
    return Math.max(0, Math.min(start, deck.cards.length - 1))
  })
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const difficulty = deck.difficulty
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selfCheck, setSelfCheck] = useState<'correct' | 'wrong' | null>(null)
  const [advanceCountdown, setAdvanceCountdown] = useState<number | null>(null)
  const [navDirection, setNavDirection] = useState<'next' | 'prev' | null>(null)
  const [isComplete, setIsComplete] = useState(false)
  const [finalStats, setFinalStats] = useState<FlashcardGameStats | null>(null)

  const advanceIntervalRef = useRef<number | null>(null)
  const completeTimeoutRef = useRef<number | null>(null)
  const answeredRef = useRef(false)
  const isFlippingRef = useRef(false)
  const indexRef = useRef(index)
  const bestStreakRef = useRef(0)
  const correctCountRef = useRef(0)
  const answeredCountRef = useRef(0)
  const startTimeRef = useRef<number | null>(timerStarted ? Date.now() : null)

  const card = deck.cards[index]
  const total = deck.cards.length

  indexRef.current = index
  correctCountRef.current = correctCount

  useEffect(() => {
    if (timerStarted && startTimeRef.current === null) {
      startTimeRef.current = Date.now()
    }
  }, [timerStarted])

  const clearCompleteTimeout = useCallback(() => {
    if (completeTimeoutRef.current !== null) {
      window.clearTimeout(completeTimeoutRef.current)
      completeTimeoutRef.current = null
    }
  }, [])

  const finishGame = useCallback((playedTotal: number, completedAll: boolean) => {
    const elapsedMs = startTimeRef.current ? Date.now() - startTimeRef.current : 0
    const answered = answeredCountRef.current
    const accuracy = answered > 0
      ? Math.round((correctCountRef.current / answered) * 100)
      : 0
    setFinalStats({
      correctCount: correctCountRef.current,
      total: playedTotal,
      accuracy,
      elapsedMs,
      bestStreak: bestStreakRef.current,
      completedAll,
    })
    setIsComplete(true)
  }, [])

  useEffect(() => {
    answeredRef.current = false
  }, [index])

  useEffect(() => {
    if (!navDirection) return
    const timer = window.setTimeout(() => setNavDirection(null), NAV_ANIMATION_MS)
    return () => window.clearTimeout(timer)
  }, [index, navDirection])

  const clearAdvanceTimers = useCallback(() => {
    if (advanceIntervalRef.current !== null) {
      window.clearInterval(advanceIntervalRef.current)
      advanceIntervalRef.current = null
    }
    setAdvanceCountdown(null)
  }, [])

  const endGame = useCallback(() => {
    if (isComplete) return
    clearAdvanceTimers()
    clearCompleteTimeout()
    finishGame(indexRef.current + 1, false)
  }, [clearAdvanceTimers, clearCompleteTimeout, finishGame, isComplete])

  const flip = useCallback(() => {
    if (isFlippingRef.current || isComplete) return

    isFlippingRef.current = true
    setIsFlipping(true)

    window.requestAnimationFrame(() => {
      setIsFlipped((f) => {
        if (f) {
          setSelfCheck(null)
          clearAdvanceTimers()
        }
        return !f
      })
    })

    window.setTimeout(() => {
      setIsFlipping(false)
      isFlippingRef.current = false
    }, FLIP_ANIMATION_MS)
  }, [clearAdvanceTimers, isComplete])

  const goToNextCard = useCallback(() => {
    clearAdvanceTimers()
    if (indexRef.current >= total - 1) return
    setNavDirection('next')
    setIsFlipped(false)
    setSelfCheck(null)
    setIndex((i) => Math.min(i + 1, total - 1))
  }, [clearAdvanceTimers, total])

  const scheduleAdvanceAfterCheck = useCallback(() => {
    clearAdvanceTimers()
    if (indexRef.current >= total - 1) return

    let remaining = ADVANCE_COUNTDOWN_SECONDS
    setAdvanceCountdown(remaining)

    advanceIntervalRef.current = window.setInterval(() => {
      remaining -= 1
      if (remaining <= 0) {
        if (advanceIntervalRef.current !== null) {
          window.clearInterval(advanceIntervalRef.current)
          advanceIntervalRef.current = null
        }
        setAdvanceCountdown(null)
        setNavDirection('next')
        setIsFlipped(false)
        setSelfCheck(null)
        setIndex((i) => Math.min(i + 1, total - 1))
        return
      }
      setAdvanceCountdown(remaining)
    }, 1000)
  }, [clearAdvanceTimers, total])

  const completeOrAdvance = useCallback(() => {
    if (indexRef.current >= total - 1) {
      clearCompleteTimeout()
      completeTimeoutRef.current = window.setTimeout(
        () => finishGame(total, true),
        COMPLETE_DELAY_MS,
      )
      return
    }
    scheduleAdvanceAfterCheck()
  }, [clearCompleteTimeout, finishGame, scheduleAdvanceAfterCheck, total])

  const markCorrect = useCallback(() => {
    if (answeredRef.current || isComplete) return
    answeredRef.current = true
    answeredCountRef.current += 1
    playCorrectSound()
    setSelfCheck('correct')
    setCorrectCount((c) => c + 1)
    setStreak((s) => {
      const next = s + 1
      if (next > bestStreakRef.current) {
        bestStreakRef.current = next
        setBestStreak(next)
      }
      return next
    })
    completeOrAdvance()
  }, [completeOrAdvance, isComplete])

  const markWrong = useCallback(() => {
    if (answeredRef.current || isComplete) return
    answeredRef.current = true
    answeredCountRef.current += 1
    setSelfCheck('wrong')
    setStreak(0)
    completeOrAdvance()
  }, [completeOrAdvance, isComplete])

  const next = useCallback(() => {
    if (isComplete || indexRef.current >= total - 1) return
    goToNextCard()
  }, [goToNextCard, isComplete, total])

  const prev = useCallback(() => {
    if (isComplete) return
    clearAdvanceTimers()
    if (indexRef.current <= 0) return
    setNavDirection('prev')
    setIsFlipped(false)
    setSelfCheck(null)
    setIndex((i) => Math.max(i - 1, 0))
  }, [clearAdvanceTimers, isComplete])

  const resetGame = useCallback(() => {
    clearAdvanceTimers()
    clearCompleteTimeout()
    setIndex(0)
    setIsFlipped(false)
    setIsFlipping(false)
    setSelfCheck(null)
    setCorrectCount(0)
    correctCountRef.current = 0
    answeredCountRef.current = 0
    setStreak(0)
    setBestStreak(0)
    bestStreakRef.current = 0
    answeredRef.current = false
    setIsComplete(false)
    setFinalStats(null)
    setAdvanceCountdown(null)
    setNavDirection(null)
    if (timerStarted) {
      startTimeRef.current = Date.now()
    } else {
      startTimeRef.current = null
    }
  }, [clearAdvanceTimers, clearCompleteTimeout, timerStarted])

  useEffect(
    () => () => {
      clearAdvanceTimers()
      clearCompleteTimeout()
    },
    [clearAdvanceTimers, clearCompleteTimeout],
  )

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isComplete) return
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip() }
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, isComplete, next, prev])

  return {
    card, index, total,
    isFlipped, isFlipping,
    difficulty,
    streak, bestStreak, correctCount,
    selfCheck, advanceCountdown, navDirection,
    isComplete, finalStats,
    flip, next, prev, markCorrect, markWrong, resetGame, endGame,
  }
}
