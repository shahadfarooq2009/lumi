import { Clock, FileQuestion } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { listQuizProjects, type SavedQuizProject } from '../../lib/savedProjects'

function formatDate(iso: string) {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

export function ProjectsPage() {
  const location = useLocation()
  const [projects, setProjects] = useState<SavedQuizProject[]>(() => listQuizProjects())

  useEffect(() => {
    setProjects(listQuizProjects())
  }, [location.key])

  return (
    <section className="mx-auto w-full max-w-[960px] px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold text-ink">My Projects</h1>
        <p className="mt-1 text-sm text-ink-dim">Quizzes you saved from the editor</p>
      </div>

      {projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-ink-soft">No saved projects yet</p>
          <p className="mt-1 text-xs text-ink-muted">
            Create a quiz and click Save changes to see it here.
          </p>
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {projects.map((project) => (
            <li key={project.id}>
              <Link
                to={`/build/${project.id}`}
                className="block rounded-2xl border border-border bg-white p-4 shadow-xs transition-all hover:-translate-y-px hover:border-brand-soft hover:shadow-sm-soft"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-softer text-brand">
                    <FileQuestion size={18} strokeWidth={2.2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="truncate font-display text-[15px] font-bold text-ink">
                      {project.title}
                    </h2>
                    <p className="mt-0.5 text-[12px] text-ink-dim">
                      {project.questionCount} question{project.questionCount === 1 ? '' : 's'}
                    </p>
                    <p className="mt-2 flex items-center gap-1 text-[11px] text-ink-muted">
                      <Clock size={11} />
                      Saved {formatDate(project.updatedAt)}
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
