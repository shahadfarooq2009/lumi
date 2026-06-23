import { useCallback, useEffect, useState } from 'react'
import { recordCorrectAnswer } from '../../../lib/streakProgress'

export interface GameQuestion {
  q: string
  a: string[]
  correct: number
  label: string
}

const QUESTIONS: GameQuestion[] = [
  {
    q: "What's described as the strongest driver of long-term memory?",
    a: ['Spaced repetition', 'Cramming', 'Highlighting', 'Reading aloud'],
    correct: 0,
    label: 'CORE CONCEPT',
  },
  {
    q: 'Which study method helps you recall information over weeks?',
    a: ['One long session', 'Spaced practice', 'Copying notes', 'Skipping review'],
    correct: 1,
    label: 'LEARNING',
  },
  {
    q: 'Active recall means…',
    a: ['Re-reading silently', 'Testing yourself', 'Highlighting text', 'Watching videos'],
    correct: 1,
    label: 'STRATEGY',
  },
  {
    q: 'What improves focus during short study bursts?',
    a: ['Multitasking', 'Timed sessions', 'Random topics', 'No breaks'],
    correct: 1,
    label: 'HABITS',
  },
  {
    q: 'Games help learning when they provide…',
    a: ['Instant feedback', 'No challenge', 'Random guessing', 'Long delays'],
    correct: 0,
    label: 'GAME DESIGN',
  },
]

export function useGame(onComplete: () => void, customQuestions?: GameQuestion[]) {
  const deck = customQuestions?.length ? customQuestions : QUESTIONS
  const [qIdx, setQIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [streak, setStreak] = useState(0)
  const [timer, setTimer] = useState(60)
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    if (finished) return
    const id = window.setInterval(() => {
      setTimer((value) => (value > 0 ? value - 1 : 0))
    }, 1000)
    return () => window.clearInterval(id)
  }, [finished])

  const question = deck[qIdx]
  const total = deck.length

  const pickAnswer = useCallback(
    (index: number) => {
      if (revealed || !question) return
      setSelected(index)
      setRevealed(true)
      const correct = index === question.correct
      if (correct) {
        recordCorrectAnswer()
        setStreak((value) => value + 1)
        setScore((value) => value + 100 + streak * 20)
      } else {
        setStreak(0)
      }

      window.setTimeout(() => {
        if (qIdx >= total - 1) {
          setFinished(true)
          return
        }
        setQIdx((value) => value + 1)
        setSelected(null)
        setRevealed(false)
      }, 900)
    },
    [qIdx, question, revealed, streak, total],
  )

  const reset = useCallback(() => {
    setQIdx(0)
    setScore(0)
    setStreak(0)
    setTimer(60)
    setSelected(null)
    setRevealed(false)
    setFinished(false)
  }, [])

  const exit = useCallback(() => {
    reset()
    onComplete()
  }, [onComplete, reset])

  return {
    question,
    qIdx,
    total,
    score,
    streak,
    timer,
    selected,
    revealed,
    finished,
    pickAnswer,
    exit,
    reset,
  }
}
