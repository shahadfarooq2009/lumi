import type { Direction, Word } from '../types/crossword'

export interface CrosswordEntry {
  id: string
  answer: string
  clue: string
}

type GridCell = { letter: string } | null

const WORKSPACE = 41
const MAX_BRANCH = 10

function createWorkspace(): GridCell[][] {
  return Array.from({ length: WORKSPACE }, () =>
    Array.from({ length: WORKSPACE }, () => null),
  )
}

function cloneGrid(grid: GridCell[][]): GridCell[][] {
  return grid.map((row) => row.map((cell) => (cell ? { ...cell } : null)))
}

function inBounds(grid: GridCell[][], row: number, col: number): boolean {
  return row >= 0 && col >= 0 && row < grid.length && col < grid[0].length
}

function cellAt(grid: GridCell[][], row: number, col: number): GridCell {
  if (!inBounds(grid, row, col)) return null
  return grid[row][col]
}

function delta(direction: Direction) {
  return direction === 'across' ? { dr: 0, dc: 1 } : { dr: 1, dc: 0 }
}

function isValidPlacement(
  grid: GridCell[][],
  answer: string,
  direction: Direction,
  startRow: number,
  startCol: number,
  requireIntersection: boolean,
): boolean {
  const { dr, dc } = delta(direction)
  let intersections = 0

  if (cellAt(grid, startRow - dr, startCol - dc)) return false
  if (cellAt(grid, startRow + dr * answer.length, startCol + dc * answer.length)) return false

  for (let index = 0; index < answer.length; index++) {
    const row = startRow + dr * index
    const col = startCol + dc * index
    if (!inBounds(grid, row, col)) return false

    const letter = answer[index]
    const existing = grid[row][col]

    if (existing) {
      if (existing.letter !== letter) return false
      intersections++
    } else if (direction === 'across') {
      if (cellAt(grid, row - 1, col) || cellAt(grid, row + 1, col)) return false
    } else if (cellAt(grid, row, col - 1) || cellAt(grid, row, col + 1)) {
      return false
    }
  }

  return !requireIntersection || intersections > 0
}

function commitPlacement(
  grid: GridCell[][],
  answer: string,
  direction: Direction,
  startRow: number,
  startCol: number,
) {
  const { dr, dc } = delta(direction)
  for (let index = 0; index < answer.length; index++) {
    const row = startRow + dr * index
    const col = startCol + dc * index
    grid[row][col] = { letter: answer[index] }
  }
}

interface PlacementCandidate {
  entryIndex: number
  direction: Direction
  startRow: number
  startCol: number
  score: number
}

function letterCountsOnGrid(grid: GridCell[][]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const row of grid) {
    for (const cell of row) {
      if (!cell) continue
      counts.set(cell.letter, (counts.get(cell.letter) ?? 0) + 1)
    }
  }
  return counts
}

function sharedLetterScore(answer: string, counts: Map<string, number>): number {
  let score = 0
  for (const letter of answer) {
    score += counts.get(letter) ?? 0
  }
  return score
}

function scorePlacement(
  grid: GridCell[][],
  answer: string,
  direction: Direction,
  startRow: number,
  startCol: number,
): number {
  const { dr, dc } = delta(direction)
  let intersections = 0
  const center = Math.floor(WORKSPACE / 2)

  for (let index = 0; index < answer.length; index++) {
    const row = startRow + dr * index
    const col = startCol + dc * index
    if (grid[row][col]) intersections++
  }

  const midRow = startRow + (dr * (answer.length - 1)) / 2
  const midCol = startCol + (dc * (answer.length - 1)) / 2
  const dist = Math.abs(midRow - center) + Math.abs(midCol - center)

  return intersections * 200 + (direction === 'down' ? 5 : 0) - dist
}

function findAllPlacements(
  grid: GridCell[][],
  remaining: CrosswordEntry[],
): PlacementCandidate[] {
  const candidates: PlacementCandidate[] = []

  for (let entryIndex = 0; entryIndex < remaining.length; entryIndex++) {
    const entry = remaining[entryIndex]
    const directions: Direction[] = ['across', 'down']

    for (const direction of directions) {
      const { dr, dc } = delta(direction)

      for (let row = 0; row < WORKSPACE; row++) {
        for (let col = 0; col < WORKSPACE; col++) {
          if (!grid[row][col]) continue

          const letter = grid[row][col]!.letter
          for (let index = 0; index < entry.answer.length; index++) {
            if (entry.answer[index] !== letter) continue

            const startRow = row - dr * index
            const startCol = col - dc * index

            if (
              !isValidPlacement(grid, entry.answer, direction, startRow, startCol, true)
            ) {
              continue
            }

            candidates.push({
              entryIndex,
              direction,
              startRow,
              startCol,
              score: scorePlacement(grid, entry.answer, direction, startRow, startCol),
            })
          }
        }
      }
    }
  }

  return candidates
}

function getOccupiedBounds(grid: GridCell[][]) {
  let minRow = Infinity
  let minCol = Infinity
  let maxRow = -Infinity
  let maxCol = -Infinity

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (!grid[row][col]) continue
      minRow = Math.min(minRow, row)
      minCol = Math.min(minCol, col)
      maxRow = Math.max(maxRow, row)
      maxCol = Math.max(maxCol, col)
    }
  }

  if (maxRow < 0) return null
  return { minRow, minCol, maxRow, maxCol }
}

interface InternalPlacement {
  entry: CrosswordEntry
  direction: Direction
  startRow: number
  startCol: number
}

