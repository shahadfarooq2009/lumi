import { useCallback, useMemo, useState } from 'react'
import { cloneGrid, getWordCellCoords, isWordSolved } from '../lib/crosswordGrid'
import type { Cell, Direction, Puzzle, Word } from '../types/crossword'

function coordsKey(row: number, col: number) {
  return `${row},${col}`
}

function pickWordAtCell(
  cell: Cell,
  words: Word[],
  preferred: Direction,
  previousId: string | null,
): Word | null {
  const candidates = words.filter((w) => cell.wordIds.includes(w.id))
  if (candidates.length === 0) return null
  if (candidates.length === 1) return candidates[0]

  const sameDir = candidates.find((w) => w.direction === preferred)
  if (sameDir && sameDir.id !== previousId) return sameDir

  const other = candidates.find((w) => w.id !== previousId)
  return other ?? candidates[0]
}

function nextCellInWord(
  word: Word,
  row: number,
  col: number,
  reverse = false,
): { row: number; col: number } | null {
  const coords = getWordCellCoords(word)
  const index = coords.findIndex((c) => c.row === row && c.col === col)
  if (index < 0) return null
  const nextIndex = reverse ? index - 1 : index + 1
  if (nextIndex < 0 || nextIndex >= coords.length) return null
  return coords[nextIndex]
}

