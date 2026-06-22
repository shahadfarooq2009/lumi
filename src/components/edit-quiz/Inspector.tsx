import { Settings2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import type { EditQuizQuestion, QuestionDifficulty } from '../../types/editQuiz'
import { TYPE_LABEL } from '../../types/editQuiz'

export type QuestionSettingsPatch = Partial<Pick<EditQuizQuestion, 'difficulty' | 'time' | 'points'>>

interface InspectorProps {
  question: EditQuizQuestion
  onUpdateSettings: (patch: QuestionSettingsPatch) => void
}

function capitalizeDifficulty(level: QuestionDifficulty) {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

function parseDifficulty(label: string): QuestionDifficulty {
  const lower = label.toLowerCase()
  if (lower === 'hard') return 'hard'
  if (lower === 'medium') return 'medium'
  return 'easy'
}

function InspectorSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border-soft px-4 py-4 last:border-0">
      <h4 className="mb-3 text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-muted">
        {title}
      </h4>
      {children}
    </div>
  )
}

function Segment({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex rounded-md border border-border bg-white p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={`flex-1 rounded-[5px] px-2 py-1.5 text-[11px] font-semibold transition-all ${
            value === opt
              ? 'bg-brand text-white shadow-brand-glow'
              : 'text-ink-dim hover:bg-surface-soft hover:text-ink'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export function Inspector({ question, onUpdateSettings }: InspectorProps) {
  const [difficulty, setDifficulty] = useState(() => capitalizeDifficulty(question.difficulty))
  const [time, setTime] = useState(question.time)
  const [points, setPoints] = useState(String(question.points))

  useEffect(() => {
    setDifficulty(capitalizeDifficulty(question.difficulty))
    setTime(question.time)
    setPoints(String(question.points))
  }, [question.id, question.difficulty, question.time, question.points])

  const handleDifficulty = (label: string) => {
    setDifficulty(label)
    onUpdateSettings({ difficulty: parseDifficulty(label) })
  }

  const handleTime = (value: string) => {
    setTime(value)
    onUpdateSettings({ time: value })
  }

  const handlePoints = (value: string) => {
    setPoints(value)
    onUpdateSettings({ points: parseInt(value, 10) })
  }

  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-y-auto bg-surface-tint">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="shrink-0 border-b border-border-soft bg-white px-4 py-4">
          <div className="flex items-center gap-2">
            <Settings2 size={15} className="text-brand" strokeWidth={2.2} />
            <h3 className="font-display text-sm font-bold text-ink">Question settings</h3>
          </div>
          <p className="mt-1 text-[12px] text-ink-dim">
            Editing {question.num} · {TYPE_LABEL[question.type]}
          </p>
        </div>

        <InspectorSection title="Difficulty">
          <Segment options={['Easy', 'Medium', 'Hard']} value={difficulty} onChange={handleDifficulty} />
        </InspectorSection>

        <InspectorSection title="Time limit">
          <Segment options={['15s', '20s', '30s', '60s']} value={time} onChange={handleTime} />
        </InspectorSection>

        <InspectorSection title="Points">
          <Segment options={['100', '200', '300', '500']} value={points} onChange={handlePoints} />
        </InspectorSection>
      </motion.div>
    </aside>
  )
}
