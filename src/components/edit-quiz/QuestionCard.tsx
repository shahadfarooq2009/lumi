import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  Copy,
  Star,
  Tag,
  Trash2,
  X,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import {
  MIN_MCQ_TF_OPTIONS,
  normalizeTfOptions,
  reletterOptions,
  setSingleCorrectOption,
} from '../../lib/editQuizQuestions'
import type { EditQuizOption, EditQuizQuestion, QuestionDifficulty } from '../../types/editQuiz'
import { TYPE_LABEL } from '../../types/editQuiz'
import type { QuestionSettingsPatch } from './Inspector'

export type QuestionSavePatch = Pick<EditQuizQuestion, 'question' | 'options' | 'fillBlankAnswer'>

const TITLE_CLASS =
  'mb-5 w-full font-display text-[19px] font-bold leading-snug tracking-tight text-ink sm:text-[21px]'
const PROMINENT_TITLE_CLASS =
  'w-full font-display text-[26px] font-bold leading-[1.22] tracking-tight text-[#1B1530] sm:text-[30px] lg:text-[34px]'
const PROMINENT_QUESTION_BOX =
  'mb-8 rounded-2xl border border-[#E8DEFF] bg-[#FAFAFE] px-8 py-7 sm:px-11 sm:py-9'
const POINT_OPTIONS = [100, 200, 300, 500] as const
const DIFFICULTY_CYCLE: QuestionDifficulty[] = ['easy', 'medium', 'hard']

const RAISED_CARD_SHADOW =
  'shadow-[0_8px_32px_-12px_rgba(28,24,58,0.14),0_2px_10px_-4px_rgba(124,77,255,0.08)]'

interface QuestionCardProps {
  question: EditQuizQuestion
  editing: boolean
  showAnswers: boolean
  readOnly?: boolean
  showProgressBar?: boolean
  progressCurrent?: number
  progressTotal?: number
  prominentQuestion?: boolean
  isDragSource?: boolean
  isDuplicateHighlight?: boolean
  isDuplicatingSource?: boolean
  onEdit: () => void
  onCommit: (patch: QuestionSavePatch) => void
  onUpdateSettings: (patch: QuestionSettingsPatch) => void
  onDuplicate: () => void
  onRequestDelete: () => void
}

function OptionOutlineCircle({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className={`h-5 w-5 shrink-0 ${className}`}
      aria-hidden
    >
      <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function CorrectOptionCircle({
  selected,
  onClick,
  interactive = false,
}: {
  selected: boolean
  onClick?: () => void
  interactive?: boolean
}) {
  const selectedClass =
    'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 bg-emerald-500 text-white shadow-[0_0_0_3px_rgba(16,185,129,0.15)]'
  const outlineClass = `inline-flex shrink-0 p-0 text-[#dcd5ea] transition-colors ${
    interactive ? 'cursor-pointer hover:text-brand-light' : ''
  }`

  if (selected) {
    const inner = <Check size={11} strokeWidth={3} className="text-white" />
    if (interactive && onClick) {
      return (
        <button
          type="button"
          onClick={onClick}
          className={`${selectedClass} ${interactive ? 'cursor-pointer' : ''}`}
          aria-pressed
          aria-label="Correct answer"
        >
          {inner}
        </button>
      )
    }
    return (
      <span className={selectedClass} aria-label="Correct answer">
        {inner}
      </span>
    )
  }

  if (interactive && onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${outlineClass} rounded-full border-0 bg-transparent p-0`}
        aria-pressed={false}
        aria-label="Mark as correct"
      >
        <OptionOutlineCircle />
      </button>
    )
  }

  return (
    <span className={outlineClass} aria-hidden>
      <OptionOutlineCircle />
    </span>
  )
}

function optionRowClass(correct: boolean, revealCorrect: boolean) {
  return `flex items-center gap-3 rounded-xl border bg-white dark:bg-[#221c34] ${
    revealCorrect && correct ? 'border-emerald-400' : 'border-border-soft dark:border-[#2d2640]'
  }`
}

function optionTextClass(correct: boolean, revealCorrect: boolean, prominent = false) {
  return `flex-1 ${prominent ? 'text-[16px] sm:text-[17px]' : 'text-[14.5px] sm:text-[15px]'} ${
    revealCorrect && correct ? 'font-semibold text-ink' : 'text-ink-soft'
  }`
}

function DifficultyBars({
  level,
  interactive,
  onCycle,
}: {
  level: QuestionDifficulty
  interactive?: boolean
  onCycle?: () => void
}) {
  const filled = level === 'easy' ? 1 : level === 'medium' ? 2 : 3
  const label = level.charAt(0).toUpperCase() + level.slice(1)

  const content = (
    <>
      <span className="text-[10px] text-ink-muted">{label}</span>
      <div className="flex items-end gap-0.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-1 rounded-sm ${i < filled ? 'h-3 bg-state-warn' : 'h-3 bg-border'}`}
          />
        ))}
      </div>
    </>
  )

  if (interactive && onCycle) {
    return (
      <button
        type="button"
        onClick={onCycle}
        className="ml-auto flex items-center gap-2 rounded-md px-1 py-0.5 transition-colors hover:bg-brand-softer"
        title="Change difficulty"
      >
        {content}
      </button>
    )
  }

  return <div className="ml-auto flex items-center gap-2">{content}</div>
}

