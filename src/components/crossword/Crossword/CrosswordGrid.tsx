import type { Cell } from '../../../types/crossword'
import { Tile } from './Tile'

interface CrosswordGridProps {
  grid: (Cell | null)[][]
  cols: number
  selected: { row: number; col: number } | null
  isCellInActiveWord: (row: number, col: number) => boolean
  onSelectCell: (row: number, col: number) => void
  fill?: boolean
}

export function CrosswordGrid({
  grid,
  cols,
  selected,
  isCellInActiveWord,
  onSelectCell,
  fill = false,
}: CrosswordGridProps) {
  return (
    <div
      className={`relative z-10 grid rounded-3xl bg-white p-4 ${
        fill
          ? 'mx-auto aspect-square w-full max-w-[min(100%,640px)] gap-1.5 sm:max-w-[min(100%,680px)]'
          : 'w-full max-w-[680px] gap-1.5 max-sm:max-w-[560px]'
      }`}
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {grid.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            row={rowIndex}
            col={colIndex}
            cols={cols}
            isSelected={selected?.row === rowIndex && selected?.col === colIndex}
            isInActiveWord={isCellInActiveWord(rowIndex, colIndex)}
            onClick={() => onSelectCell(rowIndex, colIndex)}
          />
        )),
      )}
    </div>
  )
}
