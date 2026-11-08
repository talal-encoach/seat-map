import { PODS } from '../data/seed'
import type { Desk, Person } from '../types'

type Props = {
  desk: Desk | null
  person: Person | null
  waiting: Person[]
  onClose: () => void
  onUnseat: (deskId: string) => void
  onSeat: (personId: string, deskId: string) => void
}

export function DeskDialog({
  desk,
  person,
  waiting,
  onClose,
  onUnseat,
  onSeat,
}: Props) {
  if (!desk) return null
  const pod = PODS.find((p) => p.id === desk.podId)

  return (
    <div className="dialog-backdrop" onClick={onClose} role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-label={`Desk ${desk.label}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-head">
          <div>
            <p className="eyebrow">
              Floor {desk.floor} · {pod?.name ?? 'Pod'}
            </p>
            <h2>Desk {desk.label}</h2>
          </div>
          <button type="button" className="icon-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="dialog-body">
          <div className="kv">
            <span>Status</span>
            <strong>{person ? 'Occupied' : desk.suggested ? 'Suggested' : 'Free'}</strong>
          </div>
          {person ? (
            <>
              <div className="kv">
                <span>Person</span>
                <strong>{person.name}</strong>
              </div>
              <div className="kv">
                <span>Role</span>
                <strong>{person.role}</strong>
              </div>
              <div className="kv">
                <span>Team</span>
                <strong>{person.team}</strong>
              </div>
            </>
          ) : null}

          <div className="dialog-actions">
            {person ? (
              <button
                type="button"
                className="btn ghost"
                onClick={() => onUnseat(desk.id)}
              >
                Unseat
              </button>
            ) : waiting.length > 0 ? (
              <label className="seat-select">
                <span>Seat someone</span>
                <select
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) onSeat(e.target.value, desk.id)
                  }}
                >
                  <option value="" disabled>
                    Choose a new hire…
                  </option>
                  {waiting.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} · {h.team}
                    </option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="empty">No unseated new hires.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
