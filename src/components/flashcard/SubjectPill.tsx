import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'

interface SubjectPillProps {
  label: string
  icon: LucideIcon
}

export function SubjectPill({ label, icon: Icon }: SubjectPillProps) {
  return (
    <button type="button" className="fc-subject-pill" aria-label="Choose subject">
      <Icon strokeWidth={1.8} />
      {label}
      <ChevronDown width={14} height={14} strokeWidth={2.4} style={{ opacity: 0.8 }} />
    </button>
  )
}
