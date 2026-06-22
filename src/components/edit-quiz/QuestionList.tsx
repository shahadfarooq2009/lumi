import { List, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import type { EditQuizQuestion, QuestionType } from '../../types/editQuiz'
import { TYPE_PILL } from '../../types/editQuiz'

const FILTERS: { id: 'all' | QuestionType; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'mcq', label: 'MCQ' },
  { id: 'tf', label: 'T/F' },
  { id: 'fill', label: 'Fill-in' },
  { id: 'match', label: 'Matching' },
]

interface QuestionListProps {
  questions: EditQuizQuestion[]
  selectedId: string
  onSelect: (id: string) => void
}

export function QuestionList({ questions, selectedId, onSelect }: QuestionListProps) {
  const [filter, setFilter] = useState<'all' | QuestionType>('all')
  const [query, setQuery] = useState('')

  const filtered = questions.filter((q) => {
    if (filter !== 'all' && q.type !== filter) return false
    if (!query.trim()) return true
    return q.question.toLowerCase().includes(query.toLowerCase())
  })

  return (
    <aside className="flex min-h-0 flex-col overflow-hidden border-r border-border-soft bg-surface-tint">
      <div className="shrink-0 border-b border-border-soft bg-white p-3">
        <div className="mb-2.5 flex items-center gap-2">
          <List size={14} className="text-brand" strokeWidth={2.2} />
          <span className="font-display text-sm font-bold text-ink">Questions</span>
          <span className="rounded-full bg-brand-softer px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wide text-brand-deep">
            {questions.length}
          </span>
        </div>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
            strokeWidth={2}
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-lg border border-border bg-surface-soft py-2 pl-9 pr-3 text-[12px] text-ink outline-none transition-all placeholder:text-ink-muted focus:border-brand-light focus:bg-white focus:ring-4 focus:ring-brand-softer"
          />
        </div>
      </div>

      <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-border-soft bg-white px-3 py-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`shrink-0 rounded-md px-2.5 py-1 text-[11.5px] font-semibold transition-colors ${
              filter === f.id
                ? 'bg-ink text-white'
                : 'text-ink-dim hover:bg-surface-soft hover:text-ink'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        {filtered.map((q) => {
          const active = q.id === selectedId
          const pill = TYPE_PILL[q.type]

          return (
            <button
              key={q.id}
              type="button"
              onClick={() => onSelect(q.id)}
              className={`relative mb-1.5 flex w-full gap-2.5 rounded-xl border p-3 text-left transition-all ${
                active
                  ? 'border-brand-soft bg-white shadow-md-soft before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-full before:bg-brand'
                  : 'border-transparent hover:border-border hover:bg-white'
              }`}
            >
              <span
                className={`flex h-6 shrink-0 items-center justify-center rounded-md px-1.5 font-mono text-[10.5px] font-bold ${
                  active ? 'bg-brand-softer text-brand-deep' : 'bg-surface-soft text-ink-muted'
                }`}
              >
                {q.num}
              </span>
              <span className="min-w-0 flex-1">
                <span className="mb-1 line-clamp-2 text-[12.5px] font-medium leading-snug text-ink">
                  {q.question}
                </span>
                <span className="flex items-center gap-2">
                  <span
                    className={`rounded-[5px] px-1.5 py-0.5 text-[10px] font-bold uppercase ${pill.listClass}`}
                  >
                    {pill.label}
                  </span>
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      q.status === 'ready' ? 'bg-state-success' : 'bg-state-warn'
                    }`}
                  />
                </span>
              </span>
            </button>
          )
        })}
      </div>

      <div className="shrink-0 border-t border-border-soft bg-surface-tint p-2.5">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand/40 bg-brand-softer py-2.5 text-[12px] font-semibold text-brand-deep transition-all hover:-translate-y-px hover:border-brand hover:bg-brand-soft hover:shadow-sm-soft"
        >
          <Plus size={14} strokeWidth={2.5} />
          Add question
        </button>
      </div>
    </aside>
  )
}
