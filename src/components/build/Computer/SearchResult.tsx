interface SearchResultProps {
  variant: 'edu' | 'gov' | 'news' | 'video' | 'book'
  title: string
  snippet: string
}

const VARIANT_STYLES: Record<
  SearchResultProps['variant'],
  { bg: string; text: string; emoji: string }
> = {
  edu: { bg: 'bg-emerald-100', text: 'text-game-success', emoji: '🎓' },
  gov: { bg: 'bg-blue-100', text: 'text-game-info', emoji: '🏛' },
  news: { bg: 'bg-orange-100', text: 'text-orange-600', emoji: '📰' },
  video: { bg: 'bg-red-100', text: 'text-game-survival', emoji: '🎬' },
  book: { bg: 'bg-amber-100', text: 'text-game-fantasy', emoji: '📚' },
}

export function SearchResult({ variant, title, snippet }: SearchResultProps) {
  const style = VARIANT_STYLES[variant]

  return (
    <div className="flex cursor-default gap-3 rounded-md p-3 transition-colors hover:bg-[#f5f5f8]">
      <div
        className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded text-[11px] ${style.bg} ${style.text}`}
      >
        {style.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-ink">{title}</div>
        <div className="line-clamp-2 text-[11.5px] leading-snug text-ink-dim">{snippet}</div>
      </div>
    </div>
  )
}
