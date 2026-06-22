import { motion } from 'framer-motion'
import { List } from 'lucide-react'
import type { GeneratedQuestion } from '../Thread/buildThreadTypes'

interface GeneratedQuestionsPanelProps {
  questions: GeneratedQuestion[]
  totalCount?: number
  isComplete?: boolean
}

function optionLabel(index: number, meta: string) {
  if (meta.includes('True / False')) {
    return index === 0 ? 'T' : 'F'
  }
  if (meta.includes('Fill in the blank') || meta.includes('Short answer')) {
    return 'A'
  }
  return String.fromCharCode(65 + index)
}

function typePillClass(meta: string) {
  if (meta.includes('True / False')) return 'bg-emerald-50 text-game-success'
  if (meta.includes('Fill in the blank')) return 'bg-amber-50 text-game-fantasy'
  if (meta.includes('Matching')) return 'bg-pink-50 text-game-arena'
  if (meta.includes('Multiple choice')) return 'bg-blue-50 text-game-info'
  return 'bg-brand-softer text-brand-deep'
}

const revealEase = [0.22, 1, 0.36, 1] as const

function questionRevealDelay(index: number) {
  return Math.min(index * 0.1, 2)
}

export function GeneratedQuestionsPanel({ questions, totalCount, isComplete }: GeneratedQuestionsPanelProps) {
  const readyLabel = totalCount ?? questions.length
  const statusLabel = isComplete ? 'all ready' : 'updating live'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: revealEase }}
      className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border-2 border-border-strong bg-white shadow-[0_8px_28px_-12px_rgba(124,58,237,0.14)]"
    >
      <div
        className="flex shrink-0 items-center gap-3 border-b border-border-soft px-4 py-3.5"
        style={{ background: 'linear-gradient(135deg, #faf7ff 0%, #f5f0ff 100%)' }}
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-brand/15 bg-white text-brand shadow-sm">
          <List size={15} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-sm font-bold text-ink">Generated questions</h3>
          <p className="text-[11px] text-ink-dim">
            <span className="font-semibold text-brand-deep">{readyLabel}</span> ready · {statusLabel}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-game-success/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-game-success">
          Live
        </span>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-y-contain bg-surface-bg/40 p-3.5">
        {questions.map((question, index) => (
          <motion.article
            key={question.num}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.75,
              delay: 0.15 + questionRevealDelay(index),
              ease: revealEase,
            }}
            className="rounded-xl border-2 border-border-strong bg-white p-4"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-7 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-soft font-mono text-[11px] font-bold text-brand-deep">
                {question.num}
              </span>
              <div className="min-w-0 flex-1">
                <h4 className="font-display text-[13.5px] font-bold leading-snug text-ink">{question.title}</h4>
                <span
                  className={`mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${typePillClass(question.meta)}`}
                >
                  {question.meta}
                </span>
              </div>
            </div>

            {question.options.length > 0 ? (
              <ul className="mt-3.5 space-y-2">
                {question.options.map((option, optIndex) => (
                  <li
                    key={`${question.num}-${optIndex}`}
                    className="flex items-center gap-2.5 rounded-xl border-2 border-border-strong bg-brand-softer px-3 py-2.5 text-[12.5px] leading-snug text-ink"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-brand/10 bg-white font-mono text-[10px] font-bold text-brand-deep">
                      {optionLabel(optIndex, question.meta)}
                    </span>
                    <span className="min-w-0">{option}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </motion.article>
        ))}
      </div>
    </motion.div>
  )
}
