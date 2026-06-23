import { createPlayablePuzzle } from './crosswordGrid'
import { layoutCrosswordEntries } from './crosswordLayout'
import { getCellBiologyPuzzle } from '../data/cellBiologyPuzzle'
import type { EditQuizQuestion } from '../../../types/editQuiz'
import type { Puzzle } from '../types/crossword'

const MIN_ANSWER_LEN = 2
const MAX_ANSWER_LEN = 15

function lettersOnly(text: string): string {
  return text.replace(/[^a-zA-Z]/g, '').toUpperCase()
}

function pickCrosswordWord(raw: string): string {
  const trimmed = raw.trim()
  if (!trimmed) return ''

  const compact = lettersOnly(trimmed)
  if (compact.length >= MIN_ANSWER_LEN && compact.length <= MAX_ANSWER_LEN) {
    return compact
  }

  const tokens = trimmed
    .split(/[\s→\-–—/]+/)
    .map((part) => lettersOnly(part))
    .filter((part) => part.length >= MIN_ANSWER_LEN)

  if (tokens.length === 0) {
    return compact.slice(0, MAX_ANSWER_LEN)
  }

  const inRange = tokens.filter((token) => token.length <= MAX_ANSWER_LEN)
  const pool = inRange.length > 0 ? inRange : tokens.map((token) => token.slice(0, MAX_ANSWER_LEN))
  return pool.sort((a, b) => b.length - a.length)[0] ?? ''
}

function extractAnswer(question: EditQuizQuestion, index: number): string {
  switch (question.type) {
    case 'fill': {
      const raw = question.fillBlankAnswer ?? question.acceptedAnswers?.[0] ?? ''
      const answer = pickCrosswordWord(raw)
      if (answer.length >= MIN_ANSWER_LEN) return answer
      break
    }
    case 'tf': {
      const correct = question.options?.find((option) => option.correct)
      const answer = lettersOnly(correct?.text ?? 'TRUE')
      if (answer.length >= MIN_ANSWER_LEN) return answer.slice(0, MAX_ANSWER_LEN)
      break
    }
    case 'mcq': {
      const correct = question.options?.find((option) => option.correct)
      if (correct) {
        const answer = pickCrosswordWord(correct.text)
        if (answer.length >= MIN_ANSWER_LEN) return answer
      }
      break
    }
    case 'match': {
      const option = question.options?.find((entry) => entry.correct) ?? question.options?.[0]
      if (option) {
        const left = option.text.split(/→|->/)[0]?.trim() ?? option.text
        const answer = pickCrosswordWord(left)
        if (answer.length >= MIN_ANSWER_LEN) return answer
      }
      break
    }
  }

  const fromQuestion = pickCrosswordWord(question.question)
  if (fromQuestion.length >= MIN_ANSWER_LEN) return fromQuestion

  return `ANSWER${String(index + 1).padStart(2, '0')}`
}

export function buildCrosswordFromQuestions(
  questions: EditQuizQuestion[],
  title: string,
): Puzzle {
  if (questions.length === 0) {
    return { ...getCellBiologyPuzzle(), title }
  }

  const entries = questions.map((question, index) => ({
    id: question.id,
    answer: extractAnswer(question, index),
    clue: question.question.trim() || `Question ${index + 1}`,
  }))

  const layout = layoutCrosswordEntries(entries)

  if (!layout) {
    return { ...getCellBiologyPuzzle(), title }
  }

  try {
    return createPlayablePuzzle({
      id: `quiz-crossword-${Date.now()}`,
      title: title.trim() || 'Crossword',
      topic: 'Quiz Crossword',
      size: layout.size,
      words: layout.words,
      hintsRemaining: Math.min(3, Math.max(1, Math.ceil(layout.words.length / 4))),
    })
  } catch {
    return { ...getCellBiologyPuzzle(), title }
  }
}
