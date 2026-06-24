import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Flashcard as FlashcardType } from '../types/flashcard'
import { FlipButton } from './FlipButton'
import { Flashcard } from './Flashcard'
import { NavCircleButton } from './NavCircleButton'

interface StageProps {
  card: FlashcardType
  cardIndex: number
  total: number
  isFlipped: boolean
  isFlipping: boolean
  onFlip: () => void
  onPrev: () => void
  onNext: () => void
  selfCheck: 'correct' | 'wrong' | null
  advanceCountdown: number | null
  navDirection: 'next' | 'prev' | null
  onMarkCorrect: () => void
  onMarkWrong: () => void
  entering?: boolean
}

export function Stage({
  card,
  cardIndex,
  total,
  isFlipped,
  isFlipping,
  onFlip,
  onPrev,
  onNext,
  selfCheck,
  advanceCountdown,
  navDirection,
  onMarkCorrect,
  onMarkWrong,
  entering = false,
}: StageProps) {
  return (
    <section className="fc-stage">
      <div className="fc-play-stack">
        <Flashcard
          card={card}
          cardIndex={cardIndex}
          total={total}
          isFlipped={isFlipped}
          isFlipping={isFlipping}
          onFlip={onFlip}
          selfCheck={selfCheck}
          advanceCountdown={advanceCountdown}
          navDirection={navDirection}
          onMarkCorrect={onMarkCorrect}
          onMarkWrong={onMarkWrong}
          entering={entering}
        />

        <div className="fc-controls__center">
          <NavCircleButton icon={ArrowLeft} label="Previous" onClick={onPrev} />
          <FlipButton onClick={onFlip} isFlipping={isFlipping} />
          <NavCircleButton icon={ArrowRight} label="Next" onClick={onNext} />
        </div>
      </div>
    </section>
  )
}
