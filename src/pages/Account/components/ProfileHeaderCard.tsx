import { useEffect, useState } from 'react'
import {
  FolderKanban,
  Flame,
  Gamepad2,
  Heart,
  Pencil,
  Share2,
  Sparkles,
  User,
} from 'lucide-react'
import {
  getCorrectAnswerCount,
  STREAK_MAX,
  STREAK_PROGRESS_EVENT,
} from '../../../lib/streakProgress'
import { HEADER_STATS, USER } from '../data/accountData'
import { StreakCard } from './StreakCard'

const STAT_ICONS = {
  folder: FolderKanban,
  gamepad: Gamepad2,
  share: Share2,
  heart: Heart,
}

export function ProfileHeaderCard() {
  const [streakCount, setStreakCount] = useState(getCorrectAnswerCount)

  useEffect(() => {
    const refresh = () => setStreakCount(getCorrectAnswerCount())
    window.addEventListener(STREAK_PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(STREAK_PROGRESS_EVENT, refresh)
  }, [])

  return (
    <section className="account-profile-card pricing-tier-pro relative overflow-visible rounded-[28px] px-6 py-8 pt-10 sm:px-8">
      <div className="pricing-popular-badge pointer-events-none absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2">
        <span className="pricing-popular-badge__icon">
          <Sparkles size={10} fill="currentColor" strokeWidth={0} />
        </span>
        {USER.plan}
      </div>

      <div className="pricing-tier-pro__badge-glow" aria-hidden />
      <div className="pricing-tier-pro__grid overflow-hidden rounded-[28px]" aria-hidden />
      <div className="pricing-tier-pro__shine overflow-hidden rounded-[28px]" aria-hidden />

      <div className="relative z-[1] flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="relative shrink-0">
            <div className="account-profile-avatar pricing-tier-icon pricing-tier-icon--pro">
              <span className="font-display text-[22px] font-extrabold">{USER.initials}</span>
            </div>
            <button
              type="button"
              aria-label="Edit avatar"
              className="account-profile-avatar-edit"
            >
              <Pencil size={13} strokeWidth={2.5} />
            </button>
          </div>

          <div className="min-w-0 flex-1 pt-1">
            <h1 className="m-0 font-display text-[22px] font-extrabold leading-tight text-white sm:text-[24px]">
              {USER.name}
            </h1>
            <p className="mt-1 text-[13px] font-medium text-white/70">{USER.email}</p>
          </div>
        </div>

        <p className="m-0 max-w-[720px] text-[13.5px] leading-relaxed text-white/55">
          {USER.bio}
        </p>

        <div className="account-profile-streak-hero">
          <div className="account-profile-streak-hero__icon">
            <Flame size={22} strokeWidth={2.2} fill="currentColor" />
          </div>
          <div className="flex min-w-0 flex-wrap items-end gap-x-2 gap-y-0.5 font-oswald">
            <span className="text-[44px] font-bold leading-none tracking-[-0.02em] text-white sm:text-[52px]">
              {streakCount}
            </span>
            <span className="mb-1.5 text-[13px] font-medium text-white/60 sm:text-sm">
              / {STREAK_MAX} correct answers
            </span>
          </div>
        </div>

        <button
          type="button"
          className="pricing-tier-cta-primary pricing-tier-cta-primary--featured w-full"
        >
          <User size={15} strokeWidth={2.25} />
          Edit profile
        </button>

        <div className="account-profile-section">
          <div className="account-profile-section__label">YOUR STATS</div>
          <div className="account-profile-stats">
            {HEADER_STATS.map(({ label, value, icon }) => {
              const Icon = STAT_ICONS[icon]
              return (
                <div key={label} className="account-profile-stat">
                  <div className="account-profile-stat__icon">
                    <Icon size={17} strokeWidth={2.2} />
                  </div>
                  <div className="account-profile-stat__value">{value}</div>
                  <div className="account-profile-stat__label">{label}</div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="account-profile-section">
          <div className="account-profile-section__label">STREAK REWARDS</div>
          <StreakCard inline pro showHeader={false} />
        </div>
      </div>
    </section>
  )
}
