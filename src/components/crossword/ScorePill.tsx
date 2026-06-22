interface ScorePillProps {
  value: number
}

export function ScorePill({ value }: ScorePillProps) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/25 bg-white/15 py-2 pl-2.5 pr-3.5 backdrop-blur-md">
      <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-[11px] font-bold text-amber-950 shadow-sm">
        ★
      </span>
      <span className="font-mono text-[15px] font-bold tabular-nums text-white">{value}</span>
    </div>
  )
}
