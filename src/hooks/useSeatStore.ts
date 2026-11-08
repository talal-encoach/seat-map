import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  PODS,
  SEED_DESKS,
  SEED_HIRES,
  SEED_OCCUPANTS,
  STORAGE_KEY,
  withSuggestions,
} from '../data/seed'
import type { Desk, FloorId, HireFilter, Person } from '../types'

type Persisted = {
  desks: Desk[]
  hires: Person[]
  occupants: Person[]
}

function load(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Persisted) : null
  } catch {
    return null
  }
}

export function useSeatStore() {
  const saved = load()
  const [desks, setDesks] = useState<Desk[]>(saved?.desks ?? SEED_DESKS)
  const [hires, setHires] = useState<Person[]>(saved?.hires ?? SEED_HIRES)
  const [occupants, setOccupants] = useState<Person[]>(
    saved?.occupants ?? SEED_OCCUPANTS,
  )
  const [floor, setFloor] = useState<FloorId | 'all'>(4)
  const [team, setTeam] = useState('all')
  const [selectedHireId, setSelectedHireId] = useState<string | null>(null)
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null)
  const [hireFilter, setHireFilter] = useState<HireFilter>('unseated')
  const [query, setQuery] = useState('')
  const [panelOpen, setPanelOpen] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ desks, hires, occupants }),
    )
  }, [desks, hires, occupants])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2600)
    return () => window.clearTimeout(t)
  }, [toast])

  const peopleById = useMemo(() => {
    const map = new Map<string, Person>()
    for (const p of [...hires, ...occupants]) map.set(p.id, p)
    return map
  }, [hires, occupants])

  const activeFloor: FloorId = floor === 'all' ? 4 : floor

  const refreshSuggestions = useCallback(
    (nextDesks: Desk[], f: FloorId, teamFilter: string) =>
      withSuggestions(nextDesks, f, teamFilter),
    [],
  )

  useEffect(() => {
    setDesks((prev) => refreshSuggestions(prev, activeFloor, team))
  }, [activeFloor, team, refreshSuggestions])

  const seatedIds = useMemo(() => {
    return new Set(
      desks.map((d) => d.personId).filter((id): id is string => Boolean(id)),
    )
  }, [desks])

  const unseatedHires = useMemo(
    () => hires.filter((h) => !seatedIds.has(h.id)),
    [hires, seatedIds],
  )

  const stats = useMemo(() => {
    const floorDesks =
      floor === 'all' ? desks : desks.filter((d) => d.floor === floor)
    const total = floorDesks.length
    const occupied = floorDesks.filter((d) => d.personId).length
    const free = total - occupied
    const freeOn4 = desks.filter((d) => d.floor === 4 && !d.personId).length
    const next = unseatedHires
      .slice()
      .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))[0]
    return {
      total: desks.length,
      pods: PODS.length,
      floors: 2,
      occupied: desks.filter((d) => d.personId).length,
      occupiedPct: Math.round(
        (desks.filter((d) => d.personId).length / desks.length) * 100,
      ),
      free: desks.filter((d) => !d.personId).length,
      freeOnFloor: free,
      freeOn4,
      needDesk: unseatedHires.length,
      nextHire: next,
      viewTotal: total,
      viewOccupied: occupied,
    }
  }, [desks, floor, unseatedHires])

  const visibleDesks = useMemo(() => {
    return desks.filter((d) => {
      if (floor !== 'all' && d.floor !== floor) return false
      if (team !== 'all') {
        const pod = PODS.find((p) => p.id === d.podId)
        if (pod?.team !== team) return false
      }
      return true
    })
  }, [desks, floor, team])

  const visiblePods = useMemo(() => {
    return PODS.filter((p) => {
      if (floor !== 'all' && p.floor !== floor) return false
      if (team !== 'all' && p.team !== team) return false
      return true
    })
  }, [floor, team])

  const filteredHires = useMemo(() => {
    return hires
      .filter((h) => {
        const seated = seatedIds.has(h.id)
        if (hireFilter === 'seated' && !seated) return false
        if (hireFilter === 'unseated' && seated) return false
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          h.name.toLowerCase().includes(q) ||
          h.role.toLowerCase().includes(q) ||
          h.team.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => (a.startDate ?? '').localeCompare(b.startDate ?? ''))
  }, [hires, hireFilter, query, seatedIds])

  const selectHire = useCallback((id: string | null) => {
    setSelectedHireId(id)
  }, [])

  const selectDesk = useCallback(
    (deskId: string) => {
      const desk = desks.find((d) => d.id === deskId)
      if (!desk) return

      if (selectedHireId && !desk.personId) {
        setDesks((prev) => {
          const cleared = prev.map((d) =>
            d.personId === selectedHireId ? { ...d, personId: null } : d,
          )
          const assigned = cleared.map((d) =>
            d.id === deskId ? { ...d, personId: selectedHireId } : d,
          )
          return refreshSuggestions(assigned, activeFloor, team)
        })
        const hire = hires.find((h) => h.id === selectedHireId)
        if (hire) {
          setOccupants((prev) =>
            prev.some((p) => p.id === hire.id) ? prev : [...prev, hire],
          )
        }
        setToast(`${hire?.name ?? 'Hire'} → ${desk.label}`)
        setSelectedHireId(null)
        setSelectedDeskId(null)
        return
      }

      setSelectedDeskId(deskId)
    },
    [
      activeFloor,
      desks,
      hires,
      refreshSuggestions,
      selectedHireId,
      team,
    ],
  )

  const seatPerson = useCallback(
    (personId: string, deskId: string) => {
      setDesks((prev) => {
        const cleared = prev.map((d) =>
          d.personId === personId ? { ...d, personId: null } : d,
        )
        const assigned = cleared.map((d) =>
          d.id === deskId ? { ...d, personId } : d,
        )
        return refreshSuggestions(assigned, activeFloor, team)
      })
      const person =
        hires.find((h) => h.id === personId) ||
        occupants.find((h) => h.id === personId)
      if (person?.isNewHire) {
        setOccupants((prev) =>
          prev.some((p) => p.id === person.id) ? prev : [...prev, person],
        )
      }
      const desk = desks.find((d) => d.id === deskId)
      if (person && desk) setToast(`${person.name} → ${desk.label}`)
      setSelectedHireId(null)
      setSelectedDeskId(null)
    },
    [activeFloor, desks, hires, occupants, refreshSuggestions, team],
  )

  const seatOnSuggested = useCallback(() => {
    if (!selectedHireId) return false
    const target =
      desks.find(
        (d) =>
          !d.personId &&
          d.suggested &&
          (floor === 'all' || d.floor === floor) &&
          (team === 'all' ||
            PODS.find((p) => p.id === d.podId)?.team === team),
      ) ||
      desks.find(
        (d) =>
          !d.personId &&
          (floor === 'all' || d.floor === floor) &&
          (team === 'all' ||
            PODS.find((p) => p.id === d.podId)?.team === team),
      )
    if (!target) return false
    seatPerson(selectedHireId, target.id)
    return true
  }, [desks, floor, seatPerson, selectedHireId, team])

  const unseatDesk = useCallback(
    (deskId: string) => {
      setDesks((prev) =>
        refreshSuggestions(
          prev.map((d) => (d.id === deskId ? { ...d, personId: null } : d)),
          activeFloor,
          team,
        ),
      )
      setToast('Desk cleared')
    },
    [activeFloor, refreshSuggestions, team],
  )

  const addHire = useCallback(
    (input: Omit<Person, 'id' | 'isNewHire' | 'avatarHue'> & { avatarHue?: number }) => {
      const hire: Person = {
        id: `nh-${crypto.randomUUID().slice(0, 8)}`,
        isNewHire: true,
        avatarHue: input.avatarHue ?? Math.floor(Math.random() * 360),
        ...input,
      }
      setHires((prev) => [...prev, hire])
      setSelectedHireId(hire.id)
      setHireFilter('unseated')
      setToast(`${hire.name} added`)
      setPanelOpen(true)
    },
    [],
  )

  const removeHire = useCallback(
    (id: string) => {
      setDesks((prev) =>
        refreshSuggestions(
          prev.map((d) => (d.personId === id ? { ...d, personId: null } : d)),
          activeFloor,
          team,
        ),
      )
      setHires((prev) => prev.filter((h) => h.id !== id))
      if (selectedHireId === id) setSelectedHireId(null)
      setToast('Hire removed')
    },
    [activeFloor, refreshSuggestions, selectedHireId, team],
  )

  const resetDemo = useCallback(() => {
    setDesks(SEED_DESKS)
    setHires(SEED_HIRES)
    setOccupants(SEED_OCCUPANTS)
    setSelectedHireId(null)
    setSelectedDeskId(null)
    setFloor(4)
    setTeam('all')
    setHireFilter('unseated')
    setQuery('')
    setToast('Demo restored')
  }, [])

  const selectedDesk = desks.find((d) => d.id === selectedDeskId) ?? null
  const selectedHire =
    hires.find((h) => h.id === selectedHireId) ??
    occupants.find((h) => h.id === selectedHireId) ??
    null

  return {
    desks,
    visibleDesks,
    visiblePods,
    hires,
    occupants,
    peopleById,
    seatedIds,
    unseatedHires,
    filteredHires,
    stats,
    floor,
    team,
    selectedHireId,
    selectedDeskId,
    selectedDesk,
    selectedHire,
    hireFilter,
    query,
    panelOpen,
    toast,
    setFloor,
    setTeam,
    setHireFilter,
    setQuery,
    setPanelOpen,
    selectHire,
    selectDesk,
    seatPerson,
    seatOnSuggested,
    unseatDesk,
    addHire,
    removeHire,
    resetDemo,
    setSelectedDeskId,
  }
}

export type SeatStore = ReturnType<typeof useSeatStore>
