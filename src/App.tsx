import './App.css'
import { DeskDetail } from './components/DeskDetail'
import { FloorMap } from './components/FloorMap'
import { HireQueue } from './components/HireQueue'
import { useSeatStore } from './hooks/useSeatStore'

export default function App() {
  const store = useSeatStore()
  const selectedPerson = store.selectedDesk?.hireId
    ? store.peopleById.get(store.selectedDesk.hireId) ?? null
    : null

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <div className="brand-glyph" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </div>
            <h1>Desklane</h1>
          </div>
          <p>
            Floor map for seating new hires — pick someone from the queue, then
            place them on an open desk.
          </p>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={store.resetDemo}
          >
            Reset demo
          </button>
        </div>
      </header>

      <main className="main-stage">
        <div className="toolbar">
          <div className="stats" aria-live="polite">
            <span>
              <strong>{store.stats.available}</strong> open
            </span>
            <span>
              <strong>{store.stats.occupied}</strong> seated
            </span>
            <span>
              <strong>{store.stats.waiting}</strong> waiting
            </span>
          </div>
          <div className="segmented" role="group" aria-label="Desk filter">
            {(
              [
                ['all', 'All'],
                ['available', 'Open'],
                ['occupied', 'Seated'],
              ] as const
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={store.filter === value}
                onClick={() => store.setFilter(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <FloorMap
          desks={store.desks}
          peopleById={store.peopleById}
          selectedDeskId={store.selectedDeskId}
          selectedHireId={store.selectedHireId}
          selectedHire={store.selectedHire}
          filter={store.filter}
          onSelectDesk={store.selectDesk}
        />
      </main>

      <aside className="aside">
        <HireQueue
          hires={store.unassignedHires}
          selectedHireId={store.selectedHireId}
          query={store.query}
          onQuery={store.setQuery}
          onSelect={store.selectHire}
          onAdd={store.addHire}
        />

        <DeskDetail
          desk={store.selectedDesk}
          person={selectedPerson}
          waiting={store.unassignedHires}
          onUnassign={store.unassignDesk}
          onAssign={store.assignHireToDesk}
        />

        <section className="panel" aria-label="Recent assignments">
          <h2>Placed this session</h2>
          {store.assignedNewHires.length === 0 ? (
            <p className="empty">No new hires seated yet.</p>
          ) : (
            <ul className="assigned-list">
              {store.assignedNewHires.map(({ desk, hire }) => (
                <li key={desk.id}>
                  <span>{hire.name}</span>
                  <strong>{desk.label}</strong>
                </li>
              ))}
            </ul>
          )}
          <p className="sample-note" style={{ marginTop: '0.75rem' }}>
            Sample office data · saved in this browser
          </p>
        </section>
      </aside>

      {store.toast ? (
        <div className="toast" role="status">
          {store.toast}
        </div>
      ) : null}
    </div>
  )
}
