import type { NavigateFunction } from 'react-router-dom'
import type { EditQuizQuestion } from '../types/editQuiz'
import { mapEditQuizToFlashcardDeck } from './mapEditQuizToFlashcardDeck'
import { prepareCountdownAudio } from './playCountdownTick'

export function navigateToGeneratedGame(
  navigate: NavigateFunction,
  gameKey: string,
  questions: EditQuizQuestion[],
  projectTitle?: string,
): boolean {
  if (gameKey === 'crossword') {
    navigate('/build/new', { state: { generatedQuestions: questions } })
    return true
  }

  if (gameKey === 'flashcard') {
    prepareCountdownAudio()
    const deck = mapEditQuizToFlashcardDeck(questions, projectTitle ?? 'Flashcard Game')
    navigate('/play/flashcard', { state: { deck, questions } })
    return true
  }

  return false
}
