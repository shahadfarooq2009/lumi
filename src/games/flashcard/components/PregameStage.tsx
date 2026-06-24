import type { Difficulty } from '../types/flashcard'
import type { CardOverlayPhase } from '../types/gamePhase'
import type { GenerationProgressStatus } from './GenerationProgressBar'
import { CountdownCard } from './CountdownCard'
import { CardGenerationContent } from './CardGenerationView'
import { FlashcardContainer } from './FlashcardContainer'

interface PregameStageProps {
  overlayPhase: CardOverlayPhase
  selectedDifficulty: Difficulty
  generationStatus: GenerationProgressStatus
  generationProgress: number | null
  onCountdownComplete: () => void
  onRetry: () => void
  onReadyComplete: () => void
}

export function PregameStage({
  overlayPhase,
  selectedDifficulty,
  generationStatus,
  generationProgress,
  onCountdownComplete,
  onRetry,
  onReadyComplete,
}: PregameStageProps) {
  const showGeneration = overlayPhase === 'generating' || overlayPhase === 'error'
  const usePanelShell = showGeneration || overlayPhase === 'countdown'
  const contentKey = overlayPhase

  return (
    <section className="fc-stage">
      <div className="fc-play-stack">
        <FlashcardContainer
          variant={usePanelShell ? 'generating' : 'default'}
          contentKey={contentKey}
        >
          {showGeneration ? (
            <CardGenerationContent
              status={overlayPhase === 'error' ? 'error' : generationStatus}
              progress={generationProgress}
              onRetry={onRetry}
              onReadyComplete={onReadyComplete}
            />
          ) : null}
          {overlayPhase === 'countdown' ? (
            <CountdownCard
              selectedDifficulty={selectedDifficulty}
              onComplete={onCountdownComplete}
            />
          ) : null}
        </FlashcardContainer>
      </div>
    </section>
  )
}
