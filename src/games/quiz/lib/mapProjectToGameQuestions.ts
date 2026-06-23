import type { GameQuestion } from '../hooks/useGame'
import type { EditQuizQuestion } from '../../../types/editQuiz'

export function mapProjectToGameQuestions(questions: EditQuizQuestion[]): GameQuestion[] {
  const mapped = questions
    .filter((q) => q.type === 'mcq' && q.options && q.options.length > 0)
    .map((q) => {
      const correct = q.options!.findIndex((o) => o.correct)
      return {
        q: q.question,
        a: q.options!.map((o) => o.text),
        correct: correct >= 0 ? correct : 0,
        label: q.tag?.toUpperCase() || 'QUESTION',
      }
    })

  return mapped.length > 0 ? mapped : []
}
