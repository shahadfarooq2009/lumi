import { ArrowDown, ArrowRight } from 'lucide-react'
import type { Direction, Word } from '../types/crossword'
import { ClueItem } from './ClueItem'

interface ClueGroupProps {
  direction: Direction
  clues: Word[]
  activeWordId: string | null
  solvedIds: Set<string>
  onSelectWord: (wordId: string) => void
}

export function ClueGroup({
  direction,
  clues,
  activeWordId,
  solvedIds,
  onSelectWord,
}: ClueGroupProps) {
  const Icon = direction === 'across' ? ArrowRight : ArrowDown
  const label = direction === 'across' ? 'Across' : 'Down'

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-brand-softer text-brand">
          <Icon size={12} strokeWidth={2.5} />
        </span>
        <span className="font-display text-[11.5px] font-extrabold uppercase tracking-[0.12em] text-ink-muted">
          {label}
        </span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>
      <div className="flex flex-col gap-1">
        {clues.map((word) => (
          <ClueItem
            key={word.id}
            word={word}
            isActive={activeWordId === word.id}
            isSolved={solvedIds.has(word.id)}
            onClick={() => onSelectWord(word.id)}
          />
        ))}
      </div>
    </div>
  )
}
