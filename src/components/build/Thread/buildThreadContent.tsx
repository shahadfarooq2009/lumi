import { isSoloPlayMode } from '../../../lib/playModeOptions'
import type { OnboardingStepId } from './buildThreadTypes'

function formatQuestionCountAnswer(answer?: string) {
  if (!answer) return '20 it is'
  const match = answer.match(/(\d+)/)
  return match ? `${match[1]} it is` : answer
}

export function renderLockedAiBody(bodyKey: OnboardingStepId | 'generating', answers: Record<string, string>) {
  switch (bodyKey) {
    case 'play_mode':
      return (
        <>
          Your file is in! Will you <strong>play solo</strong> or <strong>with your class</strong>?
        </>
      )
    case 'question_count':
      if (isSoloPlayMode(answers.play_mode)) {
        return (
          <>
            Solo mode — nice. How many <strong>questions</strong> should I generate?
          </>
        )
      }
      if (answers.play_mode) {
        return (
          <>
            Perfect for the classroom. First, <strong>how many questions</strong> would you like me to
            generate?
          </>
        )
      }
      return (
        <>
          Hey 👋 I&apos;ll help you build a quiz game in a few quick steps. First,{' '}
          <strong>how many questions</strong> would you like me to generate?
        </>
      )
    case 'question_type':
      return (
        <>
          Perfect — <strong>{formatQuestionCountAnswer(answers.question_count)}</strong>. Now, what{' '}
          <strong>type of questions</strong> should I generate?
        </>
      )
    case 'file_upload':
      return (
        <>
          Great choice. Now <strong>upload your study material</strong> and I&apos;ll turn it into your game.
          PDF, DOCX, slides — anything goes.
        </>
      )
    case 'generating':
      return (
        <>
          Perfect — I&apos;m building your game now. Follow the progress on the right; your questions will
          appear when everything is ready.
        </>
      )
    default:
      return null
  }
}

export function renderActiveAiBody(stepId: OnboardingStepId, answers: Record<string, string>) {
  if (stepId === 'question_type') {
    return (
      <>
        Perfect — <strong>{formatQuestionCountAnswer(answers.question_count)}</strong>. Now, what{' '}
        <strong>type of questions</strong> should I generate?
      </>
    )
  }

  return renderLockedAiBody(stepId, answers)
}
