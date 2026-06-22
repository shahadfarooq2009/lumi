import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PanelCollapseButton } from '../build/PanelExpandTab'
import { ScorePill } from './ScorePill'
import { Stars } from './Stars'

interface TopbarProps {
  title: string
  score: number
  starsEarned: 0 | 1 | 2 | 3
  compact?: boolean
  onBack?: () => void
}

export function Topbar({ title, score, starsEarned, compact = false, onBack }: TopbarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }
    navigate(-1)
  }

  return (
    <header
      className={`relative z-20 shrink-0 overflow-hidden rounded-2xl shadow-[inset_0_2px_0_rgba(255,255,255,0.2),inset_0_-4px_0_rgba(0,0,0,0.15)] ${
        compact ? 'px-3 py-2' : 'sticky top-0 px-4 py-3'
      }`}
      style={{
        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)',
      }}
    >
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/8 blur-2xl"
        aria-hidden
      />

      <div className="relative flex items-center gap-3">
        <button
          type="button"
          onClick={handleBack}
          className={`flex shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/15 text-white backdrop-blur-md transition-transform hover:-translate-x-0.5 ${
            compact ? 'h-9 w-9' : 'h-[42px] w-[42px]'
          }`}
          aria-label="Back to editor"
        >
          <ChevronLeft size={compact ? 18 : 20} strokeWidth={2.2} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
            Crossword Puzzle
          </p>
          <h1
            className={`truncate font-display font-extrabold text-white ${
              compact ? 'text-base' : 'text-xl'
            }`}
            style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}
          >
            🧬 {title}
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <ScorePill value={score} />
          <Stars earned={starsEarned} />
          <PanelCollapseButton variant="inverse" />
        </div>
      </div>
    </header>
  )
}
