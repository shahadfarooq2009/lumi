import { ArrowRight, Check, Lightbulb, RefreshCw } from 'lucide-react'

interface ControlsProps {
  hintsRemaining: number
  onHint: () => void
  onCheck: () => void
  onReset: () => void
  onNext: () => void
}

const chunky =
  'inline-flex items-center justify-center gap-1.5 rounded-[14px] border px-[18px] py-2.5 font-display text-[13.5px] font-bold tracking-[-0.005em] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0'

export function Controls({
  hintsRemaining,
  onHint,
  onCheck,
  onReset,
  onNext,
}: ControlsProps) {
  return (
    <div className="flex w-full max-w-[560px] flex-wrap items-center justify-center gap-2 max-sm:gap-1.5">
      <button
        type="button"
        onClick={onHint}
        disabled={hintsRemaining === 0}
        className={`${chunky} border-amber-200 bg-gradient-to-b from-amber-50 to-amber-100 text-amber-900 shadow-[0_3px_0_0_#fbbf24,0_4px_10px_-3px_rgba(251,191,36,0.35),inset_0_1px_0_rgba(255,255,255,0.9)]`}
      >
        <Lightbulb size={15} strokeWidth={2.2} />
        Hint
        <span className="font-mono text-[11px] opacity-80">{hintsRemaining}</span>
      </button>

      <button
        type="button"
        onClick={onCheck}
        className={`${chunky} border-emerald-200 bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-900 shadow-[0_3px_0_0_#34d399,0_4px_10px_-3px_rgba(52,211,153,0.35),inset_0_1px_0_rgba(255,255,255,0.9)]`}
      >
        <Check size={15} strokeWidth={2.2} />
        Check Answer
      </button>

      <button
        type="button"
        onClick={onReset}
        className={`${chunky} border-border-strong bg-white text-state-danger shadow-[0_3px_0_0_#dcd5ea,0_4px_10px_-3px_rgba(20,14,38,0.08),inset_0_1px_0_rgba(255,255,255,0.9)]`}
      >
        <RefreshCw size={15} strokeWidth={2.2} />
        Reset
      </button>

      <button
        type="button"
        onClick={onNext}
        className={`${chunky} border-brand-deep bg-brand text-white shadow-[0_4px_0_0_#5b21b6,0_8px_20px_-6px_rgba(124,58,237,0.45),inset_0_1px_0_rgba(255,255,255,0.2)]`}
      >
        Next Puzzle
        <ArrowRight size={15} strokeWidth={2.2} />
      </button>
    </div>
  )
}
