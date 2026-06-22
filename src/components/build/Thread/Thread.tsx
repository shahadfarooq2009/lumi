import { useEffect, useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useBuildThreadContext } from '../../../contexts/BuildThreadContext'
import { Steps } from '../Computer/Steps'
import { ActiveStepView } from './ActiveStepView'
import { AiMessage } from './AiMessage'
import { renderLockedAiBody } from './buildThreadContent'
import type { HistoryItem } from './buildThreadTypes'
import { PlayModePicks } from './PlayModePicks'
import { QuickPicks } from './QuickPicks'
import { ThreadFooter } from './ThreadFooter'
import { TypeGrid } from './TypeGrid'
import { TypingIndicator } from './TypingIndicator'
import { UserMessage } from './UserMessage'

function HistoryMessage({
  item,
  answers,
  onQuestionCountChange,
  canChangeQuestionCount,
}: {
  item: HistoryItem
  answers: Record<string, string>
  onQuestionCountChange: (label: string) => void
  canChangeQuestionCount: boolean
}) {
  if (item.kind === 'user') {
    return <UserMessage bubble={item.bubble} attachment={item.attachment} />
  }

  if (item.kind === 'ai') {
    let children: ReactNode = null

    if (item.bodyKey === 'play_mode') {
      children = <PlayModePicks onSelect={() => {}} selectedAnswer={answers.play_mode} />
    }

    if (item.bodyKey === 'question_count') {
      children = (
        <QuickPicks
          onSelect={onQuestionCountChange}
          selectedAnswer={answers.question_count}
          allowChange={canChangeQuestionCount}
        />
      )
    }

    if (item.bodyKey === 'question_type') {
      children = <TypeGrid onSelect={() => {}} selectedTitle={answers.question_type} />
    }

    return (
      <AiMessage
        body={renderLockedAiBody(item.bodyKey, answers)}
        showActions={item.bodyKey !== 'generating'}
      >
        {children}
      </AiMessage>
    )
  }

  return null
}

export function Thread() {
  const {
    history,
    activeStep,
    isTyping,
    answers,
    respond,
    pipelinePhase,
    loadingVisual,
    showWorkbench,
    changeQuestionCount,
    canChangeQuestionCount,
  } = useBuildThreadContext()
  const scrollRef = useRef<HTMLDivElement>(null)
  const typingAnchorRef = useRef<HTMLDivElement>(null)
  const activeStepAnchorRef = useRef<HTMLDivElement>(null)
  const loadingAnchorRef = useRef<HTMLDivElement>(null)

  const scrollBotBlockToTop = (node: HTMLElement | null) => {
    const container = scrollRef.current
    if (!container || !node) return
    const containerRect = container.getBoundingClientRect()
    const nodeRect = node.getBoundingClientRect()
    const top = container.scrollTop + (nodeRect.top - containerRect.top) - 24
    container.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
  }

  useEffect(() => {
    if (pipelinePhase === 'loading') {
      scrollBotBlockToTop(loadingAnchorRef.current)
      return
    }

    if (isTyping) {
      scrollBotBlockToTop(typingAnchorRef.current)
      return
    }

    if (activeStep) {
      scrollBotBlockToTop(activeStepAnchorRef.current)
      return
    }

    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' })
  }, [history.length, activeStep?.id, isTyping, pipelinePhase, loadingVisual])

  return (
    <section
      className={`relative flex h-full min-h-0 flex-col overflow-hidden bg-surface-bg ${
        showWorkbench ? 'border-r border-border-soft' : ''
      }`}
    >
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain px-8 pb-4 pt-6"
      >
        <div className="mx-auto w-full max-w-[760px] space-y-8">
          {history.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <HistoryMessage
                item={item}
                answers={answers}
                onQuestionCountChange={changeQuestionCount}
                canChangeQuestionCount={canChangeQuestionCount}
              />
            </motion.div>
          ))}

          {isTyping ? (
            <motion.div
              ref={typingAnchorRef}
              key="typing"
              className="scroll-mt-6 pt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <TypingIndicator />
            </motion.div>
          ) : null}

          {activeStep && !isTyping ? (
            <motion.div
              ref={activeStepAnchorRef}
              key={activeStep.id}
              className="scroll-mt-6 pt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              <ActiveStepView
                step={activeStep}
                answers={answers}
                onPlayMode={(label) => respond(label, 'play_mode')}
                onQuestionCount={(label) => respond(`${label}, please`, 'question_count')}
                onQuestionType={(title) =>
                  respond(title === 'Mixed Questions' ? 'Go with Mixed Questions 🎲' : title, 'question_type')
                }
                onFileUpload={() =>
                  respond('Here you go 📎', 'file_upload', {
                    type: 'PDF',
                    name: 'Cell Biology Notes.pdf',
                    meta: '2.4 MB · 18 pages',
                  })
                }
              />
            </motion.div>
          ) : null}

          {pipelinePhase === 'loading' ? (
            <motion.div
              ref={loadingAnchorRef}
              key="loading-steps"
              className="scroll-mt-6 rounded-xl border border-border bg-white p-5 pt-10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Steps />
            </motion.div>
          ) : null}
        </div>
      </div>

      <ThreadFooter />
    </section>
  )
}
