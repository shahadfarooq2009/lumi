import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import type { EditQuizQuestion } from '../../types/editQuiz'
import { AmbientLayer } from './components/AmbientLayer'
import { DifficultySetupScreen } from './components/DifficultySetupScreen'
import { ExitGameDialog } from './components/ExitGameDialog'
import { GameCompletionModal } from './components/GameCompletionModal'
import { PregameStage } from './components/PregameStage'
import { ResumeSessionDialog } from './components/ResumeSessionDialog'
import { Stage } from './components/Stage'
import { Topbar } from './components/Topbar'
import { FlashcardMusicProvider } from './context/FlashcardMusicContext'
import { scienceDeck } from './data/scienceDeck'
import { useFlashcardDeck } from './hooks/useFlashcardDeck'
import { generateFlashcardDeck } from './lib/generateFlashcardDeck'
import { prepareCountdownAudio } from './lib/playCountdownTick'
import {
  clearFlashcardSessionProgress,
  getFlashcardSessionProgress,
  saveFlashcardSessionProgress,
} from './lib/gameSessionProgress'
import type { GenerationProgressStatus } from './components/GenerationProgressBar'
import type { CardOverlayPhase } from './types/gamePhase'
import type { GamePhase } from './types/gamePhase'
import type { Deck, Difficulty } from './types/flashcard'
import './styles/flashcard-game.css'

type FlashcardLocationState = {
  deck?: Deck
  questions?: EditQuizQuestion[]
  projectId?: string
} | null

interface FlashcardPregameShellProps {
  title: string
  overlayPhase: CardOverlayPhase
  selectedDifficulty: Difficulty
  generationStatus: GenerationProgressStatus
  generationProgress: number | null
  onBack: () => void
  onRetry: () => void
  onReadyComplete: () => void
  onCountdownComplete: () => void
}

function FlashcardPregameShell({
  title,
  overlayPhase,
  selectedDifficulty,
  generationStatus,
  generationProgress,
  onBack,
  onRetry,
  onReadyComplete,
  onCountdownComplete,
}: FlashcardPregameShellProps) {
  return (
    <main className="fc-app fc-app--pregame">
      <Topbar title={title} variant="pregame" onBackRequest={onBack} />
      <PregameStage
        overlayPhase={overlayPhase}
        selectedDifficulty={selectedDifficulty}
        generationStatus={generationStatus}
        generationProgress={generationProgress}
        onCountdownComplete={onCountdownComplete}
        onRetry={onRetry}
        onReadyComplete={onReadyComplete}
      />
    </main>
  )
}

interface FlashcardGameSessionProps {
  deck: Deck
  projectId?: string
  startIndex: number
  onComplete: () => void
  onPlayAgain: () => void
}

