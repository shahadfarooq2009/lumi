import { useRef } from 'react'
import type { Flashcard as FlashcardType } from '../../types/flashcard'
import { CardFace } from './CardFace'
import { CardDots } from './CardDots'

interface FlashcardProps {
  card: FlashcardType
  isFlipped: boolean
  isFlipping: boolean
  onFlip: () => void
  cardIndex: number
  total: number
  selfCheck: 'correct' | 'wrong' | null
  advanceCountdown: number | null
  navDirection: 'next' | 'prev' | null
  onMarkCorrect: () => void
  onMarkWrong: () => void
}

export function Flashcard({
  card,
  isFlipped,
  isFlipping,
  onFlip,
  cardIndex,
  total,
  selfCheck,
  advanceCountdown,
  navDirection,
  onMarkCorrect,
  onMarkWrong,
}: FlashcardProps) {
  const dealDirectionRef = useRef<'next' | 'prev' | null>(null)

  if (navDirection) {
    dealDirectionRef.current = navDirection
  }

  const motionClass = [
    'fc-card-motion',
    dealDirectionRef.current === 'next' ? 'fc-card-motion--deal-next' : '',
    dealDirectionRef.current === 'prev' ? 'fc-card-motion--deal-prev' : '',
    isFlipping ? 'fc-card-motion--flipping' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className="fc-card-wrap">
      <div className="fc-card-area">
        <div key={cardIndex} className={motionClass}>
          <button
            type="button"
            onClick={onFlip}
            aria-label="Flashcard. Tap to flip."
            className={[
              'fc-card',
              isFlipped ? 'is-flipped' : '',
              isFlipping ? 'is-flipping' : '',
            ].filter(Boolean).join(' ')}
          >
            <CardFace side="front" card={card} />
            <CardFace
              side="back"
              card={card}
              selfCheck={selfCheck}
              advanceCountdown={advanceCountdown}
              onMarkCorrect={onMarkCorrect}
              onMarkWrong={onMarkWrong}
            />
          </button>
        </div>
      </div>
      <CardDots activeIndex={cardIndex} total={total} navDirection={navDirection} />
    </div>
  )
}
