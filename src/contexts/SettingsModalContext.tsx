import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { SettingsModal } from '../pages/Settings/SettingsModal'
import '../pages/Settings/settings.css'

type SettingsModalContextValue = {
  openSettings: () => void
  closeSettings: () => void
}

const SettingsModalContext = createContext<SettingsModalContextValue | null>(null)

export function SettingsModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    setOpen(params.get('settings') === '1')
  }, [location.search])

  const closeSettings = useCallback(() => {
    setOpen(false)
    const params = new URLSearchParams(location.search)
    if (params.get('settings') === '1') {
      params.delete('settings')
      const nextSearch = params.toString()
      navigate(
        { pathname: location.pathname, search: nextSearch ? `?${nextSearch}` : '' },
        { replace: true },
      )
    }
  }, [location.pathname, location.search, navigate])

  const openSettings = useCallback(() => {
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({
      openSettings,
      closeSettings,
    }),
    [openSettings, closeSettings],
  )

  return (
    <SettingsModalContext.Provider value={value}>
      {children}
      <SettingsModal open={open} onClose={closeSettings} />
    </SettingsModalContext.Provider>
  )
}

export function useSettingsModal() {
  const context = useContext(SettingsModalContext)
  if (!context) {
    throw new Error('useSettingsModal must be used within SettingsModalProvider')
  }
  return context
}
