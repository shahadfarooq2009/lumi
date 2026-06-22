import { motion } from 'framer-motion'
import { useEncouragement } from '../../contexts/EncouragementContext'

export function EncouragementTriggerButton() {
  const { showNow } = useEncouragement()

  return (
    <motion.button
      type="button"
      onClick={showNow}
      aria-label="Show encouragement message"
      title="Encouragement message"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="encouragement-trigger fixed bottom-6 right-5 z-[114] flex h-12 w-12 items-center justify-center rounded-2xl border border-[#ECE7FB] bg-white shadow-[0_10px_32px_-10px_rgba(124,77,255,0.4)] transition-shadow hover:shadow-[0_14px_36px_-8px_rgba(124,77,255,0.5)] sm:right-8"
    >
      <img
        src="/assets/quizora-mascot.png"
        alt=""
        aria-hidden
        className="h-8 w-8 object-contain"
      />
    </motion.button>
  )
}
