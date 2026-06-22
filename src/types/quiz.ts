export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'matching'
  | 'short-answer'

export interface Question {
  type: QuestionType
  question: string
  options: string[]
  answerIndex: number
}

export interface GeneratePayload {
  file: File
  questionCount: number
  questionType: QuestionType
  notes: string
}
