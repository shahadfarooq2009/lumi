import { PROFILE_ACHIEVEMENTS } from '../../data/accountData'
import { ProfileRoundedHex } from './ProfileRoundedHex'

export function ProfileAchievementsGrid() {
  return (
    <section className="profile-card profile-card--padded profile-achievements-section">
      <div className="profile-card__head">
        <h2 className="profile-card__title">Achievements</h2>
        <button type="button" className="profile-card__link">
          View All
        </button>
      </div>

      <div className="profile-achievements-row">
        {PROFILE_ACHIEVEMENTS.map(({ title, description, icon: Icon, accent, accentLight, unlocked }) => (
          <div
            key={title}
            className={`profile-achievement ${unlocked ? 'profile-achievement--unlocked' : 'profile-achievement--locked'}`}
          >
            <ProfileRoundedHex
              size={52}
              locked={!unlocked}
              gradient={unlocked ? [accentLight, accent] : undefined}
              glow={unlocked ? `${accent}55` : undefined}
            >
              <Icon size={20} strokeWidth={2.1} aria-hidden />
            </ProfileRoundedHex>
            <p className="profile-achievement__title">{title}</p>
            <p className="profile-achievement__desc">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
