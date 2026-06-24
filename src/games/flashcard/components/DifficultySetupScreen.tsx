import type { LucideIcon } from 'lucide-react'
import { ArrowLeft, ArrowRight, Check, Info, Sparkles, Star } from 'lucide-react'
import type { Difficulty } from '../types/flashcard'
import { IconGlassButton } from './IconGlassButton'
import { SetupBrainHero } from './SetupBrainHero'

function StarSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 L13.5 9 L20 10 L13.5 11 L12 18 L10.5 11 L4 10 L10.5 9 Z" />
    </svg>
  )
}

interface DifficultyCardConfig {
  id: Difficulty
  label: string
  description: string
  icon: LucideIcon
}

const DIFFICULTY_CARDS: DifficultyCardConfig[] = [
  {
    id: 'easy',
    label: 'Easy',
    description: 'Great for beginners',
    icon: Star,
  },
  {
    id: 'medium',
    label: 'Medium',
    description: 'Balanced challenge',
    icon: Star,
  },
  {
    id: 'hard',
    label: 'Hard',
    description: 'For advanced learners',
    icon: Star,
  },
]

function difficultyHelperLabel(difficulty: Difficulty) {
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  return `${label} difficulty selected`
}

interface DifficultySetupScreenProps {
  title: string
  selectedDifficulty: Difficulty | null
  onSelectDifficulty: (difficulty: Difficulty) => void
  onBack: () => void
  onGenerate: () => void
}

export function DifficultySetupScreen({
  title,
  selectedDifficulty,
  onSelectDifficulty,
  onBack,
  onGenerate,
}: DifficultySetupScreenProps) {
  const canGenerate = selectedDifficulty !== null

  return (
    <div className="fc-setup">
      <header className="fc-setup__header">
        <IconGlassButton icon={ArrowLeft} ariaLabel="Back to games" onClick={onBack} />
        <div className="fc-setup__title">
          <StarSparkle className="fc-setup__sparkle" />
          <h1>{title}</h1>
          <StarSparkle className="fc-setup__sparkle fc-setup__sparkle--2" />
        </div>
        <div className="fc-setup__header-spacer" aria-hidden />
      </header>

      <div className="fc-setup__body">
        <div className="fc-setup__hero">
          <SetupBrainHero />
          <h2 className="fc-setup__heading">Choose Difficulty</h2>
          <p className="fc-setup__subheading">
            AI will generate questions based on the
            <br />
            selected difficulty. ✨
          </p>
        </div>

        <div className="fc-setup__cards" role="group" aria-label="Choose difficulty">
          {DIFFICULTY_CARDS.map((card) => {
            const isSelected = selectedDifficulty === card.id
            const Icon = card.icon
            return (
              <button
                key={card.id}
                type="button"
                className={[
                  'fc-setup-card',
                  `fc-setup-card--${card.id}`,
                  isSelected ? 'is-selected' : '',
                ].filter(Boolean).join(' ')}
                aria-pressed={isSelected}
                onClick={() => onSelectDifficulty(card.id)}
              >
                {isSelected ? (
                  <span className="fc-setup-card__check" aria-hidden>
                    <Check strokeWidth={3} />
                  </span>
                ) : null}
                <span className="fc-setup-card__icon">
                  <Icon strokeWidth={2.4} />
                </span>
                <span className="fc-setup-card__label">{card.label}</span>
                <span className="fc-setup-card__desc">{card.description}</span>
              </button>
            )
          })}
        </div>

        <p className="fc-setup__note">
          <Info className="fc-setup__note-icon" strokeWidth={2.2} aria-hidden />
          Difficulty cannot be changed after starting.
        </p>

        <div className="fc-setup__actions">
          <button
            type="button"
            className="fc-setup__generate-btn"
            disabled={!canGenerate}
            aria-disabled={!canGenerate}
            onClick={onGenerate}
          >
            <Sparkles className="fc-setup__generate-sparkle" strokeWidth={2.2} aria-hidden />
            <span className="fc-setup__generate-text">Generate &amp; Start</span>
            <ArrowRight className="fc-setup__generate-arrow" strokeWidth={2.4} aria-hidden />
          </button>
          <p className="fc-setup__helper">
            {selectedDifficulty
              ? difficultyHelperLabel(selectedDifficulty)
              : 'Select a difficulty to continue'}
          </p>
        </div>
      </div>
    </div>
  )
}
