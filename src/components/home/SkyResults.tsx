import type { Question } from '../../types/quiz'
import { QuestionItem } from './QuestionItem'

interface SkyResultsProps {
  visible: boolean
  isRevealing: boolean
  meta: string
  isLoading: boolean
  error: string | null
  questions: Question[]
  onRevealEnd: () => void
  onUpdateQuestion: (index: number, updated: Question) => void
}

export function SkyResults({
  visible,
  isRevealing,
  meta,
  isLoading,
  error,
  questions,
  onRevealEnd,
  onUpdateQuestion,
}: SkyResultsProps) {
  if (!visible) return null

  return (
    <div
      className={`sky-results${isRevealing ? ' is-revealing' : ''}`}
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) onRevealEnd()
      }}
    >
      <div className="sky-results__header">
        <span className="sky-results__title">Generated Questions</span>
        <span className="sky-results__meta">{meta}</span>
      </div>

      {isLoading ? (
        <div className="sky-results__status">
          <span className="sky-results__spinner" />
          Quizora is generating questions from your file…
        </div>
      ) : null}

      {error ? <div className="sky-results__error">{error}</div> : null}

      {!isLoading && !error && questions.length > 0 ? (
        <div className="sky-results__list">
          {questions.map((question, index) => (
            <QuestionItem
              key={index}
              question={question}
              index={index}
              animate={isRevealing}
              onSave={onUpdateQuestion}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
