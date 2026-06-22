import { useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

const PRIMARY_NAV = [
  { id: 'home',         label: 'Home',          icon: HomeIcon },
  { id: 'explore',      label: 'Explore',        icon: CompassIcon },
  { id: 'challenges',   label: 'Challenges',     icon: TrophyIcon },
  { id: 'leaderboard',  label: 'Leaderboard',    icon: ChartIcon },
  { id: 'achievements', label: 'Achievements',   icon: StarIcon },
  { id: 'tutor',        label: 'AI Tutor',       icon: SparkIcon },
] as const

const SECONDARY_NAV = [
  { id: 'progress', label: 'My Progress',     icon: TrendIcon },
  { id: 'skillmap',  label: 'Skill Map',      icon: MapIcon },
  { id: 'saved',    label: 'Saved Games',     icon: BookmarkIcon },
  { id: 'recent',   label: 'Recently Played', icon: ClockIcon },
] as const

export function Sidebar() {
  const [active, setActive] = useState('home')

  return (
    <aside className="sticky top-0 z-20 hidden h-dvh w-[240px] shrink-0 flex-col bg-white px-4 pb-4 pt-6 shadow-[1px_0_0_0_rgba(26,21,48,0.06),4px_0_24px_-8px_rgba(26,21,48,0.08)] lg:flex">
      {/* Brand */}
      <div className="mb-7 flex items-center gap-2.5 px-2">
        <div
          className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] font-display text-[16px] font-extrabold text-white shadow-[0_6px_20px_-4px_rgba(91,33,182,0.5)]"
          style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)' }}
        >
          M
        </div>
        <div>
          <span className="block font-display text-[17px] font-extrabold tracking-tight text-lumi-ink">MindQuest</span>
          <span className="text-[10px] font-semibold text-lumi-muted">Learning Platform</span>
        </div>
      </div>

      {/* Primary nav */}
      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
        {PRIMARY_NAV.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(item.id)}
              className={`relative flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13.5px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary/30 ${
                isActive ? 'text-white' : 'text-lumi-muted hover:bg-lumi-soft-2/80 hover:text-lumi-ink'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)' } : undefined}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-[12px]"
                  style={{ background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)', boxShadow: '0 8px 28px -8px rgba(91,33,182,0.55)' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10"><Icon /></span>
              <span className="relative z-10">{item.label}</span>
            </button>
          )
        })}

        {/* MY LEARNING */}
        <p className="mb-1 mt-5 px-3 text-[10.5px] font-bold uppercase tracking-widest text-lumi-muted-2">
          My Learning
        </p>

        {SECONDARY_NAV.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              className="flex items-center gap-3 rounded-[12px] px-3 py-2.5 text-[13.5px] font-semibold text-lumi-muted transition-all hover:bg-lumi-soft-2/80 hover:text-lumi-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary/30"
            >
              <Icon />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Daily Challenge card */}
      <div
        className="mt-4 cursor-pointer rounded-[16px] p-3.5 transition-transform hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)',
          boxShadow: '0 4px 20px -6px rgba(251,191,36,0.5)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-white/60 text-xl">
            ⚡
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-extrabold text-amber-900">Daily Challenge</div>
            <div className="text-[11px] font-medium text-amber-700">+500 XP · 2h left</div>
          </div>
          <span className="text-[13px] text-amber-600">→</span>
        </div>
        <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-amber-200">
          <div className="h-full w-[65%] rounded-full bg-amber-500" />
        </div>
        <div className="mt-1 text-[10px] font-semibold text-amber-700">3 / 5 completed</div>
      </div>

      {/* Upgrade to Pro card */}
      <div
        className="mt-3 cursor-pointer overflow-hidden rounded-[16px] p-4 transition-transform hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, #4C1D95 0%, #5B21B6 50%, #6D28D9 100%)',
          boxShadow: '0 8px 28px -8px rgba(91,33,182,0.55)',
        }}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">Upgrade</span>
          <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-extrabold text-yellow-900">PRO</span>
        </div>
        <p className="mt-1.5 text-[13px] font-bold text-white">Unlock all games & AI features</p>
        <p className="mt-0.5 text-[11px] text-violet-300">Unlimited plays · No ads</p>
        <button
          type="button"
          className="mt-3 w-full rounded-[10px] bg-white py-2 text-[12px] font-extrabold text-[#5B21B6] transition-all hover:bg-violet-50"
        >
          Get Pro — $4.99/mo
        </button>
      </div>
    </aside>
  )
}

function icon(children: ReactNode) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  )
}

function HomeIcon() { return icon(<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />) }
function CompassIcon() { return icon(<><circle cx="12" cy="12" r="9" /><path d="m15 9-6 6M9 9h6v6" /></>) }
function TrophyIcon() { return icon(<><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM5 5H3v1a4 4 0 0 0 4 4M19 5h2v1a4 4 0 0 1-4 4" /></>) }
function ChartIcon() { return icon(<><path d="M4 20V10M10 20V4M16 20v-6M22 20H2" /></>) }
function StarIcon() { return icon(<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9L12 17.8 5.8 21.1 7 14.2 2 10.3l6.9-1z" />) }
function SparkIcon() { return icon(<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />) }
function TrendIcon() { return icon(<><path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" /></>) }
function MapIcon() { return icon(<><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line x1="8" y1="2" x2="8" y2="18" /><line x1="16" y1="6" x2="16" y2="22" /></>) }
function BookmarkIcon() { return icon(<path d="M7 4h10v16l-5-3-5 3z" />) }
function ClockIcon() { return icon(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>) }
