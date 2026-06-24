export interface GenerateFlashcardDeckOptions {
  onProgress?: (percent: number) => void
  signal?: AbortSignal
}
