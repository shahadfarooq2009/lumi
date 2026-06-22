export function tileStyleClasses(isSelected: boolean, isInActiveWord: boolean) {
  const lavender = {
    base: 'border-[1.5px] border-violet-300 bg-gradient-to-b from-violet-50 to-[#f5f3ff] text-violet-900 shadow-[0_3px_0_0_#c4b5fd,0_5px_14px_-4px_rgba(124,58,237,0.14)]',
    active:
      'border-violet-400 bg-gradient-to-b from-violet-100 to-violet-50 text-violet-950 shadow-[0_3px_0_0_#a78bfa,0_5px_14px_-4px_rgba(124,58,237,0.2)]',
    selected:
      'z-10 -translate-y-px border-violet-500 bg-gradient-to-b from-violet-200 to-violet-100 text-violet-950 shadow-[0_0_0_3px_rgba(221,214,254,0.85),0_4px_0_0_#8b5cf6,0_8px_18px_-4px_rgba(124,58,237,0.28)]',
    number: 'text-violet-500',
    numberSelected: 'text-violet-800',
  }

  if (isSelected) {
    return { tile: lavender.selected, number: lavender.numberSelected }
  }
  if (isInActiveWord) {
    return { tile: lavender.active, number: lavender.number }
  }
  return { tile: lavender.base, number: lavender.number }
}
