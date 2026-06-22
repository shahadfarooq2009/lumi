import { AiAvatar } from './AiAvatar'

interface QuestionBubbleProps {
  num: string
  title: string
  meta: string
  accent?: boolean
  settled?: boolean
}

export function QuestionBubble({ num, title, meta, accent, settled }: QuestionBubbleProps) {
  return (
    <div className="flex gap-3">
      <AiAvatar />
      <div className="min-w-0 max-w-[88%] flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <span className="font-display text-sm font-bold text-ink">Quizora AI</span>
          {!settled ? (
            <span className="rounded-full bg-brand-softer px-2 py-0.5 text-[10px] font-semibold text-brand-deep">
              New question
            </span>
          ) : null}
        </div>
        <div className="rounded-2xl rounded-tl-md border border-border bg-white px-4 py-3 shadow-sm">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`inline-flex h-6 min-w-[38px] items-center justify-center rounded-[7px] px-1.5 font-mono text-[11px] font-bold ${
                accent ? 'bg-brand-soft text-brand-deep' : 'bg-surface-soft text-ink-dim'
              }`}
            >
              {num}
            </span>
            <span className="text-[11.5px] text-ink-muted">{meta}</span>
          </div>
          <p className="font-display text-[14px] font-bold leading-snug text-ink">{title}</p>
        </div>
      </div>
    </div>
  )
}
