import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Archive, ArchiveRestore, Trash2 } from 'lucide-react'
import {
  listArchivedQuizProjects,
  mergeQuizProjects,
  restoreQuizProjects,
  trashQuizProjects,
  type SavedQuizProject,
} from '../../../lib/savedProjects'
import { ArchivedProjectCard } from '../components/ArchivedProjectCard'
import { HistoryDeleteToast } from '../components/HistoryDeleteToast'
import { PageShell } from '../components/PageShell'

const UNDO_MS = 6000

export function ArchivedProjectsView() {
  const navigate = useNavigate()
  const location = useLocation()
  const [projects, setProjects] = useState<SavedQuizProject[]>(() => listArchivedQuizProjects())
  const [selectMode, setSelectMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set())
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [pendingDelete, setPendingDelete] = useState<{
    projects: SavedQuizProject[]
    timer: number
  } | null>(null)

  const refresh = useCallback(() => {
    setProjects(listArchivedQuizProjects())
  }, [])

  useEffect(() => {
    refresh()
  }, [location.key, refresh])

  const selectedCount = selectedIds.size
  const totalQuestions = projects.reduce((sum, project) => sum + project.questionCount, 0)

  const clearSelection = () => {
    setSelectedIds(new Set())
    setSelectMode(false)
  }

  const toggleSelected = (id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const getSelectedProjects = () => projects.filter((project) => selectedIds.has(project.id))

  const handleRestoreSelected = () => {
    const toRestore = getSelectedProjects()
    if (!toRestore.length) return
    restoreQuizProjects(toRestore.map((project) => project.id))
    clearSelection()
    navigate('/mygame')
  }

  const handleRestoreOne = (id: string) => {
    restoreQuizProjects([id])
    setOpenMenuId(null)
    navigate('/mygame')
  }

  const commitDelete = useCallback((toDelete: SavedQuizProject[]) => {
    if (!toDelete.length) return
    const ids = new Set(toDelete.map((project) => project.id))

    setProjects((current) => current.filter((project) => !ids.has(project.id)))
    trashQuizProjects(toDelete.map((project) => project.id))
    setOpenMenuId(null)
    clearSelection()

    setPendingDelete((current) => {
      if (current?.timer) window.clearTimeout(current.timer)
      const timer = window.setTimeout(() => {
        setPendingDelete(null)
      }, UNDO_MS)
      return { projects: toDelete, timer }
    })
  }, [])

  const handleDeleteSelected = () => {
    commitDelete(getSelectedProjects())
  }

  const handleDeleteOne = (id: string) => {
    const project = projects.find((entry) => entry.id === id)
    if (!project) return
    commitDelete([project])
  }

  const handleSelectFromMenu = (id: string) => {
    if (selectMode) {
      clearSelection()
      return
    }
    setSelectMode(true)
    setSelectedIds(new Set([id]))
    setOpenMenuId(null)
  }

  const handleUndo = () => {
    setPendingDelete((current) => {
      if (!current) return null
      window.clearTimeout(current.timer)
      mergeQuizProjects(current.projects.map((project) => ({ ...project, archived: true, trashed: false })))
      refresh()
      return null
    })
  }

  const handleDismissToast = () => {
    setPendingDelete((current) => {
      if (!current) return null
      window.clearTimeout(current.timer)
      return null
    })
  }

  useEffect(() => {
    return () => {
      if (pendingDelete?.timer) window.clearTimeout(pendingDelete.timer)
    }
  }, [pendingDelete?.timer])

  const headerAction =
    selectMode && selectedCount > 0 ? (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handleRestoreSelected}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#7C4DFF] bg-[#F6F2FF] px-3.5 py-2 text-[13px] font-bold text-[#7C4DFF] transition-colors hover:bg-[#EDE5FF]"
        >
          <ArchiveRestore size={15} strokeWidth={2.2} />
          Restore
        </button>
        <button
          type="button"
          onClick={handleDeleteSelected}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#FECACA] bg-red-50 px-3.5 py-2 text-[13px] font-bold text-[#DC2626] transition-colors hover:bg-red-100"
        >
          <Trash2 size={15} strokeWidth={2.2} />
          Move to Trash
        </button>
      </div>
    ) : (
      <button
        type="button"
        onClick={() => navigate('/mygame')}
        className="text-[13px] font-semibold text-[#7C4DFF] transition-colors hover:underline"
      >
        ← Back to My game
      </button>
    )

  return (
    <>
      <PageShell
        title="Archive"
        subtitle={
          selectMode
            ? `Select games to restore or delete${selectedCount > 0 ? ` · ${selectedCount} selected` : ''}`
            : projects.length > 0
              ? 'Archived games — restore them to My game anytime'
              : 'Archived games will appear here'
        }
        className="pt-10 sm:pt-12"
        action={headerAction}
      >
        {projects.length > 0 ? (
          <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#ECE7FB] bg-white px-4 py-3 shadow-[0_4px_18px_-10px_rgba(27,21,48,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B94B0]">
                Archived
              </p>
              <p className="mt-1 font-display text-[22px] font-extrabold text-[#1B1530]">
                {projects.length}
              </p>
            </div>
            <div className="rounded-2xl border border-[#ECE7FB] bg-white px-4 py-3 shadow-[0_4px_18px_-10px_rgba(27,21,48,0.06)]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B94B0]">
                Questions
              </p>
              <p className="mt-1 font-display text-[22px] font-extrabold text-[#1B1530]">
                {totalQuestions}
              </p>
            </div>
            <div className="col-span-2 rounded-2xl border border-[#EDE5FF] bg-gradient-to-br from-[#FAF8FF] to-white px-4 py-3 shadow-[0_4px_18px_-10px_rgba(124,77,255,0.08)] sm:col-span-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#9B94B0]">
                Tip
              </p>
              <p className="mt-1 text-[12px] font-medium leading-snug text-[#6B6585]">
                Use ⋮ on any game to restore, delete, or select multiple
              </p>
            </div>
          </div>
        ) : null}

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-[#E8DEFF] bg-white px-6 py-16 text-center">
            <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[#F3EEFF] text-[#7C4DFF]">
              <Archive size={26} strokeWidth={2} />
            </div>
            <p className="font-display text-[17px] font-bold text-[#1B1530]">No archived games</p>
            <p className="mt-1 max-w-[280px] text-[14px] text-[#6B6585]">
              Games you archive from My game will show up here.
            </p>
            <button
              type="button"
              onClick={() => navigate('/mygame')}
              className="lumi-btn-primary mt-5 rounded-full px-5 py-2.5 text-[13px] font-bold text-white"
            >
              Go to My game
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-2.5 sm:gap-3">
            {projects.map((project) => (
              <li
                key={project.id}
                className={openMenuId === project.id ? 'relative z-50' : undefined}
              >
                <ArchivedProjectCard
                  project={project}
                  isMenuOpen={openMenuId === project.id}
                  onToggleMenu={() =>
                    setOpenMenuId((current) => (current === project.id ? null : project.id))
                  }
                  onCloseMenu={() => setOpenMenuId(null)}
                  selectMode={selectMode}
                  isSelected={selectedIds.has(project.id)}
                  onToggleSelect={toggleSelected}
                  onRestore={handleRestoreOne}
                  onDelete={handleDeleteOne}
                  onSelect={handleSelectFromMenu}
                />
              </li>
            ))}
          </ul>
        )}
      </PageShell>

      <HistoryDeleteToast
        count={pendingDelete?.projects.length ?? 0}
        message={
          pendingDelete
            ? pendingDelete.projects.length === 1
              ? '1 item moved to Trash'
              : `${pendingDelete.projects.length} items moved to Trash`
            : undefined
        }
        onUndo={handleUndo}
        onDismiss={handleDismissToast}
      />
    </>
  )
}
