import { useEffect } from 'react'
import type { GenerationProgressStatus } from './GenerationProgressBar'
import { GeneratingFlashcard } from './GeneratingFlashcard'

const READY_HOLD_MS = 400

interface CardGenerationContentProps {
  status: GenerationProgressStatus
  progress: number | null
  onRetry: () => void
  onReadyComplete: () => void
}

function statusMessage(status: GenerationProgressStatus) {
  if (status === 'ready') {
    return 'Flashcards ready! Starting in a moment...'
  }

  if (status === 'stopped') {
    return 'Generation stopped. Tap Try Again to restart.'
  }

  if (status === 'error') {
    return 'Generation failed. Please try again.'
  }

  return 'Please wait while we prepare your personalized flashcards.'
}

export function CardGenerationContent({
  status,
  progress,
  onRetry,
  onReadyComplete,
}: CardGenerationContentProps) {
  useEffect(() => {
    if (status !== 'ready') return

    const completeTimer = window.setTimeout(() => {
      onReadyComplete()
    }, READY_HOLD_MS)

    return () => {
      window.clearTimeout(completeTimer)
    }
  }, [onReadyComplete, status])

  const displayProgress = status === 'ready' ? 100 : progress
  const isError = status === 'error'

  return (
    <div className="fc-card-generation-shell">
      <GeneratingFlashcard
        progress={isError ? null : displayProgress}
        statusText={statusMessage(status)}
        fadeOut={false}
        showStatus={status !== 'loading' && !isError}
        variant={isError ? 'error' : 'generating'}
      />

      {status === 'error' || status === 'stopped' ? (
        <button type="button" className="fc-card-state__retry-btn" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  )
}
