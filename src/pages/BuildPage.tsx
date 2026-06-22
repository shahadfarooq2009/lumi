import { Workspace } from '../components/build/Workspace'
import { WorkspacePanelProvider } from '../contexts/WorkspacePanelContext'

export function BuildPage() {
  return (
    <WorkspacePanelProvider>
      <main className="relative flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F7F7FF] dark:bg-[#0f0d18]">
        <Workspace />
      </main>
    </WorkspacePanelProvider>
  )
}
