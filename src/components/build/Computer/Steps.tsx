import { Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { useBuildThreadContext } from '../../../contexts/BuildThreadContext'
import { parseTypeLabel } from '../../../lib/buildQuestions'
import type { LoadingVisual } from '../Thread/buildThreadTypes'

type StepStatus = 'done' | 'active' | 'pending'

const stepEase = [0.22, 1, 0.36, 1] as const

function StepIndicator({ status, num }: { status: StepStatus; num: number }) {
  const label = String(num).padStart(2, '0')
  const isDone = status === 'done'
  const isActive = status === 'active'

  return (
    <div className="relative h-9 w-9 shrink-0">
      <AnimatePresence>
        {isActive ? (
          <motion.span
            key="active-ring"
            className="pointer-events-none absolute -inset-1 rounded-full ring-2 ring-brand/25"
            initial={{ scale: 0.55, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.15, opacity: 0 }}
            transition={{ duration: 0.45, ease: stepEase }}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      {isActive ? (
        <motion.span
          className="pointer-events-none absolute -inset-2 rounded-full bg-brand/8"
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [0.9, 1.12, 0.9], opacity: [0.35, 0.65, 0.35] }}
          transition={{
            scale: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
            opacity: { duration: 2.4, repeat: Infinity, ease: 'easeInOut' },
          }}
          aria-hidden
        />
      ) : null}

      <motion.div
        key={`${num}-${status}`}
        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full font-display text-xs ${
          isDone
            ? 'bg-game-success text-white'
            : isActive
              ? 'border-2 border-brand bg-white font-semibold text-brand'
              : 'border border-[#d1d5db] bg-white font-medium text-[#aeaeb2]'
        }`}
        initial={
          isActive
            ? { scale: 0.72, opacity: 0 }
            : isDone
              ? { scale: 0.85, opacity: 0.5 }
              : { scale: 1, opacity: 1 }
        }
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: stepEase }}
      >
        <AnimatePresence mode="wait">
          {isDone ? (
            <motion.span
              key="check"
              initial={{ scale: 0, opacity: 0, rotate: -40 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: stepEase }}
              className="flex items-center justify-center"
            >
              <Check size={15} strokeWidth={2.5} />
            </motion.span>
          ) : (
            <motion.span
              key="label"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.32, ease: stepEase }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function StepConnector({
  stepNum,
  visual,
}: {
  stepNum: number
  visual: LoadingVisual
}) {
  const isAnimating = visual.isLineFilling && visual.completedUpTo === stepNum
  const isFilled =
    visual.completedUpTo > stepNum ||
    (visual.completedUpTo === stepNum && !visual.isLineFilling && visual.activeStep > stepNum)

  return (
    <div className="relative my-1.5 w-0.5 min-h-[28px] flex-1 overflow-hidden rounded-full bg-[#e5e5ea]">
      <motion.div
        className="absolute inset-x-0 top-0 bg-game-success"
        initial={false}
        animate={{ height: isFilled || isAnimating ? '100%' : '0%' }}
        transition={{
          duration: isAnimating ? 0.6 : 0,
          ease: [0.22, 1, 0.36, 1],
        }}
      />
    </div>
  )
}

function stepStatus(num: number, visual: LoadingVisual, isReady: boolean): StepStatus {
  if (isReady || num <= visual.completedUpTo) return 'done'
  if (num === visual.activeStep) return 'active'
  return 'pending'
}

export function Steps() {
  const { answers, loadingVisual, pipelinePhase, questionTarget, typeAnswer } = useBuildThreadContext()

  const questionCountLabel = answers.question_count?.replace(', please', '') ?? `${questionTarget} questions`
  const typeLabel = parseTypeLabel(typeAnswer)
  const isReady = pipelinePhase === 'ready'
  const isLoading = pipelinePhase === 'loading'

  const generateSub =
    isReady || loadingVisual.completedUpTo >= 3
      ? `${questionTarget} / ${questionTarget} — ${typeLabel.toLowerCase()}`
      : isLoading && loadingVisual.activeStep === 3
        ? `Generating… — ${typeLabel.toLowerCase()}`
        : `0 / ${questionTarget} — ${typeLabel.toLowerCase()}`

  const steps: { num: number; title: string; sub: string; status: StepStatus }[] = [
    {
      num: 1,
      title: 'Collect preferences',
      sub: `${questionCountLabel} · ${typeLabel}`,
      status: stepStatus(1, loadingVisual, isReady),
    },
    {
      num: 2,
      title: 'Read & analyze the file',
      sub: '18 pages · 142 key concepts found',
      status: stepStatus(2, loadingVisual, isReady),
    },
    {
      num: 3,
      title: 'Generate questions',
      sub: generateSub,
      status: stepStatus(3, loadingVisual, isReady),
    },
    {
      num: 4,
      title: 'Choose a game mode',
      sub: 'Pick how it plays',
      status: stepStatus(4, loadingVisual, isReady),
    },
    {
      num: 5,
      title: 'Polish & launch',
      sub: 'Run integrity check, save game',
      status: stepStatus(5, loadingVisual, isReady),
    },
  ]

  return (
    <div className="flex flex-col">
      {steps.map((step, index) => (
        <div key={step.num} className="flex gap-4">
          <div className="flex w-9 flex-col items-center">
            <StepIndicator status={step.status} num={step.num} />
            {index < steps.length - 1 ? (
              <StepConnector stepNum={step.num} visual={loadingVisual} />
            ) : null}
          </div>

          <div className={`min-w-0 ${index < steps.length - 1 ? 'pb-5' : 'pb-1'} pt-1.5`}>
            <div className="font-display text-[13.5px] font-bold leading-snug text-[#1c1c1e]">
              {step.title}
            </div>
            <div className="mt-0.5 text-[11.5px] leading-relaxed text-[#8e8e93]">{step.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
