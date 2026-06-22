import { PROFILE_STATS } from '../../data/accountData'

export function ProfileStatsStrip() {
  return (
    <div className="profile-stats-strip">
      {PROFILE_STATS.map(({ label, value, icon: Icon, tone }) => (
        <div key={label} className="profile-stat-pill">
          <div className={`profile-stat-pill__icon profile-stat-pill__icon--${tone}`}>
            <Icon size={18} strokeWidth={2.2} />
          </div>
          <div>
            <div className="profile-stat-pill__value">{value}</div>
            <div className="profile-stat-pill__label">{label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
