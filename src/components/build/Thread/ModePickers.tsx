import { Circle, Gift, Grid3X3, LayoutGrid, Layers } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface ModeChip {
  label: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

interface ModePickersProps {
  onSelect: (label: string) => void
  disabled?: boolean
}

const MODES: ModeChip[] = [
  { label: 'Circle Points', icon: Circle, iconBg: 'bg-blue-100', iconColor: 'text-game-info' },
  { label: 'Connect Four', icon: Grid3X3, iconBg: 'bg-emerald-100', iconColor: 'text-game-success' },
  { label: 'Crossword', icon: LayoutGrid, iconBg: 'bg-brand-soft', iconColor: 'text-brand' },
  { label: 'Mystery Box', icon: Gift, iconBg: 'bg-orange-100', iconColor: 'text-orange-500' },
  { label: 'Tower Progress', icon: Layers, iconBg: 'bg-red-100', iconColor: 'text-game-survival' },
]

export function ModePickers({ onSelect, disabled = false }: ModePickersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {MODES.map((mode) => {
        const Icon = mode.icon
        return (
          <button
            key={mode.label}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(mode.label)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white py-2 pl-2 pr-3.5 font-display text-[12.5px] font-bold text-ink-soft transition-all hover:-translate-y-px hover:border-brand-light hover:shadow-[0_4px_12px_-4px_rgba(124,58,237,0.25)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <span className={`flex h-6 w-6 items-center justify-center rounded-md ${mode.iconBg}`}>
              <Icon size={13} className={mode.iconColor} strokeWidth={2.2} />
            </span>
            {mode.label}
          </button>
        )
      })}
    </div>
  )
}
