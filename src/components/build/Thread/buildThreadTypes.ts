export const OUTLINE_QUESTIONS = [
  {
    num: 'Q01',
    title: 'What organelle is the powerhouse of the cell?',
    meta: 'Multiple choice · 4 options',
    accent: false,
    options: ['Mitochondria', 'Nucleus', 'Ribosome', 'Golgi apparatus'],
    answerIndex: 0,
  },
  {
    num: 'Q02',
    title: 'Mitochondria have their own DNA.',
    meta: 'True / False',
    accent: false,
    options: ['True', 'False'],
    answerIndex: 0,
  },
  {
    num: 'Q03',
    title: 'The process of converting glucose to ATP is called ____.',
    meta: 'Fill in the blank',
    accent: true,
    options: ['Cellular respiration'],
    answerIndex: 0,
  },
  {
    num: 'Q04',
    title: 'Match each organelle to its primary function.',
    meta: 'Matching · 4 pairs',
    accent: true,
    options: [
      'Nucleus → Stores genetic material',
      'Ribosome → Protein synthesis',
      'Mitochondria → Energy production',
      'Chloroplast → Photosynthesis',
    ],
    answerIndex: 0,
  },
] as const

export type OnboardingStepId =
  | 'play_mode'
  | 'game_mode'
  | 'question_count'
  | 'question_type'
  | 'file_upload'
  | 'generating'

export type PipelinePhase = 'chat' | 'loading' | 'ready'

export type LoadingVisual = {
  activeStep: number
  completedUpTo: number
  isLineFilling: boolean
}

export const INITIAL_LOADING_VISUAL: LoadingVisual = {
  activeStep: 0,
  completedUpTo: 0,
  isLineFilling: false,
}

export type ActiveStep = { kind: 'onboarding'; id: OnboardingStepId }

export type GeneratedQuestion = {
  num: string
  title: string
  meta: string
  accent?: boolean
  options: string[]
  answerIndex?: number
}

export type HistoryAiMessage = {
  kind: 'ai'
  id: string
  step?: string
  modelLabel?: string
  skills?: string
  bodyKey: OnboardingStepId | 'generating'
}

export type HistoryUserMessage = {
  kind: 'user'
  id: string
  bubble: string
  attachment?: {
    type: 'PDF' | 'DOCX' | 'PPTX' | 'TXT'
    name: string
    meta: string
  }
}

export type HistoryQuestion = {
  kind: 'question'
  id: string
  num: string
  title: string
  meta: string
  accent?: boolean
}

export type HistoryItem = HistoryAiMessage | HistoryUserMessage | HistoryQuestion

/** Default pause before the next chat bubble appears */
export const TYPING_MS = 450

export function getTypingDelay(_from: ActiveStep | null, _to: ActiveStep): number {
  return TYPING_MS
}
