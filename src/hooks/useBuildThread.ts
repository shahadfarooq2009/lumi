import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getTypingDelay,
  INITIAL_LOADING_VISUAL,
  type ActiveStep,
  type GeneratedQuestion,
  type HistoryItem,
  type HistoryUserMessage,
  type LoadingVisual,
  type PipelinePhase,
} from '../components/build/Thread/buildThreadTypes'
import {
  BUILD_STEP_ACTIVE_MS,
  BUILD_STEP_COMPLETE_MS,
  BUILD_STEP_LINE_MS,
} from '../data/buildProgress'
import { buildGeneratedQuestions, parseQuestionCount } from '../lib/buildQuestions'
import { isSoloPlayMode } from '../lib/playModeOptions'

function nextStepAfter(
  current: ActiveStep,
  hasUploadedFile: boolean,
): ActiveStep | null {
  switch (current.id) {
    case 'play_mode':
      return { kind: 'onboarding', id: 'question_count' }
    case 'question_count':
      return { kind: 'onboarding', id: 'question_type' }
    case 'question_type':
      return hasUploadedFile ? null : { kind: 'onboarding', id: 'file_upload' }
    case 'file_upload':
      return null
    default:
      return null
  }
}

function triggersPipeline(stepId: ActiveStep['id']) {
  return stepId === 'question_type' || stepId === 'file_upload'
}

function stepMeta(step: ActiveStep, answers: Record<string, string>) {
  const soloWithFile = isSoloPlayMode(answers.play_mode)
  const stepLabel =
    step.id === 'play_mode'
      ? 'Step 1'
      : step.id === 'question_count'
        ? soloWithFile
          ? 'Step 2'
          : answers.play_mode
            ? 'Step 2'
            : 'Step 1'
        : step.id === 'question_type'
          ? soloWithFile
            ? 'Step 3'
            : answers.play_mode
              ? 'Step 3'
              : 'Step 2'
          : step.id === 'file_upload'
            ? 'Step 3'
            : undefined

  return {
    step: stepLabel,
    bodyKey: step.id,
  }
}

function updateHistoryQuestionCountBubble(items: HistoryItem[], bubble: string): HistoryItem[] {
  let afterCountAi = false
  let updated = false

  return items.map((item) => {
    if (item.kind === 'ai' && item.bodyKey === 'question_count') {
      afterCountAi = true
      return item
    }
    if (afterCountAi && !updated && item.kind === 'user' && !item.attachment) {
      updated = true
      return { ...item, bubble }
    }
    return item
  })
}

