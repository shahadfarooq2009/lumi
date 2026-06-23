export type Direction = 'across' | 'down'

export type CellState = 'letter' | 'correct' | 'wrong' | 'hint'

export type TilePalette = 'mint' | 'lavender'

export interface Word {
  id: string
  number: number
  direction: Direction
  answer: string
  clue: string
  meta?: string
  startRow: number
  startCol: number
  palette?: TilePalette
}

export interface Cell {
  row: number
  col: number
  letter: string
  number?: number
  userValue: string
  state: CellState
  wordIds: string[]
}

export interface Puzzle {
  id: string
  title: string
  topic: string
  size: { rows: number; cols: number }
  grid: (Cell | null)[][]
  words: Word[]
  hintsRemaining: number
}
