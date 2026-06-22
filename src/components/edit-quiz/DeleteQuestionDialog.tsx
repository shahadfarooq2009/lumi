import { motion } from 'framer-motion'

interface DeleteQuestionDialogProps {
  questionNum: string
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteQuestionDialog({
  questionNum,
  onCancel,
  onConfirm,
}: DeleteQuestionDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 z-30 flex items-center justify-center bg-ink/25 px-6 backdrop-blur-[3px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-question-title"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 4 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[380px] rounded-2xl border border-border bg-white p-6 shadow-md-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="delete-question-title"
          className="text-center font-display text-[17px] font-bold leading-snug text-ink"
        >
          Are you sure you want to delete this question?
        </h2>
        <p className="mt-2 text-center text-[13px] text-ink-dim">
          {questionNum} will be removed from your quiz.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-border bg-white px-5 py-2.5 text-[13px] font-semibold text-ink-soft transition-colors hover:bg-surface-soft sm:min-w-[100px]"
          >
            No
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onConfirm()
            }}
            className="rounded-xl bg-red-500 px-6 py-2.5 text-[13px] font-bold text-white shadow-[0_4px_14px_-2px_rgba(239,68,68,0.5)] transition-colors hover:bg-red-600 sm:min-w-[120px]"
          >
            Yes, delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
