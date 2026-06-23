import { useLocation } from 'react-router-dom'
import { AmbientLayer } from './components/AmbientLayer'
import { GameStartCountdown } from './components/GameStartCountdown'
import { Stage } from './components/Stage'
import { Topbar } from './components/Topbar'
import { FlashcardMusicProvider } from './context/FlashcardMusicContext'
import { scienceDeck } from './data/scienceDeck'
import { useFlashcardDeck } from './hooks/useFlashcardDeck'
import { useGameStartCountdown } from './hooks/useGameStartCountdown'
import type { Deck } from './types/flashcard'
import './styles/flashcard-game.css'

type FlashcardLocationState = { deck?: Deck } | null

export function FlashcardGamePage() {
  const location = useLocation()
  const deckFromState = (location.state as FlashcardLocationState)?.deck
  const deck = deckFromState && deckFromState.cards.length > 0 ? deckFromState : scienceDeck
  const { count: startCount, isActive: isStartCountdownActive, skip: skipStartCountdown } =
    useGameStartCountdown()

  const {
    card, index, total,
    isFlipped, isFlipping,
    difficulty, setDifficulty,
    streak, selfCheck, advanceCountdown, navDirection,
    flip, next, prev, markCorrect, markWrong,
  } = useFlashcardDeck(deck)

  if (!card) return null

  return (
    <FlashcardMusicProvider>
      <div className="flashcard-game">
        <AmbientLayer />

        <main className={`fc-app${isStartCountdownActive ? ' fc-app--countdown' : ''}`}>
          <Topbar
            title={deck.title}
            currentIndex={index}
            total={total}
            streak={streak}
          />
          <Stage
            card={card}
            cardIndex={index}
            total={total}
            isFlipped={isFlipped}
            isFlipping={isFlipping}
            difficulty={difficulty}
            onDifficultyChange={setDifficulty}
            onFlip={flip}
            onPrev={prev}
            onNext={next}
            selfCheck={selfCheck}
            advanceCountdown={advanceCountdown}
            navDirection={navDirection}
            onMarkCorrect={markCorrect}
            onMarkWrong={markWrong}
          />
        </main>

        {isStartCountdownActive && startCount !== null ? (
          <GameStartCountdown count={startCount} onSkip={skipStartCountdown} />
        ) : null}
      </div>
    </FlashcardMusicProvider>
  )
}
