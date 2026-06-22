import { Link } from 'react-router-dom'
import { Bell, ChevronLeft, HelpCircle, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ProfileMenu } from '../layout/ProfileMenu'
import { HomeChatIconButton } from './HomeChatFab'

export function BuildTopbar() {
  return (
    <header className="sticky top-0 z-20 flex shrink-0 items-center gap-4 border-b border-border-soft bg-white/90 px-6 py-3 backdrop-blur-md">
      <Link
        to="/"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-soft hover:text-ink"
        title="Back"
      >
        <ChevronLeft size={18} strokeWidth={2.2} />
      </Link>

      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        <motion.span
          className="h-2 w-2 shrink-0 rounded-full bg-game-success"
          animate={{ opacity: [1, 0.5, 1], scale: [1, 0.85, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <h1 className="truncate font-display text-base font-bold text-ink">Cell Biology Adventure</h1>
        <span className="shrink-0 rounded-full bg-surface-soft px-2.5 py-0.5 text-[11px] font-semibold text-ink-muted">
          Building game
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <HomeChatIconButton className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-soft hover:text-ink" />
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-soft hover:text-ink"
          title="Help"
        >
          <HelpCircle size={17} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-soft hover:text-ink"
          title="Share"
        >
          <Share2 size={17} strokeWidth={2} />
        </button>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-ink-dim transition-colors hover:bg-surface-soft hover:text-ink"
          title="Notifications"
        >
          <Bell size={17} strokeWidth={2} />
          <span className="absolute right-1.5 top-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-game-survival px-0.5 text-[9px] font-bold text-white ring-2 ring-white">
            3
          </span>
        </button>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-border bg-gradient-to-r from-[#fff7ed] to-[#fef3c7] px-2.5 py-1.5 text-xs font-semibold text-ink-soft"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#fde047] to-game-fantasy text-[10px] font-extrabold text-white">
            ★
          </span>
          <span>240</span>
          <span className="text-ink-muted">|</span>
          <span className="text-game-fantasy">Upgrade</span>
        </button>
        <ProfileMenu size="sm" variant="brand" showOnlineDot />
      </div>
    </header>
  )
}
