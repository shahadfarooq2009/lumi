import { Check, Clock, FileQuestion, Square } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { SavedQuizProject } from '../../../lib/savedProjects'
import { arabicFontClass } from '../../../lib/arabicFont'
import { GAMES } from '../../../games/registry/games'
import { ProjectMenu } from './ProjectMenu'

function getProjectMeta(gameMode?: string) {
  const key = gameMode || 'quiz'
  const game = GAMES.find((g) => g.key === key) ?? GAMES.find((g) => g.key === 'quiz')
  return {
    label: game?.title ?? 'Quiz',
    image: game?.image ?? '/assets/games/quiz.png',
  }
}

function formatRelativeDate(iso: string) {
  try {
    const date = new Date(iso)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`

    return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(date)
  } catch {
    return iso
  }
}

interface ArchivedProjectCardProps {
  project: SavedQuizProject
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  selectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  onRestore?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
}

export function ArchivedProjectCard({
  project,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  selectMode = false,
  isSelected = false,
  onToggleSelect,
  onRestore,
  onDelete,
  onSelect,
}: ArchivedProjectCardProps) {
  const navigate = useNavigate()
  const { label, image } = getProjectMeta(project.gameMode)

  const openRow = () => {
    if (selectMode) {
      onToggleSelect?.(project.id)
      return
    }
    navigate(`/game/${project.id}/overview`)
  }

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={openRow}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openRow()
        }
      }}
      className={`group relative flex items-center gap-3 rounded-[18px] border bg-white p-3.5 transition-all duration-200 sm:gap-4 sm:p-4 ${
        isSelected
          ? 'border-[#7C4DFF] bg-[#FAF8FF] shadow-[0_8px_24px_-16px_rgba(124,77,255,0.28)]'
          : 'border-[#ECE7FB] shadow-[0_4px_18px_-10px_rgba(27,21,48,0.08)] hover:border-[#D4C4FF] hover:bg-[#FDFCFF] hover:shadow-[0_12px_28px_-14px_rgba(124,77,255,0.16)]'
      } ${isMenuOpen ? 'z-50' : ''}`}
    >
      {selectMode ? (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onToggleSelect?.(project.id)
          }}
          aria-pressed={isSelected}
          aria-label={isSelected ? 'Deselect project' : 'Select project'}
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 transition-colors ${
            isSelected
              ? 'border-[#7C4DFF] bg-[#7C4DFF] text-white'
              : 'border-[#D4C4FF] bg-white text-transparent hover:border-[#7C4DFF]'
          }`}
        >
          {isSelected ? (
            <Check size={14} strokeWidth={3} />
          ) : (
            <Square size={14} className="text-[#D4C4FF]" />
          )}
        </button>
      ) : null}

      <div className="relative h-[68px] w-[96px] shrink-0 overflow-hidden rounded-[14px] sm:h-[72px] sm:w-[104px]">
        <img src={image} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)',
          }}
        />
        <span className="absolute bottom-1.5 left-1.5 rounded-md bg-white/90 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-[#7C4DFF] backdrop-blur-sm">
          {label.split(' ')[0]}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2
            className={arabicFontClass(
              project.title,
              'truncate font-display text-[15px] font-bold text-[#1B1530] sm:text-[16px]',
            )}
          >
            {project.title}
          </h2>
          <span className="hidden rounded-full bg-[#F3EEFF] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#7C4DFF] sm:inline">
            Archived
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] font-medium text-[#6B6585]">
          <span className="inline-flex items-center gap-1">
            <FileQuestion size={12} className="text-[#9B94B0]" />
            {project.questionCount} question{project.questionCount === 1 ? '' : 's'}
          </span>
          <span className="text-[#D4C4FF]">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={12} className="text-[#9B94B0]" />
            {formatRelativeDate(project.updatedAt)}
          </span>
        </div>
      </div>

      <div
        className="shrink-0"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <ProjectMenu
          project={project}
          isOpen={isMenuOpen}
          onToggle={onToggleMenu}
          onClose={onCloseMenu}
          menuVariant="archive"
          selectMode={selectMode}
          onRestore={onRestore}
          onDelete={onDelete}
          onSelect={onSelect}
        />
      </div>
    </article>
  )
}
