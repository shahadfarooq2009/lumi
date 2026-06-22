import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { GAMES, type GameItem } from './data/games'
import type { NavPageId } from './data/nav'
import { LumiPageLayout } from './components/LumiPageLayout'
import { Hero } from './components/Hero'
import { GameGrid } from './components/GameGrid'
import { ModalContainer, type ModalView } from './components/ModalContainer'
import { GameScreen } from './components/GameScreen'
import { saveQuizProject } from '../../lib/savedProjects'
import { navigateToGeneratedGame } from '../../lib/navigateToGeneratedGame'
import { mapProjectToGameQuestions } from '../../lib/mapProjectToGameQuestions'
import type { EditQuizQuestion } from '../../types/editQuiz'

type HomeLocationState = { page?: NavPageId } | null

export function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const pageFromState = (location.state as HomeLocationState)?.page
  const [activePage, setActivePage] = useState<NavPageId>(pageFromState ?? 'home')

  useEffect(() => {
    if (pageFromState === 'projects') {
      navigate('/mygame', { replace: true })
      return
    }
    if (pageFromState === 'pricing') {
      navigate('/pricing', { replace: true })
      return
    }
    if (pageFromState === 'profile') {
      navigate('/account', { replace: true })
      return
    }
    if (pageFromState) setActivePage(pageFromState)
  }, [pageFromState, location.key, navigate])
  const [modal, setModal] = useState<ModalView>(null)
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null)
  const [inGame, setInGame] = useState(false)
  const [playQuestions, setPlayQuestions] = useState<EditQuizQuestion[]>([])

  const openGame = (game: GameItem) => {
    setSelectedGame(game)
    setModal('gameInfo')
  }

  const closeModal = () => {
    setModal(null)
    setSelectedGame(null)
  }

  const handlePlayGame = (questions: EditQuizQuestion[]) => {
    if (!selectedGame) return
    const routed = navigateToGeneratedGame(navigate, selectedGame.key, questions, selectedGame.title)
    if (routed) {
      closeModal()
      return
    }
    setPlayQuestions(questions)
    closeModal()
    setInGame(true)
  }

  const handleSaveGame = (questions: EditQuizQuestion[], projectTitle: string) => {
    if (!selectedGame) return
    saveQuizProject({
      title: projectTitle,
      questions,
      gameMode: selectedGame.key,
    })
    closeModal()
    navigate('/mygame')
  }

  const handleNavigate = (page: NavPageId) => {
    if (page === 'projects') {
      navigate('/mygame')
      return
    }
    if (page === 'pricing') {
      navigate('/pricing')
      return
    }
    if (page === 'profile') {
      navigate('/account')
      return
    }
    if (page === 'home') {
      setActivePage('home')
      navigate('/')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    setActivePage(page)
    navigate('/', { state: { page } })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <LumiPageLayout
      activePage={activePage}
      onNavigate={handleNavigate}
      enableSpotlight={activePage === 'home'}
    >
        {activePage === 'home' ? (
          <>
            <Hero featuredGame={GAMES[0]} onFeaturedPlay={() => openGame(GAMES[0])} />
            <GameGrid games={GAMES} onOpen={openGame} />
          </>
        ) : null}

      <ModalContainer
        view={modal}
        game={selectedGame}
        onClose={closeModal}
        onPlay={() => setModal('upload')}
        onBack={() => setModal('gameInfo')}
        onSaveGame={handleSaveGame}
        onPlayGame={handlePlayGame}
      />

      {inGame ? (
        <GameScreen
          onExit={() => setInGame(false)}
          questions={mapProjectToGameQuestions(playQuestions)}
        />
      ) : null}
    </LumiPageLayout>
  )
}
