import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GameScreen } from '../games/quiz/components/GameScreen'
import { prepareCountdownAudio } from '../games/flashcard/lib/playCountdownTick'
import { mapEditQuizToFlashcardDeck } from '../games/flashcard/lib/mapEditQuizToFlashcardDeck'
import { mapProjectToGameQuestions } from '../games/quiz/lib/mapProjectToGameQuestions'
import { getQuizProject } from '../lib/savedProjects'

export function GamePlayPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const project = id ? getQuizProject(id) : null

  useEffect(() => {
    if (!project || project.gameMode !== 'flashcard') return
    prepareCountdownAudio()
    const deck = mapEditQuizToFlashcardDeck(project.questions, project.title)
    navigate('/play/flashcard', {
      state: { deck, questions: project.questions, projectId: id },
      replace: true,
    })
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
