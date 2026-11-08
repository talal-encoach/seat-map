import { useState, type FormEvent } from 'react'
import { TEAMS } from '../data/seed'
import type { HireFilter, Person } from '../types'

type Props = {
  open: boolean
  hires: Person[]
  seatedIds: Set<string>
  selectedHireId: string | null
  filter: HireFilter
  query: string
  onClose: () => void
  onFilter: (f: HireFilter) => void
  onQuery: (q: string) => void
  onSelect: (id: string | null) => void
  onRemove: (id: string) => void
  onAdd: (input: {
    name: string
    role: string
    team: string
    startDate: string
  }) => void
}

function formatDate(iso?: string) {
  if (!iso) return ''
  return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}

export function HirePanel({
  open,
  hires,
  seatedIds,
  selectedHireId,
  filter,
  query,
  onClose,
  onFilter,
  onQuery,
  onSelect,
  onRemove,
  onAdd,
}: Props) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [team, setTeam] = useState('Design')
  const [startDate, setStartDate] = useState('')

  if (!open) return null

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !role.trim() || !startDate) return
    onAdd({
      name: name.trim(),
      role: role.trim(),
      team,
      startDate,
    })
    setName('')
    setRole('')
    setStartDate('')
  }

  return (
    <aside className="hire-panel" aria-label="New hire list">
      <div className="panel-head">
        <div>
          <p className="eyebrow">Workforce</p>
          <h2>Hire list</h2>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <p className="panel-copy">
        Select a hire, then click a free desk on the map to seat them.
      </p>

      <div className="segmented dark">
        {(
          [
            ['unseated', 'Unseated'],
            ['seated', 'Seated'],
            ['all', 'All'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => onFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <input
        className="field"
        type="search"
        placeholder="Filter by name, role, team"
        value={query}
        onChange={(e) => onQuery(e.target.value)}
      />

      <ul className="hire-list">
        {hires.length === 0 ? (
          <li className="empty">No hires match this filter.</li>
        ) : (
          hires.map((hire) => {
            const seated = seatedIds.has(hire.id)
            return (
              <li key={hire.id}>
                <button
                  type="button"
                  className={`hire-row${selectedHireId === hire.id ? ' selected' : ''}`}
                  onClick={() =>
                    onSelect(selectedHireId === hire.id ? null : hire.id)
                  }
                >
                  <span
                    className="avatar"
                    style={{
                      background: `hsl(${hire.avatarHue} 70% 45%)`,
                    }}
                  >
                    {hire.name.slice(0, 1)}
                  </span>
                  <span className="hire-text">
                    <strong>{hire.name}</strong>
                    <small>
                      {hire.role} · {hire.team}
                      {hire.startDate ? ` · ${formatDate(hire.startDate)}` : ''}
                    </small>
                  </span>
                  <span className={`pill ${seated ? 'seated' : 'open'}`}>
                    {seated ? 'Seated' : 'Needs desk'}
                  </span>
                </button>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => onRemove(hire.id)}
                  aria-label={`Remove ${hire.name}`}
                >
                  Remove
                </button>
              </li>
            )
          })
        )}
      </ul>

      <form className="add-form" onSubmit={submit}>
        <strong>Add new hire</strong>
        <input
          className="field"
          required
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="field"
          required
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <div className="form-row">
          <select
            className="field"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
          >
            {TEAMS.filter((t) => t !== 'all').map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <input
            className="field"
            required
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <button className="btn primary" type="submit">
          Add hire
        </button>
      </form>
    </aside>
  )
}
