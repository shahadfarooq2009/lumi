import { AiMessage } from './AiMessage'
import { ChatDropZone } from './ChatDropZone'
import { PlayModePicks } from './PlayModePicks'
import { QuickPicks } from './QuickPicks'
import { TypeGrid } from './TypeGrid'
import { renderActiveAiBody } from './buildThreadContent'
import type { ActiveStep } from './buildThreadTypes'

interface ActiveStepViewProps {
  step: ActiveStep
  answers: Record<string, string>
  onPlayMode: (label: string) => void
  onQuestionCount: (label: string) => void
  onQuestionType: (title: string) => void
  onFileUpload: () => void
}

export function ActiveStepView({
  step,
  answers,
  onPlayMode,
  onQuestionCount,
  onQuestionType,
  onFileUpload,
}: ActiveStepViewProps) {
  const body = renderActiveAiBody(step.id, answers)

  if (step.id === 'play_mode') {
    return (
      <AiMessage body={body}>
        <PlayModePicks onSelect={onPlayMode} />
      </AiMessage>
    )
  }

  if (step.id === 'question_count') {
    return (
      <AiMessage body={body}>
        <QuickPicks onSelect={onQuestionCount} />
      </AiMessage>
    )
  }

  if (step.id === 'question_type') {
    return (
      <AiMessage body={body}>
        <TypeGrid onSelect={onQuestionType} />
      </AiMessage>
    )
  }

  if (step.id === 'file_upload') {
    return (
      <AiMessage body={body}>
        <ChatDropZone onSelect={onFileUpload} />
      </AiMessage>
    )
  }

  return null
}
