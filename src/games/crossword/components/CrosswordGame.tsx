import { useMemo } from 'react'
import type { EditQuizQuestion } from '../../../types/editQuiz'
import { ActiveClueCard } from './ActiveClueCard'
import { BoardPanel } from './BoardPanel'
import { CluesSidebar } from './CluesSidebar'
import { Controls } from './Controls'
import { CrosswordGrid } from './Crossword/CrosswordGrid'
import { Topbar } from './Topbar'
import { useGridFocus } from './useGridFocus'
import { getCellBiologyPuzzle } from '../data/cellBiologyPuzzle'
import { useCrossword } from '../hooks/useCrossword'
import { buildCrosswordFromQuestions } from '../lib/buildCrosswordFromQuestions'

interface CrosswordGameProps {
  title?: string
  questions?: EditQuizQuestion[]
  embedded?: boolean
  onBack?: () => void
}

export function CrosswordGame({
  title,
  questions,
  embedded = false,
  onBack,
}: CrosswordGameProps) {
  const puzzle = useMemo(() => {
    if (questions && questions.length > 0) {
      return buildCrosswordFromQuestions(questions, title ?? 'Crossword')
    }
    const fallback = getCellBiologyPuzzle()
    return { ...fallback, title: title ?? fallback.title }
  }, [questions, title])

  const crossword = useCrossword(puzzle)
  useGridFocus(crossword)

  const {
    grid,
    selected,
    activeWord,
    activeWordId,
    hintsRemaining,
    score,
    starsEarned,
    solvedIds,
    solvedWords,
    selectCell,
    isCellInActiveWord,
    goToWord,
    goToPrevWord,
    goToNextWord,
    checkAnswers,
    useHint,
    reset,
    puzzle: activePuzzle,
  } = crossword

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden bg-surface-bg ${
        embedded ? 'h-full gap-2 p-2' : 'mx-auto min-h-screen max-w-[1400px] gap-4 p-4'
      }`}
    >
      <Topbar
        title={activePuzzle.title}
        score={score}
        starsEarned={starsEarned}
        compact={embedded}
        onBack={onBack}
      />

      <div
        className={`grid min-h-0 flex-1 gap-3 overflow-hidden ${
          embedded
            ? 'grid-cols-1'
            : 'grid-cols-1 lg:grid-cols-[1fr_320px]'
        }`}
      >
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <BoardPanel>
            <ActiveClueCard word={activeWord} onPrev={goToPrevWord} onNext={goToNextWord} />
            <CrosswordGrid
              grid={grid}
              cols={activePuzzle.size.cols}
              selected={selected}
              isCellInActiveWord={isCellInActiveWord}
              onSelectCell={selectCell}
            />
            <Controls
              hintsRemaining={hintsRemaining}
              onHint={useHint}
              onCheck={checkAnswers}
              onReset={reset}
              onNext={reset}
            />
          </BoardPanel>
        </div>

        <CluesSidebar
          words={activePuzzle.words}
          activeWordId={activeWordId}
          solvedIds={solvedIds}
          solvedCount={solvedWords.length}
          onSelectWord={goToWord}
        />
      </div>
    </div>
  )
}
