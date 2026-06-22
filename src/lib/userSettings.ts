export type ColorTheme = 'purple' | 'blue' | 'pink'
export type AppLanguage = 'english' | 'arabic'
export type GameDifficulty = 'easy' | 'medium' | 'hard'

import { applyColorTheme } from './colorThemes'

export interface UserSettings {
  appearance: {
    colorTheme: ColorTheme
  }
  language: AppLanguage
  notifications: {
    games: boolean
    achievements: boolean
    email: boolean
  }
  account: {
    name: string
  }
  game: {
    defaultDifficulty: GameDifficulty
    timerEnabled: boolean
    soundEffects: boolean
  }
}

const STORAGE_KEY = 'quizora:user-settings'
export const USER_SETTINGS_EVENT = 'quizora:user-settings-updated'

export const DEFAULT_USER_SETTINGS: UserSettings = {
  appearance: {
    colorTheme: 'purple',
  },
  language: 'english',
  notifications: {
    games: true,
    achievements: true,
    email: false,
  },
  account: {
    name: 'Shahad',
  },
  game: {
    defaultDifficulty: 'medium',
    timerEnabled: true,
    soundEffects: true,
  },
}

function normalizeSettings(raw: unknown): UserSettings {
  const parsed = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>

  const legacyProfile = parsed.profile as { name?: string } | undefined
  const legacyAppearance = parsed.appearance as { colorTheme?: ColorTheme } | undefined
  const legacyLanguage = parsed.language as AppLanguage | undefined
  const legacyAi = parsed.ai as { language?: string } | undefined
  const legacyNotifications = parsed.notifications as
    | (Partial<UserSettings['notifications']> & { sharing?: boolean })
    | undefined
  const legacyGame = parsed.game as Partial<UserSettings['game']> | undefined
  const legacyAccount = parsed.account as { name?: string } | undefined

  return {
    appearance: {
      colorTheme:
        legacyAppearance?.colorTheme ??
        DEFAULT_USER_SETTINGS.appearance.colorTheme,
    },
    language:
      legacyLanguage ??
      (legacyAi?.language === 'english' ? 'english' : DEFAULT_USER_SETTINGS.language),
    notifications: {
      games: legacyNotifications?.games ?? DEFAULT_USER_SETTINGS.notifications.games,
      achievements:
        legacyNotifications?.achievements ??
        legacyNotifications?.sharing ??
        DEFAULT_USER_SETTINGS.notifications.achievements,
      email: legacyNotifications?.email ?? DEFAULT_USER_SETTINGS.notifications.email,
    },
    account: {
      name:
        legacyAccount?.name ??
        legacyProfile?.name ??
        DEFAULT_USER_SETTINGS.account.name,
    },
    game: {
      defaultDifficulty:
        legacyGame?.defaultDifficulty ?? DEFAULT_USER_SETTINGS.game.defaultDifficulty,
      timerEnabled: legacyGame?.timerEnabled ?? DEFAULT_USER_SETTINGS.game.timerEnabled,
      soundEffects: legacyGame?.soundEffects ?? DEFAULT_USER_SETTINGS.game.soundEffects,
    },
  }
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_USER_SETTINGS
    return normalizeSettings(JSON.parse(raw))
  } catch {
    return DEFAULT_USER_SETTINGS
  }
}

export function saveUserSettings(settings: UserSettings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  applyAppearanceSettings(settings.appearance)
  window.dispatchEvent(new CustomEvent(USER_SETTINGS_EVENT, { detail: settings }))
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

export function updateUserSettings(patch: DeepPartial<UserSettings>) {
  const current = getUserSettings()
  const next: UserSettings = {
    appearance: { ...current.appearance, ...patch.appearance },
    language: patch.language ?? current.language,
    notifications: { ...current.notifications, ...patch.notifications },
    account: { ...current.account, ...patch.account },
    game: { ...current.game, ...patch.game },
  }
  saveUserSettings(next)
  return next
}

export function applyAppearanceSettings(appearance: UserSettings['appearance']) {
  applyColorTheme(appearance.colorTheme)
}

export function exportUserData() {
  const settings = getUserSettings()
  const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'lumi-settings-export.json'
  link.click()
  URL.revokeObjectURL(url)
}

export function resetUserProgress() {
  localStorage.removeItem('quizora:correct-answers')
  localStorage.removeItem('quizora:streak-milestones-claimed')
  window.dispatchEvent(new CustomEvent('quizora:streak-progress-updated'))
}

export function initUserSettings() {
  applyAppearanceSettings(getUserSettings().appearance)
}
