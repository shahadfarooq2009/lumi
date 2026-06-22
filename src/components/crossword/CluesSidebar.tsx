import type { Word } from '../../types/crossword'
import { ClueGroup } from './ClueGroup'
import { ProgressCard } from './ProgressCard'

interface CluesSidebarProps {
  words: Word[]
  activeWordId: string | null
  solvedIds: Set<string>
  solvedCount: number
  onSelectWord: (wordId: string) => void
}

export function CluesSidebar({
  words,
  activeWordId,
  solvedIds,
  solvedCount,
  onSelectWord,
}: CluesSidebarProps) {
  const across = words
    .filter((w) => w.direction === 'across')
    .sort((a, b) => a.number - b.number)
  const down = words
    .filter((w) => w.direction === 'down')
    .sort((a, b) => a.number - b.number)

  return (
    <aside className="flex max-h-full flex-col gap-4 overflow-y-auto rounded-3xl border border-border-soft bg-white p-5 shadow-[0_2px_4px_rgba(20,14,38,0.04),0_8px_24px_-12px_rgba(20,14,38,0.1),inset_0_-4px_0_rgba(20,14,38,0.03),inset_0_1px_0_rgba(255,255,255,1)]">
      <ProgressCard solvedCount={solvedCount} totalWords={words.length} />
      <ClueGroup
        direction="across"
        clues={across}
        activeWordId={activeWordId}
        solvedIds={solvedIds}
        onSelectWord={onSelectWord}
      />
      <ClueGroup
        direction="down"
        clues={down}
        activeWordId={activeWordId}
        solvedIds={solvedIds}
        onSelectWord={onSelectWord}
      />
    </aside>
  )
}
