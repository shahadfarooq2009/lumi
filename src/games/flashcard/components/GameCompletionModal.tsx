import {
  Clock,
  FileText,
  Flame,
  Heart,
  Home,
  RotateCcw,
  Star,
  Target,
  X,
} from 'lucide-react'
import { formatGameTime } from '../lib/formatGameTime'
import '../styles/game-completion-modal.css'

export interface GameCompletionModalProps {
  isOpen: boolean
  score: number
  totalQuestions: number
  accuracy: number
  completionTime: number
  bestStreak: number
  onPlayAgain: () => void
  onReviewAnswers: () => void
  onBackToGames: () => void
  onClose: () => void
}

type TrophyConfettiPiece = {
  shape: 'ribbon' | 'diamond' | 'rect' | 'sparkle' | 'circle'
  color: string
  left?: string
  right?: string
  rot: number
  delay: number
  duration: number
  sway: number
  spin: number
  w?: number
  h?: number
  size?: number
}

const LEFT_CONFETTI: TrophyConfettiPiece[] = [
  { shape: 'ribbon', color: '#ff7a86', left: '10%', rot: -28, delay: 0, duration: 5.6, sway: -8, spin: 85, w: 16, h: 5 },
  { shape: 'sparkle', color: '#ffd65a', left: '55%', rot: 0, delay: 0.4, duration: 5.2, sway: 7, spin: 0, size: 11 },
  { shape: 'diamond', color: '#73d9c2', left: '32%', rot: 38, delay: 0.8, duration: 4.9, sway: -6, spin: 110, size: 7 },
  { shape: 'rect', color: '#b58ae8', left: '72%', rot: -18, delay: 0.25, duration: 5.4, sway: 9, spin: 55, w: 9, h: 5 },
  { shape: 'circle', color: '#ffa987', left: '20%', rot: 0, delay: 1.1, duration: 4.7, sway: -5, spin: 30, size: 6 },
  { shape: 'ribbon', color: '#73d9c2', left: '48%', rot: 22, delay: 0.65, duration: 5.8, sway: 6, spin: 95, w: 14, h: 4 },
  { shape: 'sparkle', color: '#ff7a86', left: '82%', rot: 0, delay: 0.95, duration: 5.1, sway: -7, spin: 0, size: 10 },
  { shape: 'rect', color: '#fff8e8', left: '38%', rot: 12, delay: 1.3, duration: 5.3, sway: 5, spin: 45, w: 8, h: 4 },
  { shape: 'circle', color: '#ffd65a', left: '64%', rot: 0, delay: 0.55, duration: 4.8, sway: -8, spin: 35, size: 5 },
]

const RIGHT_CONFETTI: TrophyConfettiPiece[] = [
  { shape: 'ribbon', color: '#ffd65a', right: '12%', rot: 26, delay: 0.15, duration: 5.5, sway: 8, spin: 90, w: 15, h: 5 },
  { shape: 'circle', color: '#b58ae8', right: '58%', rot: 0, delay: 0.75, duration: 4.9, sway: -6, spin: 32, size: 5 },
  { shape: 'diamond', color: '#ff7a86', right: '34%', rot: -40, delay: 0.35, duration: 5.2, sway: 7, spin: 120, size: 6 },
  { shape: 'sparkle', color: '#73d9c2', right: '78%', rot: 0, delay: 1.05, duration: 5.7, sway: -7, spin: 0, size: 12 },
  { shape: 'rect', color: '#ffa987', right: '22%', rot: 20, delay: 0.5, duration: 4.8, sway: 6, spin: 50, w: 10, h: 4 },
  { shape: 'ribbon', color: '#b58ae8', right: '50%', rot: -18, delay: 0.9, duration: 5.9, sway: -9, spin: 80, w: 13, h: 4 },
  { shape: 'circle', color: '#ffd65a', right: '68%', rot: 0, delay: 1.2, duration: 5, sway: 5, spin: 34, size: 7 },
  { shape: 'diamond', color: '#fff8e8', right: '86%', rot: 30, delay: 1.4, duration: 5.3, sway: -5, spin: 100, size: 5 },
  { shape: 'sparkle', color: '#ff7a86', right: '40%', rot: 0, delay: 0.6, duration: 4.9, sway: 8, spin: 0, size: 9 },
]

