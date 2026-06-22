import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url,
).toString()

export async function detectPdfPageCount(file: File): Promise<number> {
  const buffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
  return pdf.numPages
}

export function getPageCountHint(file: File): { total: number; label?: string } {
  const name = file.name.toLowerCase()

  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    return { total: 1 }
  }
  if (/\.pptx?$/.test(name)) {
    return { total: 30, label: 'of ~30 (slides)' }
  }
  if (/\.docx?$/.test(name)) {
    return { total: 20, label: 'of ~20 (pages)' }
  }
  return { total: 1 }
}

export function getFileExtension(name: string): string {
  const parts = name.split('.')
  return parts.length > 1 ? (parts.pop()?.toUpperCase() ?? 'FILE') : 'FILE'
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}

export function fileNameToProjectTitle(fileName: string): string {
  const trimmed = fileName.trim()
  const dot = trimmed.lastIndexOf('.')
  return dot > 0 ? trimmed.slice(0, dot) : trimmed
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export async function extractTextFromFile(file: File): Promise<string> {
  const name = file.name.toLowerCase()

  if (name.endsWith('.txt') || file.type === 'text/plain') {
    return file.text()
  }

  if (file.type === 'application/pdf' || name.endsWith('.pdf')) {
    const buffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(buffer) }).promise
    const parts: string[] = []

    for (let page = 1; page <= pdf.numPages; page++) {
      const pdfPage = await pdf.getPage(page)
      const content = await pdfPage.getTextContent()
      const pageText = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
      if (pageText.trim()) parts.push(pageText)
    }

    return parts.join('\n')
  }

  return ''
}
