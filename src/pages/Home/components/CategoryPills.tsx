const CATEGORIES = [
  { id: 'all',      label: '🎮 All games' },
  { id: 'math',     label: '🧮 Math' },
  { id: 'science',  label: '🔬 Science' },
  { id: 'language', label: '🌍 Language' },
  { id: 'history',  label: '📖 History' },
  { id: 'logic',    label: '🧩 Logic' },
] as const

interface CategoryPillsProps {
  activeIndex: number
  onChange: (index: number) => void
}

export function CategoryPills({ activeIndex, onChange }: CategoryPillsProps) {
  return (
    <div className="mb-8 flex flex-wrap gap-2.5">
      {CATEGORIES.map((cat, index) => {
        const active = activeIndex === index
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onChange(index)}
            className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lumi-primary/30 ${
              active
                ? 'text-white shadow-[0_8px_20px_-8px_rgba(124,77,255,0.55)]'
                : 'text-lumi-muted hover:text-lumi-ink'
            }`}
            style={active ? { background: 'linear-gradient(135deg, #7C4DFF, #9A6BFF)' } : undefined}
          >
            {cat.label}
          </button>
        )
      })}
    </div>
  )
}
