import type { Cell } from '../../types/crossword'
import { Tile } from './Tile'

interface CrosswordGridProps {
  grid: (Cell | null)[][]
  cols: number
  selected: { row: number; col: number } | null
  isCellInActiveWord: (row: number, col: number) => boolean
  onSelectCell: (row: number, col: number) => void
}

export function CrosswordGrid({
  grid,
  cols,
  selected,
  isCellInActiveWord,
  onSelectCell,
}: CrosswordGridProps) {
  return (
    <div
      className="relative z-10 grid w-full max-w-[560px] gap-1 rounded-2xl border border-border-soft bg-white/60 p-3.5 shadow-[inset_0_2px_6px_rgba(20,14,38,0.04)] backdrop-blur-sm max-sm:max-w-[460px]"
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
