import type { EditQuizQuestion } from '../../../types/editQuiz'
import type { Deck } from '../types/flashcard'

export function mapFlashcardDeckToEditQuestions(deck: Deck): EditQuizQuestion[] {
  return deck.cards.map((card, index) => ({
    id: card.id || `fc-${index + 1}`,
    num: String(index + 1).padStart(2, '0'),
    type: 'fill',
    difficulty: deck.difficulty,
    status: 'ready',
    question: card.question,
    fillBlankAnswer: card.answer,
    acceptedAnswers: [card.answer],
    time: '30 sec',
    points: 10,
    tag: card.tag ?? 'Flashcard',
  }))
}
