import { Check, Clock, Pencil, Play, Square } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import type { SavedQuizProject } from '../../../lib/savedProjects'
import { arabicFontClass } from '../../../lib/arabicFont'
import { GAMES } from '../data/games'
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

interface ProjectCardProps {
  project: SavedQuizProject
  isMenuOpen: boolean
  onToggleMenu: () => void
  onCloseMenu: () => void
  menuVariant?: 'default' | 'archive'
  hideMenu?: boolean
  selectMode?: boolean
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  onArchive?: (id: string) => void
  onRestore?: (id: string) => void
  onDelete?: (id: string) => void
  onSelect?: (id: string) => void
}

export function ProjectCard({
  project,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  menuVariant = 'default',
  hideMenu = false,
  selectMode = false,
  isSelected = false,
  onToggleSelect,
  onArchive,
  onRestore,
  onDelete,
  onSelect,
}: ProjectCardProps) {
  const navigate = useNavigate()
  const { label, image } = getProjectMeta(project.gameMode)

  const openOverview = () => {
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
      onClick={openOverview}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          openOverview()
        }
      }}
      className={`cursor-pointer overflow-hidden rounded-[20px] bg-white shadow-[0_4px_18px_-6px_rgba(124,77,255,0.07)] transition-shadow duration-300 [transform:translateZ(0)] group-hover:shadow-[0_12px_32px_-10px_rgba(124,77,255,0.14)] ${
        isMenuOpen ? 'relative z-50' : ''
      } ${isSelected ? 'ring-2 ring-[#7C4DFF] ring-offset-2' : ''}`}
    >
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-[20px]">
        {selectMode ? (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onToggleSelect?.(project.id)
            }}
            aria-pressed={isSelected}
            aria-label={isSelected ? 'Deselect project' : 'Select project'}
            className={`absolute left-3 top-3 z-30 grid h-6 w-6 place-items-center rounded-md border-2 transition-colors ${
              isSelected
                ? 'border-[#7C4DFF] bg-[#7C4DFF] text-white'
                : 'border-white/80 bg-white/90 text-transparent hover:border-[#7C4DFF]'
            }`}
          >
            {isSelected ? (
              <Check size={14} strokeWidth={3} />
            ) : (
              <Square size={14} className="text-[#D4C4FF]" />
            )}
          </button>
        ) : null}
        <img
          src={image}
          alt=""
          className="h-full w-full rounded-t-[20px] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1B1530]/55 via-[#1B1530]/10 to-transparent" />
        <span className={`absolute top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#7C4DFF] backdrop-blur-sm ${selectMode ? 'left-12' : 'left-3'}`}>
          {label}
        </span>
        {!hideMenu ? (
          <div
            className="absolute right-2 top-2 z-20 rounded-full bg-white/90 shadow-sm backdrop-blur-sm"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <ProjectMenu
              project={project}
              isOpen={isMenuOpen}
              onToggle={onToggleMenu}
              onClose={onCloseMenu}
              menuVariant={menuVariant}
              selectMode={selectMode}
              onArchive={onArchive}
              onRestore={onRestore}
              onDelete={onDelete}
              onSelect={onSelect}
            />
          </div>
        ) : null}
        <h2
          className={arabicFontClass(
            project.title,
            'absolute bottom-3 left-3 right-12 font-display text-[17px] font-bold leading-tight text-white drop-shadow-sm',
          )}
        >
          {project.title}
        </h2>
      </div>

      <div className="flex flex-col gap-3 px-[18px] pb-5 pt-4">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] font-medium text-[#6B6585]">
          <span>
            {project.questionCount} question{project.questionCount === 1 ? '' : 's'}
          </span>
          <span className="text-[#D4C4FF]">·</span>
          <span className="inline-flex items-center gap-1">
            <Clock size={11} />
            {formatRelativeDate(project.updatedAt)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              navigate(`/game/${project.id}/play`)
            }}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#9A6BFF] px-3 py-2.5 text-[13px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(124,77,255,0.5)] transition-all hover:-translate-y-px"
          >
            <Play size={14} fill="currentColor" strokeWidth={0} />
            Play
          </button>
          <Link
            to={`/build/${project.id}`}
            onClick={(event) => event.stopPropagation()}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#F6F2FF] px-3 py-2.5 text-[13px] font-bold text-[#7C4DFF] transition-colors hover:bg-[#EDE5FF]"
          >
            <Pencil size={14} strokeWidth={2.2} />
            Edit
          </Link>
        </div>
      </div>
    </article>
  )
}
