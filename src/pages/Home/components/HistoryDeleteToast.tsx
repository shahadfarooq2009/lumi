import { RotateCcw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HistoryDeleteToastProps {
  count: number
  message?: string
  onUndo: () => void
  onDismiss: () => void
}

export function HistoryDeleteToast({ count, message, onUndo, onDismiss }: HistoryDeleteToastProps) {
  const label =
    message ??
    (count === 1 ? '1 item deleted' : `${count} items deleted`)
  return (
    <AnimatePresence>
      {count > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 left-1/2 z-[120] flex w-[min(420px,calc(100vw-2rem))] -translate-x-1/2 items-center justify-between gap-3 rounded-2xl border border-[#ECE7FB] bg-[#1B1530] px-4 py-3.5 text-white shadow-[0_16px_48px_-12px_rgba(27,21,48,0.45)] sm:px-5"
          role="status"
          aria-live="polite"
        >
          <p className="text-[13px] font-semibold sm:text-[14px]">
            {label}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={onUndo}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-[12px] font-bold transition-colors hover:bg-white/15"
            >
              <RotateCcw size={13} strokeWidth={2.2} />
              Undo
            </button>
            <button
              type="button"
              onClick={onDismiss}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[12px] font-bold text-white/90 transition-colors hover:bg-white/10"
            >
              <X size={13} strokeWidth={2.2} />
              Cancel
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
