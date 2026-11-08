import { ZONE_META, type Desk, type Hire, type ZoneId } from '../types'

const ZONE_ORDER: ZoneId[] = ['windows', 'core', 'quiet']

type Props = {
  desks: Desk[]
  peopleById: Map<string, Hire>
  selectedDeskId: string | null
  selectedHireId: string | null
  selectedHire: Hire | null
  filter: 'all' | 'available' | 'occupied'
  onSelectDesk: (id: string) => void
}

export function FloorMap({
  desks,
  peopleById,
  selectedDeskId,
  selectedHireId,
  selectedHire,
  filter,
  onSelectDesk,
}: Props) {
  return (
    <section className="floor" aria-label="Office floor map">
      <p className="floor-hint">
        {selectedHireId && selectedHire ? (
          <>
            Place <em>{selectedHire.name}</em> on an open desk
            {selectedHire.preferredZone
              ? ` · prefers ${ZONE_META[selectedHire.preferredZone].label}`
              : ''}
          </>
        ) : (
          <>Select a new hire, then click an open desk to assign</>
        )}
      </p>

      <div className="zones">
        {ZONE_ORDER.map((zone) => {
          const zoneDesks = desks
            .filter((d) => d.zone === zone)
            .sort((a, b) => a.row - b.row || a.col - b.col)
          const open = zoneDesks.filter((d) => !d.hireId).length
          return (
            <div className="zone" key={zone}>
              <div className="zone-head">
                <h2>{ZONE_META[zone].label}</h2>
                <span>
                  {open} open · {ZONE_META[zone].blurb}
                </span>
              </div>
              <div className={`desk-grid ${zone}`}>
                {zoneDesks.map((desk) => {
                  const person = desk.hireId
                    ? peopleById.get(desk.hireId)
                    : null
                  const occupied = Boolean(desk.hireId)
                  const dimmed =
                    (filter === 'available' && occupied) ||
                    (filter === 'occupied' && !occupied)
                  const assignable = Boolean(selectedHireId) && !occupied
                  const selected = selectedDeskId === desk.id

                  return (
                    <button
                      key={desk.id}
                      type="button"
                      className={[
                        'desk',
                        occupied ? 'occupied' : 'available',
                        dimmed ? 'dimmed' : '',
                        selected ? 'selected' : '',
                        assignable ? 'assignable' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() => onSelectDesk(desk.id)}
                      aria-pressed={selected}
                      aria-label={`${desk.label}${person ? `, ${person.name}` : ', available'}`}
                    >
                      <span className="desk-label">{desk.label}</span>
                      {person ? (
                        <span className="desk-person">{person.name}</span>
                      ) : (
                        <span className="desk-empty">Open</span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="legend" style={{ marginTop: '0.9rem' }}>
        <span>
          <i className="l-available" /> Available
        </span>
        <span>
          <i className="l-occupied" /> Occupied
        </span>
      </div>
    </section>
  )
}
