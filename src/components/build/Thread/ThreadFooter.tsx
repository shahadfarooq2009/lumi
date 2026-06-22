import { Mic, Paperclip, Send } from 'lucide-react'

export function ThreadFooter() {
  return (
    <div className="relative z-10 shrink-0 bg-surface-bg px-8 pb-6 pt-4">
      <div className="mx-auto max-w-[760px] rounded-2xl border border-border bg-white px-3.5 pb-2.5 pt-3.5 shadow-[0_4px_20px_-6px_rgba(20,14,38,0.1)]">
        <textarea
          className="min-h-9 w-full resize-none border-0 bg-transparent text-sm text-ink outline-none placeholder:text-ink-muted"
          placeholder="Ask Quizora to tweak the game, add a question, or change the theme…"
          rows={1}
        />
        <div className="mt-2 flex items-center justify-between border-t border-border-soft pt-2">
          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-brand-softer hover:text-brand"
              title="Attach"
            >
              <Paperclip size={15} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="flex h-7 w-7 items-center justify-center rounded-md text-ink-dim transition-colors hover:bg-brand-softer hover:text-brand"
              title="Voice"
            >
              <Mic size={15} strokeWidth={2} />
            </button>
          </div>
          <button
            type="button"
            className="flex h-[30px] w-[30px] items-center justify-center rounded-xl bg-ink text-white transition-all hover:scale-105 hover:bg-brand"
            title="Send"
          >
            <Send size={14} strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </div>
  )
}
