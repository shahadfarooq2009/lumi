import type { GeneratedQuestion } from '../components/build/Thread/buildThreadTypes'
import type { EditQuizQuestion, QuestionType } from '../types/editQuiz'

function parseType(meta: string): QuestionType {
  if (meta.includes('True / False')) return 'tf'
  if (meta.includes('Fill in the blank') || meta.includes('Fill in')) return 'fill'
  if (meta.includes('Matching')) return 'match'
  return 'mcq'
}

function buildOptions(
  type: QuestionType,
  options: string[],
  answerIndex = 0,
): EditQuizQuestion['options'] {
  if (type === 'fill') return undefined

  const letters =
    type === 'tf'
      ? ['T', 'F']
      : options.map((_, i) => (type === 'match' ? String.fromCharCode(65 + i) : String.fromCharCode(65 + i)))

  return options.map((text, i) => ({
    letter: letters[i] ?? String.fromCharCode(65 + i),
    text,
    correct: type === 'match' ? true : i === answerIndex,
  }))
}

export function mapGeneratedToEditQuestions(questions: GeneratedQuestion[]): EditQuizQuestion[] {
  return questions.map((q, index) => {
    const type = parseType(q.meta)
    const draftIndices = new Set([2, 7])

    return {
      id: q.num,
      num: q.num,
      type,
      difficulty: index % 3 === 0 ? 'easy' : index % 3 === 1 ? 'medium' : 'hard',
      status: draftIndices.has(index) ? 'draft' : 'ready',
      question: q.title,
      options: buildOptions(type, q.options, q.answerIndex ?? 0),
      fillBlankAnswer:
        type === 'fill' ? (q.options[0] ?? 'mitosis') : undefined,
      acceptedAnswers:
        type === 'fill'
          ? [q.options[0] ?? 'mitosis', 'cell division'].filter(Boolean)
          : undefined,
      time: '20s',
      points: 100,
      tag: 'Cell structure',
    }
  })
}
