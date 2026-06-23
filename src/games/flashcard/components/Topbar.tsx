import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { IconGlassButton } from './IconGlassButton'
import { StreakPill } from './StreakPill'
import { TitleBlock } from './TitleBlock'
import { Utility } from './Utility'

interface TopbarProps {
  title: string
  currentIndex: number
  total: number
  streak: number
}

export function Topbar({ title, currentIndex, total, streak }: TopbarProps) {
  const navigate = useNavigate()

  return (
    <header className="fc-topbar">
      <div className="fc-topbar__left">
        <IconGlassButton
          icon={ArrowLeft}
          ariaLabel="Back to My Game"
          onClick={() => navigate('/mygame')}
        />
      </div>

      <TitleBlock title={title} currentIndex={currentIndex} total={total} />

      <div className="fc-topbar__right">
        <StreakPill count={streak} />
        <Utility />
      </div>
    </header>
  )
}
