import { useLocation, useParams } from 'react-router-dom'
import { CrosswordGame } from './components/CrosswordGame'
import { getQuizProject } from '../../lib/savedProjects'

export function CrosswordPage() {
  const { id } = useParams()
  const location = useLocation()
  const titleFromState = (location.state as { title?: string } | null)?.title
  const project = id ? getQuizProject(id) : null
  const title = project?.title ?? titleFromState

  return <CrosswordGame title={title} questions={project?.questions} />
}
