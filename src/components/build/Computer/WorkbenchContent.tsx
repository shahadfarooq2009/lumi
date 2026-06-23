import { lazy, Suspense, useState } from 'react'
import { EditQuizWorkbench } from '../../edit-quiz/EditQuizWorkbench'
import { useBuildThreadContext } from '../../../contexts/BuildThreadContext'
import type { SavedQuizProject } from '../../../lib/savedProjects'
import type { EditQuizQuestion } from '../../../types/editQuiz'

const CrosswordGame = lazy(() =>
  import('../../../games/crossword/components/CrosswordGame').then((m) => ({ default: m.CrosswordGame })),
)

type WorkbenchView = 'edit' | 'crossword'

interface WorkbenchContentProps {
  savedProject?: SavedQuizProject | null
}

function CrosswordLoading() {
  return (
    <div className="flex h-full min-h-[200px] flex-1 items-center justify-center">
      <p className="font-display text-sm font-semibold text-ink-dim">Loading crossword…</p>
    </div>
  )
}

export function WorkbenchContent({ savedProject = null }: WorkbenchContentProps) {
  const { pipelinePhase, generatedQuestions } = useBuildThreadContext()
  const canShowFlow = pipelinePhase === 'ready' && generatedQuestions.length > 0
  const [view, setView] = useState<WorkbenchView>('edit')
  const [crosswordTitle, setCrosswordTitle] = useState(
    savedProject?.title ?? 'Cell Biology Basics',
  )
  const [crosswordQuestions, setCrosswordQuestions] = useState<EditQuizQuestion[]>(
    () => savedProject?.questions ?? [],
  )

  if (!savedProject && !canShowFlow) {
    return null
  }

  if (view === 'crossword') {
    return (
      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
        <Suspense fallback={<CrosswordLoading />}>
          <CrosswordGame
            title={crosswordTitle}
            questions={crosswordQuestions}
            embedded
            onBack={() => setView('edit')}
          />
        </Suspense>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden">
      <EditQuizWorkbench
        savedProject={savedProject ?? undefined}
        onPlayCrossword={(title, questions) => {
          setCrosswordTitle(title.trim() || 'Cell Biology Basics')
          setCrosswordQuestions(questions)
          setView('crossword')
        }}
      />
    </div>
  )
}
