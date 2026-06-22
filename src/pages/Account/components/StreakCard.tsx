import { useEffect, useState } from 'react'
import {
  getCorrectAnswerCount,
  getStreakProgressPercent,
  isMilestoneClaimed,
  STREAK_MAX,
  STREAK_MILESTONES,
  STREAK_PROGRESS_EVENT,
} from '../../../lib/streakProgress'

const TRACK_MIN_WIDTH = STREAK_MILESTONES.length * 88

type StreakCardProps = {
  inline?: boolean
  pro?: boolean
  showHeader?: boolean
}

export function StreakCard({ inline = false, pro = false, showHeader = true }: StreakCardProps) {
  const [count, setCount] = useState(getCorrectAnswerCount)

  useEffect(() => {
    const refresh = () => setCount(getCorrectAnswerCount())
    window.addEventListener(STREAK_PROGRESS_EVENT, refresh)
    return () => window.removeEventListener(STREAK_PROGRESS_EVENT, refresh)
  }, [])

  const progress = getStreakProgressPercent(count)
  const trackWidth = Math.max(TRACK_MIN_WIDTH, 640)

  const cardClass = [
    'account-streak-card',
    inline ? 'account-streak-card--inline' : '',
    pro ? 'account-streak-card--pro' : '',
  ]
    .filter(Boolean)
    .join(' ')

  const milestonePosition = (at: number) => `${(at / STREAK_MAX) * 100}%`

  return (
    <div className={cardClass}>
      {showHeader ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className={`m-0 text-[13px] font-bold ${pro ? 'text-white' : 'text-[#1B1530]'}`}>
              Streak
            </p>
            <p className={`m-0 text-[11px] ${pro ? 'text-white/60' : 'text-[#9B94B0]'}`}>
              {count} / {STREAK_MAX} correct answers
            </p>
          </div>
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
              pro ? 'bg-white/10 text-white/80' : 'bg-[#F3EEFF] text-[#7C4DFF]'
            }`}
          >
            Goal: {STREAK_MAX}
          </span>
        </div>
      ) : null}

      <div className="account-streak-scroll">
        <div
          className="account-streak-scroll__inner"
          style={pro ? undefined : { width: trackWidth }}
        >
          <div className="account-streak-rail">
            <div className="account-streak-counts" aria-hidden>
              {STREAK_MILESTONES.map((milestone) => {
                const reached = count >= milestone.at
                return (
                  <span
                    key={`count-${milestone.at}`}
                    className={`account-streak-count ${reached ? 'account-streak-count--reached' : ''}`}
                    style={{ left: milestonePosition(milestone.at) }}
                  >
                    {milestone.at}
                  </span>
                )
              })}
            </div>

            <div className="account-streak-track">
              <div className="account-streak-track__fill" style={{ width: `${progress}%` }} />
              {STREAK_MILESTONES.map((milestone) => {
                const reached = count >= milestone.at
                const claimed = isMilestoneClaimed(milestone.at)
                return (
                  <span
                    key={milestone.at}
                    className={`account-streak-dot ${reached ? 'account-streak-dot--reached' : ''} ${claimed ? 'account-streak-dot--claimed' : ''}`}
                    style={{ left: milestonePosition(milestone.at) }}
                    title={`${milestone.at} correct → ${milestone.credits} credits`}
                  />
                )
              })}
            </div>

            <div className="account-streak-rewards">
              {STREAK_MILESTONES.map((milestone) => {
                const reached = count >= milestone.at
                const claimed = isMilestoneClaimed(milestone.at)
                return (
                  <span
                    key={`reward-${milestone.at}`}
                    className={`account-streak-reward ${reached ? 'account-streak-reward--reached' : ''} ${claimed ? 'account-streak-reward--claimed' : ''}`}
                    style={{ left: milestonePosition(milestone.at) }}
                  >
                    ★ {milestone.credits}
                  </span>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
