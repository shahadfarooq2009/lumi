import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, Zap } from 'lucide-react'
import { formatCredits } from '../../lib/credits'
import type { PlanId } from './pricingPlans'

const UPGRADE_COPY: Record<
  PlanId,
  { title: string; subtitle: string; badge: string }
> = {
  free: {
    title: "You're all set!",
    subtitle: 'Your Free plan is ready. Keep building amazing games.',
    badge: 'Plan activated',
  },
  pro: {
    title: "You're upgraded to Pro!",
    subtitle: 'Your 7-day free trial is live. Unlimited learning unlocked.',
    badge: 'Pro upgrade',
  },
  classroom: {
    title: 'Welcome to Classroom!',
    subtitle: 'Your team plan is active. Bring your class along.',
    badge: 'Classroom upgrade',
  },
}

function useCountUp(from: number, to: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(from)

  useEffect(() => {
    if (!active) {
      setValue(from)
      return
    }

    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - (1 - progress) ** 3
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [active, duration, from, to])

  return value
}

interface UpgradeCelebrationProps {
  open: boolean
  planId: PlanId
  fromCredits: number
  toCredits: number
  reward: number
  onContinue: () => void
}

export function UpgradeCelebration({
  open,
  planId,
  fromCredits,
  toCredits,
  reward,
  onContinue,
}: UpgradeCelebrationProps) {
  const copy = UPGRADE_COPY[planId]
  const animatedCredits = useCountUp(fromCredits, toCredits, open)

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="lumi-modal-bg fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-celebration-title"
        >
          <motion.div
            className="relative w-full max-w-[420px] overflow-hidden rounded-[28px] border border-[#ECE7FB] bg-white p-8 text-center shadow-[0_30px_80px_-20px_rgba(124,77,255,0.45)]"
            style={{ background: '#ffffff' }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at 50% 0%, rgba(124,77,255,0.12), transparent 55%), radial-gradient(circle at 80% 90%, rgba(255,184,108,0.14), transparent 45%)',
              }}
              aria-hidden
            />

            {[0, 1, 2, 3, 4, 5].map((index) => (
              <motion.span
                key={index}
                className="pointer-events-none absolute h-2 w-2 rounded-full"
                style={{
                  left: `${12 + index * 14}%`,
                  top: `${18 + (index % 3) * 8}%`,
                  background: index % 2 === 0 ? '#7C4DFF' : '#FFB86C',
                }}
                initial={{ opacity: 0, scale: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0.4, 1, 0.6],
                  y: [0, -28 - index * 6, -52 - index * 8],
                }}
                transition={{ delay: 0.15 + index * 0.08, duration: 1.1, ease: 'easeOut' }}
                aria-hidden
              />
            ))}

            <div className="relative">
              <motion.div
                className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-white"
                style={{ background: 'linear-gradient(135deg, #7C4DFF, #9A6BFF)' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles size={11} fill="currentColor" />
                {copy.badge}
              </motion.div>

              <motion.h2
                id="upgrade-celebration-title"
                className="font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-[#1B1530]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                {copy.title}
              </motion.h2>

              <motion.p
                className="mx-auto mt-2 max-w-[320px] text-[14px] leading-relaxed text-[#6B6585]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                {copy.subtitle}
              </motion.p>

              <div className="relative mx-auto mt-7 flex w-fit flex-col items-center">
                <motion.div
                  className="credits__coin relative !h-[72px] !w-[72px] !text-[28px]"
                  initial={{ scale: 0.4, rotate: -20, opacity: 0 }}
                  animate={{
                    scale: [0.4, 1.18, 1],
                    rotate: [-20, 8, 0],
                    opacity: 1,
                  }}
                  transition={{ delay: 0.28, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
                >
                  ★
                </motion.div>

                {[0, 1, 2].map((index) => (
                  <motion.span
                    key={index}
                    className="pointer-events-none absolute left-1/2 top-2 -translate-x-1/2 text-[15px] font-extrabold text-[#059669]"
                    initial={{ opacity: 0, y: 0, scale: 0.7 }}
                    animate={{ opacity: [0, 1, 0], y: [-8, -34 - index * 12], scale: 1 }}
                    transition={{ delay: 0.55 + index * 0.12, duration: 1.05, ease: 'easeOut' }}
                  >
                    +{reward}
                  </motion.span>
                ))}

                <motion.div
                  className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#FED7AA] bg-gradient-to-r from-[#FFF7ED] to-[#FEF3C7] px-4 py-2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.45, type: 'spring', stiffness: 280, damping: 20 }}
                >
                  <span className="text-[13px] font-semibold text-[#9A3412]">Credits</span>
                  <motion.span
                    className="font-oswald text-[24px] font-bold leading-none text-[#9A3412]"
                    key={animatedCredits}
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 0.25 }}
                  >
                    {formatCredits(animatedCredits)}
                  </motion.span>
                </motion.div>

                <motion.p
                  className="mt-2 text-[12px] font-medium text-[#6B6585]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  {formatCredits(fromCredits)} → {formatCredits(toCredits)}
                </motion.p>
              </div>

              <motion.button
                type="button"
                onClick={onContinue}
                className="pricing-tier-cta-primary mx-auto mt-8 !w-auto min-w-[220px] px-8"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {planId === 'pro' ? <Zap size={15} fill="currentColor" /> : null}
                Continue to Lumi
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
