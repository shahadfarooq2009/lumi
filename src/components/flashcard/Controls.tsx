import { StreakPill } from './StreakPill'
import { Utility } from './Utility'

interface ControlsProps {
  streak: number
}

export function Controls({ streak }: ControlsProps) {
  return (
    <footer className="fc-controls fc-controls--meta">
      <StreakPill count={streak} />
      <Utility />
    </footer>
  )
}
