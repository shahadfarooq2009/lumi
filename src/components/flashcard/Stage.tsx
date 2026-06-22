import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Difficulty } from '../../types/flashcard'
import type { Flashcard as FlashcardType } from '../../types/flashcard'
import { DifficultySelector } from './DifficultySelector'
import { FlipButton } from './FlipButton'
import { Flashcard } from './Flashcard'
import { NavCircleButton } from './NavCircleButton'

interface StageProps {
  card: FlashcardType
  cardIndex: number
  total: number
  isFlipped: boolean
  isFlipping: boolean
  difficulty: Difficulty
  onDifficultyChange: (d: Difficulty) => void
  onFlip: () => void
  onPrev: () => void
  onNext: () => void
  selfCheck: 'correct' | 'wrong' | null
  advanceCountdown: number | null
  navDirection: 'next' | 'prev' | null
  onMarkCorrect: () => void
  onMarkWrong: () => void
}

export function Stage({
  card,
  cardIndex,
  total,
  isFlipped,
  isFlipping,
  difficulty,
  onDifficultyChange,
  onFlip,
  onPrev,
  onNext,
  selfCheck,
  advanceCountdown,
  navDirection,
  onMarkCorrect,
  onMarkWrong,
}: StageProps) {
  return (
    <section className="fc-stage">
      <div className="fc-play-stack">
        <DifficultySelector difficulty={difficulty} onChange={onDifficultyChange} />

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
