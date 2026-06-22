import type { GameItem } from '../data/games'
import { GameThumbnail } from '../thumbnails/GameThumbnails'

interface GameTileProps {
  game: GameItem
  onOpen: () => void
}

const BADGES: Record<string, { text: string; variant: 'hot' | 'new' }> = {
  crossword: { text: 'FEATURED', variant: 'new' },
  flashcard: { text: 'HOT', variant: 'hot' },
  dragdrop: { text: 'CO-OP', variant: 'new' },
  sudoku: { text: 'NEW', variant: 'new' },
}

export function GameTile({ game, onOpen }: GameTileProps) {
  const badge = BADGES[game.key]

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => e.key === 'Enter' && onOpen()}
      className="group relative cursor-pointer overflow-hidden rounded-[20px] border border-[#ECE7FB] bg-white shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)] transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(124,77,255,0.2)] hover:shadow-[0_14px_40px_-18px_rgba(124,77,255,0.35),0_2px_8px_rgba(124,77,255,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7C4DFF]/30"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-[#F6F2FF]">
        <GameThumbnail gameKey={game.key} image={game.image} />
        {badge ? (
          <div
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1.5 text-[11px] font-bold tracking-[0.3px] ${
              badge.variant === 'hot'
                ? 'border-0 bg-gradient-to-br from-[#FF5C7A] to-[#FF8AA0] text-white'
                : 'border-0 bg-gradient-to-br from-[#7C4DFF] to-[#B388FF] text-white'
            }`}
          >
            {badge.text}
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-2 px-3.5 pb-4 pt-3.5 sm:gap-3 sm:px-[18px] sm:pb-5 sm:pt-[18px]">
        <h3 className="m-0 truncate font-display text-[15px] font-bold tracking-[-0.3px] text-[#1B1530] sm:text-[18px]">
          {game.title}
        </h3>
        <p className="m-0 line-clamp-2 text-[11px] leading-[1.45] text-[#6B6585] sm:text-[13px]">
          {game.description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="hidden gap-3 text-[12px] font-semibold text-[#6B6585] sm:flex">
            <span>⏱ 5m</span>
            <span>★ {game.rating}</span>
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onOpen()
            }}
            className="ml-auto flex items-center gap-1.5 rounded-xl bg-gradient-to-br from-[#7C4DFF] to-[#9A6BFF] px-3 py-1.5 text-[12px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(124,77,255,0.6)] transition-all hover:-translate-y-px sm:px-3.5 sm:py-2 sm:text-[13px]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play
          </button>
        </div>
      </div>
    </article>
  )
}
