import './App.css'
import { DeskDialog } from './components/DeskDialog'
import { HirePanel } from './components/HirePanel'
import { OfficeCanvas } from './components/OfficeCanvas'
import { StatsBar } from './components/StatsBar'
import { TEAMS } from './data/seed'
import { useSeatStore } from './hooks/useSeatStore'
import type { FloorId } from './types'

export default function App() {
  const store = useSeatStore()
  const selectedPerson = store.selectedDesk?.personId
    ? store.peopleById.get(store.selectedDesk.personId) ?? null
    : null

  return (
    <div className="shell">
      <header className="top">
        <div className="title-block">
          <p className="breadcrumb">Workplace / New hire seating</p>
          <h1>Seat Map</h1>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn ghost"
            onClick={() => store.setPanelOpen(!store.panelOpen)}
          >
            {store.panelOpen ? 'Hide hires' : 'Hire list'}
          </button>
          <button type="button" className="btn ghost" onClick={store.resetDemo}>
            Reset demo
          </button>
        </div>
      </header>

      <StatsBar
        total={store.stats.total}
        pods={store.stats.pods}
        floors={store.stats.floors}
        occupied={store.stats.occupied}
        occupiedPct={store.stats.occupiedPct}
        free={store.stats.free}
        freeOn4={store.stats.freeOn4}
        needDesk={store.stats.needDesk}
        nextHireName={store.stats.nextHire?.name}
        nextHireDate={store.stats.nextHire?.startDate}
      />

      <div className="toolbar">
        <div className="segmented dark">
          {([4, 5, 'all'] as const).map((f) => (
            <button
              key={String(f)}
              type="button"
              aria-pressed={store.floor === f}
              onClick={() => store.setFloor(f === 'all' ? 'all' : (f as FloorId))}
            >
              {f === 'all' ? 'All floors' : `Floor ${f}`}
            </button>
          ))}
        </div>
        <select
          className="field team-select"
          value={store.team}
          onChange={(e) => store.setTeam(e.target.value)}
          aria-label="Filter by team"
        >
          {TEAMS.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All teams' : t}
            </option>
          ))}
        </select>
        {store.selectedHire ? (
          <div className="assign-banner row">
            <p>
              Seating <strong>{store.selectedHire.name}</strong> — click a free
              desk
            </p>
            <button
              type="button"
              className="btn primary compact"
              onClick={() => store.seatOnSuggested()}
            >
              Place on suggested
            </button>
          </div>
        ) : (
          <p className="assign-banner muted">
            Open the hire list, pick someone, then place them on the floor
          </p>
        )}
      </div>

      <div className="workspace">
        <OfficeCanvas
          pods={store.visiblePods}
          desks={store.visibleDesks}
          peopleById={store.peopleById}
          selectedDeskId={store.selectedDeskId}
          selectedHireId={store.selectedHireId}
          onSelectDesk={store.selectDesk}
        />

        <HirePanel
          open={store.panelOpen}
          hires={store.filteredHires}
          seatedIds={store.seatedIds}
          selectedHireId={store.selectedHireId}
          filter={store.hireFilter}
          query={store.query}
          onClose={() => store.setPanelOpen(false)}
          onFilter={store.setHireFilter}
          onQuery={store.setQuery}
          onSelect={store.selectHire}
          onRemove={store.removeHire}
          onAdd={store.addHire}
        />
      </div>

      <DeskDialog
        desk={store.selectedDesk}
        person={selectedPerson}
        waiting={store.unseatedHires}
        onClose={() => store.setSelectedDeskId(null)}
        onUnseat={store.unseatDesk}
        onSeat={store.seatPerson}
      />

      {store.toast ? (
        <div className="toast" role="status">
          {store.toast}
        </div>
      ) : null}
    </div>
  )
}
