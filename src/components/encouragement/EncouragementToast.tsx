import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

type EncouragementToastProps = {
  message: string | null
  visible: boolean
  onDismiss: () => void
}

export function EncouragementToast({ message, visible, onDismiss }: EncouragementToastProps) {
  return (
    <AnimatePresence>
      {visible && message ? (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 14, scale: 0.98 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="encouragement-toast fixed bottom-[5.25rem] right-5 z-[115] flex w-[min(360px,calc(100vw-2.5rem))] items-start gap-3 rounded-2xl border border-[#ECE7FB] bg-white p-3.5 shadow-[0_16px_48px_-14px_rgba(124,77,255,0.35)] sm:right-8"
          role="status"
          aria-live="polite"
        >
          <div className="encouragement-toast__avatar shrink-0">
            <img src="/assets/quizora-mascot.png" alt="" aria-hidden />
          </div>
          <div className="min-w-0 flex-1 pt-0.5">
            <p className="m-0 text-[11px] font-bold uppercase tracking-wide text-[#7C4DFF]">
              Quizora
            </p>
            <p className="m-0 mt-1 text-[13.5px] font-semibold leading-snug text-[#1B1530]" dir="auto">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss message"
            className="encouragement-toast__dismiss shrink-0 rounded-full p-1.5 text-[#9B94B0] transition-colors hover:bg-[#F3EEFF] hover:text-[#7C4DFF]"
          >
            <X size={16} strokeWidth={2.2} />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
