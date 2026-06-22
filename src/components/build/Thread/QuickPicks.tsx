import { ArrowLeft, Plus } from 'lucide-react'
import { useState } from 'react'

export interface QuickPick {
  label: string
  hint?: string
  custom?: boolean
}

interface QuickPicksProps {
  onSelect: (label: string) => void
  disabled?: boolean
  selectedAnswer?: string
  allowChange?: boolean
}

const PRESET_PICKS: QuickPick[] = [
  { label: '10 questions', hint: 'quick' },
  { label: '20 questions', hint: 'recommended' },
  { label: '30 questions' },
  { label: '50 questions', hint: 'deep dive' },
]

const MIN_QUESTIONS = 1
const MAX_QUESTIONS = 50

function clampCount(value: number) {
  return Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, value))
}

function pickMatchesAnswer(pickLabel: string, answer?: string) {
  const pickNum = pickLabel.match(/^(\d+)/)?.[1]
  const answerNum = answer?.match(/(\d+)/)?.[1]
  return Boolean(pickNum && answerNum && pickNum === answerNum)
}

function selectedButtonClass(isSelected: boolean, locked: boolean) {
  if (isSelected) {
    return 'border-brand bg-brand-soft text-brand-deep ring-2 ring-brand/20'
  }
  if (locked) {
    return 'opacity-50'
  }
  return 'hover:border-dashed hover:border-brand hover:bg-brand-soft/70 hover:text-brand-deep'
}

export function QuickPicks({ onSelect, disabled = false, selectedAnswer, allowChange = false }: QuickPicksProps) {
  const [showCustom, setShowCustom] = useState(false)
  const [customCount, setCustomCount] = useState('')

  const locked = Boolean(selectedAnswer) && !allowChange
  const selectedNum = selectedAnswer?.match(/(\d+)/)?.[1]
  const isCustomSelected =
    locked && Boolean(selectedNum) && !PRESET_PICKS.some((pick) => pickMatchesAnswer(pick.label, selectedAnswer))

  const parsedCustom = parseInt(customCount, 10)
  const isCustomValid = Number.isFinite(parsedCustom) && parsedCustom >= MIN_QUESTIONS

  const submitCustom = () => {
    if (!isCustomValid || disabled || locked) return
    onSelect(`${clampCount(parsedCustom)} questions`)
  }

  return (
    <div className="w-full rounded-2xl bg-white p-3">
      <div className="flex w-full flex-col gap-2.5">
        {PRESET_PICKS.map((pick) => {
          const isSelected = pickMatchesAnswer(pick.label, selectedAnswer)

          return (
            <button
              key={pick.label}
              type="button"
              disabled={disabled}
              aria-disabled={locked || disabled}
              onClick={() => {
                if (locked || disabled) return
                onSelect(pick.label)
              }}
              className={`flex w-full items-center justify-between gap-3 rounded-xl border-2 border-border-strong bg-brand-softer px-4 py-3.5 font-display text-[13px] font-semibold text-ink transition-all disabled:cursor-not-allowed ${selectedButtonClass(isSelected, locked)}`}
            >
              <span>{pick.label}</span>
              {pick.hint ? (
                <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 text-[10px] font-semibold text-brand-deep">
                  {pick.hint}
                </span>
              ) : null}
            </button>
          )
        })}

        {showCustom && !locked ? (
          <div className="rounded-xl border-2 border-dashed border-border-strong bg-brand-softer px-4 py-3.5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-display text-[13px] font-semibold text-ink">Custom count</span>
              <button
                type="button"
                disabled={disabled}
                onClick={() => {
                  setShowCustom(false)
                  setCustomCount('')
                }}
                className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-ink-dim transition-colors hover:bg-white hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={12} strokeWidth={2.2} />
                Back
              </button>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                inputMode="numeric"
                autoFocus
                disabled={disabled}
                value={customCount}
                onChange={(e) => setCustomCount(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    submitCustom()
                  }
                }}
                placeholder="e.g. 15"
                className="min-w-0 flex-1 rounded-xl border border-border-strong bg-white px-3.5 py-2.5 font-display text-[13px] font-semibold text-ink outline-none transition-colors placeholder:font-normal placeholder:text-ink-muted focus:border-brand focus:ring-2 focus:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <button
                type="button"
                disabled={disabled || !isCustomValid}
                onClick={submitCustom}
                className="shrink-0 rounded-xl bg-brand px-4 py-2.5 font-display text-[13px] font-semibold text-white transition-all hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-40"
              >
                Go
              </button>
            </div>

            <p className="mt-2 text-[11px] text-ink-dim">
              Enter {MIN_QUESTIONS}–{MAX_QUESTIONS} questions
            </p>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            aria-disabled={locked || disabled}
            onClick={() => {
              if (disabled) return
              if (locked) return
              if (isCustomSelected && selectedNum) {
                setCustomCount(selectedNum)
              }
              setShowCustom(true)
            }}
            className={`flex w-full items-center gap-2 rounded-xl border-2 border-dashed border-border-strong bg-brand-softer px-4 py-3.5 font-display text-[13px] font-semibold text-ink transition-all disabled:cursor-not-allowed ${selectedButtonClass(isCustomSelected, locked)}`}
          >
            <Plus size={15} strokeWidth={2.5} />
            {isCustomSelected && selectedNum ? `${selectedNum} questions` : 'Custom'}
          </button>
        )}
      </div>
    </div>
  )
}
