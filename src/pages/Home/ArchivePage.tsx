import { useNavigate } from 'react-router-dom'
import { LumiPageLayout } from './components/LumiPageLayout'
import { navigateToPage } from './lib/navigateToPage'
import { ArchivedProjectsView } from './views/ArchivedProjectsView'

export function ArchivePage() {
  const navigate = useNavigate()

  return (
    <LumiPageLayout
      activePage="projects"
      onNavigate={(page) => navigateToPage(navigate, page)}
    >
      <ArchivedProjectsView />
    </LumiPageLayout>
  )
}
