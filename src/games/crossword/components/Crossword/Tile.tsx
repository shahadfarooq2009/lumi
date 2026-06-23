import { tileStyleClasses } from '../../lib/crosswordTileStyle'
import type { Cell } from '../../types/crossword'

interface TileProps {
  cell: Cell | null
  isSelected: boolean
  isInActiveWord: boolean
  row: number
  col: number
  cols: number
  onClick?: () => void
}

function stateOverrideClasses(cell: Cell) {
  if (cell.state === 'correct') {
    return 'animate-correctPulse cursor-pointer border-[1.5px] border-emerald-400 bg-gradient-to-b from-emerald-50 to-emerald-100 text-emerald-900 shadow-[0_4px_0_0_#34d399,0_5px_14px_-4px_rgba(52,211,153,0.25)]'
  }
  if (cell.state === 'wrong') {
    return 'animate-shake cursor-pointer border-[1.5px] border-red-300 bg-gradient-to-b from-red-50 to-red-100 text-red-900 shadow-[0_4px_0_0_#f87171,0_5px_14px_-4px_rgba(248,113,113,0.2)]'
  }
  if (cell.state === 'hint') {
    return 'cursor-pointer border-[1.5px] border-amber-300 bg-gradient-to-b from-amber-50 to-amber-100 text-amber-900 shadow-[0_4px_0_0_#fbbf24,0_5px_14px_-4px_rgba(251,191,36,0.2)]'
  }
  return null
}

function numberClassForState(cell: Cell, isSelected: boolean) {
  if (cell.state === 'correct') return 'text-emerald-700'
  if (cell.state === 'wrong') return 'text-red-700'
  if (cell.state === 'hint') return 'text-amber-700'
  if (isSelected) return 'text-violet-800'
  return 'text-violet-500'
}

export function Tile({
  cell,
  isSelected,
  isInActiveWord,
  row,
  col,
  cols,
  onClick,
}: TileProps) {
  if (!cell) {
    return <span className="aspect-square bg-transparent" aria-hidden />
  }

  const override = cell.state !== 'letter' ? stateOverrideClasses(cell) : null
  const style = override
    ? { tile: override, number: numberClassForState(cell, isSelected) }
    : tileStyleClasses(isSelected, isInActiveWord)

  const delay = (row * cols + col) * 0.02

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex aspect-square animate-bounceIn cursor-pointer select-none items-center justify-center rounded-2xl font-display text-lg font-extrabold uppercase transition-all duration-150 ease-out sm:text-xl ${style.tile}`}
      style={{ animationDelay: `${delay}s`, animationFillMode: 'backwards' }}
      aria-label={`Cell ${row + 1}, ${col + 1}`}
      aria-pressed={isSelected}
    >
      {cell.number != null ? (
        <span
          className={`absolute left-1 top-1 font-display text-[9px] font-bold leading-none ${style.number}`}
        >
          {cell.number}
        </span>
      ) : null}
      {cell.userValue || (cell.state === 'correct' ? cell.letter : '')}
    </button>
  )
}