function FlashcardGameSession({
  deck,
  projectId,
  startIndex,
  onComplete,
  onPlayAgain,
}: FlashcardGameSessionProps) {
  const navigate = useNavigate()
  const [exitOpen, setExitOpen] = useState(false)
  const [completionOpen, setCompletionOpen] = useState(false)
  const [completionDismissed, setCompletionDismissed] = useState(false)
  const [justStarted, setJustStarted] = useState(true)

  const {
    card, index, total,
    isFlipped, isFlipping,
    streak, selfCheck, advanceCountdown, navDirection,
    isComplete, finalStats,
    flip, next, prev, markCorrect, markWrong, endGame,
  } = useFlashcardDeck(deck, { initialIndex: startIndex, timerStarted: true })

  useEffect(() => {
    const timer = window.setTimeout(() => setJustStarted(false), 520)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (isComplete && finalStats && !completionDismissed) {
      setCompletionOpen(true)
      onComplete()
    }
  }, [completionDismissed, finalStats, isComplete, onComplete])

  const handleLeave = useCallback(() => {
    if (projectId) {
      saveFlashcardSessionProgress(projectId, index, total)
    }
    setExitOpen(false)
    navigate('/mygame')
  }, [index, navigate, projectId, total])

  const handleEndGame = useCallback(() => {
    if (isComplete) return
    endGame()
  }, [endGame, isComplete])

  const handleBackToGames = useCallback(() => {
    setCompletionOpen(false)
    if (projectId) clearFlashcardSessionProgress(projectId)
    navigate('/mygame')
  }, [navigate, projectId])

  const handlePlayAgain = useCallback(() => {
    setCompletionDismissed(false)
    setCompletionOpen(false)
    if (projectId) clearFlashcardSessionProgress(projectId)
    onPlayAgain()
  }, [onPlayAgain, projectId])

  const handleReviewAnswers = useCallback(() => {
    setCompletionOpen(false)
    if (projectId) {
      clearFlashcardSessionProgress(projectId)
      navigate(`/game/${projectId}/overview`)
      return
    }
    navigate('/mygame')
  }, [navigate, projectId])

  const handleCloseCompletion = useCallback(() => {
    setCompletionDismissed(true)
    setCompletionOpen(false)
  }, [])

  useEffect(() => {
    if (isComplete && finalStats && projectId) {
      clearFlashcardSessionProgress(projectId)
    }
  }, [finalStats, isComplete, projectId])

  if (!card) return null

  return (
    <>
      <main
        className={[
          'fc-app',
          completionOpen ? 'fc-app--complete' : '',
        ].filter(Boolean).join(' ')}
      >
        <Topbar
          title={deck.title}
          currentIndex={index}
          total={total}
          streak={streak}
          onBackRequest={() => setExitOpen(true)}
          onEndGame={handleEndGame}
          endGameDisabled={isComplete}
        />
        <Stage
          card={card}
          cardIndex={index}
          total={total}
          isFlipped={isFlipped}
          isFlipping={isFlipping}
          onFlip={flip}
          onPrev={prev}
          onNext={next}
          selfCheck={selfCheck}
          advanceCountdown={advanceCountdown}
          navDirection={navDirection}
          onMarkCorrect={markCorrect}
          onMarkWrong={markWrong}
          entering={justStarted}
        />
      </main>

      {exitOpen ? (
        <ExitGameDialog
          onStay={() => setExitOpen(false)}
          onLeave={handleLeave}
        />
      ) : null}

      {finalStats ? (
        <GameCompletionModal
          isOpen={completionOpen}
          score={finalStats.correctCount}
          totalQuestions={finalStats.total}
          accuracy={finalStats.accuracy}
          completionTime={finalStats.elapsedMs}
          bestStreak={finalStats.bestStreak}
          onClose={handleCloseCompletion}
          onPlayAgain={handlePlayAgain}
          onReviewAnswers={handleReviewAnswers}
          onBackToGames={handleBackToGames}
        />
      ) : null}
    </>
  )
}