export function useBuildThread(fileName: string, hasUploadedFile: boolean) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [activeStep, setActiveStep] = useState<ActiveStep | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [questionTarget, setQuestionTarget] = useState(20)
  const [typeAnswer, setTypeAnswer] = useState('Mixed Questions')
  const buildConfigRef = useRef({ count: 20, typeAnswer: 'Mixed Questions' })
  const [pipelinePhase, setPipelinePhase] = useState<PipelinePhase>('chat')
  const [loadingVisual, setLoadingVisual] = useState<LoadingVisual>(INITIAL_LOADING_VISUAL)
  const timerRef = useRef<number | null>(null)
  const pipelineRunIdRef = useRef(0)

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const clearPipelineTimer = useCallback(() => {
    pipelineRunIdRef.current += 1
  }, [])

  const wait = useCallback(
    (ms: number, runId: number) =>
      new Promise<boolean>((resolve) => {
        timerRef.current = window.setTimeout(() => {
          resolve(runId === pipelineRunIdRef.current)
        }, ms)
      }),
    [],
  )

  const showStep = useCallback(
    (step: ActiveStep, from: ActiveStep | null = null) => {
      clearTimer()
      setActiveStep(null)
      setIsTyping(true)

      const delay = getTypingDelay(from, step)
      timerRef.current = window.setTimeout(() => {
        setIsTyping(false)
        setActiveStep(step)
        timerRef.current = null
      }, delay)
    },
    [clearTimer],
  )

  const lockActiveToHistory = useCallback((step: ActiveStep, currentAnswers: Record<string, string>) => {
    const meta = stepMeta(step, currentAnswers)
    setHistory((items) => [
      ...items,
      {
        kind: 'ai',
        id: `ai-${step.id}`,
        step: meta.step,
        bodyKey: meta.bodyKey,
      },
    ])
  }, [])

  const startLoadingPipeline = useCallback(() => {
    setPipelinePhase('loading')
    setLoadingVisual({ activeStep: 1, completedUpTo: 0, isLineFilling: false })
    setActiveStep(null)
    setHistory((items) => [
      ...items,
      {
        kind: 'ai',
        id: 'ai-generating',
        bodyKey: 'generating',
      },
    ])
  }, [])

  const respond = useCallback(
    (userBubble: string, answerKey?: string, attachment?: HistoryUserMessage['attachment']) => {
      if (!activeStep || isTyping) return

      const current = activeStep

      const mergedAnswers = answerKey
        ? { ...answers, [answerKey]: userBubble }
        : answers

      if (answerKey) {
        setAnswers(mergedAnswers)
      }

      lockActiveToHistory(current, mergedAnswers)

      setHistory((items) => [
        ...items,
        {
          kind: 'user',
          id: `user-${items.length + 1}-${Date.now()}`,
          bubble: userBubble,
          attachment,
        },
      ])

      const next = nextStepAfter(current, hasUploadedFile)
      if (next) {
        showStep(next, current)
        return
      }

      if (triggersPipeline(current.id)) {
        const count = parseQuestionCount(
          answerKey === 'question_count' ? userBubble : answers.question_count,
        )
        const selectedType =
          answerKey === 'question_type' ? userBubble : answers.question_type ?? 'Mixed Questions'
        buildConfigRef.current = { count, typeAnswer: selectedType }
        setQuestionTarget(count)
        setTypeAnswer(selectedType)
        startLoadingPipeline()
      } else {
        setActiveStep(null)
      }
    },
    [activeStep, answers, hasUploadedFile, isTyping, lockActiveToHistory, showStep, startLoadingPipeline],
  )

  const changeQuestionCount = useCallback(
    (label: string) => {
      if (pipelinePhase !== 'chat' || !answers.question_count) return

      const bubble = `${label}, please`
      if (answers.question_count === bubble) return

      const count = parseQuestionCount(bubble)
      setAnswers((prev) => ({ ...prev, question_count: bubble }))
      setQuestionTarget(count)
      buildConfigRef.current = { ...buildConfigRef.current, count }
      setHistory((items) => updateHistoryQuestionCountBubble(items, bubble))
    },
    [answers.question_count, pipelinePhase],
  )

  const canChangeQuestionCount = pipelinePhase === 'chat' && Boolean(answers.question_count)

  useEffect(() => {
    if (pipelinePhase !== 'loading') return

    const runId = pipelineRunIdRef.current

    const runSequence = async () => {
      for (let step = 1; step <= 5; step++) {
        setLoadingVisual({ activeStep: step, completedUpTo: step - 1, isLineFilling: false })
        if (!(await wait(BUILD_STEP_ACTIVE_MS, runId))) return

        setLoadingVisual({ activeStep: 0, completedUpTo: step, isLineFilling: false })
        if (!(await wait(BUILD_STEP_COMPLETE_MS, runId))) return

        if (step < 5) {
          setLoadingVisual({ activeStep: 0, completedUpTo: step, isLineFilling: true })
          if (!(await wait(BUILD_STEP_LINE_MS, runId))) return
        }
      }

      if (runId !== pipelineRunIdRef.current) return

      const { count, typeAnswer: selectedType } = buildConfigRef.current
      setGeneratedQuestions(buildGeneratedQuestions(count, selectedType))
      setLoadingVisual({ activeStep: 0, completedUpTo: 5, isLineFilling: false })
      setPipelinePhase('ready')
    }

    runSequence()

    return () => {
      clearPipelineTimer()
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [clearPipelineTimer, pipelinePhase, wait])

  useEffect(() => {
    clearTimer()
    clearPipelineTimer()
    setHistory([])
    setActiveStep(null)
    setIsTyping(false)
    setAnswers({})
    setGeneratedQuestions([])
    setQuestionTarget(20)
    setTypeAnswer('Mixed Questions')
    buildConfigRef.current = { count: 20, typeAnswer: 'Mixed Questions' }
    setPipelinePhase('chat')
    setLoadingVisual(INITIAL_LOADING_VISUAL)

    const initialHistory: HistoryItem[] = []
    if (hasUploadedFile) {
      initialHistory.push({
        kind: 'user',
        id: 'user-file',
        bubble: 'Here you go 📎',
        attachment: {
          type: 'PDF',
          name: fileName,
          meta: '2.4 MB · 18 pages',
        },
      })
    }

    setHistory(initialHistory)
    showStep(
      hasUploadedFile
        ? { kind: 'onboarding', id: 'play_mode' }
        : { kind: 'onboarding', id: 'question_count' },
    )

    return () => {
      clearTimer()
      clearPipelineTimer()
    }
  }, [clearPipelineTimer, clearTimer, fileName, hasUploadedFile, showStep])

  const showWorkbench = pipelinePhase === 'ready'

  return {
    history,
    activeStep,
    isTyping,
    answers,
    generatedQuestions,
    questionTarget,
    typeAnswer,
    pipelinePhase,
    loadingVisual,
    showWorkbench,
    respond,
    changeQuestionCount,
    canChangeQuestionCount,
  }
}
