export const NAV_PAGES = [
  { id: 'home', label: 'Home' },
  { id: 'projects', label: 'My game' },
  { id: 'pricing', label: 'Pricing' },
] as const

export type NavPageId = (typeof NAV_PAGES)[number]['id'] | 'profile'
