import { AccountShell } from '../Account/components/AccountShell'
import { AccountProfileView } from '../Account/views/AccountProfileView'
import '../Account/account.css'

export function AccountProfilePage() {
  return (
    <AccountShell>
      <AccountProfileView />
    </AccountShell>
  )
}
