import type { EditQuizOption, EditQuizQuestion, QuestionType } from '../types/editQuiz'

export function renumberQuestions(questions: EditQuizQuestion[]): EditQuizQuestion[] {
  return questions.map((q, i) => {
    const num = `Q${String(i + 1).padStart(2, '0')}`
    return { ...q, id: num, num }
  })
}

export function resolveIndexAfterMove(
  index: number,
  fromIndex: number,
  toIndex: number,
): number {
  if (index < 0) return -1
  if (fromIndex === toIndex) return index
  if (index === fromIndex) return toIndex
  if (fromIndex < index && toIndex >= index) return index - 1
  if (fromIndex > index && toIndex <= index) return index + 1
  return index
}

export function reorderQuestions(
  questions: EditQuizQuestion[],
  fromIndex: number,
  toIndex: number,
): EditQuizQuestion[] {
  if (
    fromIndex === toIndex ||
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= questions.length ||
    toIndex >= questions.length
  ) {
    return questions
  }

  const moved = questions[fromIndex]
  if (!moved) return questions

  const next: EditQuizQuestion[] = []
  for (let i = 0; i < questions.length; i += 1) {
    if (i === toIndex) {
      next.push(moved)
    }
    if (i !== fromIndex) {
      next.push(questions[i])
    }
  }

  return renumberQuestions(next)
}

export function createBlankMcqQuestion(time: string, tag = 'General'): EditQuizQuestion {
  const id = `new-${Date.now()}`
  return {
    id,
    num: 'Q00',
    type: 'mcq',
    difficulty: 'medium',
    status: 'draft',
    question: 'New question',
    options: ['Option A', 'Option B', 'Option C', 'Option D'].map((text, index) => ({
      letter: String.fromCharCode(65 + index),
      text,
      correct: index === 0,
    })),
    time,
    points: 100,
    tag,
  }
}

export function cloneQuestion(source: EditQuizQuestion): EditQuizQuestion {
  return {
    ...source,
    id: `dup-${Date.now()}`,
    options: source.options?.map((opt) => ({ ...opt })),
  }
}

export function optionLetter(index: number, type: QuestionType): string {
  if (type === 'tf' && index < 2) return index === 0 ? 'T' : 'F'
  return String.fromCharCode(65 + index)
}

export function reletterOptions(options: EditQuizOption[], type: QuestionType): EditQuizOption[] {
  return options.map((opt, i) => ({
    ...opt,
    letter: optionLetter(i, type),
  }))
}

export const MIN_MCQ_TF_OPTIONS = 2

export const QUIZ_TIME_OPTIONS = ['15s', '20s', '30s', '60s'] as const
export type QuizTimeOption = (typeof QUIZ_TIME_OPTIONS)[number]

export const DEFAULT_QUIZ_TIME: QuizTimeOption = '20s'

export function initialQuizTime(questions: EditQuizQuestion[]): QuizTimeOption {
  const first = questions[0]?.time
  if (first && (QUIZ_TIME_OPTIONS as readonly string[]).includes(first)) {
    return first as QuizTimeOption
  }
  return DEFAULT_QUIZ_TIME
}

export function applyQuizTimeToQuestions(
  questions: EditQuizQuestion[],
  time: string,
): EditQuizQuestion[] {
  return questions.map((q) => ({ ...q, time }))
}

/** True/False always has exactly two options with one correct answer. */
export function normalizeTfOptions(options: EditQuizOption[]): EditQuizOption[] {
  const correctIndex = options.findIndex((opt) => opt.correct)
  const idx = correctIndex >= 0 ? correctIndex : 0
  return [
    { letter: 'T', text: 'True', correct: idx === 0 },
    { letter: 'F', text: 'False', correct: idx === 1 },
  ]
}

export function setSingleCorrectOption(
  options: EditQuizOption[],
  correctIndex: number,
): EditQuizOption[] {
  return options.map((opt, i) => ({ ...opt, correct: i === correctIndex }))
}
