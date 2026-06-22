import type { EditQuizQuestion } from '../types/editQuiz'
import type { Deck, Flashcard } from '../types/flashcard'

function answerForQuestion(q: EditQuizQuestion): string {
  const correctOption = q.options?.find((o) => o.correct)?.text
  if (correctOption) return correctOption
  if (q.fillBlankAnswer) return q.fillBlankAnswer
  if (q.acceptedAnswers?.[0]) return q.acceptedAnswers[0]
  return '—'
}

export function mapEditQuizToFlashcardDeck(
  questions: EditQuizQuestion[],
  title = 'Flashcard Game',
  subject = 'Science',
): Deck {
  const cards: Flashcard[] = questions.map((q, i) => ({
    id: q.id || String(i + 1),
    question: q.question,
    answer: answerForQuestion(q),
    tag: 'Question',
    topicIcon: 'leaf',
  }))

  return {
    id: 'generated',
    subject,
    title,
    difficulty: 'medium',
    cards: cards.length > 0 ? cards : [],
  }
}
