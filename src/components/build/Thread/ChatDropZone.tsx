import { Upload } from 'lucide-react'

interface ChatDropZoneProps {
  onSelect: () => void
  disabled?: boolean
}

export function ChatDropZone({ onSelect, disabled = false }: ChatDropZoneProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="group flex w-full items-center gap-3.5 rounded-[14px] border-2 border-dashed border-border bg-[#f5f5f8] px-4 py-4 text-left transition-colors hover:border-brand hover:bg-[#efeff3] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-brand-glow">
        <Upload size={20} strokeWidth={2.2} />
      </div>
      <div>
        <div className="font-display text-sm font-bold text-ink">Drop a file here</div>
        <div className="text-[13px] text-ink-dim">
          or{' '}
          <span className="font-semibold text-brand underline decoration-brand-soft underline-offset-2">
            browse
          </span>{' '}
          your device · PDF, DOCX, PPTX, TXT
        </div>
      </div>
    </button>
  )
}
