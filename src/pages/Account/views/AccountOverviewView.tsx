import { ProfileAchievementsGrid } from '../components/profile/ProfileAchievementsGrid'
import { ProfileLearningChart } from '../components/profile/ProfileLearningChart'
import { ProfileLevelCard } from '../components/profile/ProfileLevelCard'
import { ProfileRecentProjects } from '../components/profile/ProfileRecentProjects'
import { ProfileStatsStrip } from '../components/profile/ProfileStatsStrip'
import { ProfileUserCard } from '../components/profile/ProfileUserCard'

export function AccountOverviewView({
  onOpenSettings,
}: {
  onOpenSettings?: () => void
}) {
  return (
    <div className="profile-dashboard">
      <div className="profile-top-grid">
        <ProfileUserCard onOpenSettings={onOpenSettings} />
        <ProfileLevelCard />
      </div>

      <ProfileStatsStrip />

      <div className="profile-main-grid">
        <div className="profile-main-grid__projects">
          <ProfileRecentProjects />
        </div>

        <div className="profile-main-grid__achievements">
          <ProfileAchievementsGrid />
        </div>

        <div className="profile-main-grid__chart">
          <ProfileLearningChart />
        </div>
      </div>
    </div>
  )
}
