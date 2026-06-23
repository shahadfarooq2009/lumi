import type { Difficulty } from '../types/flashcard'

interface DifficultySelectorProps {
  difficulty: Difficulty
  onChange: (d: Difficulty) => void
}

const LEVELS: { key: Difficulty; label: string; dotClass: string }[] = [
  { key: 'easy', label: 'Easy', dotClass: 'fc-difficulty__dot--easy' },
  { key: 'medium', label: 'Medium', dotClass: 'fc-difficulty__dot--medium' },
  { key: 'hard', label: 'Hard', dotClass: 'fc-difficulty__dot--hard' },
]

export function DifficultySelector({ difficulty, onChange }: DifficultySelectorProps) {
  return (
    <div className="fc-difficulty">
      {LEVELS.map(({ key, label, dotClass }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          className={difficulty === key ? 'fc-difficulty__btn is-active' : 'fc-difficulty__btn'}
        >
          <span className={`fc-difficulty__dot ${dotClass}`} />
          {label}
        </button>
      ))}
    </div>
  )
}