function ConfettiZone({
  side,
  pieces,
}: {
  side: 'left' | 'right'
  pieces: TrophyConfettiPiece[]
}) {
  return (
    <div className={`gcm__confetti-zone gcm__confetti-zone--${side}`}>
      {pieces.map((piece, i) => (
        <span
          key={i}
          className={[
            'gcm__t-confetti',
            `gcm__t-confetti--${piece.shape}`,
            piece.shape === 'sparkle' ? 'gcm__t-confetti--glow' : '',
          ].filter(Boolean).join(' ')}
          style={{
            left: piece.left,
            right: piece.right,
            ['--rot' as string]: `${piece.rot}deg`,
            ['--delay' as string]: `${piece.delay}s`,
            ['--duration' as string]: `${piece.duration}s`,
            ['--sway' as string]: `${piece.sway}px`,
            ['--spin' as string]: `${piece.spin}deg`,
            ['--piece-color' as string]: piece.color,
            width: piece.w ?? piece.size,
            height: piece.h ?? piece.size,
          }}
        >
          {piece.shape === 'sparkle' ? '✦' : null}
        </span>
      ))}
    </div>
  )
}

function HeaderConfettiDecor() {
  return (
    <div className="gcm__header-confetti" aria-hidden>
      <ConfettiZone side="left" pieces={LEFT_CONFETTI} />
      <ConfettiZone side="right" pieces={RIGHT_CONFETTI} />
    </div>
  )
}

function TrophyIllustration() {
  return (
    <div className="gcm__hero" aria-hidden>
      <div className="gcm__trophy-float">
        <img
          className="gcm__trophy-img"
          src="/assets/games/completion-trophy.png"
          alt=""
          width={168}
          height={168}
          draggable={false}
        />
      </div>
    </div>
  )
}

export function GameCompletionModal({
  isOpen,
  score,
  totalQuestions,
  accuracy,
  completionTime,
  bestStreak,
  onPlayAgain,
  onReviewAnswers,
  onBackToGames,
  onClose,
}: GameCompletionModalProps) {
  if (!isOpen) return null

  return (
    <div
      className="gcm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gcm-title"
      aria-describedby="gcm-desc"
    >
      <div className="gcm__backdrop" aria-hidden />

      <div className="gcm__panel">
        <button type="button" className="gcm__close" aria-label="Close" onClick={onClose}>
          <X size={20} strokeWidth={2.5} />
        </button>

        <HeaderConfettiDecor />

        <TrophyIllustration />

        <h2 id="gcm-title" className="gcm__title">
          Congratulations!
        </h2>
        <p id="gcm-desc" className="gcm__subtitle">
          You&apos;ve completed this game. Great job!
        </p>

        <div className="gcm__stats">
          <div className="gcm__stat">
            <div className="gcm__stat-icon gcm__stat-icon--score">
              <Star size={18} strokeWidth={2.2} />
            </div>
            <span className="gcm__stat-label">Score</span>
            <span className="gcm__stat-value gcm__stat-value--score">
              {score}/{totalQuestions}
            </span>
          </div>

          <div className="gcm__stat">
            <div className="gcm__stat-icon gcm__stat-icon--accuracy">
              <Target size={18} strokeWidth={2.2} />
            </div>
            <span className="gcm__stat-label">Accuracy</span>
            <span className="gcm__stat-value gcm__stat-value--accuracy">
              {accuracy}%
            </span>
          </div>

          <div className="gcm__stat">
            <div className="gcm__stat-icon gcm__stat-icon--time">
              <Clock size={18} strokeWidth={2.2} />
            </div>
            <span className="gcm__stat-label">Time</span>
            <span className="gcm__stat-value gcm__stat-value--time">
              {formatGameTime(completionTime)}
            </span>
          </div>

          <div className="gcm__stat">
            <div className="gcm__stat-icon gcm__stat-icon--streak">
              <Flame size={18} strokeWidth={2.2} />
            </div>
            <span className="gcm__stat-label">Best Streak</span>
            <span className="gcm__stat-value gcm__stat-value--streak">
              {bestStreak}
            </span>
          </div>
        </div>

        <div className="gcm__divider" aria-hidden>
          <span className="gcm__divider-line" />
          <span className="gcm__divider-heart">
            <Heart size={12} fill="#ff6b78" stroke="#ff6b78" strokeWidth={0} />
          </span>
          <span className="gcm__divider-line" />
        </div>

        <p className="gcm__message">
          Keep learning! Try another game to strengthen your knowledge.
        </p>

        <div className="gcm__actions">
          <button type="button" className="gcm__btn gcm__btn--primary" onClick={onPlayAgain}>
            <RotateCcw size={17} strokeWidth={2.4} />
            Play Again
          </button>
          <button type="button" className="gcm__btn gcm__btn--secondary" onClick={onReviewAnswers}>
            <FileText size={17} strokeWidth={2.2} />
            Review Answers
          </button>
          <button type="button" className="gcm__btn gcm__btn--outline" onClick={onBackToGames}>
            <Home size={17} strokeWidth={2.2} />
            Back to Games
          </button>
        </div>
      </div>
    </div>
  )
}
