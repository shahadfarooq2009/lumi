import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useBuildThreadContext } from '../../../contexts/BuildThreadContext'

function loadingProgress(visual: {
  activeStep: number
  completedUpTo: number
  isLineFilling: boolean
}) {
  let value = visual.completedUpTo
  if (visual.activeStep > 0) value += 0.25
  if (visual.isLineFilling) value += 0.35
  return Math.min(value / 5, 1)
}

export function BottomProgress() {
  const { pipelinePhase, loadingVisual, questionTarget, generatedQuestions } = useBuildThreadContext()

  const progress = pipelinePhase === 'ready' ? 1 : loadingProgress(loadingVisual)
  const percent = Math.round(progress * 86) + 14

  const label =
    pipelinePhase === 'ready'
      ? `${generatedQuestions.length} / ${questionTarget}`
      : pipelinePhase === 'loading'
        ? `${Math.min(Math.round(progress * questionTarget), questionTarget)} / ${questionTarget}`
        : `0 / ${questionTarget}`

  return (
    <div className="sticky bottom-0 border-t border-border bg-white px-6 py-3.5">
      <div className="flex items-center gap-4">
        <span className="shrink-0 text-xs font-semibold text-ink-soft">Game build</span>
        <div className="relative h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-border">
          <div
            className="relative h-full overflow-hidden rounded-full transition-all duration-500"
            style={{
              width: `${percent}%`,
              background: 'linear-gradient(90deg, #34d399 0%, #10b981 100%)',
            }}
          >
            <span className="build-progress-shimmer absolute inset-0" />
          </div>
        </div>
        <span className="shrink-0 font-mono text-xs font-bold text-game-success">{label}</span>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-ink-dim hover:bg-surface-soft"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="flex h-6 w-6 items-center justify-center rounded-md border border-border text-ink-dim hover:bg-surface-soft"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
