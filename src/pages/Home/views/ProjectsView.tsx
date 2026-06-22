import { Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  archiveQuizProject,
  listQuizProjects,
  type SavedQuizProject,
} from '../../../lib/savedProjects'
import { PageShell } from '../components/PageShell'
import { ProjectCard } from '../components/ProjectCard'

interface ProjectsViewProps {
  onCreateGame: () => void
  refreshKey?: number
}

function ProjectsStats({ projects }: { projects: SavedQuizProject[] }) {
  const totalQuestions = useMemo(
    () => projects.reduce((sum, p) => sum + p.questionCount, 0),
    [projects],
  )

  const stats = [
    { label: 'Games', value: projects.length },
    { label: 'Questions', value: totalQuestions },
    {
      label: 'Last updated',
      value:
        projects.length > 0
          ? new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(
              new Date(projects[0].updatedAt),
            )
          : '—',
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl bg-white px-4 py-3.5 shadow-[0_4px_18px_-6px_rgba(124,77,255,0.07)]"
        >
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#9B94B0]">
            {stat.label}
          </p>
          <p className="mt-1 font-display text-[22px] font-extrabold leading-none text-[#1B1530]">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}

function EmptyProjects({ onCreateGame }: { onCreateGame: () => void }) {
  return (
    <div className="mt-8 flex justify-start sm:mt-10">
      <button
        type="button"
        onClick={onCreateGame}
        className="group flex w-[200px] flex-col items-center gap-4 rounded-[24px] border border-[#ECE7FB] bg-white px-8 py-8 shadow-[0_4px_18px_-6px_rgba(124,77,255,0.1)] transition-all hover:border-[#D4C4FF] hover:shadow-[0_8px_24px_-8px_rgba(124,77,255,0.18)] sm:w-[220px] sm:px-9 sm:py-9"
      >
        <div className="grid h-14 w-14 place-items-center rounded-[16px] bg-[#F3EFFF] text-[#7C4DFF] transition-colors group-hover:bg-[#7C4DFF] group-hover:text-white sm:h-16 sm:w-16">
          <Plus size={26} strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-semibold text-[#6B6585] transition-colors group-hover:text-[#7C4DFF] sm:text-[16px]">
          Create game
        </span>
      </button>
    </div>
  )
}

export function ProjectsView({ onCreateGame, refreshKey = 0 }: ProjectsViewProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [projects, setProjects] = useState<SavedQuizProject[]>(() => listQuizProjects())
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  useEffect(() => {
    setProjects(listQuizProjects())
  }, [location.key, refreshKey])

  const handleArchive = (id: string) => {
    archiveQuizProject(id)
    setProjects(listQuizProjects())
    setOpenMenuId(null)
    navigate('/archive')
  }

  return (
    <PageShell
      title="My game"
      subtitle={projects.length > 0 ? 'Your saved quizzes — play, edit, or share anytime' : undefined}
      className="pt-10 sm:pt-12"
      action={
        <button
          type="button"
          onClick={onCreateGame}
          className="lumi-btn-primary inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-4 text-[13px] font-bold text-white transition-all sm:h-10 sm:gap-2 sm:px-5 sm:text-[14px]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Create game
        </button>
      }
    >
      {projects.length > 0 ? <ProjectsStats projects={projects} /> : null}

      {projects.length === 0 ? (
        <EmptyProjects onCreateGame={onCreateGame} />
      ) : (
        <ul className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <li
              key={project.id}
              className={`group relative transition-transform duration-300 hover:-translate-y-1 ${
                openMenuId === project.id ? 'z-50' : ''
              }`}
            >
              <ProjectCard
                project={project}
                isMenuOpen={openMenuId === project.id}
                onToggleMenu={() =>
                  setOpenMenuId((current) => (current === project.id ? null : project.id))
                }
                onCloseMenu={() => setOpenMenuId(null)}
                onArchive={handleArchive}
              />
            </li>
          ))}
        </ul>
      )}
    </PageShell>
  )
}