function cycleValue<T>(current: T, options: readonly T[]): T {
  const index = options.findIndex((value) => value === current)
  const start = index === -1 ? 0 : index
  return options[(start + 1) % options.length]
}

function buildPatchFromDraft(
  question: EditQuizQuestion,
  draft: { text: string; options: EditQuizOption[]; fillBlank: string },
): QuestionSavePatch | null {
  const trimmed = draft.text.trim()
  if (!trimmed) return null

  if (question.type === 'tf') {
    const filled = normalizeTfOptions(
      draft.options.map((opt) => ({ ...opt, text: opt.text.trim() })),
    )
    return { question: trimmed, options: filled }
  }

  if (question.type === 'mcq') {
    const filled = draft.options.map((opt) => ({ ...opt, text: opt.text.trim() }))
    if (filled.some((opt) => !opt.text)) return null
    if (filled.filter((opt) => opt.correct).length !== 1) return null
    return { question: trimmed, options: setSingleCorrectOption(
      filled,
      Math.max(0, filled.findIndex((opt) => opt.correct)),
    ) }
  }

  if (question.type === 'fill') {
    const blank = draft.fillBlank.trim()
    if (!blank) return null
    return { question: trimmed, options: question.options, fillBlankAnswer: blank }
  }

  return { question: trimmed, options: question.options }
}

