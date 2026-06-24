import './GeneratingFlashcard.css'
import { BrainIllustration, SparkleAccent } from './BrainIllustration'

export interface GeneratingFlashcardProps {
  progress?: number | null
  statusText?: string
  fadeOut?: boolean
  showStatus?: boolean
  variant?: 'generating' | 'error'
}

function clampProgress(value: number) {
  return Math.min(100, Math.max(0, value))
}

export function GeneratingFlashcard({
  progress,
  statusText = 'Please wait while we prepare your personalized flashcards.',
  fadeOut = false,
  showStatus = true,
  variant = 'generating',
}: GeneratingFlashcardProps) {
  const isError = variant === 'error'
  const hasRealProgress = !isError && typeof progress === 'number'
  const safeProgress = hasRealProgress ? clampProgress(progress) : 0
  const isComplete = hasRealProgress && safeProgress >= 100

  const title = isError ? 'Something went wrong' : 'Generating Flashcards...'
  const description = isError ? (
    <>We couldn&apos;t generate your flashcards. Please try again.</>
  ) : (
    <>
      AI is creating questions for you.
      <br />
      This may take a few seconds.
    </>
  )

  return (
    <div
      className={[
        'generating-flashcard',
        fadeOut ? 'generating-flashcard--fade-out' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="generating-flashcard__content">
        <div className="brain-decoration" aria-hidden="true">
          <SparkleAccent color="#F7C948" className="fc-brain-sparkle fc-brain-sparkle--gen-1" />
          <SparkleAccent color="#6ED4E8" className="fc-brain-sparkle fc-brain-sparkle--gen-2" />
          <SparkleAccent color="#B88AE8" className="fc-brain-sparkle fc-brain-sparkle--gen-3" />
          <SparkleAccent color="#FFA65F" className="fc-brain-sparkle fc-brain-sparkle--gen-4" withDot={false} />
          <div className="brain-icon">
            <BrainIllustration className="brain-icon__svg" size={62} />
          </div>
        </div>

        <h2 className="generating-title">{title}</h2>

        <p className="generating-description">{description}</p>

        {!isError ? (
          <div className="progress-section">
          <div
            className="progress-track"
            role="progressbar"
            aria-label="Generating flashcards"
            aria-valuemin={hasRealProgress ? 0 : undefined}
            aria-valuemax={hasRealProgress ? 100 : undefined}
            aria-valuenow={hasRealProgress ? safeProgress : undefined}
          >
            {hasRealProgress ? (
              <div
                className={[
                  'progress-fill',
                  isComplete ? 'progress-fill--complete' : '',
                ].filter(Boolean).join(' ')}
                style={{ width: `${safeProgress}%` }}
              />
            ) : (
              <div className="progress-fill progress-fill--indeterminate" />
            )}
          </div>

          {hasRealProgress ? (
            <span className="progress-percentage">{Math.round(safeProgress)}%</span>
          ) : null}
        </div>
        ) : null}
      </div>

      {showStatus ? (
        <div className="generating-status">
          <span className="generating-status__icon">i</span>
          <span>{statusText}</span>
        </div>
      ) : null}
    </div>
  )
}
