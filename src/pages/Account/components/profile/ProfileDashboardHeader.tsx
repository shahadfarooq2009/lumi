import { Sparkles } from 'lucide-react'

export function ProfileDashboardHeader() {
  return (
    <header className="profile-dashboard__header">
      <h1 className="profile-dashboard__title">
        My Profile
        <Sparkles size={22} className="profile-dashboard__title-icon" strokeWidth={2.2} />
      </h1>
      <p className="profile-dashboard__subtitle">
        Track your progress and manage your account.
      </p>
    </header>
  )
}
