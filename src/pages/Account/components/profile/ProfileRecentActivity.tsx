import { PROFILE_ACTIVITIES } from '../../data/accountData'

export function ProfileRecentActivity() {
  return (
    <section className="profile-card profile-card--padded">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Recent Activity</h2>
        <button type="button" className="profile-card__link">
          View All
        </button>
      </div>

      <div className="profile-activity-scroll">
        {PROFILE_ACTIVITIES.map(({ id, text, time, tone, icon: Icon }) => (
          <article key={id} className="profile-activity-card">
            <div className={`profile-activity-card__icon profile-activity-card__icon--${tone}`}>
              <Icon size={16} strokeWidth={2.2} />
            </div>
            <div>
              <p className="profile-activity-card__text">{text}</p>
              <p className="profile-activity-card__time">{time}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
