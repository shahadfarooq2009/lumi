import { Copy, Expand, List } from 'lucide-react'

interface OutlineQuestion {
  num: string
  title: string
  meta: string
  accent?: boolean
}

interface OutlineCardProps {
  title?: string
  questions: OutlineQuestion[]
}

export function OutlineCard({ title = 'Questions preview', questions }: OutlineCardProps) {
  return (
    <div className="overflow-hidden rounded-[18px] border border-border bg-white shadow-sm">
      <div className="flex items-center gap-2.5 border-b border-border-soft px-4 py-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-softer text-brand">
          <List size={14} strokeWidth={2.2} />
        </div>
        <h3 className="flex-1 font-display text-sm font-bold text-ink">{title}</h3>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-dim hover:bg-surface-soft hover:text-ink"
          title="Copy"
        >
          <Copy size={14} />
        </button>
        <button
          type="button"
          className="flex h-7 w-7 items-center justify-center rounded-md text-ink-dim hover:bg-surface-soft hover:text-ink"
          title="Expand"
        >
          <Expand size={14} />
        </button>
      </div>
      <div className="max-h-[380px] space-y-3.5 overflow-y-auto p-4">
        {questions.map((q) => (
          <div key={q.num} className="grid grid-cols-[44px_1fr] gap-3">
            <span
              className={`flex h-6 w-[38px] items-center justify-center rounded-[7px] font-mono text-[11px] font-bold ${
                q.accent ? 'bg-brand-soft text-brand-deep' : 'bg-surface-soft text-ink-dim'
              }`}
            >
              {q.num}
            </span>
            <div>
              <div className="mb-0.5 font-display text-[13px] font-bold leading-snug text-ink">{q.title}</div>
              <div className="text-[11.5px] text-ink-muted">{q.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
