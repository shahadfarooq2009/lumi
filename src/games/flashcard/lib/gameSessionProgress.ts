const STORAGE_KEY = 'quizora:flashcard-session-progress'

export interface FlashcardSessionProgress {
  projectId: string
  cardIndex: number
  totalCards: number
  savedAt: string
}

function readAll(): Record<string, FlashcardSessionProgress> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, FlashcardSessionProgress>
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(entries: Record<string, FlashcardSessionProgress>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
}

export function getFlashcardSessionProgress(projectId: string): FlashcardSessionProgress | null {
  return readAll()[projectId] ?? null
}

export function saveFlashcardSessionProgress(
  projectId: string,
  cardIndex: number,
  totalCards: number,
): void {
  const entries = readAll()
  entries[projectId] = {
    projectId,
    cardIndex: Math.max(0, Math.min(cardIndex, totalCards - 1)),
    totalCards,
    savedAt: new Date().toISOString(),
  }
  writeAll(entries)
}

export function clearFlashcardSessionProgress(projectId: string): void {
  const entries = readAll()
  if (!(projectId in entries)) return
  delete entries[projectId]
  writeAll(entries)
}

export function isFlashcardSessionResumable(
  progress: FlashcardSessionProgress | null,
  totalCards: number,
): progress is FlashcardSessionProgress {
  if (!progress) return false
  return progress.totalCards === totalCards && progress.cardIndex >= 0
}
