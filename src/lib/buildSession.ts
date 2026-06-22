const GAME_MODE_KEY = 'quizora:last-game-mode'

export function persistGameMode(mode: string) {
  try {
    sessionStorage.setItem(GAME_MODE_KEY, mode)
  } catch {
    /* ignore */
  }
}

export function readPersistedGameMode(): string | undefined {
  try {
    return sessionStorage.getItem(GAME_MODE_KEY) ?? undefined
  } catch {
    return undefined
  }
}
