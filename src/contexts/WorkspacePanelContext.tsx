import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface WorkspacePanelContextValue {
  canTogglePanel: boolean
  isPanelOpen: boolean
  setCanTogglePanel: (value: boolean) => void
  openPanel: () => void
  closePanel: () => void
  togglePanel: () => void
}

const WorkspacePanelContext = createContext<WorkspacePanelContextValue | null>(null)

export function WorkspacePanelProvider({ children }: { children: ReactNode }) {
  const [isPanelOpen, setIsPanelOpen] = useState(true)
  const [canTogglePanel, setCanTogglePanel] = useState(false)

  const openPanel = useCallback(() => setIsPanelOpen(true), [])
  const closePanel = useCallback(() => setIsPanelOpen(false), [])
  const togglePanel = useCallback(() => setIsPanelOpen((open) => !open), [])

  const value = useMemo(
    () => ({
      canTogglePanel,
      isPanelOpen,
      setCanTogglePanel,
      openPanel,
      closePanel,
      togglePanel,
    }),
    [canTogglePanel, closePanel, isPanelOpen, openPanel, togglePanel],
  )

  return (
    <WorkspacePanelContext.Provider value={value}>{children}</WorkspacePanelContext.Provider>
  )
}

export function useWorkspacePanel() {
  const context = useContext(WorkspacePanelContext)
  if (!context) {
    throw new Error('useWorkspacePanel must be used within WorkspacePanelProvider')
  }
  return context
}

export function useWorkspacePanelOptional() {
  return useContext(WorkspacePanelContext)
}
