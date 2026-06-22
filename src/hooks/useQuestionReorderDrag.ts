import { useCallback, useRef, useState } from 'react'

const DRAG_THRESHOLD_PX = 6

interface DragSession {
  fromIndex: number
  active: boolean
  startX: number
  startY: number
}

export function useQuestionReorderDrag(
  readOnly: boolean,
  questionCount: number,
  onReorder: (fromIndex: number, toIndex: number) => void,
) {
  const [dragFromIndex, setDragFromIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const [dragPointer, setDragPointer] = useState<{ x: number; y: number } | null>(null)
  const sessionRef = useRef<DragSession | null>(null)
  const dropIndexRef = useRef<number | null>(null)
  const didDragRef = useRef(false)

  const beginDrag = useCallback(
    (fromIndex: number, event: React.PointerEvent) => {
      if (readOnly) return
      event.preventDefault()
      event.stopPropagation()

      sessionRef.current = {
        fromIndex,
        active: false,
        startX: event.clientX,
        startY: event.clientY,
      }
      didDragRef.current = false
      setDragFromIndex(null)
      setDropIndex(null)
      setDragPointer(null)
      dropIndexRef.current = null

      const resolveDropIndex = (moveEvent: PointerEvent, fromIndex: number) => {
        const target = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)
        const gapEl = target?.closest('[data-drop-slot]')
        if (gapEl instanceof HTMLElement) {
          const slot = Number(gapEl.getAttribute('data-drop-slot'))
          const maxIndex = Math.max(0, questionCount - 1)
          if (Number.isFinite(slot) && slot >= 0 && slot <= maxIndex && slot !== fromIndex) {
            return slot
          }
          return null
        }

        const dropEl = target?.closest('[data-drop-index]')
        if (!(dropEl instanceof HTMLElement)) return null

        const badgeIndex = Number(dropEl.getAttribute('data-drop-index'))
        if (!Number.isFinite(badgeIndex)) return null

        const rect = dropEl.getBoundingClientRect()
        const insertAfter = moveEvent.clientX >= rect.left + rect.width / 2
        const rawIndex = insertAfter ? badgeIndex + 1 : badgeIndex
        const maxIndex = Math.max(0, questionCount - 1)
        const resolved = Math.max(0, Math.min(rawIndex, maxIndex))
        return resolved === fromIndex ? null : resolved
      }

      const onMove = (moveEvent: PointerEvent) => {
        const session = sessionRef.current
        if (!session) return

        if (!session.active) {
          const distance = Math.hypot(
            moveEvent.clientX - session.startX,
            moveEvent.clientY - session.startY,
          )
          if (distance < DRAG_THRESHOLD_PX) return
          session.active = true
          didDragRef.current = true
          setDragFromIndex(session.fromIndex)
          document.body.style.cursor = 'grabbing'
          document.body.style.userSelect = 'none'
        }

        if (session.active) {
          setDragPointer({ x: moveEvent.clientX, y: moveEvent.clientY })
          const resolved = resolveDropIndex(moveEvent, session.fromIndex)
          dropIndexRef.current = resolved
          setDropIndex(resolved)
        }
      }

      const onUp = (upEvent: PointerEvent) => {
        const session = sessionRef.current
        if (session?.active) {
          const resolved = resolveDropIndex(upEvent, session.fromIndex)
          if (resolved != null) {
            dropIndexRef.current = resolved
          }

          const toIndex = dropIndexRef.current
          if (toIndex != null && toIndex !== session.fromIndex) {
            onReorder(session.fromIndex, toIndex)
          }
        }

        sessionRef.current = null
        dropIndexRef.current = null
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
        setDragFromIndex(null)
        setDropIndex(null)
        setDragPointer(null)
        window.removeEventListener('pointermove', onMove)
        window.removeEventListener('pointerup', onUp)
        window.removeEventListener('pointercancel', onUp)
      }

      window.addEventListener('pointermove', onMove)
      window.addEventListener('pointerup', onUp)
      window.addEventListener('pointercancel', onUp)
    },
    [onReorder, questionCount, readOnly],
  )

  const consumeDragClick = useCallback(() => {
    if (!didDragRef.current) return false
    didDragRef.current = false
    return true
  }, [])

  return {
    beginDrag,
    consumeDragClick,
    dragFromIndex,
    dropIndex,
    dragPointer,
    isDragging: dragFromIndex !== null,
  }
}
