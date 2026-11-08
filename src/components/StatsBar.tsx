type Props = {
  total: number
  pods: number
  floors: number
  occupied: number
  occupiedPct: number
  free: number
  freeOn4: number
  needDesk: number
  nextHireName?: string
  nextHireDate?: string
}

function formatDate(iso?: string) {
  if (!iso) return ''
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function StatsBar({
  total,
  pods,
  floors,
  occupied,
  occupiedPct,
  free,
  freeOn4,
  needDesk,
  nextHireName,
  nextHireDate,
}: Props) {
  return (
    <div className="stats-grid">
      <article className="stat-card">
        <span className="stat-label">Desks</span>
        <strong className="stat-value">{total}</strong>
        <span className="stat-sub">
          {floors} floors · {pods} pods
        </span>
      </article>
      <article className="stat-card">
        <span className="stat-label">Occupied</span>
        <strong className="stat-value">{occupied}</strong>
        <span className="stat-sub">{occupiedPct}% in use</span>
      </article>
      <article className="stat-card">
        <span className="stat-label">Free</span>
        <strong className="stat-value accent-green">{free}</strong>
        <span className="stat-sub">{freeOn4} on Floor 4</span>
      </article>
      <article className="stat-card">
        <span className="stat-label">Need a desk</span>
        <strong className="stat-value accent-amber">{needDesk}</strong>
        <span className="stat-sub">
          {nextHireName
            ? `Next: ${nextHireName}, ${formatDate(nextHireDate)}`
            : 'Queue clear'}
        </span>
      </article>
    </div>
  )
}
