import { useNavigate } from 'react-router-dom'
import { LumiPageLayout } from './components/LumiPageLayout'
import { navigateToPage } from './lib/navigateToPage'
import { TrashedProjectsView } from './views/TrashedProjectsView'
import '../Account/account.css'

export function TrashPage() {
  const navigate = useNavigate()

  return (
    <LumiPageLayout
      activePage="profile"
      onNavigate={(page) => navigateToPage(navigate, page)}
    >
      <div className="account-layout">
        <TrashedProjectsView />
      </div>
    </LumiPageLayout>
  )
}
