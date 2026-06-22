import { useMemo, useState } from 'react'
import { Calendar, ChevronDown, Maximize2 } from 'lucide-react'
import { LEARNING_CHART } from '../../data/accountData'

const CHART = {
  width: 640,
  height: 220,
  padding: { top: 12, right: 16, bottom: 28, left: 44 },
}

function formatTick(value: number) {
  return `${value}%`
}

export function ProfileLearningChart() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(LEARNING_CHART.points.length - 1)
  const { points, yTicks } = LEARNING_CHART
  const max = 100
  const min = 0

  const coords = useMemo(() => {
    const innerWidth = CHART.width - CHART.padding.left - CHART.padding.right
    const innerHeight = CHART.height - CHART.padding.top - CHART.padding.bottom

    return points.map((point, index) => {
      const x = CHART.padding.left + (index / (points.length - 1)) * innerWidth
      const y =
        CHART.padding.top +
        innerHeight -
        ((point.value - min) / (max - min)) * innerHeight
      return { ...point, x, y, index }
    })
  }, [points])

  const linePoints = coords.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPoints = [
    `${CHART.padding.left},${CHART.height - CHART.padding.bottom}`,
    ...coords.map((p) => `${p.x},${p.y}`),
    `${CHART.width - CHART.padding.right},${CHART.height - CHART.padding.bottom}`,
  ].join(' ')

  const activeIndex = hoverIndex ?? coords.length - 1
  const active = coords[activeIndex]

  const handlePointerMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const ratio = (event.clientX - rect.left) / rect.width
    const x = ratio * CHART.width
    let nearest = 0
    let nearestDistance = Number.POSITIVE_INFINITY

    coords.forEach((point) => {
      const distance = Math.abs(point.x - x)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = point.index
      }
    })

    setHoverIndex(nearest)
  }

  const tooltipLeft = `${(active.x / CHART.width) * 100}%`
  const tooltipTop = `${(active.y / CHART.height) * 100}%`

  return (
    <section className="profile-card profile-chart-card profile-card--padded">
      <div className="profile-chart-card__toolbar">
        <div className="profile-chart-card__select-wrap">
          <Calendar size={14} strokeWidth={2} className="profile-chart-card__select-icon" />
          <select className="profile-chart-card__select" defaultValue="year" aria-label="Period">
            <option value="year">{LEARNING_CHART.periodLabel}</option>
            <option value="month">This month</option>
            <option value="week">This week</option>
          </select>
          <ChevronDown size={14} strokeWidth={2} className="profile-chart-card__select-chevron" />
        </div>
        <button type="button" className="profile-chart-card__expand" aria-label="Expand chart">
          <Maximize2 size={15} strokeWidth={2} />
        </button>
      </div>

      <div className="profile-chart-card__summary">
        <h2 className="profile-chart-card__title">{LEARNING_CHART.title}</h2>
        <p className="profile-chart-card__value">
          {LEARNING_CHART.totalValue.toLocaleString()}
          <span className="profile-chart-card__value-suffix"> {LEARNING_CHART.totalSuffix}</span>
        </p>
        <p className="profile-chart-card__growth">
          <span className="profile-chart-card__growth-delta">
            +{LEARNING_CHART.growthDelta.toFixed(1)}
          </span>
          <span className="profile-chart-card__growth-percent">
            ({LEARNING_CHART.growthPercent}%)
          </span>
          <span className="profile-chart-card__growth-period"> • {LEARNING_CHART.periodLabel}</span>
        </p>
      </div>

      <div className="profile-chart-card__plot">
        <div className="profile-chart-card__y-axis" aria-hidden>
          {[...yTicks].reverse().map((tick) => (
            <span key={tick}>{formatTick(tick)}</span>
          ))}
        </div>

        <div className="profile-chart-card__canvas">
          <svg
            viewBox={`0 0 ${CHART.width} ${CHART.height}`}
            className="profile-chart-card__svg"
            preserveAspectRatio="none"
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(points.length - 1)}
          >
            <defs>
              <linearGradient id="profileLearningArea" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.32" />
                <stop offset="55%" stopColor="var(--brand-light)" stopOpacity="0.14" />
                <stop offset="100%" stopColor="var(--brand)" stopOpacity="0.02" />
              </linearGradient>
              <pattern
                id="profileChartDots"
                width="14"
                height="14"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="7" cy="7" r="0.9" fill="#dfe3ea" />
              </pattern>
            </defs>

            <rect
              x={CHART.padding.left}
              y={CHART.padding.top}
              width={CHART.width - CHART.padding.left - CHART.padding.right}
              height={CHART.height - CHART.padding.top - CHART.padding.bottom}
              fill="url(#profileChartDots)"
            />

            {yTicks.map((tick) => {
              const innerHeight = CHART.height - CHART.padding.top - CHART.padding.bottom
              const y =
                CHART.padding.top +
                innerHeight -
                ((tick - min) / (max - min)) * innerHeight
              return (
                <line
                  key={tick}
                  x1={CHART.padding.left}
                  x2={CHART.width - CHART.padding.right}
                  y1={y}
                  y2={y}
                  stroke="#e8ebf0"
                  strokeWidth="1"
                  strokeDasharray="2 6"
                />
              )
            })}

            <polygon points={areaPoints} fill="url(#profileLearningArea)" />
            <polyline
              points={linePoints}
              fill="none"
              stroke="var(--brand)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {active ? (
              <>
                <line
                  x1={active.x}
                  x2={active.x}
                  y1={CHART.padding.top}
                  y2={CHART.height - CHART.padding.bottom}
                  stroke="var(--brand-light)"
                  strokeOpacity="0.55"
                  strokeWidth="1.5"
                />
                <circle
                  cx={active.x}
                  cy={active.y}
                  r="5.5"
                  fill="#fff"
                  stroke="var(--brand)"
                  strokeWidth="2"
                />
              </>
            ) : null}

            {coords.map((point) => (
              <circle
                key={point.month}
                cx={point.x}
                cy={point.y}
                r="10"
                fill="transparent"
                className="profile-chart-card__hit"
              />
            ))}
          </svg>

          {active ? (
            <div
              className="profile-chart-card__tooltip"
              style={{
                left: tooltipLeft,
                top: tooltipTop,
              }}
            >
              <span className="profile-chart-card__tooltip-date">{active.tooltipDate}</span>
              <span className="profile-chart-card__tooltip-value">
                Score: {active.value}%
              </span>
            </div>
          ) : null}

          <div className="profile-chart-card__x-axis">
            {points.map((point) => (
              <span key={point.month}>{point.month}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
