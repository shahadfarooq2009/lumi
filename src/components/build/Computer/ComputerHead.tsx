import { ExternalLink, Minimize2, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export function ComputerHead() {
  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white px-6 py-4">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-softer text-brand">
          <Sparkles size={16} strokeWidth={2.2} />
        </div>
        <h2 className="font-display text-sm font-bold text-ink">AI Workbench</h2>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-game-success">
          <motion.span
            className="h-1.5 w-1.5 rounded-full bg-game-success"
            animate={{ opacity: [1, 0.5, 1], scale: [1, 0.85, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Ready
        </span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-dim hover:bg-surface-soft hover:text-ink"
          title="Open"
        >
          <ExternalLink size={15} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-dim hover:bg-surface-soft hover:text-ink"
          title="Minimize"
        >
          <Minimize2 size={15} strokeWidth={2} />
        </button>
      </div>
    </header>
  )
}
