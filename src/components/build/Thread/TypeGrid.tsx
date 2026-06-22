import {
  CheckCircle2,
  CheckSquare,
  Columns2,
  Sparkles,
  Underline,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface TypeCard {
  title: string
  sub: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
  featured?: boolean
}

interface TypeGridProps {
  onSelect: (title: string) => void
  disabled?: boolean
  selectedTitle?: string
}

const TYPE_CARDS: TypeCard[] = [
  {
    title: 'Multiple Choice',
    sub: '4 options per question',
    icon: CheckCircle2,
    iconBg: 'bg-blue-100',
    iconColor: 'text-game-info',
  },
  {
    title: 'True / False',
    sub: 'Quick yes-or-no checks',
    icon: CheckSquare,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-game-success',
  },
  {
    title: 'Fill in the Blank',
    sub: 'Complete the sentence',
    icon: Underline,
    iconBg: 'bg-amber-100',
    iconColor: 'text-game-fantasy',
  },
  {
    title: 'Matching',
    sub: 'Pair terms & definitions',
    icon: Columns2,
    iconBg: 'bg-pink-100',
    iconColor: 'text-game-arena',
  },
  {
    title: 'Mixed Questions',
    sub: 'Best variety for learning',
    icon: Sparkles,
    iconBg: 'bg-brand-soft',
    iconColor: 'text-brand',
    featured: true,
  },
]

function typeMatchesAnswer(title: string, answer?: string) {
  if (!answer) return false
  if (title === 'Mixed Questions') return answer.includes('Mixed')
  return answer === title || answer.startsWith(title)
}

function typeButtonClass(isSelected: boolean, locked: boolean) {
  if (isSelected) {
    return 'border-brand bg-brand-soft ring-2 ring-brand/20'
  }
  if (locked) {
    return 'opacity-50'
  }
  return 'hover:border-dashed hover:border-brand hover:bg-brand-soft/70'
}

export function TypeGrid({ onSelect, disabled = false, selectedTitle }: TypeGridProps) {
  const locked = Boolean(selectedTitle)

  return (
    <div className="w-full rounded-2xl bg-white p-3">
      <div className="flex w-full flex-col gap-2.5">
        {TYPE_CARDS.map((card) => {
          const Icon = card.icon
          const isSelected = typeMatchesAnswer(card.title, selectedTitle)

          return (
            <button
              key={card.title}
              type="button"
              disabled={disabled}
              aria-disabled={locked || disabled}
              onClick={() => {
                if (locked || disabled) return
                onSelect(card.title)
              }}
              className={`relative flex w-full items-center gap-3.5 rounded-xl border-2 border-border-strong bg-brand-softer px-4 py-3.5 text-left transition-all disabled:cursor-not-allowed ${typeButtonClass(isSelected, locked)}`}
            >
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${card.iconBg}`}>
                <Icon size={16} className={card.iconColor} strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-[13px] font-bold text-ink">{card.title}</div>
                <div className="text-[11px] text-ink-dim">{card.sub}</div>
              </div>
              {card.featured ? (
                <span className="shrink-0 rounded-full bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Recommended
                </span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
