export function Avatar() {
  return (
    <button type="button" className="fc-avatar" aria-label="Profile">
      <svg viewBox="0 0 32 32">
        <defs>
          <radialGradient id="fcAvatarBody" cx="50%" cy="40%">
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#fde68a" />
          </radialGradient>
        </defs>
        <circle cx="16" cy="16" r="13" fill="url(#fcAvatarBody)" stroke="rgba(176,50,70,0.2)" strokeWidth="1" />
        <circle cx="11" cy="14" r="1.6" fill="#2d1518" />
        <circle cx="21" cy="14" r="1.6" fill="#2d1518" />
        <circle cx="11.5" cy="13.5" r="0.5" fill="#fff" />
        <circle cx="21.5" cy="13.5" r="0.5" fill="#fff" />
        <path d="M12 19 Q16 21.5 20 19" stroke="#2d1518" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <circle cx="8" cy="17" r="1.6" fill="#fda4af" opacity="0.6" />
        <circle cx="24" cy="17" r="1.6" fill="#fda4af" opacity="0.6" />
      </svg>
    </button>
  )
}
