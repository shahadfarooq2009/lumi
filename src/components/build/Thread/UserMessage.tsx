import { FileText } from 'lucide-react'

interface UserMessageProps {
  bubble: string
  pill?: string
  attachment?: {
    type: 'PDF' | 'DOCX' | 'PPTX' | 'TXT'
    name: string
    meta: string
  }
}

export function UserMessage({ bubble, pill, attachment }: UserMessageProps) {
  return (
    <div className="ml-auto flex max-w-[85%] flex-col items-end gap-2">
      {attachment ? (
        <div className="flex w-full min-w-[220px] max-w-[320px] items-center gap-3 rounded-xl border border-dashed border-brand/30 bg-brand-softer/60 px-3 py-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-brand/15 bg-white text-brand">
            <FileText size={16} strokeWidth={2.2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-ink">{attachment.name}</div>
            <div className="text-xs text-ink-muted">
              {attachment.type} · {attachment.meta}
            </div>
          </div>
        </div>
      ) : null}
      <div className="rounded-full bg-brand px-5 py-2.5 text-[15px] leading-relaxed text-white">
        {pill ? (
          <span className="mb-1 mr-2 inline-block rounded-full bg-white/20 px-2 py-0.5 text-xs font-medium text-white">
            {pill}
          </span>
        ) : null}
        {bubble}
      </div>
    </div>
  )
}
