import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { LumiPageLayout } from '../../Home/components/LumiPageLayout'
import { navigateToPage } from '../../Home/lib/navigateToPage'

export function AccountShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate()

  return (
    <LumiPageLayout
      activePage="profile"
      onNavigate={(page) => navigateToPage(navigate, page)}
    >
      <div className="account-layout">
        <div className="account-main min-w-0 flex-1">
          <div className="account-tab-panel">{children}</div>
        </div>
      </div>
    </LumiPageLayout>
  )
}
