import { Copy, MoreHorizontal, RotateCw, SquareArrowOutUpRight, ThumbsDown, ThumbsUp } from 'lucide-react'

const ACTIONS = [
  { icon: Copy, label: 'Copy' },
  { icon: ThumbsUp, label: 'Good response' },
  { icon: ThumbsDown, label: 'Bad response' },
  { icon: SquareArrowOutUpRight, label: 'Share' },
  { icon: RotateCw, label: 'Regenerate' },
  { icon: MoreHorizontal, label: 'More' },
] as const

export function AiMessageActions() {
  return (
    <div className="mt-3 flex items-center gap-0.5">
      {ACTIONS.map(({ icon: Icon, label }) => (
        <button
          key={label}
          type="button"
          title={label}
          aria-label={label}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted/70 transition-colors hover:bg-black/[0.04] hover:text-ink-dim"
        >
          <Icon size={16} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  )
}
