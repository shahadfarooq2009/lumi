import {
  Archive,
  ArchiveRestore,
  BarChart2,
  Check,
  LayoutGrid,
  MoreVertical,
  Pencil,
  Trash2,
  Upload,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import type { SavedQuizProject } from '../../../lib/savedProjects'

const MENU_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'edit', label: 'Edit', icon: Pencil },
  { id: 'publish', label: 'Publish', icon: Upload },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'archive', label: 'Archive', icon: Archive },
] as const

interface ProjectMenuProps {
  project: SavedQuizProject
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  menuVariant?: 'default' | 'archive'
  selectMode?: boolean
  onArchive?: (id: string) => void
  onRestore?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
}

export function ProjectMenu({
  project,
  isOpen,
  onToggle,
  onClose,
  menuVariant = 'default',
  selectMode = false,
  onArchive,
  onRestore,
  onDelete,
  onSelect,
}: ProjectMenuProps) {
  const navigate = useNavigate()
  const menuRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number } | null>(null)

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) {
      setMenuStyle(null)
      return
    }

    const updatePosition = () => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const menuWidth = 168
      const left = Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8)
      setMenuStyle({
        top: rect.bottom + 6,
        left: Math.max(8, left),
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target) || buttonRef.current?.contains(target)) return
      onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [isOpen, onClose])

  const handleAction = (
    actionId: (typeof MENU_ITEMS)[number]['id'] | 'restore' | 'delete' | 'select',
  ) => {
    if (actionId === 'overview') {
      navigate(`/game/${project.id}/overview`)
    } else if (actionId === 'edit') {
      navigate(`/build/${project.id}`)
    } else if (actionId === 'archive') {
      onArchive?.(project.id)
    } else if (actionId === 'restore') {
      onRestore?.(project.id)
    } else if (actionId === 'delete') {
      onDelete?.(project.id)
    } else if (actionId === 'select') {
      onSelect?.(project.id)
    }
    onClose()
  }

  const menuItems =
    menuVariant === 'archive'
      ? ([
          { id: 'restore' as const, label: 'Restore', icon: ArchiveRestore },
          { id: 'delete' as const, label: 'Move to Trash', icon: Trash2 },
          {
            id: 'select' as const,
            label: selectMode ? 'Done selecting' : 'Select',
            icon: Check,
          },
        ] as const)
      : MENU_ITEMS

  const menuPanel =
    isOpen && menuStyle ? (
      <div
        ref={menuRef}
        role="menu"
        style={{ top: menuStyle.top, left: menuStyle.left }}
        className="fixed z-[200] min-w-[168px] overflow-hidden rounded-[14px] border border-[#ECE7FB] bg-white py-1.5 shadow-[0_20px_48px_-12px_rgba(27,21,48,0.28),0_8px_16px_-8px_rgba(27,21,48,0.12)]"
      >
        {menuItems.map((item) => {
          const Icon = item.icon
          const isDestructive = item.id === 'archive' || item.id === 'delete'
          const isRestore = item.id === 'restore'
          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                handleAction(item.id)
              }}
              className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-medium transition-colors hover:bg-[#F7F4FF] ${
                isDestructive
                  ? 'text-[#DC2626] hover:bg-red-50'
                  : isRestore
                    ? 'text-[#7C4DFF] hover:bg-[#FAF8FF]'
                    : 'text-[#1B1530]'
              }`}
            >
              <Icon
                size={15}
                strokeWidth={2.2}
                className={`shrink-0 ${
                  isDestructive
                    ? 'text-[#DC2626]'
                    : isRestore
                      ? 'text-[#7C4DFF]'
                      : 'text-[#6B6585]'
                }`}
              />
              {item.label}
            </button>
          )
        })}
      </div>
    ) : null

  return (
    <>
      <div className="relative shrink-0">
        <button
          ref={buttonRef}
          type="button"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onToggle()
          }}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Project options"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            isOpen
              ? 'bg-[#F0EBFF] text-[#7C4DFF]'
              : 'text-[#9B94B0] hover:bg-[#F7F4FF] hover:text-[#6B6585]'
          }`}
        >
          <MoreVertical size={18} strokeWidth={2.2} />
        </button>
      </div>
      {menuPanel ? createPortal(menuPanel, document.body) : null}
    </>
  )
}
