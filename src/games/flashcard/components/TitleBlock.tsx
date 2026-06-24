function StarSparkle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2 L13.5 9 L20 10 L13.5 11 L12 18 L10.5 11 L4 10 L10.5 9 Z" />
    </svg>
  )
}

interface TitleBlockProps {
  title: string
  showProgress?: boolean
  currentIndex?: number
  total?: number
}

export function TitleBlock({
  title,
  showProgress = true,
  currentIndex = 0,
  total = 1,
}: TitleBlockProps) {
  const pct = Math.round(((currentIndex + 1) / total) * 100)
  return (
    <div className="fc-title-block">
      <div className="fc-title-block__head">
        <StarSparkle className="fc-title-block__sparkle" />
        <h1>{title}</h1>
        <StarSparkle className="fc-title-block__sparkle fc-title-block__sparkle--2" />
      </div>
      {showProgress ? (
        <div className="fc-title-block__progress">
          <div className="fc-title-block__counter">
            {currentIndex + 1} <span>/ {total}</span>
          </div>
          <div className="fc-title-block__bar">
            <div className="fc-title-block__bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
