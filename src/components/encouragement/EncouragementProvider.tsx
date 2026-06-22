import type { ReactNode } from 'react'
import { EncouragementContextProvider } from '../../contexts/EncouragementContext'
import { useEncouragementMessages } from '../../hooks/useEncouragementMessages'
import { EncouragementToast } from './EncouragementToast'
import { EncouragementTriggerButton } from './EncouragementTriggerButton'

export function EncouragementProvider({ children }: { children: ReactNode }) {
  const { message, visible, dismiss, showNow } = useEncouragementMessages()

  return (
    <EncouragementContextProvider value={{ showNow }}>
      {children}
      <EncouragementTriggerButton />
      <EncouragementToast message={message} visible={visible} onDismiss={dismiss} />
    </EncouragementContextProvider>
  )
}
