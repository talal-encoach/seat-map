import { ZONE_META, type Desk, type Hire } from '../types'

type Props = {
  desk: Desk | null
  person: Hire | null
  waiting: Hire[]
  onUnassign: (deskId: string) => void
  onAssign: (hireId: string, deskId: string) => void
}

export function DeskDetail({
  desk,
  person,
  waiting,
  onUnassign,
  onAssign,
}: Props) {
  if (!desk) {
    return (
      <section className="panel" aria-label="Desk details">
        <h2>Desk details</h2>
        <p className="empty">Select a desk on the map to inspect or reassign.</p>
      </section>
    )
  }

  return (
    <section className="panel" aria-label="Desk details">
      <h2>{desk.label}</h2>
      <p className="panel-sub">{ZONE_META[desk.zone].label}</p>

      <div className="detail-block">
        <div className="detail-row">
          <span>Status</span>
          <strong>{person ? 'Occupied' : 'Available'}</strong>
        </div>
        {person ? (
          <>
            <div className="detail-row">
              <span>Person</span>
              <strong>{person.name}</strong>
            </div>
            <div className="detail-row">
              <span>Role</span>
              <strong>{person.role}</strong>
            </div>
            <div className="detail-row">
              <span>Team</span>
              <strong>{person.team}</strong>
            </div>
          </>
        ) : null}

        <div className="detail-actions">
          {person ? (
            <button
              type="button"
              className="btn btn-ghost btn-small"
              onClick={() => onUnassign(desk.id)}
            >
              Clear desk
            </button>
          ) : waiting.length > 0 ? (
            <label style={{ display: 'grid', gap: '0.35rem', width: '100%' }}>
              <span className="hire-meta">Assign from queue</span>
              <select
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) onAssign(e.target.value, desk.id)
                  e.target.value = ''
                }}
              >
                <option value="" disabled>
                  Choose a new hire…
                </option>
                {waiting.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name} · {h.role}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <p className="empty">No one left in the queue.</p>
          )}
        </div>
      </div>
    </section>
  )
}
