import { motion } from 'framer-motion'

interface StarsProps {
  earned: 0 | 1 | 2 | 3
}

function StarSvg({ filled, delay }: { filled: boolean; delay: number }) {
  return (
    <motion.svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      initial={{ scale: 0, rotate: -30, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
      className={filled ? 'drop-shadow-[0_2px_6px_rgba(253,224,71,0.5)]' : ''}
    >
      <path
        d="M12 2l2.9 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 7.1-1.01L12 2z"
        fill={filled ? '#fde047' : 'rgba(255,255,255,0.25)'}
      />
    </motion.svg>
  )
}

export function Stars({ earned }: StarsProps) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/25 bg-white/15 px-2.5 py-1.5 backdrop-blur-md">
      {[0, 1, 2].map((i) => (
        <StarSvg key={i} filled={i < earned} delay={0.1 + i * 0.1} />
      ))}
    </div>
  )
}