export function useCrossword(puzzle: Puzzle) {
  const initialGrid = useMemo(() => cloneGrid(puzzle.grid), [puzzle.grid])

  const [grid, setGrid] = useState(initialGrid)
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null)
  const [activeWordId, setActiveWordId] = useState<string | null>(null)
  const [direction, setDirection] = useState<Direction>('across')
  const [hintsRemaining, setHintsRemaining] = useState(puzzle.hintsRemaining)
  const [score, setScore] = useState(450)
  const [starsEarned, setStarsEarned] = useState<0 | 1 | 2 | 3>(2)
  const [lastClickKey, setLastClickKey] = useState<string | null>(null)

  const activeWord = useMemo(
    () => puzzle.words.find((w) => w.id === activeWordId) ?? null,
    [activeWordId, puzzle.words],
  )

  const solvedWords = useMemo(
    () => puzzle.words.filter((w) => isWordSolved(grid, w)),
    [grid, puzzle.words],
  )

  const solvedIds = useMemo(() => new Set(solvedWords.map((w) => w.id)), [solvedWords])

  const selectCell = useCallback(
    (row: number, col: number) => {
      const cell = grid[row]?.[col]
      if (!cell) return

      const key = coordsKey(row, col)
      const toggling =
        selected?.row === row &&
        selected?.col === col &&
        lastClickKey === key &&
        cell.wordIds.length > 1

      if (toggling) {
        setDirection((d) => (d === 'across' ? 'down' : 'across'))
        const flipped = pickWordAtCell(
          cell,
          puzzle.words,
          direction === 'across' ? 'down' : 'across',
          activeWordId,
        )
        if (flipped) setActiveWordId(flipped.id)
        return
      }

      setSelected({ row, col })
      setLastClickKey(key)

      const preferred =
        cell.wordIds.length === 1
          ? puzzle.words.find((w) => w.id === cell.wordIds[0])?.direction ?? 'across'
          : direction

      const word = pickWordAtCell(cell, puzzle.words, preferred, null)
      if (word) {
        setActiveWordId(word.id)
        setDirection(word.direction)
      }
    },
    [activeWordId, direction, grid, lastClickKey, puzzle.words, selected],
  )

  const goToWord = useCallback(
    (wordId: string) => {
      const word = puzzle.words.find((w) => w.id === wordId)
      if (!word) return
      setActiveWordId(word.id)
      setDirection(word.direction)
      setSelected({ row: word.startRow, col: word.startCol })
      setLastClickKey(coordsKey(word.startRow, word.startCol))
    },
    [puzzle.words],
  )

  const orderedWords = useMemo(() => {
    return [...puzzle.words].sort((a, b) => a.number - b.number || a.direction.localeCompare(b.direction))
  }, [puzzle.words])

  const goToPrevWord = useCallback(() => {
    if (!activeWordId) {
      goToWord(orderedWords[0].id)
      return
    }
    const index = orderedWords.findIndex((w) => w.id === activeWordId)
    const prev = orderedWords[(index - 1 + orderedWords.length) % orderedWords.length]
    goToWord(prev.id)
  }, [activeWordId, goToWord, orderedWords])

  const goToNextWord = useCallback(() => {
    if (!activeWordId) {
      goToWord(orderedWords[0].id)
      return
    }
    const index = orderedWords.findIndex((w) => w.id === activeWordId)
    const next = orderedWords[(index + 1) % orderedWords.length]
    goToWord(next.id)
  }, [activeWordId, goToWord, orderedWords])

  const switchDirection = useCallback(() => {
    setDirection((d) => (d === 'across' ? 'down' : 'across'))
    if (!selected) return
    const cell = grid[selected.row][selected.col]
    if (!cell) return
    const word = pickWordAtCell(cell, puzzle.words, direction === 'across' ? 'down' : 'across', activeWordId)
    if (word) setActiveWordId(word.id)
  }, [activeWordId, direction, grid, puzzle.words, selected])

  const typeLetter = useCallback(
    (letter: string) => {
      if (!selected || !activeWord) return
      const { row, col } = selected
      setGrid((g) => {
        const next = cloneGrid(g)
        const cell = next[row][col]
        if (!cell) return g
        next[row][col] = { ...cell, userValue: letter.toUpperCase(), state: 'letter' }
        return next
      })
      setScore((s) => s + 5)
      const next = nextCellInWord(activeWord, row, col)
      if (next) {
        setSelected(next)
        setLastClickKey(coordsKey(next.row, next.col))
      }
    },
    [activeWord, grid, selected],
  )

  const deleteLetter = useCallback(() => {
    if (!selected || !activeWord) return
    const { row, col } = selected
    setGrid((g) => {
      const next = cloneGrid(g)
      const cell = next[row][col]
      if (!cell) return g
      next[row][col] = { ...cell, userValue: '', state: 'letter' }
      return next
    })
    const prev = nextCellInWord(activeWord, row, col, true)
    if (prev) {
      setSelected(prev)
      setLastClickKey(coordsKey(prev.row, prev.col))
    }
  }, [activeWord, grid, selected])

  const moveDirection = useCallback(
    (dir: 'up' | 'down' | 'left' | 'right') => {
      if (!selected) return
      const delta = {
        up: { dr: -1, dc: 0 },
        down: { dr: 1, dc: 0 },
        left: { dr: 0, dc: -1 },
        right: { dr: 0, dc: 1 },
      }[dir]
      let { row, col } = selected
      for (let i = 0; i < puzzle.size.cols + puzzle.size.rows; i++) {
        row += delta.dr
        col += delta.dc
        if (row < 0 || col < 0 || row >= puzzle.size.rows || col >= puzzle.size.cols) return
        if (grid[row][col]) {
          selectCell(row, col)
          return
        }
      }
    },
    [grid, puzzle.size.cols, puzzle.size.rows, selectCell, selected],
  )

  const checkAnswers = useCallback(() => {
    setGrid((g) => {
      const next = cloneGrid(g)
      for (const row of next) {
        for (const cell of row) {
          if (!cell || !cell.userValue) continue
          cell.state =
            cell.userValue.toUpperCase() === cell.letter ? 'correct' : 'wrong'
        }
      }
      const solved = puzzle.words.filter((w) => isWordSolved(next, w)).length
      setStarsEarned(Math.min(3, solved) as 0 | 1 | 2 | 3)
      return next
    })
  }, [puzzle.words])

  const useHint = useCallback(() => {
    if (hintsRemaining === 0 || !selected) return
    const { row, col } = selected
    setGrid((g) => {
      const next = cloneGrid(g)
      const cell = next[row][col]
      if (!cell) return g
      next[row][col] = {
        ...cell,
        userValue: cell.letter,
        state: 'hint',
      }
      return next
    })
    setHintsRemaining((h) => h - 1)
    setScore((s) => s - 10)
    if (activeWord) {
      const next = nextCellInWord(activeWord, row, col)
      if (next) setSelected(next)
    }
  }, [activeWord, grid, hintsRemaining, selected])

  const reset = useCallback(() => {
    setGrid(cloneGrid(initialGrid))
    setHintsRemaining(puzzle.hintsRemaining)
    setSelected(null)
    setActiveWordId(null)
    setDirection('across')
    setLastClickKey(null)
    setScore(450)
    setStarsEarned(2)
  }, [initialGrid, puzzle.hintsRemaining])

  const isCellInActiveWord = useCallback(
    (row: number, col: number) => {
      if (!activeWordId) return false
      const cell = grid[row]?.[col]
      return cell?.wordIds.includes(activeWordId) ?? false
    },
    [activeWordId, grid],
  )

  return {
    grid,
    selected,
    activeWord,
    activeWordId,
    direction,
    hintsRemaining,
    score,
    starsEarned,
    solvedWords,
    solvedIds,
    selectCell,
    typeLetter,
    deleteLetter,
    moveDirection,
    switchDirection,
    goToWord,
    goToPrevWord,
    goToNextWord,
    checkAnswers,
    useHint,
    reset,
    isCellInActiveWord,
    puzzle,
  }
}

export type UseCrosswordReturn = ReturnType<typeof useCrossword>
