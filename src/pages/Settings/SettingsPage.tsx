import { Navigate } from 'react-router-dom'

export function SettingsPage() {
  return <Navigate to="/account?settings=1" replace />
}
