import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Word } from '../types/crossword'

interface ActiveClueCardProps {
  word: Word | null
  onPrev: () => void
  onNext: () => void
}

export function ActiveClueCard({ word, onPrev, onNext }: ActiveClueCardProps) {
  return (
    <motion.div
      key={word?.id ?? 'empty'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex w-full max-w-[580px] items-center gap-4 rounded-2xl border border-brand-soft bg-gradient-to-br from-white to-[#faf7ff] p-4 px-5 shadow-[0_4px_14px_-4px_rgba(124,58,237,0.15),inset_0_-3px_0_rgba(124,58,237,0.05),inset_0_1px_0_rgba(255,255,255,0.9)]"
    >
      {word ? (
        <>
          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-gradient-to-br from-brand to-brand-deep px-2.5 py-1 font-display text-[11px] font-extrabold uppercase tracking-wide text-white">
            <span className="rounded bg-white/20 px-1.5 py-0.5 font-mono text-[10px]">
              {word.number}
            </span>
            {word.direction === 'across' ? 'Across' : 'Down'}
          </span>
          <p className="min-w-0 flex-1 font-display text-base font-bold text-ink">{word.clue}</p>
        </>
      ) : (
        <p className="flex-1 font-display text-sm font-semibold text-ink-dim">
          Select a cell or clue to begin
        </p>
      )}

      <div className="flex shrink-0 gap-1">
        <button
          type="button"
          onClick={onPrev}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-soft bg-brand-softer text-brand-deep transition-all hover:-translate-y-px active:translate-y-px"
          aria-label="Previous clue"
        >
          <ChevronLeft size={16} strokeWidth={2.2} />
        </button>
        <button
          type="button"
          onClick={onNext}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-soft bg-brand-softer text-brand-deep transition-all hover:-translate-y-px active:translate-y-px"
          aria-label="Next clue"
        >
          <ChevronRight size={16} strokeWidth={2.2} />
        </button>
      </div>
    </motion.div>
  )
}
