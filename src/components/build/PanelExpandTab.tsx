import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { useWorkspacePanelOptional } from '../../contexts/WorkspacePanelContext'

export function PanelExpandTab() {
  const panel = useWorkspacePanelOptional()

  if (!panel?.canTogglePanel || panel.isPanelOpen) return null

  return (
    <button
      type="button"
      onClick={panel.openPanel}
      aria-label="Show editor panel"
      title="Show editor"
      className="absolute right-0 top-1/2 z-40 flex h-14 w-9 -translate-y-1/2 items-center justify-center rounded-l-2xl border border-r-0 border-border bg-white text-brand shadow-lg transition-colors hover:bg-brand-softer"
    >
      <PanelRightOpen size={18} strokeWidth={2.2} />
    </button>
  )
}

export function PanelCollapseButton({
  className = '',
  variant = 'default',
  size = 'default',
}: {
  className?: string
  variant?: 'default' | 'inverse'
  size?: 'default' | 'lg'
}) {
  const panel = useWorkspacePanelOptional()

  if (!panel?.canTogglePanel || !panel.isPanelOpen) return null

  const variantClasses =
    variant === 'inverse'
      ? 'border-white/20 bg-white/15 text-white hover:border-white/30 hover:bg-white/25 hover:text-white'
      : 'border-border bg-white text-ink-dim hover:border-brand-soft hover:bg-brand-softer hover:text-brand-deep'

  const sizeClasses = size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
  const iconSize = size === 'lg' ? 18 : 16

  return (
    <button
      type="button"
      onClick={panel.closePanel}
      aria-label="Hide editor panel"
      title="Hide editor"
      className={`flex items-center justify-center rounded-lg border shadow-xs transition-all ${sizeClasses} ${variantClasses} ${className}`}
    >
      <PanelRightClose size={iconSize} strokeWidth={2.2} />
    </button>
  )
}
