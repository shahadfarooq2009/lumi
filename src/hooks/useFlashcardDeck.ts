import { useCallback, useEffect, useRef, useState } from 'react'
import { playCorrectSound } from '../lib/playCorrectSound'
import type { Deck, Difficulty } from '../types/flashcard'

const ADVANCE_COUNTDOWN_SECONDS = 5
const FLIP_ANIMATION_MS = 780
const NAV_ANIMATION_MS = 560

export function useFlashcardDeck(deck: Deck) {
  const [index, setIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isFlipping, setIsFlipping] = useState(false)
  const [difficulty, setDifficulty] = useState<Difficulty>(deck.difficulty)
  const [streak, setStreak] = useState(0)
  const [score, setScore] = useState(850)
  const [selfCheck, setSelfCheck] = useState<'correct' | 'wrong' | null>(null)
  const [advanceCountdown, setAdvanceCountdown] = useState<number | null>(null)
  const [navDirection, setNavDirection] = useState<'next' | 'prev' | null>(null)
  const advanceIntervalRef = useRef<number | null>(null)
  const answeredRef = useRef(false)
  const isFlippingRef = useRef(false)
  const indexRef = useRef(index)

  const card = deck.cards[index]
  const total = deck.cards.length

  indexRef.current = index

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

  const flip = useCallback(() => {
    if (isFlippingRef.current) return

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
  }, [clearAdvanceTimers])

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

  const markCorrect = useCallback(() => {
    if (answeredRef.current) return
    answeredRef.current = true
    playCorrectSound()
    setSelfCheck('correct')
    setStreak((s) => s + 1)
    setScore((s) => s + 10)
    scheduleAdvanceAfterCheck()
  }, [scheduleAdvanceAfterCheck])

  const markWrong = useCallback(() => {
    if (answeredRef.current) return
    answeredRef.current = true
    setSelfCheck('wrong')
    setStreak(0)
    scheduleAdvanceAfterCheck()
  }, [scheduleAdvanceAfterCheck])

  const next = useCallback(() => {
    if (indexRef.current >= total - 1) return
    goToNextCard()
  }, [goToNextCard, total])

  const prev = useCallback(() => {
    clearAdvanceTimers()
    if (indexRef.current <= 0) return
    setNavDirection('prev')
    setIsFlipped(false)
    setSelfCheck(null)
    setIndex((i) => Math.max(i - 1, 0))
  }, [clearAdvanceTimers])

  useEffect(() => () => clearAdvanceTimers(), [clearAdvanceTimers])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip() }
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [flip, next, prev])

  return {
    card, index, total,
    isFlipped, isFlipping,
    difficulty, setDifficulty,
    streak, score, selfCheck, advanceCountdown, navDirection,
    flip, next, prev, markCorrect, markWrong,
  }
}
