import { AccountShell } from './components/AccountShell'
import { ProfileDashboardHeader } from './components/profile/ProfileDashboardHeader'
import { AccountOverviewView } from './views/AccountOverviewView'
import { useSettingsModal } from '../../contexts/SettingsModalContext'
import './account.css'
import './profile-dashboard.css'

export function AccountPage() {
  const { openSettings } = useSettingsModal()

  return (
    <AccountShell>
      <ProfileDashboardHeader />
      <AccountOverviewView onOpenSettings={openSettings} />
    </AccountShell>
  )
}
