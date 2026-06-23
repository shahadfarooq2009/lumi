import type { LucideIcon } from 'lucide-react'

interface IconGlassButtonProps {
  icon: LucideIcon
  ariaLabel: string
  size?: 'default' | 'sm'
  onClick?: () => void
}

export function IconGlassButton({ icon: Icon, ariaLabel, size = 'default', onClick }: IconGlassButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={size === 'sm' ? 'fc-icon-btn fc-icon-btn--sm' : 'fc-icon-btn'}
    >
      <Icon strokeWidth={2.2} />
    </button>
  )
}
