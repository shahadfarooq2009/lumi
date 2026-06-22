import { Globe, Lock, MoreHorizontal } from 'lucide-react'
import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { listQuizProjects } from '../../../lib/savedProjects'
import { PROJECT_GRADIENTS } from '../data/accountData'

const FALLBACK = [
  { title: 'Biology – Cell Structure', questions: 24, visibility: 'Public', edited: '2 days ago' },
  { title: 'World History Quiz', questions: 18, visibility: 'Private', edited: '5 days ago' },
  { title: 'Spanish Vocabulary', questions: 32, visibility: 'Public', edited: '1 week ago' },
  { title: 'Math – Algebra Basics', questions: 15, visibility: 'Private', edited: '2 weeks ago' },
]

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days <= 0) return 'Today'
  if (days === 1) return '1 day ago'
  if (days < 7) return `${days} days ago`
  const weeks = Math.floor(days / 7)
  return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`
}

export function RecentProjectsList() {
  const projects = useMemo(() => {
    const saved = listQuizProjects().slice(0, 4)
    if (saved.length === 0) return FALLBACK.map((item, i) => ({ ...item, id: String(i) }))
    return saved.map((p, i) => ({
      id: p.id,
      title: p.title,
      questions: p.questionCount,
      visibility: i % 2 === 0 ? 'Public' : 'Private',
      edited: formatRelativeTime(p.updatedAt),
    }))
  }, [])

  return (
    <section className="account-section-card mb-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="m-0 font-display text-[17px] font-extrabold text-[#1B1530]">Recent Projects</h2>
        <Link to="/mygame" className="text-[13px] font-semibold text-[#7C4DFF] hover:underline">
          View all
        </Link>
      </div>

      <div>
        {projects.map((project, index) => (
          <div key={project.id} className="account-project-row">
            <div
              className="h-11 w-14 shrink-0 rounded-lg"
              style={{ background: PROJECT_GRADIENTS[index % PROJECT_GRADIENTS.length] }}
            />
            <div className="min-w-0 flex-1">
              <p className="m-0 truncate text-[14px] font-bold text-[#1B1530]">{project.title}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-[12px] text-[#9B94B0]">
                <span>{project.questions} questions</span>
                <span className="inline-flex items-center gap-1">
                  {project.visibility === 'Public' ? (
                    <Globe size={12} strokeWidth={2} />
                  ) : (
                    <Lock size={12} strokeWidth={2} />
                  )}
                  {project.visibility}
                </span>
                <span>Edited {project.edited}</span>
              </div>
            </div>
            <button
              type="button"
              aria-label="Project options"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-[#9B94B0] transition-colors hover:bg-[#F3EEFF] hover:text-[#7C4DFF]"
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}
