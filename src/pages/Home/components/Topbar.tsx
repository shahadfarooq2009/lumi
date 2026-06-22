import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation, useNavigate } from 'react-router-dom'
import { useCredits } from '../../../hooks/useCredits'
import { CREDITS_UPDATED_EVENT, formatCredits } from '../../../lib/credits'
import { ProfileMenu } from '../../../components/layout/ProfileMenu'
import { NAV_PAGES, type NavPageId } from '../data/nav'
import { navPageToPath, pathToNavPage } from '../lib/navRoutes'

interface TopbarProps {
  activePage?: NavPageId
  onNavigate: (page: NavPageId) => void
}

export function Topbar({ activePage: activePageProp, onNavigate }: TopbarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const activePage = activePageProp ?? pathToNavPage(location.pathname)
  const credits = useCredits()
  const [creditsPulse, setCreditsPulse] = useState(false)

  const handleNavClick = (page: NavPageId) => {
    const path = navPageToPath(page)
    if (path && path !== location.pathname) {
      navigate(path)
      return
    }
    onNavigate(page)
  }

  useEffect(() => {
    const onCreditsUpdated = () => {
      setCreditsPulse(true)
      window.setTimeout(() => setCreditsPulse(false), 700)
    }

    window.addEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated)
    return () => window.removeEventListener(CREDITS_UPDATED_EVENT, onCreditsUpdated)
  }, [])
  return (
    <nav className="flex items-center gap-3 rounded-full bg-white px-3 py-2.5 shadow-[0_4px_18px_-6px_rgba(124,77,255,0.07)] sm:gap-4 sm:px-5 sm:py-3 lg:px-6">
      <button
        type="button"
        onClick={() => onNavigate('home')}
        className="flex shrink-0 items-center gap-2.5 font-display text-[20px] font-extrabold text-[#1B1530] transition-opacity hover:opacity-90 sm:gap-3 sm:text-[22px]"
      >
        <div
          className="relative grid h-9 w-9 place-items-center rounded-[11px] font-extrabold text-white shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]"
          style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)' }}
        >
          <span className="relative z-10">L</span>
          <span
            className="pointer-events-none absolute inset-[3px] rounded-lg border-[1.5px] border-white/40"
            aria-hidden
          />
        </div>
        Lumi
      </button>

      <div className="hidden min-w-0 flex-1 items-center justify-center gap-4 text-[15px] font-medium text-[#6B6585] sm:flex lg:gap-6 lg:text-[16px]">
        {NAV_PAGES.map((link) => (
          <button
            key={link.id}
            type="button"
            onClick={() => handleNavClick(link.id)}
            className={`shrink-0 whitespace-nowrap transition-colors hover:text-[#7C4DFF] ${
              activePage === link.id ? 'font-semibold text-[#1B1530]' : ''
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
        <motion.button
          type="button"
          onClick={() => handleNavClick('pricing')}
          className="credits hidden sm:inline-flex"
          animate={creditsPulse ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 0.45 }}
        >
          <motion.span
            className="credits__coin"
            animate={creditsPulse ? { rotate: [0, -12, 12, 0], scale: [1, 1.15, 1] } : {}}
            transition={{ duration: 0.55 }}
          >
            ★
          </motion.span>
          <span>{formatCredits(credits)}</span>
          <span className="credits__divider">|</span>
          <span className="credits__upgrade">Upgrade</span>
        </motion.button>
        <ProfileMenu
          onAction={(action) => {
            if (action === 'archive') navigate('/archive')
          }}
        />
      </div>
    </nav>
  )
}
