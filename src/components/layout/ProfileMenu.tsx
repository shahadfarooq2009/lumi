import { useEffect, useMemo, useRef, useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Archive, Moon, Settings, Sparkles, Sun, UserCog } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../contexts/ThemeContext'
import { useSettingsModal } from '../../contexts/SettingsModalContext'

export type ProfileMenuAction = 'theme' | 'settings' | 'upgrade' | 'account' | 'archive'

interface ProfileMenuProps {
  initials?: string
  size?: 'sm' | 'md'
  variant?: 'soft' | 'brand'
  showOnlineDot?: boolean
  onAction?: (action: ProfileMenuAction) => void
}

export function ProfileMenu({
  initials = 'F',
  size = 'md',
  variant = 'soft',
  showOnlineDot = false,
  onAction,
}: ProfileMenuProps) {
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useTheme()
  const { openSettings } = useSettingsModal()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const menuItems = useMemo(
    (): {
      id: ProfileMenuAction
      label: string
      icon: LucideIcon
      destructive?: boolean
    }[] => [
      { id: 'theme', label: isDark ? 'Light' : 'Dark', icon: isDark ? Sun : Moon },
      { id: 'settings', label: 'Settings', icon: Settings },
      { id: 'upgrade', label: 'Upgrade', icon: Sparkles },
      { id: 'account', label: 'Manage account', icon: UserCog },
      { id: 'archive', label: 'Archive', icon: Archive, destructive: true },
    ],
    [isDark],
  )

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node
      if (ref.current && !ref.current.contains(target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [open])

  const handleItemClick = (id: ProfileMenuAction) => {
    if (id === 'theme') {
      toggleTheme()
    } else if (id === 'account') {
      navigate('/account')
      onAction?.(id)
    } else if (id === 'archive') {
      navigate('/archive')
      onAction?.(id)
    } else if (id === 'upgrade') {
      navigate('/pricing')
      onAction?.(id)
    } else if (id === 'settings') {
      openSettings()
      onAction?.(id)
    } else {
      onAction?.(id)
    }
    setOpen(false)
  }

  const sizeClass = size === 'sm' ? 'h-9 w-9 text-sm' : 'h-[38px] w-[38px] text-[14px]'

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Profile menu"
        className={`relative grid place-items-center rounded-full font-bold text-white shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)] transition-transform hover:scale-105 ${sizeClass} ${
          variant === 'brand'
            ? 'bg-gradient-to-br from-brand-light to-brand font-display'
            : ''
        }`}
        style={
          variant === 'soft'
            ? { background: 'linear-gradient(135deg, #FFD3E2, #B388FF)' }
            : undefined
        }
      >
        {initials}
        {showOnlineDot ? (
          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-[#22C58B]" />
        ) : null}
      </button>

      {open ? (
        <div
          role="menu"
          aria-label="Profile menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[210px] overflow-hidden rounded-xl border border-[#EDE5FF] bg-white py-1.5 shadow-[0_12px_40px_-12px_rgba(28,24,58,0.18)] dark:border-[#2d2640] dark:bg-[#1a1628] dark:shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]"
        >
          {menuItems.map(({ id, label, icon: Icon, destructive }) => (
            <button
              key={id}
              type="button"
              role="menuitem"
              onClick={() => handleItemClick(id)}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors ${
                destructive
                  ? 'text-[#DC2626] hover:bg-red-50 dark:hover:bg-red-950/40'
                  : 'text-[#4A4560] hover:bg-[#FAF8FF] hover:text-[#7C4DFF] dark:text-[#c4bdd8] dark:hover:bg-[#2a2240] dark:hover:text-[#B388FF]'
              }`}
            >
              <Icon
                size={16}
                strokeWidth={2}
                className={`shrink-0 ${destructive ? 'text-[#DC2626]' : 'text-[#9B94B0] dark:text-[#7a7394]'}`}
              />
              {label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
