import type { NavigateFunction } from 'react-router-dom'
import type { NavPageId } from '../data/nav'
import { navPageToPath } from './navRoutes'

export function navigateToPage(navigate: NavigateFunction, page: NavPageId) {
  const path = navPageToPath(page)
  if (path) {
    navigate(path)
    return
  }
  navigate('/', { state: { page } })
}
