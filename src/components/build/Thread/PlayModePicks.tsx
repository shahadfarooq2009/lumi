import { PLAY_MODE_OPTIONS } from '../../../lib/playModeOptions'

interface PlayModePicksProps {
  onSelect: (label: string) => void
  disabled?: boolean
  selectedAnswer?: string
}

function pickMatchesAnswer(label: string, answer?: string) {
  if (!answer) return false
  const lower = answer.toLowerCase()
  if (label.toLowerCase().includes('solo')) {
    return lower.includes('solo') || lower.includes('your own')
  }
  return lower.includes('class')
}

function selectedButtonClass(isSelected: boolean, locked: boolean) {
  if (isSelected) {
    return 'border-brand bg-brand-soft ring-2 ring-brand/20'
  }
  if (locked) {
    return 'opacity-50'
  }
  return 'hover:border-dashed hover:border-brand hover:bg-brand-soft/70'
}

export function PlayModePicks({ onSelect, disabled = false, selectedAnswer }: PlayModePicksProps) {
  const locked = Boolean(selectedAnswer)

  return (
    <div className="w-full rounded-2xl bg-white p-3">
      <div className="flex w-full flex-col gap-2.5">
        {PLAY_MODE_OPTIONS.map((option) => {
          const Icon = option.icon
          const isSelected = pickMatchesAnswer(option.label, selectedAnswer)

          return (
            <button
              key={option.id}
              type="button"
              disabled={disabled}
              aria-disabled={locked || disabled}
              onClick={() => {
                if (locked || disabled) return
                onSelect(option.label)
              }}
              className={`relative flex w-full items-center gap-3.5 rounded-xl border-2 border-border-strong bg-brand-softer px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed ${selectedButtonClass(isSelected, locked)}`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${option.iconBg}`}
              >
                <Icon size={20} className={option.iconColor} strokeWidth={2.2} />
              </div>
              <span className="min-w-0 flex-1">
                <span className="block font-display text-[13px] font-bold text-ink">{option.label}</span>
                <span className="mt-0.5 block text-[11px] font-normal text-ink-dim">{option.sub}</span>
              </span>
              {option.hint ? (
                <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-deep">
                  {option.hint}
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
