import type { LucideIcon } from 'lucide-react'

interface NavCircleButtonProps {
  icon: LucideIcon
  label: string
  onClick: () => void
}

export function NavCircleButton({ icon: Icon, label, onClick }: NavCircleButtonProps) {
  return (
    <div className="fc-nav-circle">
      <button type="button" aria-label={label} onClick={onClick} className="fc-nav-circle__btn">
        <Icon strokeWidth={2.2} />
      </button>
      <span className="fc-nav-circle__label">{label}</span>
    </div>
  )
}
