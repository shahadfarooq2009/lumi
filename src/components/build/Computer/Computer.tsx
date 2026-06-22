import { motion } from 'framer-motion'
import { useBuildThreadContext } from '../../../contexts/BuildThreadContext'
import type { SavedQuizProject } from '../../../lib/savedProjects'
import { WorkbenchContent } from './WorkbenchContent'
import { WorkbenchLoading } from './WorkbenchLoading'

const panelEase = [0.22, 1, 0.36, 1] as const

interface ComputerProps {
  savedProject?: SavedQuizProject | null
}

export function Computer({ savedProject = null }: ComputerProps) {
  const { pipelinePhase, generatedQuestions } = useBuildThreadContext()
  const isReady = pipelinePhase === 'ready' && generatedQuestions.length > 0
  const showSavedEditor = Boolean(savedProject)

  return (
    <motion.aside
      initial={{ opacity: 0, x: savedProject ? 0 : 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.65, ease: panelEase }}
      className={`${showSavedEditor ? 'flex' : 'hidden workspace:flex'} h-full min-h-0 flex-col overflow-hidden bg-white`}
    >
      {showSavedEditor || isReady ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <WorkbenchContent savedProject={savedProject} />
        </div>
      ) : pipelinePhase === 'loading' ? (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-5">
          <WorkbenchLoading />
        </div>
      ) : null}
    </motion.aside>
  )
}
