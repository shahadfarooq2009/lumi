import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveQuizProject } from '../../lib/savedProjects'
import { navigateToGeneratedGame } from '../../games/registry/navigateToGame'
import { mapProjectToGameQuestions } from '../../games/quiz/lib/mapProjectToGameQuestions'
import type { EditQuizQuestion } from '../../types/editQuiz'
import { LumiPageLayout } from './components/LumiPageLayout'
import { ConvertGameModal } from './components/ConvertGameModal'
import { ModalContainer, type ModalView } from './components/ModalContainer'
import { GameScreen } from '../../games/quiz/components/GameScreen'
import { GAMES, type GameItem } from '../../games/registry/games'
import { navigateToPage } from './lib/navigateToPage'
import { ProjectsView } from './views/ProjectsView'

export function MyGamePage() {
  const navigate = useNavigate()
  const [pickerOpen, setPickerOpen] = useState(false)
  const [modal, setModal] = useState<ModalView>(null)
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null)
  const [inGame, setInGame] = useState(false)
  const [playQuestions, setPlayQuestions] = useState<EditQuizQuestion[]>([])
  const [projectsRefreshKey, setProjectsRefreshKey] = useState(0)

  const openHomeFlowForGame = (gameKey: string) => {
    const game = GAMES.find((g) => g.key === gameKey)
    if (!game) return
    setPickerOpen(false)
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
    setProjectsRefreshKey((key) => key + 1)
  }

  return (
    <>
      <LumiPageLayout
        activePage="projects"
        onNavigate={(page) => navigateToPage(navigate, page)}
      >
        <ProjectsView
          onCreateGame={() => setPickerOpen(true)}
          refreshKey={projectsRefreshKey}
        />
      </LumiPageLayout>

      {pickerOpen ? (
        <ConvertGameModal
          variant="create"
          currentKey=""
          onUse={openHomeFlowForGame}
          onClose={() => setPickerOpen(false)}
        />
      ) : null}

      <ModalContainer
        view={modal}
        game={selectedGame}
        onClose={closeModal}
        onPlay={() => setModal('upload')}
        onBack={() => {
          setModal(null)
          setSelectedGame(null)
          setPickerOpen(true)
        }}
        onSaveGame={handleSaveGame}
        onPlayGame={handlePlayGame}
      />

      {inGame ? (
        <GameScreen
          onExit={() => setInGame(false)}
          questions={mapProjectToGameQuestions(playQuestions)}
        />
      ) : null}
    </>
  )
}
