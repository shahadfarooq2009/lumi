import type { Cell, Direction, Puzzle, Word } from '../types/crossword'

function wordDelta(direction: Direction) {
  return direction === 'across' ? { dr: 0, dc: 1 } : { dr: 1, dc: 0 }
}

export function getWordCellCoords(word: Word): { row: number; col: number }[] {
  const { dr, dc } = wordDelta(word.direction)
  return word.answer.split('').map((_, i) => ({
    row: word.startRow + dr * i,
    col: word.startCol + dc * i,
  }))
}

export function buildGridFromWords(
  words: Word[],
  size: { rows: number; cols: number },
): (Cell | null)[][] {
  const { rows, cols } = size
  const grid: (Cell | null)[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null),
  )

  for (const word of words) {
    const { dr, dc } = wordDelta(word.direction)
    word.answer.split('').forEach((letter, index) => {
      const row = word.startRow + dr * index
      const col = word.startCol + dc * index
      if (row < 0 || row >= rows || col < 0 || col >= cols) {
        throw new Error(`Word ${word.id} out of bounds at ${row},${col}`)
      }

      const existing = grid[row][col]
      if (existing && existing.letter !== letter) {
        throw new Error(`Letter conflict at ${row},${col} for ${word.id}`)
      }

      if (existing) {
        if (!existing.wordIds.includes(word.id)) {
          existing.wordIds.push(word.id)
        }
        if (index === 0 && word.number != null) {
          existing.number = word.number
        }
      } else {
        grid[row][col] = {
          row,
          col,
          letter,
          number: index === 0 ? word.number : undefined,
          userValue: '',
          state: 'letter',
          wordIds: [word.id],
        }
      }
    })
  }

  return grid
}

export function cloneGrid(grid: (Cell | null)[][]): (Cell | null)[][] {
  return grid.map((row) =>
    row.map((cell) =>
      cell
        ? {
            ...cell,
            wordIds: [...cell.wordIds],
          }
        : null,
    ),
  )
}

export function isWordSolved(grid: (Cell | null)[][], word: Word): boolean {
  return getWordCellCoords(word).every(({ row, col }) => {
    const cell = grid[row][col]
    return cell != null && cell.userValue.toUpperCase() === cell.letter
  })
}

export function createPlayablePuzzle(base: Omit<Puzzle, 'grid'> & { words: Word[] }): Puzzle {
  const grid = buildGridFromWords(base.words, base.size)
  return { ...base, grid: cloneGrid(grid) }
}
