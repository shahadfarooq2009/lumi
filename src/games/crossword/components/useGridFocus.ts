import { useEffect } from 'react'
import type { UseCrosswordReturn } from '../hooks/useCrossword'

export function useGridFocus(crossword: UseCrosswordReturn) {
  const {
    selected,
    typeLetter,
    deleteLetter,
    moveDirection,
    switchDirection,
    goToNextWord,
  } = crossword

  useEffect(() => {
    if (!selected) return

    const handler = (e: KeyboardEvent) => {
      if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        typeLetter(e.key.toUpperCase())
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        deleteLetter()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        moveDirection('right')
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        moveDirection('left')
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        moveDirection('up')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        moveDirection('down')
      } else if (e.key === ' ' || e.key === 'Tab') {
        e.preventDefault()
        switchDirection()
      } else if (e.key === 'Enter') {
        e.preventDefault()
        goToNextWord()
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [
    deleteLetter,
    goToNextWord,
    moveDirection,
    selected,
    switchDirection,
    typeLetter,
  ])
}
