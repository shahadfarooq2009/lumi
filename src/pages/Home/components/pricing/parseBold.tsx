export function parseBold(text: string, strongClassName = 'font-bold text-pricing-ink') {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className={strongClassName}>
        {part}
      </strong>
    ) : (
      part
    ),
  )
}
