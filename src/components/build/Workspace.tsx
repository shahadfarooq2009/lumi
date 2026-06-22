import { useEffect, useRef } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { BuildThreadProvider, useBuildThreadContext } from '../../contexts/BuildThreadContext'
import { useWorkspacePanel } from '../../contexts/WorkspacePanelContext'
import { getQuizProject } from '../../lib/savedProjects'
import { Computer } from './Computer/Computer'
import { PanelExpandTab } from './PanelExpandTab'
import { Thread } from './Thread/Thread'

function WorkspaceLayout() {
  const { id: buildId } = useParams()
  const { showWorkbench } = useBuildThreadContext()
  const { isPanelOpen, setCanTogglePanel, openPanel } = useWorkspacePanel()
  const savedProject =
    buildId && buildId !== 'new' ? getQuizProject(buildId) : null
  const showEditor = showWorkbench || Boolean(savedProject)
  const canSplit = showEditor && !savedProject
  const showRightPanel = showEditor && (!canSplit || isPanelOpen)
  const wasWorkbenchReady = useRef(false)

  useEffect(() => {
    setCanTogglePanel(canSplit)
    if (showWorkbench && !wasWorkbenchReady.current && canSplit) {
      openPanel()
    }
    wasWorkbenchReady.current = showWorkbench
  }, [canSplit, openPanel, setCanTogglePanel, showWorkbench])

  return (
    <div
      className={`relative grid h-full min-h-0 flex-1 overflow-hidden ${
        canSplit && isPanelOpen
          ? 'grid-cols-1 workspace:grid-cols-[minmax(0,0.95fr)_minmax(0,1.25fr)]'
          : 'grid-cols-1'
      }`}
    >
      {!savedProject ? <Thread /> : null}
      {showRightPanel ? <Computer savedProject={savedProject} /> : null}
      <PanelExpandTab />
    </div>
  )
}

export function Workspace() {
  const location = useLocation()
  const fileName =
    (location.state as { fileName?: string } | null)?.fileName ?? 'Cell Biology Notes.pdf'
  const hasUploadedFile = Boolean((location.state as { fileName?: string } | null)?.fileName)

  return (
    <BuildThreadProvider fileName={fileName} hasUploadedFile={hasUploadedFile}>
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <WorkspaceLayout />
      </div>
    </BuildThreadProvider>
  )
}
