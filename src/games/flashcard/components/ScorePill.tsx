import { ChevronDown, Star } from 'lucide-react'

interface ScorePillProps {
  value: number
}

export function ScorePill({ value }: ScorePillProps) {
  return (
    <button type="button" className="fc-score-pill" aria-label="Score">
      <span className="fc-score-pill__star">
        <Star fill="currentColor" strokeWidth={0} />
      </span>
      <span className="fc-score-pill__value">{value}</span>
      <span className="fc-score-pill__chev">
        <ChevronDown strokeWidth={2.4} />
      </span>
    </button>
  )
}
