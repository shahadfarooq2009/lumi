import { useEffect, useState } from 'react'
import {
  getUserSettings,
  USER_SETTINGS_EVENT,
  updateUserSettings,
  type DeepPartial,
  type UserSettings,
} from '../../../lib/userSettings'

export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => getUserSettings())

  useEffect(() => {
    const refresh = () => setSettings(getUserSettings())
    window.addEventListener(USER_SETTINGS_EVENT, refresh)
    return () => window.removeEventListener(USER_SETTINGS_EVENT, refresh)
  }, [])

  const patch = (next: DeepPartial<UserSettings>) => {
    setSettings(updateUserSettings(next))
  }

  return { settings, patch }
}
