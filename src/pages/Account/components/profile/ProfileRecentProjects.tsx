import { MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PROFILE_PROJECTS } from '../../data/accountData'

export function ProfileRecentProjects() {
  return (
    <section className="profile-card profile-card--padded">
      <div className="profile-card__head">
        <h2 className="profile-card__title">My Recent Projects</h2>
        <Link to="/mygame" className="profile-card__link">
          View All
        </Link>
      </div>

      <div>
        {PROFILE_PROJECTS.map((project) => (
          <div key={project.id} className="profile-project-row">
            <div
              className="profile-project-row__icon"
              style={{ background: project.gradient }}
            />
            <div className="min-w-0 flex-1">
              <p className="profile-project-row__title">{project.title}</p>
              <p className="profile-project-row__meta">
                {project.type} • {project.meta}
              </p>
            </div>
            <div className="profile-project-row__score">
              <span className="profile-project-row__score-label">Best Score</span>
              <span className="profile-project-row__score-value">{project.bestScore}%</span>
            </div>
            <div className="profile-project-row__actions">
              <button type="button" className="profile-btn profile-btn--ghost">
                Edit
              </button>
              <button type="button" className="profile-btn profile-btn--primary">
                Play
              </button>
              <button type="button" aria-label="More options" className="profile-btn--menu">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
