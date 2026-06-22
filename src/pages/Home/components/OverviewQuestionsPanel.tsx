import { useState } from 'react'
import { Check, Clock, Eye, EyeOff, FileQuestion } from 'lucide-react'
import type { EditQuizQuestion, QuestionDifficulty } from '../../../types/editQuiz'
import { TYPE_LABEL } from '../../../types/editQuiz'
import { getQuizProject } from '../../../lib/savedProjects'

const TYPE_STYLES = {
  mcq: 'bg-[#F0EBFF] text-[#7C4DFF]',
  tf: 'bg-[#ECFDF5] text-[#059669]',
  fill: 'bg-[#FFF7ED] text-[#EA580C]',
  match: 'bg-[#FDF2F8] text-[#DB2777]',
} as const

const DIFFICULTY_LABEL: Record<QuestionDifficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
}

const DIFFICULTY_STYLE: Record<QuestionDifficulty, string> = {
  easy: 'bg-[#ECFDF5] text-[#059669]',
  medium: 'bg-[#FFFBEB] text-[#D97706]',
  hard: 'bg-[#FEF2F2] text-[#DC2626]',
}

interface OverviewQuestionsPanelProps {
  projectId?: string
}

function OverviewQuestionItem({
  question,
  index,
  showAnswers,
}: {
  question: EditQuizQuestion
  index: number
  showAnswers: boolean
}) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <article className="rounded-[18px] border border-[#ECE7FB] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center gap-2.5">
        <span
          className="grid h-9 w-9 place-items-center rounded-lg font-display text-[13px] font-extrabold text-white"
          style={{ background: 'linear-gradient(135deg, #7C4DFF, #B388FF)' }}
        >
          {num}
        </span>
        <span
          className={`rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide sm:text-[12px] ${TYPE_STYLES[question.type]}`}
        >
          {TYPE_LABEL[question.type]}
        </span>
        <span
          className={`rounded-md px-2.5 py-1 text-[11px] font-bold sm:text-[12px] ${DIFFICULTY_STYLE[question.difficulty]}`}
        >
          {DIFFICULTY_LABEL[question.difficulty]}
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[12px] font-semibold text-[#9B94B0] sm:text-[13px]">
          <Clock size={14} />
          {question.time}
        </span>
      </div>

      <h3 className="mb-4 font-display text-[17px] font-bold leading-snug text-[#1B1530] sm:text-[18px]">
        {question.question}
      </h3>

      {question.type === 'fill' ? (
        <div
          className={`rounded-xl border px-4 py-3.5 text-[15px] text-[#6B6585] sm:text-[16px] ${
            showAnswers
              ? 'border-[#22C58B] bg-[#ECFDF5]'
              : 'border-dashed border-[#D4C4FF] bg-[#FAF8FF]'
          }`}
        >
          Answer:{' '}
          <span className={`font-semibold ${showAnswers ? 'text-[#059669]' : 'text-[#7C4DFF]'}`}>
            {showAnswers ? (question.fillBlankAnswer ?? '—') : '••••••'}
          </span>
        </div>
      ) : question.options?.length ? (
        <ul className="space-y-2">
          {question.options.map((opt) => {
            const isCorrect = opt.correct
            const reveal = showAnswers && isCorrect
            return (
              <li
                key={opt.letter}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                  reveal
                    ? 'border-[#22C58B] bg-[#ECFDF5]'
                    : 'border-[#F0EBFF] bg-[#FAFAFE]'
                }`}
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-[13px] font-extrabold ${
                    reveal
                      ? 'bg-[#22C58B] text-white'
                      : 'bg-white text-[#7C4DFF]'
                  }`}
                >
                  {reveal ? <Check size={14} strokeWidth={3} /> : opt.letter}
                </span>
                <span className={`text-[15px] font-medium sm:text-[16px] ${reveal ? 'text-[#059669]' : 'text-[#1B1530]'}`}>
                  {opt.text}
                </span>
              </li>
            )
          })}
        </ul>
      ) : null}
    </article>
  )
}

export function OverviewQuestionsPanel({ projectId }: OverviewQuestionsPanelProps) {
  const [showAnswers, setShowAnswers] = useState(false)
  const project = projectId ? getQuizProject(projectId) : null
  const questions = project?.questions ?? []

  if (!questions.length) {
    return (
      <div className="flex h-full min-h-[280px] flex-col items-center justify-center gap-4 p-10 text-center">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#F0EBFF] text-[#7C4DFF]">
          <FileQuestion size={26} strokeWidth={2.2} />
        </div>
        <p className="text-[16px] text-[#6B6585]">
          No questions yet. Use <strong className="text-[#1B1530]">Edit</strong> to add questions.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="shrink-0 border-b border-[#ECE7FB] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <FileQuestion size={20} className="text-[#7C4DFF]" strokeWidth={2.2} />
              <h2 className="font-display text-[18px] font-bold text-[#1B1530] sm:text-[20px]">All questions</h2>
            </div>
            <p className="mt-1 text-[13px] text-[#9B94B0] sm:text-[14px]">Preview only — open Edit to make changes</p>
          </div>
          <button
            type="button"
            onClick={() => setShowAnswers((on) => !on)}
            aria-label={showAnswers ? 'Hide correct answers' : 'Show correct answers'}
            aria-pressed={showAnswers}
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full border transition-colors ${
              showAnswers
                ? 'border-[#22C58B] bg-[#ECFDF5] text-[#059669]'
                : 'border-[#ECE7FB] bg-[#F6F2FF] text-[#7C4DFF] hover:bg-[#EDE5FF]'
            }`}
          >
            {showAnswers ? <EyeOff size={18} strokeWidth={2.2} /> : <Eye size={18} strokeWidth={2.2} />}
          </button>
        </div>
      </div>

      <div className="space-y-4 p-4 sm:p-6">
        {questions.map((question, index) => (
          <OverviewQuestionItem
            key={question.id}
            question={question}
            index={index}
            showAnswers={showAnswers}
          />
        ))}
      </div>
    </div>
  )
}
