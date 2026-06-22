import { Zap } from 'lucide-react'
import { PulseRing } from '../shared/PulseRing'
import {
  BUILD_PROGRESS_PERCENT,
  BUILD_QUESTIONS_CURRENT,
  BUILD_QUESTIONS_TOTAL,
} from '../../../data/buildProgress'

interface ProgressStripProps {
  current?: number
  total?: number
  progress?: number
}

export function ProgressStrip({
  current = BUILD_QUESTIONS_CURRENT,
  total = BUILD_QUESTIONS_TOTAL,
  progress = BUILD_PROGRESS_PERCENT,
}: ProgressStripProps) {
  return (
    <div
      className="flex items-center gap-3 rounded-[14px] border border-brand-soft px-4 py-3"
      style={{ background: 'linear-gradient(135deg, #faf7ff 0%, #f0e9ff 100%)' }}
    >
      <PulseRing className="rounded-lg">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-brand-soft bg-white text-brand">
          <Zap size={16} strokeWidth={2.2} fill="currentColor" />
        </div>
      </PulseRing>
      <div className="min-w-0 flex-1 text-[13px] text-ink-soft">
        Generating{' '}
        <strong className="font-bold text-brand-deep">
          {current} of {total}
        </strong>{' '}
        questions
      </div>
      <div className="h-1.5 w-[90px] overflow-hidden rounded-full bg-brand/15">
        <div
          className="h-full rounded-full bg-brand shadow-[0_0_8px_rgba(167,139,250,0.6)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
