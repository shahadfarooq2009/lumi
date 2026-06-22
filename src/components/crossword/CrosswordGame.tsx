import { useMemo } from 'react'
import { ActiveClueCard } from './ActiveClueCard'
import { BoardPanel } from './BoardPanel'
import { CrosswordGrid } from './Crossword/CrosswordGrid'
import { Topbar } from './Topbar'
import { useGridFocus } from './useGridFocus'
import { getCellBiologyPuzzle } from '../../data/cellBiologyPuzzle'
import { buildCrosswordFromQuestions } from '../../lib/buildCrosswordFromQuestions'
import { useCrossword } from '../../hooks/useCrossword'
import type { EditQuizQuestion } from '../../types/editQuiz'

interface CrosswordGameProps {
  title?: string
  questions?: EditQuizQuestion[]
  embedded?: boolean
  onBack?: () => void
}

export function CrosswordGame({
  title = getCellBiologyPuzzle().title,
  questions,
  embedded = false,
  onBack,
}: CrosswordGameProps) {
  const puzzle = useMemo(() => {
    if (questions && questions.length > 0) {
      return buildCrosswordFromQuestions(questions, title)
    }
    const base = getCellBiologyPuzzle()
    return { ...base, title }
  }, [questions, title])

  const crossword = useCrossword(puzzle)
  useGridFocus(crossword)

  const {
    grid,
    selected,
    activeWord,
    score,
    starsEarned,
    selectCell,
    isCellInActiveWord,
    goToPrevWord,
    goToNextWord,
    puzzle: activePuzzle,
  } = crossword

  return (
    <div
      className={`flex h-full min-h-0 flex-col overflow-hidden bg-white ${
        embedded ? 'gap-1.5 p-1.5' : 'mx-auto min-h-screen max-w-[1400px] gap-3 p-3'
      }`}
    >
      <Topbar
        title={activePuzzle.title}
        score={score}
        starsEarned={starsEarned}
        compact={embedded}
        onBack={onBack}
      />

      <BoardPanel fill>
        <ActiveClueCard
          word={activeWord}
          onPrev={goToPrevWord}
          onNext={goToNextWord}
          compact={embedded}
          className="w-full max-w-[min(100%,680px)]"
        />
        <div className="flex w-full flex-1 items-center justify-center px-3 py-4">
          <CrosswordGrid
            grid={grid}
            cols={activePuzzle.size.cols}
            selected={selected}
            isCellInActiveWord={isCellInActiveWord}
            onSelectCell={selectCell}
            fill
          />
        </div>
      </BoardPanel>
    </div>
  )
}
