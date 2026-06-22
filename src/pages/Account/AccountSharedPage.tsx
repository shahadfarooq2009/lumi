import { AccountShell } from '../Account/components/AccountShell'
import { AccountSharedView } from '../Account/views/AccountSharedView'
import '../Account/account.css'

export function AccountSharedPage() {
  return (
    <AccountShell>
      <AccountSharedView />
    </AccountShell>
  )
}
