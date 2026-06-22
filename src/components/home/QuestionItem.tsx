import { useState } from 'react'
import { getWrongOptions } from '../../lib/questions'
import type { Question } from '../../types/quiz'

interface QuestionItemProps {
  question: Question
  index: number
  animate?: boolean
  onSave: (index: number, updated: Question) => void
}

export function QuestionItem({ question, index, animate = false, onSave }: QuestionItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [draft, setDraft] = useState(question)

  const answer = question.options[question.answerIndex] ?? question.options[0] ?? ''
  const wrongOptions = getWrongOptions(question)

  const startEdit = () => {
    setDraft(question)
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setDraft(question)
    setIsEditing(false)
  }

  const saveEdit = () => {
    if (!draft.question.trim()) {
      alert('Question text cannot be empty.')
      return
    }
    if (draft.options.some((opt) => !opt.trim())) {
      alert('All options must be filled in.')
      return
    }
    onSave(index, draft)
    setIsEditing(false)
  }

  return (
    <div
      className={`sky-results__item${animate ? ' sky-results__item--reveal' : ''}${isEditing ? ' is-editing' : ''}`}
      data-index={index}
      style={animate ? { animationDelay: `${index * 0.12}s` } : undefined}
    >
      <div className="sky-results__item-head">
        <span className="sky-results__item-num">Question {index + 1}</span>
        {!isEditing ? (
          <button type="button" className="sky-results__edit" title="Edit question" onClick={startEdit}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        <div className="sky-results__item-view">
          <div className="sky-results__item-q">{question.question}</div>
          <div className="sky-results__answer">
            <span className="sky-results__answer-text">{answer}</span>
          </div>
          {wrongOptions.length > 0 ? (
            <div className="sky-results__options">
              {wrongOptions.map((option) => (
                <div key={option} className="sky-results__option">
                  {option}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ) : (
        <div className="sky-results__item-edit">
          <div className="sky-results__field">
            <label htmlFor={`edit-q-${index}`}>Question</label>
            <textarea
              id={`edit-q-${index}`}
              value={draft.question}
              onChange={(e) => setDraft((current) => ({ ...current, question: e.target.value }))}
            />
          </div>
          <div className="sky-results__edit-options">
            {draft.options.map((option, optionIndex) => (
              <div key={optionIndex} className="sky-results__edit-option">
                <input
                  type="radio"
                  name={`edit-answer-${index}`}
                  checked={draft.answerIndex === optionIndex}
                  onChange={() => setDraft((current) => ({ ...current, answerIndex: optionIndex }))}
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    setDraft((current) => ({
                      ...current,
                      options: current.options.map((opt, i) => (i === optionIndex ? e.target.value : opt)),
                    }))
                  }
                />
              </div>
            ))}
          </div>
          <div className="sky-results__edit-actions">
            <button type="button" className="sky-results__edit-cancel" onClick={cancelEdit}>
              Cancel
            </button>
            <button type="button" className="sky-results__edit-save" onClick={saveEdit}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
