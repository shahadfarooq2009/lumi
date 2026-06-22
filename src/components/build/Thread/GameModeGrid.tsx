import { GAME_MODE_OPTIONS } from '../../../lib/playModeOptions'

interface GameModeGridProps {
  onSelect: (title: string) => void
  disabled?: boolean
  selectedTitle?: string
}

function modeMatchesAnswer(title: string, answer?: string) {
  if (!answer) return false
  return answer.includes(title)
}

function modeButtonClass(isSelected: boolean, locked: boolean) {
  if (isSelected) {
    return 'border-brand bg-brand-soft ring-2 ring-brand/20'
  }
  if (locked) {
    return 'opacity-50'
  }
  return 'hover:border-dashed hover:border-brand hover:bg-brand-soft/70'
}

export function GameModeGrid({ onSelect, disabled = false, selectedTitle }: GameModeGridProps) {
  const locked = Boolean(selectedTitle)

  return (
    <div className="w-full rounded-2xl bg-white p-3">
      <div className="grid w-full grid-cols-1 gap-2.5 sm:grid-cols-2">
        {GAME_MODE_OPTIONS.map((mode) => {
          const Icon = mode.icon
          const isSelected = modeMatchesAnswer(mode.title, selectedTitle)

          return (
            <button
              key={mode.title}
              type="button"
              disabled={disabled}
              aria-disabled={locked || disabled}
              onClick={() => {
                if (locked || disabled) return
                onSelect(mode.title)
              }}
              className={`relative flex w-full flex-col items-start gap-2 rounded-xl border-2 border-border-strong bg-brand-softer px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed ${modeButtonClass(isSelected, locked)}`}
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${mode.iconBg}`}>
                <Icon size={18} className={mode.iconColor} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <div className="font-display text-[13px] font-bold text-ink">{mode.title}</div>
                <div className="text-[11px] leading-snug text-ink-dim">{mode.sub}</div>
              </div>
              {mode.featured ? (
                <span className="absolute right-3 top-3 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                  Popular
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
