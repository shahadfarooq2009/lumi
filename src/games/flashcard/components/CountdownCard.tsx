import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { Difficulty } from '../types/flashcard'
import { playCountdownGo, playCountdownTick, prepareCountdownAudio } from '../lib/playCountdownTick'
import './CountdownCard.css'

type CountdownValue = 3 | 2 | 1 | 'GO'

interface CountdownCardProps {
  selectedDifficulty: Difficulty
  onComplete: () => void
}

export function CountdownCard({
  selectedDifficulty,
  onComplete,
}: CountdownCardProps) {
  const [countdownValue, setCountdownValue] = useState<CountdownValue>(3)
  const lastPlayedRef = useRef<CountdownValue | null>(null)

  useLayoutEffect(() => {
    prepareCountdownAudio()
  }, [])

  useEffect(() => {
    setCountdownValue(3)
    lastPlayedRef.current = null
  }, [selectedDifficulty])

  useLayoutEffect(() => {
    if (lastPlayedRef.current === countdownValue) return
    lastPlayedRef.current = countdownValue

    if (countdownValue === 'GO') {
      playCountdownGo()
      return
    }

    playCountdownTick(countdownValue)
  }, [countdownValue])

  useEffect(() => {
    const delay = countdownValue === 'GO' ? 700 : 1000

    const timeoutId = window.setTimeout(() => {
      if (countdownValue === 3) {
        setCountdownValue(2)
        return
      }

      if (countdownValue === 2) {
        setCountdownValue(1)
        return
      }

      if (countdownValue === 1) {
        setCountdownValue('GO')
        return
      }

      onComplete()
    }, delay)

    return () => window.clearTimeout(timeoutId)
  }, [countdownValue, onComplete])

  const difficultyLabel =
    selectedDifficulty.charAt(0).toUpperCase() + selectedDifficulty.slice(1)

  return (
    <div
      className="countdown-card"
      role="status"
      aria-live="assertive"
      aria-label="Game starting countdown"
    >
      <div className="countdown-card__content">
        <h2 className="countdown-card__heading">Get Ready!</h2>

        <div
          className={`countdown-difficulty countdown-difficulty--${selectedDifficulty}`}
        >
          <span aria-hidden="true">★</span>
          <span>{difficultyLabel}</span>
        </div>

        <div className="countdown-visual">
          <span className="countdown-decoration countdown-decoration--one" aria-hidden>
            ✦
          </span>
          <span className="countdown-decoration countdown-decoration--two" aria-hidden>
            ✦
          </span>
          <span className="countdown-decoration countdown-decoration--three" aria-hidden>
            ●
          </span>
          <span className="countdown-decoration countdown-decoration--four" aria-hidden>
            ●
          </span>
          <span className="countdown-decoration countdown-decoration--five" aria-hidden>
            ✦
          </span>

          <div key={countdownValue} className="countdown-number-container">
            <div className="countdown-ring" aria-hidden />
            <span
              className={[
                'countdown-number',
                countdownValue === 'GO' ? 'countdown-number--go' : '',
              ].filter(Boolean).join(' ')}
            >
              {countdownValue === 'GO' ? 'Go!' : countdownValue}
            </span>
          </div>
        </div>

        <div className="countdown-card__message">
          <p>Your flashcards are ready</p>
          <span>
            {countdownValue === 'GO' ? "Let's begin!" : 'Starting in a moment...'}
          </span>
        </div>
      </div>
    </div>
  )
}