function QuestionBody({
  question,
  editing,
  showAnswers,
  readOnly = false,
  prominentQuestion = false,
  onCommit,
}: {
  question: EditQuizQuestion
  editing: boolean
  showAnswers: boolean
  readOnly?: boolean
  prominentQuestion?: boolean
  onCommit: (patch: QuestionSavePatch) => void
}) {
  const revealCorrect = editing || showAnswers
  const [text, setText] = useState(question.question)
  const [options, setOptions] = useState<EditQuizOption[]>(question.options ?? [])
  const [fillBlank, setFillBlank] = useState(question.fillBlankAnswer ?? '')
  const wasEditingRef = useRef(false)

  const syncOptionsFromQuestion = (source: EditQuizQuestion) => {
    if (source.type === 'tf' && source.options?.length) {
      setOptions(normalizeTfOptions(source.options))
      return
    }
    setOptions(source.options ?? [])
  }

  useEffect(() => {
    setText(question.question)
    syncOptionsFromQuestion(question)
    setFillBlank(question.fillBlankAnswer ?? '')
  }, [question.id])

  useEffect(() => {
    if (editing) return
    setText(question.question)
    syncOptionsFromQuestion(question)
    setFillBlank(question.fillBlankAnswer ?? '')
  }, [editing, question.question, question.options, question.fillBlankAnswer, question.type])

  useEffect(() => {
    if (wasEditingRef.current && !editing) {
      const patch = buildPatchFromDraft(question, { text, options, fillBlank })
      if (patch) onCommit(patch)
    }
    wasEditingRef.current = editing
  }, [editing, text, options, fillBlank, onCommit, question])

  const pickCorrectOption = (index: number) => {
    if (question.type === 'match') return

    setOptions((current) => {
      let next: EditQuizOption[]
      if (question.type === 'tf') {
        next = [
          { letter: 'T', text: 'True', correct: index === 0 },
          { letter: 'F', text: 'False', correct: index === 1 },
        ]
      } else {
        next = setSingleCorrectOption(current, index)
      }

      if (!editing) {
        const patch = buildPatchFromDraft(question, {
          text: question.question,
          options: next,
          fillBlank: question.fillBlankAnswer ?? '',
        })
        if (patch) onCommit(patch)
      }

      return next
    })
  }

  const canPickCorrect = question.type === 'tf' || question.type === 'mcq'
  const showCorrectPicker = !readOnly && canPickCorrect && (editing || question.type === 'tf')

  const removeOption = (index: number) => {
    setOptions((current) => {
      if (current.length <= MIN_MCQ_TF_OPTIONS) return current
      const next = current.filter((_, i) => i !== index)
      if (!next.some((opt) => opt.correct)) {
        next[0] = { ...next[0], correct: true }
      }
      return reletterOptions(next, question.type)
    })
  }

  if (question.type === 'fill') {
    return (
      <>
        <h3 className={TITLE_CLASS}>
          The process of converting glucose to ATP is called{' '}
          {editing ? (
            <input
              value={fillBlank}
              onChange={(e) => setFillBlank(e.target.value)}
              className="min-w-[100px] border-b-2 border-dashed border-brand-light bg-transparent font-display text-[17px] font-bold italic text-brand outline-none"
            />
          ) : revealCorrect ? (
            <span className="min-w-[100px] border-b-2 border-dashed border-brand-light italic text-brand">
              {fillBlank || 'mitosis'}
            </span>
          ) : (
            <span className="min-w-[80px] inline-block border-b-2 border-dashed border-border-strong text-ink-muted">
              &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
          .
        </h3>
        {revealCorrect && question.acceptedAnswers?.length ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface-tint px-3.5 py-2 text-[12px] text-ink-soft">
            <Check size={14} className="text-state-success" strokeWidth={2.5} />
            <span className="text-ink-dim">Accepted answers:</span>
            <strong className="text-ink">{question.acceptedAnswers.join(', ')}</strong>
          </div>
        ) : null}
      </>
    )
  }

  const titleClass = prominentQuestion ? PROMINENT_TITLE_CLASS : TITLE_CLASS
  const showChooseHint =
    prominentQuestion && !editing && (question.type === 'mcq' || question.type === 'tf')

  const questionContent = editing ? (
    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      rows={prominentQuestion ? 3 : 2}
      className={`${titleClass} resize-none border-0 bg-transparent p-0 outline-none ring-0 focus:ring-0 [field-sizing:content]`}
    />
  ) : (
    <h3 className={titleClass}>{question.question}</h3>
  )

  return (
    <>
      {prominentQuestion ? (
        <div className={PROMINENT_QUESTION_BOX}>
          {questionContent}
          {showChooseHint ? (
            <p className="mt-3 text-[15px] font-medium text-[#9B94B0]">Choose the best answer.</p>
          ) : null}
        </div>
      ) : (
        questionContent
      )}

      {question.options?.length ? (
        <ul
          className="space-y-3"
          role={question.type === 'tf' ? 'radiogroup' : undefined}
          aria-label={question.type === 'tf' ? 'Correct answer' : undefined}
        >
          {options.map((opt, index) => (
            <li
              key={opt.letter}
              className={`${optionRowClass(opt.correct, revealCorrect)} ${
                prominentQuestion ? 'px-6 py-5 sm:px-7 sm:py-5' : 'px-4 py-4 sm:px-5 sm:py-4'
              }`}
            >
              <CorrectOptionCircle
                selected={revealCorrect && opt.correct}
                interactive={showCorrectPicker}
                onClick={() => pickCorrectOption(index)}
              />
              {editing && question.type !== 'tf' ? (
                <>
                  <input
                    value={opt.text}
                    onChange={(e) =>
                      setOptions((current) =>
                        current.map((item, i) =>
                          i === index ? { ...item, text: e.target.value } : item,
                        ),
                      )
                    }
                    className={`${optionTextClass(opt.correct, revealCorrect, prominentQuestion)} min-w-0 border-0 bg-transparent outline-none focus:ring-0`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= MIN_MCQ_TF_OPTIONS}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-muted transition-colors hover:bg-red-50 hover:text-state-danger disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label="Remove option"
                  >
                    <X size={15} strokeWidth={2} />
                  </button>
                </>
              ) : (
                <span className={optionTextClass(opt.correct, revealCorrect, prominentQuestion)}>
                  {opt.text}
                </span>
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </>
  )
}

export function QuestionCard({
  question,
  editing,
  showAnswers,
  readOnly = false,
  showProgressBar = false,
  progressCurrent,
  progressTotal,
  prominentQuestion = false,
  isDragSource = false,
  isDuplicateHighlight = false,
  isDuplicatingSource = false,
  onEdit,
  onCommit,
  onUpdateSettings,
  onDuplicate,
  onRequestDelete,
}: QuestionCardProps) {
  const cardRef = useRef<HTMLElement>(null)
  const [dupClicked, setDupClicked] = useState(false)
  const isEditing = !readOnly && editing

  const handleBodyClick = () => {
    if (!readOnly && !isEditing) onEdit()
  }

  const handleDuplicate = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDuplicate()
    setDupClicked(true)
    window.setTimeout(() => setDupClicked(false), 500)
  }

  return (
    <motion.article
      ref={cardRef}
      data-question-card
      data-editing={isEditing ? 'true' : 'false'}
      animate={
        isDuplicatingSource
          ? {
              boxShadow: [
                '0 8px 32px -12px rgba(28,24,58,0.14)',
                '0 16px 48px -10px rgba(124,77,255,0.45)',
                '0 8px 32px -12px rgba(28,24,58,0.14)',
              ],
              borderColor: ['#ECE7FB', '#7C4DFF', '#ECE7FB'],
            }
          : isDuplicateHighlight
            ? {
                boxShadow: [
                  '0 8px 32px -12px rgba(28,24,58,0.14), 0 2px 10px -4px rgba(124,77,255,0.08)',
                  '0 12px 48px -8px rgba(124,77,255,0.4), 0 0 0 4px rgba(124,77,255,0.2)',
                  '0 8px 32px -12px rgba(28,24,58,0.14), 0 2px 10px -4px rgba(124,77,255,0.08)',
                ],
                scale: [1, 1.012, 1],
              }
            : undefined
      }
      transition={{ duration: isDuplicatingSource ? 0.58 : 0.65, ease: 'easeOut' }}
      className={`relative overflow-hidden rounded-[20px] border bg-white dark:bg-[#1a1628] ${RAISED_CARD_SHADOW} transition-[opacity,border-color,background-color] dark:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45)] ${
        isDragSource
          ? 'border-2 border-dashed border-[#C5CAD4] bg-[#EEF0F5] opacity-35 shadow-none dark:border-[#3d3458] dark:bg-[#151220]'
          : isDuplicatingSource
            ? 'border-brand/70'
            : isDuplicateHighlight
              ? 'border-brand/60'
              : isEditing
                ? 'border-brand/50 shadow-edit-halo'
                : 'border-[#ECE7FB] dark:border-[#2d2640]'
      }`}
    >
      <AnimatePresence>
        {isDuplicateHighlight ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.96 }}
            className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-[#7C4DFF] px-3 py-1.5 text-[12px] font-semibold text-white shadow-[0_4px_16px_-4px_rgba(124,77,255,0.55)]"
          >
            <Copy size={12} strokeWidth={2.2} />
            Duplicated
          </motion.div>
        ) : null}
      </AnimatePresence>
      <div className="flex items-center gap-2.5 border-b border-[#F0ECFB] bg-gradient-to-b from-[#FAFAFE] to-white px-7 py-4 dark:border-[#2d2640] dark:from-[#1a1628] dark:to-[#1a1628] sm:gap-3 sm:px-9 sm:py-5">
        <span className="rounded-md bg-[#F0EBFF] px-2.5 py-1 font-mono text-[11px] font-bold text-[#7C4DFF]">
          {question.num}
        </span>
        <span className="rounded-md bg-[#F0EBFF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#7C4DFF]">
          {TYPE_LABEL[question.type]}
        </span>
        <div className="ml-auto flex items-center gap-2.5 sm:gap-3">
          <DifficultyBars
            level={question.difficulty}
            interactive={isEditing}
            onCycle={() =>
              onUpdateSettings({
                difficulty: cycleValue(question.difficulty, DIFFICULTY_CYCLE),
              })
            }
          />
        {!readOnly ? (
          <div className="flex gap-0.5">
            <motion.button
              type="button"
              onClick={handleDuplicate}
              animate={dupClicked ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.35 }}
              className={`flex h-[30px] w-[30px] items-center justify-center rounded-md transition-colors ${
                dupClicked
                  ? 'bg-brand-softer text-brand'
                  : 'text-ink-dim hover:bg-brand-softer hover:text-brand'
              }`}
              aria-label="Duplicate question"
            >
              <Copy size={14} />
            </motion.button>
            <button
              type="button"
              onClick={onRequestDelete}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-md text-ink-dim hover:bg-red-50 hover:text-state-danger"
              aria-label="Delete question"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ) : null}
        </div>
      </div>

      {showProgressBar && progressCurrent != null && progressTotal != null ? (
        <div className="border-b border-[#F0ECFB] bg-white px-8 py-4 dark:border-[#2d2640] dark:bg-[#1a1628] sm:px-10">
          <p className={`mb-3 font-semibold text-[#9B94B0] ${prominentQuestion ? 'text-[13px] sm:text-[14px]' : 'text-[12px]'}`}>
            Question {progressCurrent} of {progressTotal}
          </p>
          <div className={`overflow-hidden rounded-full bg-[#EDE8FF] ${prominentQuestion ? 'h-1.5' : 'h-1'}`}>
            <div
              className="h-full rounded-full bg-[#7C4DFF] transition-[width] duration-300"
              style={{ width: `${(progressCurrent / progressTotal) * 100}%` }}
            />
          </div>
        </div>
      ) : null}

      <div
        className={
          prominentQuestion
            ? isEditing
              ? 'p-10 sm:p-14'
              : readOnly
                ? 'p-10 sm:p-14'
                : 'cursor-pointer p-10 sm:p-14'
            : isEditing
              ? 'p-7 sm:p-9'
              : readOnly
                ? 'p-7 sm:p-9'
                : 'cursor-pointer p-7 sm:p-9'
        }
        onClick={readOnly ? undefined : handleBodyClick}
        onKeyDown={
          readOnly
            ? undefined
            : (e) => {
                if (!isEditing && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault()
                  onEdit()
                }
              }
        }
        role={readOnly || isEditing ? undefined : 'button'}
        tabIndex={readOnly || isEditing ? undefined : 0}
        aria-label={readOnly || isEditing ? undefined : `Edit ${question.num}`}
      >
        <QuestionBody
          question={question}
          editing={isEditing}
          showAnswers={showAnswers}
          readOnly={readOnly}
          prominentQuestion={prominentQuestion}
          onCommit={onCommit}
        />
      </div>

      <div className="flex items-center gap-3.5 border-t border-dashed border-border bg-surface-tint px-7 py-4 dark:border-[#2d2640] dark:bg-[#151220] sm:px-9">
        {isEditing ? (
          <button
            type="button"
            onClick={() =>
              onUpdateSettings({
                points: cycleValue(question.points, POINT_OPTIONS),
              })
            }
            className="flex items-center gap-1 text-[11px] font-medium text-ink-dim transition-colors hover:text-brand"
          >
            <Star size={12} />
            {question.points} pts
          </button>
        ) : (
          <span className="flex items-center gap-1 text-[11px] font-medium text-ink-dim">
            <Star size={12} />
            {question.points} pts
          </span>
        )}
        <span className="flex items-center gap-1 text-[11px] font-medium text-ink-dim">
          <Tag size={12} />
          {question.tag}
        </span>
      </div>
    </motion.article>
  )
}
