export function formatGameTime(elapsedMs: number): string {
  const totalSec = Math.max(0, Math.floor(elapsedMs / 1000))
  const minutes = Math.floor(totalSec / 60)
  const seconds = totalSec % 60
  return `${minutes}m ${seconds}s`
}
