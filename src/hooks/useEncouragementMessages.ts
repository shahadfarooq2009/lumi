import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ENCOURAGEMENT_INTERVAL_MS,
  ENCOURAGEMENT_MESSAGES,
  ENCOURAGEMENT_STORAGE_KEY,
} from '../data/encouragementMessages'

const TOAST_VISIBLE_MS = 8_000

function pickMessage(lastIndex: number) {
  if (ENCOURAGEMENT_MESSAGES.length <= 1) return { text: ENCOURAGEMENT_MESSAGES[0], index: 0 }

  let index = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
  while (index === lastIndex) {
    index = Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)
  }
  return { text: ENCOURAGEMENT_MESSAGES[index], index }
}

function readNextAt() {
  const stored = sessionStorage.getItem(ENCOURAGEMENT_STORAGE_KEY)
  if (!stored) return Date.now() + ENCOURAGEMENT_INTERVAL_MS
  const parsed = Number(stored)
  return Number.isFinite(parsed) ? parsed : Date.now() + ENCOURAGEMENT_INTERVAL_MS
}

function writeNextAt(from = Date.now()) {
  sessionStorage.setItem(ENCOURAGEMENT_STORAGE_KEY, String(from + ENCOURAGEMENT_INTERVAL_MS))
}

export function useEncouragementMessages() {
  const [message, setMessage] = useState<string | null>(null)
  const [visible, setVisible] = useState(false)
  const lastIndexRef = useRef(-1)
  const hideTimerRef = useRef<number | null>(null)

  const dismiss = useCallback(() => {
    setVisible(false)
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  const showMessage = useCallback((scheduled = true) => {
    if (scheduled && document.hidden) return

    const next = pickMessage(lastIndexRef.current)
    lastIndexRef.current = next.index
    setMessage(next.text)
    setVisible(true)
    if (scheduled) writeNextAt()

    if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current)
    hideTimerRef.current = window.setTimeout(() => {
      setVisible(false)
      hideTimerRef.current = null
    }, TOAST_VISIBLE_MS)
  }, [])

  const showNow = useCallback(() => showMessage(false), [showMessage])

  useEffect(() => {
    if (!sessionStorage.getItem(ENCOURAGEMENT_STORAGE_KEY)) {
      writeNextAt()
    }

    let timeoutId = 0
    let intervalId = 0

    const arm = () => {
      const delay = Math.max(0, readNextAt() - Date.now())
      timeoutId = window.setTimeout(() => {
        showMessage()
        intervalId = window.setInterval(showMessage, ENCOURAGEMENT_INTERVAL_MS)
      }, delay)
    }

    arm()

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current)
    }
  }, [showMessage])

  return { message, visible, dismiss, showNow }
}
