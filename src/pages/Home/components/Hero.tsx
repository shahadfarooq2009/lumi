import type { GameItem } from '../data/games'
import { arabicFontClass } from '../../../lib/arabicFont'

interface HeroProps {
  featuredGame: GameItem
  onFeaturedPlay: () => void
}

const META_CHIPS = [
  {
    label: 'Powered by AI',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 text-[#7C4DFF]">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
  },
  {
    label: '60s to play',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 text-[#7C4DFF]">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    label: '12K players today',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4 text-[#7C4DFF]">
        <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
      </svg>
    ),
  },
]

export function Hero({ featuredGame, onFeaturedPlay }: HeroProps) {
  return (
    <section className="mb-14 mt-10 grid grid-cols-1 items-stretch gap-8 sm:mb-16 sm:mt-12 lg:grid-cols-2 lg:gap-10">
      <div className="flex flex-col justify-center">
        <h1 className="m-0 mb-3.5 font-display text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.02] tracking-[-1.5px] text-[#1B1530]">
          Turn anything into
          <br />
          a{' '}
          <span className="relative inline-block bg-gradient-to-r from-[#7C4DFF] to-[#B388FF] bg-clip-text text-transparent">
            game you&apos;ll love
          </span>
          .
        </h1>
        <p className="m-0 mb-5 max-w-[520px] text-[17px] leading-[1.55] text-[#6B6585]">
          Drop a PDF, slide deck, or any document. Lumi&apos;s AI spins it into bite-sized, addictive
          learning games — built for curious minds.
        </p>
        <div className="flex flex-wrap gap-[18px]">
          {META_CHIPS.map((chip) => (
            <div
              key={chip.label}
              className="flex items-center gap-2.5 rounded-full border border-[#ECE7FB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#1B1530] shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]"
            >
              {chip.icon}
              {chip.label}
            </div>
          ))}
        </div>
      </div>

      <div
        className="relative flex w-full min-h-[240px] flex-col justify-end overflow-hidden rounded-[26px] p-6 text-white shadow-[0_30px_60px_-25px_rgba(124,77,255,0.5)] sm:min-h-[260px] sm:p-7 lg:min-h-[280px]"
        style={{ background: 'linear-gradient(135deg, #7C4DFF 0%, #B388FF 60%, #E9DEFF 100%)' }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(300px 200px at 90% 10%, rgba(255,255,255,0.35), transparent 60%), radial-gradient(200px 200px at 0% 100%, rgba(255,255,255,0.2), transparent 60%)',
          }}
        />
        <div className="pointer-events-none absolute -bottom-10 -right-[30px] h-[180px] w-[180px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,255,255,0.6),rgba(255,255,255,0)_60%)]" />

        <p className="relative text-[12px] font-bold uppercase tracking-[1.5px] opacity-90">
          ⚡ Featured Today
        </p>
        <h3
          className={arabicFontClass(
            featuredGame.title,
            'relative m-0 mb-1.5 mt-2 font-display text-[28px] font-extrabold tracking-[-0.5px]',
          )}
        >
          {featuredGame.title}
        </h3>
        <p className="relative m-0 mb-[18px] max-w-[300px] text-[14px] opacity-90">
          {featuredGame.description}
        </p>
        <button
          type="button"
          onClick={onFeaturedPlay}
          className="relative inline-flex items-center gap-2 rounded-full bg-white/95 px-[18px] py-[11px] text-[13.5px] font-bold text-[#7C4DFF] transition-all hover:-translate-y-px hover:shadow-[0_10px_24px_-8px_rgba(0,0,0,0.2)]"
        >
          Play featured ▶
        </button>
      </div>
    </section>
  )
}
