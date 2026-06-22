import { extractTextFromFile } from './files'
import type { GeneratePayload, Question, QuestionType } from '../types/quiz'

export const GENERATION_QUESTION_COUNT = 20

const TOPICS = [
  'main idea',
  'key term',
  'definition',
  'example',
  'summary',
  'concept',
  'detail',
  'application',
]

const TYPE_LABELS: Record<QuestionType, string> = {
  'multiple-choice': 'Multiple Choice',
  'true-false': 'True / False',
  'fill-blank': 'Fill in the Blank',
  matching: 'Matching',
  'short-answer': 'Short Answer',
}

export function getQuestionTypeLabel(type: QuestionType): string {
  return TYPE_LABELS[type] ?? 'Multiple Choice'
}

export function getWrongOptions(question: Question): string[] {
  return question.options.filter((_, index) => index !== question.answerIndex)
}

export function buildMockQuestions(count: number, type: QuestionType = 'multiple-choice'): Question[] {
  const questions: Question[] = []

  for (let i = 0; i < count; i++) {
    const topic = TOPICS[i % TOPICS.length]

    if (type === 'true-false') {
      questions.push({
        type,
        question: `True or False: The material covers the ${topic} on these pages.`,
        options: ['True', 'False'],
        answerIndex: 0,
      })
    } else if (type === 'fill-blank') {
      questions.push({
        type,
        question: `Complete the sentence: The main ${topic} is __________.`,
        options: [`The primary ${topic} from this section`],
        answerIndex: 0,
      })
    } else if (type === 'matching') {
      questions.push({
        type,
        question: `Match each term to its definition (${topic}).`,
        options: [
          `Term A → Primary ${topic} definition`,
          `Term B → Secondary ${topic} detail`,
          `Term C → Related ${topic} concept`,
          `Term D → Supporting ${topic} fact`,
        ],
        answerIndex: 0,
      })
    } else if (type === 'short-answer') {
      questions.push({
        type,
        question: `Explain the ${topic} based on the uploaded material.`,
        options: [`A clear explanation of the ${topic} using evidence from the file.`],
        answerIndex: 0,
      })
    } else {
      questions.push({
        type: 'multiple-choice',
        question: `Which option best describes the ${topic}?`,
        options: [
          `The primary ${topic} from this section`,
          'A supporting detail mentioned nearby',
          'An unrelated concept from another page',
          'None of the above',
        ],
        answerIndex: 0,
      })
    }
  }

  return questions
}

function truncateSentence(sentence: string, max = 140): string {
  const trimmed = sentence.trim()
  if (trimmed.length <= max) return trimmed
  return `${trimmed.slice(0, max - 1)}…`
}

export function buildQuestionsFromText(
  text: string,
  count: number,
  type: QuestionType,
  fileName: string,
): Question[] {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const sentences = normalized
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 35)
    .slice(0, Math.max(count * 3, 12))

  if (sentences.length === 0) {
    return buildMockQuestions(count, type).map((q) => ({
      ...q,
      question: q.question.replace(/uploaded material|these pages|this section/gi, fileName),
    }))
  }

  const questions: Question[] = []

  for (let i = 0; i < count; i++) {
    const base = sentences[i % sentences.length]
    const distractor = sentences[(i + 1) % sentences.length] ?? base

    if (type === 'true-false') {
      questions.push({
        type,
        question: `True or False: ${truncateSentence(base)}`,
        options: ['True', 'False'],
        answerIndex: 0,
      })
    } else if (type === 'fill-blank') {
      const words = base.split(/\s+/).filter((w) => w.length > 5)
      const blank = words[Math.floor(words.length / 2)] ?? words[0] ?? 'concept'
      const cleanBlank = blank.replace(/[^\w-]/g, '')
      questions.push({
        type,
        question: `Fill in the blank: ${base.replace(blank, '__________')}`,
        options: [cleanBlank],
        answerIndex: 0,
      })
    } else if (type === 'matching') {
      const chunk = sentences.slice(i, i + 4)
      while (chunk.length < 4) chunk.push(sentences[chunk.length % sentences.length])
      questions.push({
        type,
        question: 'Match each statement to the concept it describes.',
        options: chunk.map((s, idx) => `Item ${idx + 1} → ${truncateSentence(s, 60)}`),
        answerIndex: 0,
      })
    } else {
      questions.push({
        type: 'multiple-choice',
        question: `According to "${fileName}", which statement is correct?`,
        options: [
          truncateSentence(base),
          truncateSentence(distractor),
          'This information does not appear in the uploaded file.',
          'All of the above are incorrect.',
        ],
        answerIndex: 0,
      })
    }
  }

  return questions
}

function normalizeQuestion(raw: unknown, fallbackType: QuestionType): Question | null {
  if (!raw || typeof raw !== 'object') return null
  const item = raw as Record<string, unknown>
  const question = typeof item.question === 'string' ? item.question.trim() : ''
  const options = Array.isArray(item.options)
    ? item.options.filter((o): o is string => typeof o === 'string' && o.trim().length > 0)
    : []
  const answerIndex = typeof item.answerIndex === 'number' ? item.answerIndex : 0
  const type =
    typeof item.type === 'string' && item.type in TYPE_LABELS
      ? (item.type as QuestionType)
      : fallbackType

  if (!question || options.length === 0) return null

  return {
    type,
    question,
    options,
    answerIndex: Math.min(Math.max(answerIndex, 0), options.length - 1),
  }
}

async function requestAiQuestions(
  text: string,
  payload: Pick<GeneratePayload, 'questionCount' | 'questionType' | 'file' | 'notes'>,
): Promise<Question[] | null> {
  const response = await fetch('/api/generate-questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: text.slice(0, 14000),
      questionCount: payload.questionCount,
      questionType: payload.questionType,
      fileName: payload.file.name,
      notes: payload.notes,
    }),
  })

  if (!response.ok) return null

  const data = (await response.json()) as { questions?: unknown[] }
  if (!Array.isArray(data.questions)) return null

  const parsed = data.questions
    .map((item) => normalizeQuestion(item, payload.questionType))
    .filter((q): q is Question => q !== null)

  return parsed.length > 0 ? parsed : null
}

export async function generateQuestionsFromFile(payload: GeneratePayload): Promise<Question[]> {
  const text = await extractTextFromFile(payload.file)

  if (text.length > 40) {
    try {
      const aiQuestions = await requestAiQuestions(text, payload)
      if (aiQuestions) return aiQuestions.slice(0, payload.questionCount)
    } catch {
      /* fall through to local generation */
    }
  }

  return buildQuestionsFromText(text, payload.questionCount, payload.questionType, payload.file.name)
}

export function questionTypeForGameKey(gameKey: string): QuestionType {
  if (gameKey === 'truefalse') return 'true-false'
  if (gameKey === 'fillblank') return 'fill-blank'
  if (gameKey === 'match') return 'matching'
  return 'multiple-choice'
}
