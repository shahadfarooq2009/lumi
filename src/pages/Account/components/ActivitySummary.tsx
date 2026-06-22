import { ACTIVITY_STATS, CHART_POINTS } from '../data/accountData'

export function ActivitySummary() {
  const width = 400
  const height = 140
  const padding = 8
  const max = Math.max(...CHART_POINTS)
  const min = Math.min(...CHART_POINTS)
  const range = max - min || 1

  const points = CHART_POINTS.map((value, index) => {
    const x = padding + (index / (CHART_POINTS.length - 1)) * (width - padding * 2)
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`

  return (
    <section className="account-section-card h-full">
      <h2 className="m-0 mb-4 font-display text-[17px] font-extrabold text-[#1B1530]">Activity Summary</h2>

      <div className="account-chart-wrap">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="accountChartFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#7C4DFF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#7C4DFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={areaPoints} fill="url(#accountChartFill)" />
          <polyline
            points={points}
            fill="none"
            stroke="#7C4DFF"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {ACTIVITY_STATS.map(({ label, value, trend, icon: Icon }) => (
          <div key={label} className="account-stat-mini">
            <div className="flex items-center gap-2">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-[#F3EEFF] text-[#7C4DFF]">
                <Icon size={15} strokeWidth={2.2} />
              </div>
              <span className="text-[11px] font-semibold text-[#9B94B0]">{label}</span>
            </div>
            <div className="mt-2 font-display text-[22px] font-extrabold leading-none text-[#1B1530]">{value}</div>
            <div className="mt-1 text-[11px] font-semibold text-[#16A34A]">↑ {trend}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
