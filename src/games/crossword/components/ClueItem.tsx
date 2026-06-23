import { Check } from 'lucide-react'
import type { Word } from '../types/crossword'

interface ClueItemProps {
  word: Word
  isActive: boolean
  isSolved: boolean
  onClick: () => void
}

export function ClueItem({ word, isActive, isSolved, onClick }: ClueItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex w-full cursor-pointer items-start gap-2.5 rounded-xl p-2.5 px-3 text-left transition-all hover:bg-surface-soft ${
        isActive
          ? 'border border-brand-soft bg-brand-softer before:absolute before:bottom-2 before:left-0 before:top-2 before:w-[3px] before:rounded-r before:bg-brand'
          : ''
      } ${isSolved ? 'opacity-65' : ''}`}
    >
      <span
        className={`shrink-0 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold ${
          isSolved
            ? 'bg-emerald-100 text-emerald-700'
            : isActive
              ? 'bg-brand text-white'
              : 'bg-surface-soft text-ink-muted'
        }`}
      >
        {word.number}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[12.5px] font-medium text-ink-soft ${isSolved ? 'line-through' : ''}`}
        >
          {word.clue}
        </span>
        {word.meta ? (
          <span className="mt-0.5 block text-[10.5px] text-ink-muted">{word.meta}</span>
        ) : null}
      </span>
      {isSolved ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-state-success text-white">
          <Check size={10} strokeWidth={3} />
        </span>
      ) : null}
    </button>
  )
}
