import type { NavPageId } from '../data/nav'

const ROUTE_PATHS: Partial<Record<NavPageId, string>> = {
  home: '/',
  projects: '/mygame',
  pricing: '/pricing',
  profile: '/account',
}

export function navPageToPath(page: NavPageId): string | null {
  return ROUTE_PATHS[page] ?? null
}

export function pathToNavPage(pathname: string): NavPageId {
  if (pathname.startsWith('/mygame')) return 'projects'
  if (pathname.startsWith('/pricing')) return 'pricing'
  if (pathname.startsWith('/account')) return 'profile'
  if (pathname.startsWith('/settings')) return 'profile'
  if (pathname.startsWith('/trash')) return 'profile'
  return 'home'
}
