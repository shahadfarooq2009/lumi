import { useMemo, useState } from 'react'
import type { GameItem } from '../../../games/registry/games'
import { GameTile } from './GameTile'

interface GameGridProps {
  games: GameItem[]
  onOpen: (game: GameItem) => void
}

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'quick', label: 'Quick' },
  { id: 'brainy', label: 'Brainy' },
  { id: 'coop', label: 'Co-op' },
] as const

const TAB_FILTERS: Record<string, string[]> = {
  all: [],
  quick: ['crossword', 'flashcard', 'quiz', 'truefalse'],
  brainy: ['math', 'sudoku', 'wordsearch', 'fillblank'],
  coop: ['match', 'dragdrop', 'quiz'],
}

export function GameGrid({ games, onOpen }: GameGridProps) {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]['id']>('all')

  const filteredGames = useMemo(() => {
    const keys = TAB_FILTERS[activeTab]
    if (!keys.length) return games
    return games.filter((game) => keys.includes(game.key))
  }, [activeTab, games])

  return (
    <section className="mt-8">
      <div className="mb-[18px] flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 font-display text-2xl font-bold tracking-[-0.4px] text-[#1B1530]">
          Pick your game
        </h2>
        <div className="flex max-w-full gap-1 overflow-x-auto rounded-full border border-[#ECE7FB] bg-white p-1.5 shadow-[0_8px_24px_-12px_rgba(124,77,255,0.25)]">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all sm:px-4 sm:py-2 sm:text-[13px] ${
                activeTab === tab.id
                  ? 'bg-gradient-to-br from-[#7C4DFF] to-[#9A6BFF] text-white shadow-[0_6px_16px_-6px_rgba(124,77,255,0.5)]'
                  : 'bg-transparent text-[#6B6585] hover:text-[#1B1530]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
        {filteredGames.map((game) => (
          <GameTile key={game.key} game={game} onOpen={() => onOpen(game)} />
        ))}
      </div>
    </section>
  )
}
