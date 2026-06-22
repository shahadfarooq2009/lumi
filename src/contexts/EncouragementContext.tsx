import { createContext, useContext, type ReactNode } from 'react'

type EncouragementContextValue = {
  showNow: () => void
}

const EncouragementContext = createContext<EncouragementContextValue | null>(null)

export function EncouragementContextProvider({
  value,
  children,
}: {
  value: EncouragementContextValue
  children: ReactNode
}) {
  return <EncouragementContext.Provider value={value}>{children}</EncouragementContext.Provider>
}

export function useEncouragement() {
  const ctx = useContext(EncouragementContext)
  if (!ctx) {
    throw new Error('useEncouragement must be used within EncouragementProvider')
  }
  return ctx
}
