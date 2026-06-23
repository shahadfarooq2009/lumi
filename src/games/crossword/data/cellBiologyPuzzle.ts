import { createPlayablePuzzle } from '../lib/crosswordGrid'
import type { Word } from '../types/crossword'

const WORDS: Word[] = [
  {
    id: '1-down',
    number: 1,
    direction: 'down',
    answer: 'MEMBRANE',
    clue: 'Outer layer that surrounds the cell',
    meta: '8 letters',
    startRow: 0,
    startCol: 4,
  },
  {
    id: '2-across',
    number: 2,
    direction: 'across',
    answer: 'CELL',
    clue: 'The basic unit of life',
    meta: '4 letters',
    startRow: 1,
    startCol: 0,
  },
  {
    id: '3-across',
    number: 3,
    direction: 'across',
    answer: 'NUCLEUS',
    clue: 'Controls the activities of the cell',
    meta: '7 letters',
    startRow: 8,
    startCol: 0,
  },
  {
    id: '5-across',
    number: 5,
    direction: 'across',
    answer: 'DNA',
    clue: 'Contains the genetic information',
    meta: '3 letters · abbreviation',
    startRow: 6,
    startCol: 3,
  },
  {
    id: '6-across',
    number: 6,
    direction: 'across',
    answer: 'ENERGY',
    clue: 'Produces energy for the cell',
    meta: '6 letters',
    startRow: 7,
    startCol: 5,
  },
  {
    id: '7-across',
    number: 7,
    direction: 'across',
    answer: 'RIBOSOME',
    clue: 'Site of protein synthesis in the cell',
    meta: '8 letters',
    startRow: 9,
    startCol: 2,
  },
]

function buildPuzzle() {
  return createPlayablePuzzle({
    id: 'cell-biology-1',
    title: 'Cell Biology Basics',
    topic: 'Crossword Puzzle',
    size: { rows: 11, cols: 11 },
    words: WORDS,
    hintsRemaining: 3,
  })
}

let cached: ReturnType<typeof buildPuzzle> | null = null

export function getCellBiologyPuzzle() {
  if (!cached) cached = buildPuzzle()
  return cached
}

/** @deprecated Prefer getCellBiologyPuzzle() — kept for direct imports */
export const cellBiologyPuzzle = getCellBiologyPuzzle()
