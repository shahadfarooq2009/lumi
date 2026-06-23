interface ProgressCardProps {
  solvedCount: number
  totalWords: number
}

export function ProgressCard({ solvedCount, totalWords }: ProgressCardProps) {
  const pct = totalWords > 0 ? (solvedCount / totalWords) * 100 : 0

  return (
    <div className="rounded-2xl border border-brand-soft bg-gradient-to-br from-brand-softer to-white p-3.5 px-4 shadow-[inset_0_-2px_0_rgba(124,58,237,0.06)]">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="font-display text-[11.5px] font-bold uppercase tracking-[0.06em] text-brand-deep">
          Progress
        </span>
        <span className="font-mono text-[13px] font-bold text-brand">
          {solvedCount} / {totalWords}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-brand/12">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-light to-brand shadow-[0_0_8px_#a78bfa] transition-all duration-400"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
