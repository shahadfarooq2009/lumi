import type { QuestionType } from '../types/quiz'
import { buildMockQuestions } from './questions'
import type { GeneratedQuestion } from '../components/build/Thread/buildThreadTypes'
import { OUTLINE_QUESTIONS } from '../components/build/Thread/buildThreadTypes'

/** Mixed mode cycles through all four interactive types */
const MIXED_TYPES: QuestionType[] = [
  'multiple-choice',
  'true-false',
  'fill-blank',
  'matching',
]

const TYPE_META: Record<QuestionType, string> = {
  'multiple-choice': 'Multiple choice · 4 options',
  'true-false': 'True / False',
  'fill-blank': 'Fill in the blank',
  matching: 'Matching · 4 pairs',
  'short-answer': 'Short answer',
}

export function parseQuestionCount(answer?: string): number {
  const match = answer?.match(/(\d+)/)
  if (!match) return 20
  return Math.min(50, Math.max(1, parseInt(match[1], 10)))
}

export function parseTypeLabel(typeAnswer?: string): string {
  const parsed = parseTypeAnswer(typeAnswer)
  if (parsed.kind === 'mixed') return 'Mixed types'
  return TYPE_META[parsed.type]
}

export function parseTypeAnswer(typeAnswer?: string): { kind: 'mixed' } | { kind: 'single'; type: QuestionType } {
  if (!typeAnswer || typeAnswer.includes('Mixed')) return { kind: 'mixed' }
  if (typeAnswer.includes('True')) return { kind: 'single', type: 'true-false' }
  if (typeAnswer.includes('Fill')) return { kind: 'single', type: 'fill-blank' }
  if (typeAnswer.includes('Matching')) return { kind: 'single', type: 'matching' }
  if (typeAnswer.includes('Multiple')) return { kind: 'single', type: 'multiple-choice' }
  return { kind: 'single', type: 'multiple-choice' }
}

function mockForType(type: QuestionType) {
  const [mock] = buildMockQuestions(1, type)
  return mock
}

function shapeOutlineQuestion(
  template: (typeof OUTLINE_QUESTIONS)[number],
  num: string,
  type: QuestionType,
): GeneratedQuestion {
  const title = template.title

  if (type === 'multiple-choice') {
    if (template.options.length >= 4 && !template.meta.includes('Matching')) {
      return {
        num,
        title,
        meta: TYPE_META[type],
        accent: template.accent,
        options: template.options.slice(0, 4),
        answerIndex: template.answerIndex ?? 0,
      }
    }
    const mock = mockForType('multiple-choice')
    return {
      num,
      title,
      meta: TYPE_META[type],
      accent: template.accent,
      options: [...mock.options],
      answerIndex: mock.answerIndex,
    }
  }

  if (type === 'true-false') {
    return {
      num,
      title,
      meta: TYPE_META[type],
      accent: template.accent,
      options: ['True', 'False'],
      answerIndex: template.answerIndex ?? 0,
    }
  }

  if (type === 'fill-blank') {
    const fillTitle = title.includes('____')
      ? title
      : `Complete the sentence: ${title.replace(/\.$/, '')} __________.`
    const answer = template.options[0] ?? 'Cellular respiration'
    return {
      num,
      title: fillTitle,
      meta: TYPE_META[type],
      accent: template.accent,
      options: [answer],
      answerIndex: 0,
    }
  }

  if (type === 'matching') {
    if (template.meta.includes('Matching') && template.options.length >= 4) {
      return {
        num,
        title,
        meta: TYPE_META[type],
        accent: template.accent,
        options: [...template.options],
        answerIndex: 0,
      }
    }
    const mock = mockForType('matching')
    return {
      num,
      title: mock.question,
      meta: TYPE_META[type],
      accent: template.accent,
      options: [...mock.options],
      answerIndex: 0,
    }
  }

  const mock = mockForType(type)
  return {
    num,
    title: mock.question,
    meta: TYPE_META[type],
    accent: template.accent,
    options: [...mock.options],
    answerIndex: mock.answerIndex,
  }
}

function questionFromMock(type: QuestionType, num: string, index: number): GeneratedQuestion {
  const mock = mockForType(type)
  return {
    num,
    title: mock.question,
    meta: TYPE_META[type],
    accent: index % 4 >= 2,
    options: [...mock.options],
    answerIndex: mock.answerIndex,
  }
}

export function buildGeneratedQuestions(count: number, typeAnswer?: string): GeneratedQuestion[] {
  const parsed = parseTypeAnswer(typeAnswer)
  const questions: GeneratedQuestion[] = []

  for (let i = 0; i < count; i++) {
    const type =
      parsed.kind === 'mixed' ? MIXED_TYPES[i % MIXED_TYPES.length] : parsed.type
    const num = `Q${String(i + 1).padStart(2, '0')}`

    if (i < OUTLINE_QUESTIONS.length) {
      questions.push(shapeOutlineQuestion(OUTLINE_QUESTIONS[i], num, type))
    } else {
      questions.push(questionFromMock(type, num, i))
    }
  }

  return questions
}