function assignNumbers(placements: InternalPlacement[]): Word[] {
  const sorted = [...placements].sort(
    (a, b) => a.startRow - b.startRow || a.startCol - b.startCol,
  )
  const numberAt = new Map<string, number>()
  let nextNumber = 1

  return sorted.map((placement) => {
    const key = `${placement.startRow},${placement.startCol}`
    if (!numberAt.has(key)) {
      numberAt.set(key, nextNumber++)
    }
    const number = numberAt.get(key)!

    return {
      id: `${number}-${placement.direction}`,
      number,
      direction: placement.direction,
      answer: placement.entry.answer,
      clue: placement.entry.clue,
      meta: `${placement.entry.answer.length} letters`,
      startRow: placement.startRow,
      startCol: placement.startCol,
    }
  })
}

function scoreLayoutQuality(words: Word[], size: { rows: number; cols: number }): number {
  const area = size.rows * size.cols
  const downCount = words.filter((word) => word.direction === 'down').length
  const acrossCount = words.length - downCount
  const mixBonus = downCount > 0 && acrossCount > 0 ? 500 : 0
  return words.length * 1000 + mixBonus - area
}

function normalizeLayout(placements: InternalPlacement[]) {
  const grid = createWorkspace()
  for (const placement of placements) {
    commitPlacement(
      grid,
      placement.entry.answer,
      placement.direction,
      placement.startRow,
      placement.startCol,
    )
  }

  const bounds = getOccupiedBounds(grid)
  if (!bounds) return null

  const offsetRow = Math.max(0, bounds.minRow - 1)
  const offsetCol = Math.max(0, bounds.minCol - 1)
  const rows = bounds.maxRow - offsetRow + 2
  const cols = bounds.maxCol - offsetCol + 2

  const normalized = placements.map((placement) => ({
    ...placement,
    startRow: placement.startRow - offsetRow,
    startCol: placement.startCol - offsetCol,
  }))

  const words = assignNumbers(normalized)

  return {
    words,
    size: { rows, cols },
    quality: scoreLayoutQuality(words, { rows, cols }),
  }
}

function backtrack(
  grid: GridCell[][],
  remaining: CrosswordEntry[],
  placements: InternalPlacement[],
): InternalPlacement[] | null {
  if (remaining.length === 0) return placements

  const counts = letterCountsOnGrid(grid)
  const ordered = [...remaining].sort(
    (a, b) => sharedLetterScore(b.answer, counts) - sharedLetterScore(a.answer, counts),
  )

  const candidates = findAllPlacements(grid, ordered)
  if (candidates.length === 0) return null

  candidates.sort((a, b) => b.score - a.score)
  const branch = candidates.slice(0, MAX_BRANCH)

  for (const candidate of branch) {
    const entry = ordered[candidate.entryIndex]
    const nextGrid = cloneGrid(grid)
    commitPlacement(
      nextGrid,
      entry.answer,
      candidate.direction,
      candidate.startRow,
      candidate.startCol,
    )

    const nextRemaining = remaining.filter((item) => item.id !== entry.id)
    const result = backtrack(nextGrid, nextRemaining, [
      ...placements,
      {
        entry,
        direction: candidate.direction,
        startRow: candidate.startRow,
        startCol: candidate.startCol,
      },
    ])

    if (result) return result
  }

  return null
}

function tryAnchorLayout(
  entries: CrosswordEntry[],
  anchorIndex: number,
  anchorDirection: Direction,
) {
  const grid = createWorkspace()
  const center = Math.floor(WORKSPACE / 2)
  const anchor = entries[anchorIndex]
  const remaining = entries.filter((_, index) => index !== anchorIndex)

  const startRow =
    anchorDirection === 'across'
      ? center
      : center - Math.floor(anchor.answer.length / 2)
  const startCol =
    anchorDirection === 'across'
      ? center - Math.floor(anchor.answer.length / 2)
      : center

  if (!isValidPlacement(grid, anchor.answer, anchorDirection, startRow, startCol, false)) {
    return null
  }

  commitPlacement(grid, anchor.answer, anchorDirection, startRow, startCol)

  const solved = backtrack(grid, remaining, [
    {
      entry: anchor,
      direction: anchorDirection,
      startRow,
      startCol,
    },
  ])

  if (!solved) return null
  return normalizeLayout(solved)
}

export function layoutCrosswordEntries(entries: CrosswordEntry[]): {
  words: Word[]
  size: { rows: number; cols: number }
} | null {
  if (entries.length === 0) return null

  if (entries.length === 1) {
    const center = Math.floor(WORKSPACE / 2)
    return normalizeLayout([
      {
        entry: entries[0],
        direction: 'across',
        startRow: center,
        startCol: center,
      },
    ])
  }

  const anchorOrder = [...entries.keys()].sort(
    (a, b) => entries[b].answer.length - entries[a].answer.length,
  )

  let best: ReturnType<typeof normalizeLayout> = null

  for (const anchorIndex of anchorOrder) {
    for (const direction of ['down', 'across'] as Direction[]) {
      const layout = tryAnchorLayout(entries, anchorIndex, direction)
      if (!layout) continue

      if (layout.words.length === entries.length && layout.quality > (best?.quality ?? -Infinity)) {
        best = layout
      }

      const hasMix =
        layout.words.some((word) => word.direction === 'down') &&
        layout.words.some((word) => word.direction === 'across')

      if (layout.words.length === entries.length && hasMix) {
        return { words: layout.words, size: layout.size }
      }
    }
  }

  return best ? { words: best.words, size: best.size } : null
}
