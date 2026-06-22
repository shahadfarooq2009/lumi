const ARABIC_RE =
  /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

export function hasArabicText(text: string): boolean {
  return ARABIC_RE.test(text)
}

export function arabicFontClass(text: string, ...classes: string[]): string {
  return [hasArabicText(text) ? 'font-arabic' : '', ...classes].filter(Boolean).join(' ')
}
