import type { ReactNode } from 'react'
import type { NavPageId } from '../data/nav'
import { GridSpotlight } from './GridSpotlight'
import { Topbar } from './Topbar'

type LumiPageLayoutProps = {
  activePage: NavPageId
  onNavigate: (page: NavPageId) => void
  children: ReactNode
  contentClassName?: string
  enableSpotlight?: boolean
}

export function LumiPageLayout({
  activePage,
  onNavigate,
  children,
  contentClassName = '',
  enableSpotlight = false,
}: LumiPageLayoutProps) {
  return (
    <div className="lumi-app">
      {enableSpotlight ? <GridSpotlight /> : null}
      <header className="lumi-page-header">
        <div className="lumi-page-header__inner">
          <Topbar activePage={activePage} onNavigate={onNavigate} />
        </div>
      </header>
      <div
        className={`lumi-app__inner lumi-app__inner--with-header mx-auto max-w-[1320px] px-5 pb-20 sm:px-10 ${contentClassName}`}
      >
        {children}
      </div>
    </div>
  )
}
