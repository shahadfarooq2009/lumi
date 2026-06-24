export type GenerationProgressStatus = 'loading' | 'ready' | 'error' | 'stopped'

interface GenerationProgressBarProps {
  status: GenerationProgressStatus
  progress: number | null
  fadeOut?: boolean
}

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function GenerationProgressBar({
  status,
  progress,
  fadeOut = false,
}: GenerationProgressBarProps) {
  const hasRealProgress = typeof progress === 'number'
  const isIndeterminate = status === 'loading' && !hasRealProgress
  const isError = status === 'error'
  const isReady = status === 'ready'
  const isStopped = status === 'stopped'
  const isGenerating = status === 'loading'

  const displayPercent =
    isReady
      ? 100
      : hasRealProgress
        ? clampProgress(progress)
        : null

  const label = isError
    ? 'Generation failed'
    : isReady
      ? 'Flashcards ready!'
      : hasRealProgress
        ? null
        : 'Preparing your flashcards...'

  const fillClass = [
    'fc-gen-progress__fill',
    isError ? 'fc-gen-progress__fill--error' : '',
    isIndeterminate ? 'fc-gen-progress__fill--indeterminate' : '',
    isGenerating ? 'fc-gen-progress__fill--generating' : '',
    isStopped ? 'fc-gen-progress__fill--stopped' : '',
    isReady ? 'fc-gen-progress__fill--complete' : '',
    isReady ? 'fc-gen-progress__fill--success-glow' : '',
  ].filter(Boolean).join(' ')

  return (
    <div
      className={[
        'fc-gen-progress',
        isReady ? 'fc-gen-progress--success-glow' : '',
        fadeOut ? 'fc-gen-progress--fade-out' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="fc-gen-progress__row">
        <div
          className="fc-gen-progress__track"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={displayPercent ?? undefined}
          aria-valuetext={
            isIndeterminate
              ? 'Preparing your flashcards'
              : isError
                ? 'Generation failed'
                : isReady
                  ? 'Flashcards ready'
                  : displayPercent !== null
                    ? `${displayPercent}% complete`
                    : undefined
          }
        >
          <div
            className={fillClass}
            style={displayPercent !== null ? { width: `${displayPercent}%` } : undefined}
          />
        </div>
        {displayPercent !== null ? (
          <span className="fc-gen-progress__pct" aria-hidden>
            {Math.round(displayPercent)}%
          </span>
        ) : null}
      </div>
      {label ? (
        <p className="fc-gen-progress__label" aria-live="polite">
          {label}
        </p>
      ) : null}
    </div>
  )
}
