import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { NavId } from './data/navItems'
import { AppHeader } from './components/layout/AppHeader'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { ProjectsPage } from './components/home/ProjectsPage'
import { Home } from './pages/Home/Home'

type HomeLocationState = { activeNav?: NavId } | null

export function HomeApp() {
  const location = useLocation()
  const navigate = useNavigate()
  const navFromState = (location.state as HomeLocationState)?.activeNav
  const [navExpanded, setNavExpanded] = useState(false)
  const [activeNav, setActiveNav] = useState<NavId>(navFromState ?? 'home')

  useEffect(() => {
    if (navFromState === 'projects') {
      navigate('/mygame', { replace: true })
      return
    }
    if (navFromState) setActiveNav(navFromState)
  }, [navFromState, location.key, navigate])

  if (activeNav !== 'projects') {
    return <Home />
  }

  const expandNav = () => setNavExpanded(true)

  return (
    <div className={`app${navExpanded ? ' nav-expanded' : ''}`}>
      <AppHeader onToggleNav={() => setNavExpanded((value) => !value)} />

      <Sidebar
        activeNav={activeNav}
        onNavItemClick={(id) => {
          expandNav()
          setActiveNav(id)
        }}
        onClassCodeClick={expandNav}
      />

      <div className="app__right">
        <main className="main">
          <Topbar />
          <div className="content">
            <ProjectsPage />
          </div>
        </main>
      </div>
    </div>
  )
}
