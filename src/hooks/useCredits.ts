import { useEffect, useState } from 'react'
import { CREDITS_UPDATED_EVENT, getCredits } from '../lib/credits'

export function useCredits() {
  const [credits, setCredits] = useState(getCredits)

  useEffect(() => {
    const sync = () => setCredits(getCredits())

    window.addEventListener(CREDITS_UPDATED_EVENT, sync)
    window.addEventListener('storage', sync)

    return () => {
      window.removeEventListener(CREDITS_UPDATED_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  return credits
}
