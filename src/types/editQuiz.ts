export type QuestionType = 'mcq' | 'tf' | 'fill' | 'match'

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export type QuestionStatus = 'ready' | 'draft'

export interface EditQuizOption {
  letter: string
  text: string
  correct: boolean
}

export interface EditQuizQuestion {
  id: string
  num: string
  type: QuestionType
  difficulty: QuestionDifficulty
  status: QuestionStatus
  question: string
  options?: EditQuizOption[]
  fillBlankAnswer?: string
  acceptedAnswers?: string[]
  time: string
  points: number
  tag: string
}

export const TYPE_PILL: Record<
  QuestionType,
  { label: string; listClass: string; dotClass: string }
> = {
  mcq: {
    label: 'MCQ',
    listClass: 'bg-blue-100 text-blue-700',
    dotClass: 'text-blue-600',
  },
  tf: {
    label: 'T/F',
    listClass: 'bg-emerald-100 text-emerald-700',
    dotClass: 'text-emerald-600',
  },
  fill: {
    label: 'FILL',
    listClass: 'bg-orange-200 text-orange-800',
    dotClass: 'text-orange-600',
  },
  match: {
    label: 'MATCH',
    listClass: 'bg-pink-100 text-pink-700',
    dotClass: 'text-pink-600',
  },
}

export const TYPE_LABEL: Record<QuestionType, string> = {
  mcq: 'Multiple Choice',
  tf: 'True / False',
  fill: 'Fill the blank',
  match: 'Matching',
}
