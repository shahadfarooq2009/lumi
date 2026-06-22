import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameScreen } from './Home/components/GameScreen'
import { prepareCountdownAudio } from '../lib/playCountdownTick'
import { mapEditQuizToFlashcardDeck } from '../lib/mapEditQuizToFlashcardDeck'
import { mapProjectToGameQuestions } from '../lib/mapProjectToGameQuestions'
import { getQuizProject } from '../lib/savedProjects'

export function GamePlayPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = id ? getQuizProject(id) : null

  useEffect(() => {
    if (!project || project.gameMode !== 'flashcard') return
    prepareCountdownAudio()
    const deck = mapEditQuizToFlashcardDeck(project.questions, project.title)
    navigate('/play/flashcard', { state: { deck }, replace: true })
  }, [navigate, project])

  if (project?.gameMode === 'flashcard') return null

  const questions = project ? mapProjectToGameQuestions(project.questions) : undefined

  return (
    <GameScreen
      questions={questions}
      onExit={() => {
        if (id) {
          navigate(`/game/${id}/overview`)
          return
        }
        navigate('/')
      }}
    />
  )
}
