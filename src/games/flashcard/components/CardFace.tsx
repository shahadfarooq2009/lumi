import { Atom, Check, FlaskConical, Leaf, RotateCcw } from 'lucide-react'
import type { Flashcard } from '../types/flashcard'
import { AdvanceCountdown } from './AdvanceCountdown'

interface CardFaceProps {
  side: 'front' | 'back'
  card: Flashcard
  selfCheck?: 'correct' | 'wrong' | null
  advanceCountdown?: number | null
  onMarkCorrect?: () => void
  onMarkWrong?: () => void
}

function TopicIcon({ icon }: { icon?: 'leaf' | 'atom' | 'flask' }) {
  if (icon === 'atom') return <Atom strokeWidth={1.8} />
  if (icon === 'flask') return <FlaskConical strokeWidth={1.8} />
  return <Leaf strokeWidth={1.8} />
}

export function CardFace({
  side,
  card,
  selfCheck = null,
  advanceCountdown = null,
  onMarkCorrect,
  onMarkWrong,
}: CardFaceProps) {
  const isBack = side === 'back'

  return (
    <div className={isBack ? 'fc-card__face fc-card__face--back' : 'fc-card__face'}>
      <div className="fc-card__face-inner">
        {!isBack ? <span className="fc-card__tag">{card.tag ?? 'Question'}</span> : null}

        {isBack ? (
          <div className="fc-card__back-layout">
            {advanceCountdown !== null ? (
              <AdvanceCountdown seconds={advanceCountdown} />
            ) : null}

            <header className="fc-card__back-header">
              <div className="fc-card__answer-hero" aria-hidden="true">
                <div className="fc-card__answer-badge">
                  <TopicIcon icon={card.topicIcon} />
                </div>
              </div>
              <span className="fc-card__back-title">Answer</span>
            </header>

            <p className="fc-card__answer">{card.answer}</p>

            <div
              className="fc-card__actions"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              role="group"
              aria-label="Self check"
            >
              {selfCheck === null ? (
                <>
                  <div className="fc-card__actions-divider">
                    <span className="fc-card__divider-line" />
                    <span className="fc-card__actions-prompt">How did you do?</span>
                    <span className="fc-card__divider-line" />
                  </div>
                  <div className="fc-card__action-row">
                    <button
                      type="button"
                      className="fc-card__action fc-card__action--yes"
                      onClick={onMarkCorrect}
                    >
                      <span className="fc-card__action-btn">
                        <Check size={30} strokeWidth={2.8} />
                      </span>
                      <span className="fc-card__action-label">I Got It</span>
                    </button>
                    <button
                      type="button"
                      className="fc-card__action fc-card__action--no"
                      onClick={onMarkWrong}
                    >
                      <span className="fc-card__action-btn">
                        <RotateCcw size={28} strokeWidth={2.5} />
                      </span>
                      <span className="fc-card__action-label">Review Again</span>
                    </button>
                  </div>
                </>
              ) : (
                <p
                  className={
                    selfCheck === 'correct'
                      ? 'fc-card__self-result fc-card__self-result--correct'
                      : 'fc-card__self-result fc-card__self-result--wrong'
                  }
                >
                  {selfCheck === 'correct' ? 'Nice — you got it right!' : 'Keep going — you will get it next time!'}
                </p>
              )}
            </div>
          </div>
        ) : (
          <>
            <div className="fc-card__icon">
              <TopicIcon icon={card.topicIcon} />
            </div>

            <div className="fc-card__question">{card.question}</div>
          </>
        )}
      </div>
    </div>
  )
}
