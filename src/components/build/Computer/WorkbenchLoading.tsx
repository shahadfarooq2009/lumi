import { motion } from 'framer-motion'
import { Loader2, Sparkles } from 'lucide-react'
import { PanelCollapseButton } from '../PanelExpandTab'
import { PulseRing } from '../shared/PulseRing'
import { BUILD_QUESTIONS_CURRENT, BUILD_QUESTIONS_TOTAL } from '../../../data/buildProgress'

export function WorkbenchLoading() {
  return (
    <div className="overflow-hidden rounded-[14px] border border-brand-soft bg-white">
      <div
        className="border-b border-border-soft px-4 py-3"
        style={{ background: 'linear-gradient(135deg, #faf7ff 0%, #f0e9ff 100%)' }}
      >
        <div className="flex items-center gap-2.5">
          <PulseRing className="rounded-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-soft bg-white text-brand">
              <Sparkles size={15} strokeWidth={2.2} />
            </div>
          </PulseRing>
          <div>
            <div className="font-display text-sm font-bold text-ink">Generating questions</div>
            <div className="text-[11.5px] text-ink-dim">
              {BUILD_QUESTIONS_CURRENT} / {BUILD_QUESTIONS_TOTAL} — mixed types
            </div>
          </div>
          <Loader2 size={16} className="ml-auto animate-spin text-brand" />
          <PanelCollapseButton />
        </div>
      </div>

      <div className="space-y-3 p-4">
        {[0, 1, 2].map((row) => (
          <motion.div
            key={row}
            className="rounded-md bg-[#f5f5f8] p-3"
            animate={{ opacity: [0.45, 0.85, 0.45] }}
            transition={{ duration: 1.1, repeat: Infinity, delay: row * 0.12 }}
          >
            <div className="mb-2 h-2.5 w-2/3 rounded-full bg-border" />
            <div className="h-2 w-full rounded-full bg-border-soft" />
          </motion.div>
        ))}
        <p className="text-center text-[12px] font-medium text-ink-muted">
          Quizora is writing your questions…
        </p>
      </div>
    </div>
  )
}
