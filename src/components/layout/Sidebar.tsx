import type { NavId } from '../../data/navItems'
import { NAV_ITEMS } from '../../data/navItems'
import { NavIcon } from './NavIcon'

interface SidebarProps {
  activeNav: NavId
  onNavItemClick: (id: NavId) => void
  onClassCodeClick: () => void
}

export function Sidebar({ activeNav, onNavItemClick, onClassCodeClick }: SidebarProps) {
  return (
    <aside className="nav">
      <div className="nav__items">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav__item${activeNav === item.id ? ' nav__item--active' : ''}`}
            onClick={() => onNavItemClick(item.id)}
          >
            <span className="nav__icon">
              <NavIcon name={item.id} />
            </span>
            <span className="nav__label">{item.label}</span>
            {item.count ? <span className="nav__count">{item.count}</span> : null}
            {item.dot ? <span className="nav__dot" /> : null}
          </button>
        ))}
      </div>

      <div className="nav__bottom">
        <button
          type="button"
          className={`nav__item${activeNav === 'settings' ? ' nav__item--active' : ''}`}
          onClick={() => onNavItemClick('settings')}
        >
          <span className="nav__icon">
            <NavIcon name="settings" />
          </span>
          <span className="nav__label">Settings</span>
        </button>

        <button type="button" className="nav__class-code" onClick={onClassCodeClick}>
          <div className="class-code__icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <div className="class-code__text">
            <div className="class-code__code">PLAY-2X4Q</div>
          </div>
        </button>
      </div>
    </aside>
  )
}
