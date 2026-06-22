export const NAV_ITEMS = [
  { id: 'home', label: 'Home', count: null as string | null, dot: false },
  { id: 'projects', label: 'My Projects', count: '14', dot: false },
  { id: 'themes', label: 'Themes', count: null, dot: false },
  { id: 'analytics', label: 'Analytics', count: null, dot: false },
  { id: 'notifications', label: 'Notifications', count: null, dot: true },
  { id: 'trash', label: 'Trash', count: null, dot: false },
] as const

export type NavId = (typeof NAV_ITEMS)[number]['id'] | 'settings'
