import { AccountDetailsCard } from '../components/AccountDetailsCard'
import { AchievementsSection } from '../components/AchievementsSection'
import { ActivitySummary } from '../components/ActivitySummary'

export function AccountProfileView() {
  return (
    <div className="grid gap-5">
      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <AccountDetailsCard />
        <ActivitySummary />
      </div>
      <AchievementsSection />
    </div>
  )
}
