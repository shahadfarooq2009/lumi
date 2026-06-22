interface AppHeaderProps {
  onToggleNav: () => void
}

export function AppHeader({ onToggleNav }: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="nav__brand">
        <div className="nav__brand-logo">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <path d="M9 24.5C9 14.5 15 10.5 23 13.5" stroke="#5b21b6" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M23 7.5C23 17.5 17 21.5 9 18.5" stroke="#2dd4bf" strokeWidth="3.6" strokeLinecap="round" />
          </svg>
        </div>
        <span className="nav__brand-name">Quizora</span>
      </div>
      <button type="button" className="sidebar-toggle" title="Toggle sidebar" onClick={onToggleNav}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>
    </header>
  )
}
