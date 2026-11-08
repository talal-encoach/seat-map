import { useState, type FormEvent } from 'react'
import { ZONE_META, type Hire, type ZoneId } from '../types'

type Props = {
  hires: Hire[]
  selectedHireId: string | null
  query: string
  onQuery: (q: string) => void
  onSelect: (id: string | null) => void
  onAdd: (input: {
    name: string
    role: string
    team: string
    startDate: string
    preferredZone?: ZoneId
  }) => void
}

function formatStart(iso: string) {
  const d = new Date(`${iso}T12:00:00`)
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function HireQueue({
  hires,
  selectedHireId,
  query,
  onQuery,
  onSelect,
  onAdd,
}: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [team, setTeam] = useState('')
  const [startDate, setStartDate] = useState('')
  const [preferredZone, setPreferredZone] = useState<ZoneId | ''>('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim() || !team.trim() || !startDate) return
    onAdd({
      name: name.trim(),
      role: role.trim(),
      team: team.trim(),
      startDate,
      preferredZone: preferredZone || undefined,
    })
    setName('')
    setRole('')
    setTeam('')
    setStartDate('')
    setPreferredZone('')
  }

  return (
    <section className="panel" aria-label="New hire queue">
      <h2>New hire queue</h2>
      <p className="panel-sub">
        {hires.length === 0
          ? 'Everyone has a desk'
          : `${hires.length} waiting for a seat`}
      </p>

      <input
        className="search"
        type="search"
        placeholder="Search name, role, or team"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        aria-label="Search new hires"
      />

      {hires.length === 0 ? (
        <p className="empty">Queue is clear. Add someone below.</p>
      ) : (
        <ul className="hire-list">
          {hires.map((hire) => (
            <li key={hire.id}>
              <button
                type="button"
                className={`hire${selectedHireId === hire.id ? ' selected' : ''}`}
                onClick={() =>
                  onSelect(selectedHireId === hire.id ? null : hire.id)
                }
                aria-pressed={selectedHireId === hire.id}
              >
                <span className="hire-name">{hire.name}</span>
                <span className="hire-meta">
                  {hire.role} · {hire.team} · starts {formatStart(hire.startDate)}
                </span>
                {hire.preferredZone ? (
                  <span className="hire-pref">
                    Prefers {ZONE_META[hire.preferredZone].label}
                  </span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      )}

      <form className="add-form" onSubmit={handleSubmit}>
        <strong style={{ fontSize: '0.85rem' }}>Add new hire</strong>
        <input
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="row">
          <input
            required
            placeholder="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          />
          <input
            required
            placeholder="Team"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          />
        </div>
        <div className="row">
          <input
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            aria-label="Start date"
          />
          <select
            value={preferredZone}
            onChange={(e) => setPreferredZone(e.target.value as ZoneId | '')}
            aria-label="Preferred zone"
          >
            <option value="">Any zone</option>
            {(Object.keys(ZONE_META) as ZoneId[]).map((z) => (
              <option key={z} value={z}>
                {ZONE_META[z].label}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-accent" type="submit">
          Add to queue
        </button>
      </form>
    </section>
  )
}
