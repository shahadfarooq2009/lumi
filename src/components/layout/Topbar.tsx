import { HomeChatIconButton } from '../build/HomeChatFab'

export function Topbar() {
  return (
    <div className="topbar">
      <div className="search-bar">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input type="text" placeholder="Search games, themes, students…" />
        <kbd>⌘ K</kbd>
      </div>

      <div className="topbar__right">
        <HomeChatIconButton />
        <button type="button" className="icon-btn" title="Help">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </button>
        <button type="button" className="icon-btn" title="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="icon-btn__badge">3</span>
        </button>
        <button type="button" className="credits">
          <span className="credits__coin">★</span>
          <span>240</span>
          <span className="credits__divider">|</span>
          <span className="credits__upgrade">Upgrade</span>
        </button>
        <div className="avatar">
          F
          <span className="avatar__online" />
        </div>
      </div>
    </div>
  )
}
