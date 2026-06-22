import type { Question, QuestionType } from '../types/quiz'
import type { EditQuizQuestion, QuestionType as EditType } from '../types/editQuiz'

const QUIZ_TO_EDIT: Record<QuestionType, EditType> = {
  'multiple-choice': 'mcq',
  'true-false': 'tf',
  'fill-blank': 'fill',
  matching: 'match',
  'short-answer': 'mcq',
}

function buildEditOptions(
  type: EditType,
  options: string[],
  answerIndex: number,
): EditQuizQuestion['options'] {
  if (type === 'fill') return undefined

  const letters = type === 'tf' ? ['T', 'F'] : options.map((_, i) => String.fromCharCode(65 + i))

  return options.map((text, i) => ({
    letter: letters[i] ?? String.fromCharCode(65 + i),
    text,
    correct: type === 'match' ? true : i === answerIndex,
  }))
}

export function mapQuizQuestionsToEdit(questions: Question[], tag = 'From file'): EditQuizQuestion[] {
  return questions.map((q, index) => {
    const type = QUIZ_TO_EDIT[q.type] ?? 'mcq'

    return {
      id: `Q${String(index + 1).padStart(2, '0')}`,
      num: `Q${String(index + 1).padStart(2, '0')}`,
      type,
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      status: 'ready',
      question: q.question,
      options: buildEditOptions(type, q.options, q.answerIndex),
      fillBlankAnswer: type === 'fill' ? q.options[q.answerIndex] : undefined,
      acceptedAnswers: type === 'fill' ? [q.options[q.answerIndex]].filter(Boolean) : undefined,
      time: '20s',
      points: 100,
      tag,
    }
  })
}
