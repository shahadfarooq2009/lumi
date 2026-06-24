import type { EditQuizQuestion } from '../../../types/editQuiz'
import type { Deck, Difficulty } from '../types/flashcard'
import { mapEditQuizToFlashcardDeck } from './mapEditQuizToFlashcardDeck'
import type { GenerateFlashcardDeckOptions } from './generateFlashcardDeck.types'

export type { GenerateFlashcardDeckOptions } from './generateFlashcardDeck.types'

const GENERATION_DURATION_MS = 8_000
const PROGRESS_TICK_MS = 250

const CARD_LIMITS: Record<Difficulty, number> = {
  easy: 10,
  medium: 15,
  hard: 20,
}

function questionsForDifficulty(
  questions: EditQuizQuestion[],
  difficulty: Difficulty,
): EditQuizQuestion[] {
  const matching = questions.filter((q) => q.difficulty === difficulty)
  if (matching.length >= 5) return matching
  return questions
}

function delayWithProgress(
  durationMs: number,
  options: GenerateFlashcardDeckOptions,
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (options.signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'))
      return
    }

    const start = Date.now()
    options.onProgress?.(0)

    const finish = (handler: () => void) => {
      window.clearInterval(interval)
      handler()
    }

    const interval = window.setInterval(() => {
      if (options.signal?.aborted) {
        finish(() => reject(new DOMException('Aborted', 'AbortError')))
        return
      }

      const elapsed = Date.now() - start
      const percent = Math.min(99, Math.round((elapsed / durationMs) * 100))
      options.onProgress?.(percent)

      if (elapsed >= durationMs) {
        finish(() => {
          options.onProgress?.(100)
          resolve()
        })
      }
    }, PROGRESS_TICK_MS)

    options.signal?.addEventListener(
      'abort',
      () => {
        finish(() => reject(new DOMException('Aborted', 'AbortError')))
      },
      { once: true },
    )
  })
}

export async function generateFlashcardDeck(
  sourceDeck: Deck,
  difficulty: Difficulty,
  questions?: EditQuizQuestion[],
  options: GenerateFlashcardDeckOptions = {},
): Promise<Deck> {
  await delayWithProgress(GENERATION_DURATION_MS, options)

  if (questions && questions.length > 0) {
    const filtered = questionsForDifficulty(questions, difficulty)
    const deck = mapEditQuizToFlashcardDeck(filtered, sourceDeck.title, sourceDeck.subject)
    const limit = Math.min(CARD_LIMITS[difficulty], deck.cards.length)
    return {
      ...deck,
      id: sourceDeck.id,
      difficulty,
      cards: deck.cards.slice(0, limit),
    }
  }

  const limit = Math.min(CARD_LIMITS[difficulty], sourceDeck.cards.length)

  return {
    ...sourceDeck,
    difficulty,
    cards: sourceDeck.cards.slice(0, limit),
  }
}
