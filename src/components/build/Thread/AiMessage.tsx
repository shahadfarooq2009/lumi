import type { ReactNode } from 'react'
import { AiAvatar } from './AiAvatar'
import { AiMessageActions } from './AiMessageActions'

interface AiMessageProps {
  body: ReactNode
  meta?: string
  children?: ReactNode
  showActions?: boolean
}

export function AiMessage({ body, meta, children, showActions = false }: AiMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <AiAvatar size="lg" />

      <div className="min-w-0 max-w-[calc(100%-3.75rem)] flex-1">
        <p className="mb-2 font-display text-sm font-bold text-ink">Quizora</p>

        <div className="relative rounded-2xl rounded-tl-md border border-border-soft bg-white px-4 py-3.5 shadow-sm-soft">
          <span
            aria-hidden
            className="absolute -left-1.5 top-3.5 h-3 w-3 rotate-45 border-b border-l border-border-soft bg-white"
          />
          <div className="text-[15px] leading-[1.75] text-ink [&_blockquote]:my-3 [&_blockquote]:border-l-2 [&_blockquote]:border-border-strong [&_blockquote]:pl-4 [&_blockquote]:text-ink-dim [&_li]:leading-[1.75] [&_p+p]:mt-3 [&_strong]:font-semibold [&_strong]:text-ink [&_ul]:my-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
            {body}
          </div>

          {meta ? <p className="mt-2.5 text-[13px] leading-relaxed text-ink-dim">{meta}</p> : null}
        </div>

        {children ? <div className="mt-5 space-y-3">{children}</div> : null}

        {showActions && !children ? (
          <div className="mt-3">
            <AiMessageActions />
          </div>
        ) : null}
      </div>
    </div>
  )
}
