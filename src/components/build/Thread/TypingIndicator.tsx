import { AiAvatar } from './AiAvatar'

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar size="lg" />
      <div className="min-w-0 flex-1">
        <p className="mb-2 font-display text-sm font-bold text-ink">Quizora</p>
        <div className="relative inline-flex items-center gap-1 rounded-2xl rounded-tl-md border border-border-soft bg-white px-4 py-3.5 shadow-sm-soft">
          <span
            aria-hidden
            className="absolute -left-1.5 top-3.5 h-3 w-3 rotate-45 border-b border-l border-border-soft bg-white"
          />
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-muted/35 [animation-delay:0ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-muted/35 [animation-delay:140ms]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-ink-muted/35 [animation-delay:280ms]" />
        </div>
      </div>
    </div>
  )
}