export function FlashcardGamePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as FlashcardLocationState
  const deckFromState = locationState?.deck
  const sourceQuestions = locationState?.questions
  const projectId = locationState?.projectId
  const sourceDeck =
    deckFromState && deckFromState.cards.length > 0 ? deckFromState : scienceDeck

  const savedProgress = projectId ? getFlashcardSessionProgress(projectId) : null
  const canResume = Boolean(
    projectId
    && savedProgress
    && savedProgress.cardIndex >= 0
    && savedProgress.totalCards > 0
    && savedProgress.totalCards <= sourceDeck.cards.length,
  )

  const [resumeDecided, setResumeDecided] = useState(!canResume)
  const [resumeStartIndex, setResumeStartIndex] = useState(0)
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup')
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null)
  const [lockedDifficulty, setLockedDifficulty] = useState<Difficulty | null>(null)
  const [activeDeck, setActiveDeck] = useState<Deck | null>(null)
  const [generationError, setGenerationError] = useState(false)
  const [generationAttempt, setGenerationAttempt] = useState(0)
  const [generationUiStatus, setGenerationUiStatus] = useState<GenerationProgressStatus>('loading')
  const [generationProgress, setGenerationProgress] = useState<number | null>(null)
  const [sessionKey, setSessionKey] = useState(0)
  const generationAbortRef = useRef<AbortController | null>(null)

  const handleCountdownComplete = useCallback(() => {
    setGamePhase('playing')
    setSessionKey((key) => key + 1)
  }, [])

  const handleResume = useCallback(() => {
    if (!savedProgress) return
    setResumeStartIndex(savedProgress.cardIndex)
    setActiveDeck({
      ...sourceDeck,
      cards: sourceDeck.cards.slice(0, savedProgress.totalCards),
    })
    setGamePhase('playing')
    setResumeDecided(true)
  }, [savedProgress, sourceDeck])

  const handleStartOver = useCallback(() => {
    if (projectId) clearFlashcardSessionProgress(projectId)
    setResumeStartIndex(0)
    setActiveDeck(null)
    setSelectedDifficulty(null)
    setLockedDifficulty(null)
    setGenerationError(false)
    setGenerationUiStatus('loading')
    setGenerationProgress(null)
    setGamePhase('setup')
    setResumeDecided(true)
  }, [projectId])

  const handleSetupBack = useCallback(() => {
    navigate('/mygame')
  }, [navigate])

  const handleGenerate = useCallback(() => {
    if (!selectedDifficulty) return
    prepareCountdownAudio()
    setLockedDifficulty(selectedDifficulty)
    setGenerationError(false)
    setGenerationUiStatus('loading')
    setGenerationProgress(0)
    setActiveDeck(null)
    setGamePhase('generating')
    setGenerationAttempt((value) => value + 1)
  }, [selectedDifficulty])

  const handleGenerationReadyComplete = useCallback(() => {
    setGenerationUiStatus('loading')
    setGenerationProgress(null)
    setGamePhase('countdown')
  }, [])

  const handlePregameBack = useCallback(() => {
    navigate('/mygame')
  }, [navigate])

  const handleRetryGeneration = useCallback(() => {
    setGenerationError(false)
    setGenerationUiStatus('loading')
    setGenerationProgress(0)
    setGamePhase('generating')
    setGenerationAttempt((value) => value + 1)
  }, [])

  useEffect(() => {
    if (
      gamePhase !== 'generating' ||
      !lockedDifficulty ||
      generationError ||
      generationUiStatus === 'stopped'
    ) {
      return
    }

    const abortController = new AbortController()
    generationAbortRef.current = abortController
    let cancelled = false

    generateFlashcardDeck(sourceDeck, lockedDifficulty, sourceQuestions, {
      signal: abortController.signal,
      onProgress: (percent) => setGenerationProgress(Math.min(100, percent)),
    })
      .then((generatedDeck) => {
        if (cancelled) return
        setGenerationProgress(100)
        setActiveDeck(generatedDeck)
        setGenerationUiStatus('ready')
      })
      .catch((error: unknown) => {
        if (cancelled) return
        if (error instanceof DOMException && error.name === 'AbortError') return
        setGenerationError(true)
        setGenerationUiStatus('error')
      })

    return () => {
      cancelled = true
      abortController.abort()
      if (generationAbortRef.current === abortController) {
        generationAbortRef.current = null
      }
    }
  }, [
    gamePhase,
    lockedDifficulty,
    generationError,
    generationUiStatus,
    generationAttempt,
    sourceDeck,
    sourceQuestions,
  ])

  const handleGameComplete = useCallback(() => {
    setGamePhase('completed')
  }, [])

  const handlePlayAgain = useCallback(() => {
    setActiveDeck(null)
    setSelectedDifficulty(null)
    setLockedDifficulty(null)
    setGenerationError(false)
    setGenerationUiStatus('loading')
    setGenerationProgress(null)
    setResumeStartIndex(0)
    setGamePhase('setup')
    setSessionKey((key) => key + 1)
  }, [])

  const overlayPhase: CardOverlayPhase | null = generationError
    ? 'error'
    : gamePhase === 'generating'
      ? 'generating'
      : gamePhase === 'countdown'
        ? 'countdown'
        : null

  const showSetup = resumeDecided && gamePhase === 'setup'
  const showPregame = resumeDecided && lockedDifficulty && overlayPhase !== null
  const showSession = resumeDecided && activeDeck && (gamePhase === 'playing' || gamePhase === 'completed')

  return (
    <FlashcardMusicProvider>
      <div className="flashcard-game">
        <AmbientLayer />

        {!resumeDecided && savedProgress ? (
          <ResumeSessionDialog
            questionNumber={savedProgress.cardIndex + 1}
            onResume={handleResume}
            onStartOver={handleStartOver}
          />
        ) : null}

        {showSetup ? (
          <DifficultySetupScreen
            title="Flashcard Master"
            selectedDifficulty={selectedDifficulty}
            onSelectDifficulty={setSelectedDifficulty}
            onBack={handleSetupBack}
            onGenerate={handleGenerate}
          />
        ) : null}

        {showPregame && lockedDifficulty && overlayPhase ? (
          <FlashcardPregameShell
            title={sourceDeck.title}
            overlayPhase={overlayPhase}
            selectedDifficulty={lockedDifficulty}
            generationStatus={generationUiStatus}
            generationProgress={generationProgress}
            onBack={handlePregameBack}
            onRetry={handleRetryGeneration}
            onReadyComplete={handleGenerationReadyComplete}
            onCountdownComplete={handleCountdownComplete}
          />
        ) : null}

        {showSession && activeDeck ? (
          <FlashcardGameSession
            key={`${projectId ?? 'demo'}-${sessionKey}-${resumeStartIndex}`}
            deck={activeDeck}
            projectId={projectId}
            startIndex={resumeStartIndex}
            onComplete={handleGameComplete}
            onPlayAgain={handlePlayAgain}
          />
        ) : null}
      </div>
    </FlashcardMusicProvider>
  )
}
