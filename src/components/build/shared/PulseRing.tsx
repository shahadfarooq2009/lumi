import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface PulseRingProps {
  children: ReactNode
  className?: string
}

export function PulseRing({ children, className = '' }: PulseRingProps) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <motion.span
        className="pointer-events-none absolute -inset-1 rounded-[inherit]"
        animate={{ scale: [1, 1.08, 1], opacity: [0.55, 0.15, 0.55] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ boxShadow: '0 0 0 4px rgba(124, 58, 237, 0.12)' }}
      />
      {children}
    </span>
  )
}
