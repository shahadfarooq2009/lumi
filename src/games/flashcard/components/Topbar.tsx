import { ArrowLeft } from 'lucide-react'
import { IconGlassButton } from './IconGlassButton'
import { StreakPill } from './StreakPill'
import { TitleBlock } from './TitleBlock'
import { Utility } from './Utility'

interface TopbarProps {
  title: string
  variant?: 'full' | 'pregame'
  currentIndex?: number
  total?: number
  streak?: number
  onBackRequest: () => void
  onEndGame?: () => void
  endGameDisabled?: boolean
}

export function Topbar({
  title,
  variant = 'full',
  currentIndex = 0,
  total = 1,
  streak = 0,
  onBackRequest,
  onEndGame,
  endGameDisabled = false,
}: TopbarProps) {
  const isPregame = variant === 'pregame'

  return (
    <header className="fc-topbar">
      <div className="fc-topbar__left">
        <IconGlassButton
          icon={ArrowLeft}
          ariaLabel="Back to My Game"
          onClick={onBackRequest}
        />
      </div>

      <TitleBlock
        title={title}
        showProgress={!isPregame}
        currentIndex={currentIndex}
        total={total}
      />

      {isPregame ? (
        <div className="fc-topbar__right fc-topbar__right--spacer" aria-hidden />
      ) : (
        <div className="fc-topbar__right">
          <button
            type="button"
            className="fc-end-game-btn"
            onClick={onEndGame}
            disabled={endGameDisabled}
          >
            End Game
          </button>
          <StreakPill count={streak} />
          <Utility />
        </div>
      )}
    </header>
  )
}
