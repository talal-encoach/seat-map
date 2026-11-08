import { useCallback, useEffect, useMemo, useState } from 'react'
import { SEED_DESKS, SEED_HIRES, SEED_OCCUPANTS, STORAGE_KEY } from '../data/seed'
import type { Desk, Hire, SeatState, ZoneId } from '../types'

type Persisted = {
  desks: Desk[]
  hires: Hire[]
  occupants: Hire[]
}

function loadPersisted(): Persisted | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw) as Persisted
  } catch {
    return null
  }
}

function savePersisted(desks: Desk[], hires: Hire[], occupants: Hire[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ desks, hires, occupants }))
}

export function useSeatStore() {
  const initial = loadPersisted()
  const [desks, setDesks] = useState<Desk[]>(initial?.desks ?? SEED_DESKS)
  const [hires, setHires] = useState<Hire[]>(initial?.hires ?? SEED_HIRES)
  const [occupants, setOccupants] = useState<Hire[]>(
    initial?.occupants ?? SEED_OCCUPANTS,
  )
  const [selectedHireId, setSelectedHireId] = useState<string | null>(null)
  const [selectedDeskId, setSelectedDeskId] = useState<string | null>(null)
  const [filter, setFilter] = useState<SeatState['filter']>('all')
  const [query, setQuery] = useState('')
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    savePersisted(desks, hires, occupants)
  }, [desks, hires, occupants])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), 2800)
    return () => window.clearTimeout(t)
  }, [toast])

  const peopleById = useMemo(() => {
    const map = new Map<string, Hire>()
    for (const h of [...hires, ...occupants]) map.set(h.id, h)
    return map
  }, [hires, occupants])

  const unassignedHires = useMemo(() => {
    const seated = new Set(
      desks.map((d) => d.hireId).filter((id): id is string => Boolean(id)),
    )
    return hires
      .filter((h) => !seated.has(h.id))
      .filter((h) => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          h.name.toLowerCase().includes(q) ||
          h.role.toLowerCase().includes(q) ||
          h.team.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [desks, hires, query])

  const assignedNewHires = useMemo(() => {
    const hireIds = new Set(hires.map((h) => h.id))
    return desks
      .filter((d) => d.hireId && hireIds.has(d.hireId))
      .map((d) => ({
        desk: d,
        hire: peopleById.get(d.hireId!)!,
      }))
  }, [desks, hires, peopleById])

  const stats = useMemo(() => {
    const total = desks.length
    const occupied = desks.filter((d) => d.hireId).length
    return {
      total,
      occupied,
      available: total - occupied,
      waiting: unassignedHires.length,
    }
  }, [desks, unassignedHires.length])

  const visibleDesks = useMemo(() => {
    return desks.filter((d) => {
      if (filter === 'available') return !d.hireId
      if (filter === 'occupied') return Boolean(d.hireId)
      return true
    })
  }, [desks, filter])

  const selectHire = useCallback((id: string | null) => {
    setSelectedHireId(id)
    if (id) setSelectedDeskId(null)
  }, [])

  const selectDesk = useCallback(
    (deskId: string) => {
      const desk = desks.find((d) => d.id === deskId)
      if (!desk) return

      // Assign flow: hire selected + empty desk
      if (selectedHireId && !desk.hireId) {
        setDesks((prev) =>
          prev.map((d) =>
            d.id === deskId ? { ...d, hireId: selectedHireId } : d,
          ),
        )
        const hire = hires.find((h) => h.id === selectedHireId)
        setToast(
          hire
            ? `${hire.name} → ${desk.label}`
            : `Assigned to ${desk.label}`,
        )
        setSelectedHireId(null)
        setSelectedDeskId(deskId)
        return
      }

      setSelectedDeskId(deskId)
    },
    [desks, hires, selectedHireId],
  )

  const unassignDesk = useCallback((deskId: string) => {
    setDesks((prev) =>
      prev.map((d) => (d.id === deskId ? { ...d, hireId: null } : d)),
    )
    setToast('Desk cleared')
  }, [])

  const assignHireToDesk = useCallback((hireId: string, deskId: string) => {
    setDesks((prev) => {
      const cleared = prev.map((d) =>
        d.hireId === hireId ? { ...d, hireId: null } : d,
      )
      return cleared.map((d) =>
        d.id === deskId ? { ...d, hireId } : d,
      )
    })
    const hire = [...hires, ...occupants].find((h) => h.id === hireId)
    const desk = desks.find((d) => d.id === deskId)
    if (hire && desk) setToast(`${hire.name} → ${desk.label}`)
    setSelectedHireId(null)
    setSelectedDeskId(deskId)
  }, [desks, hires, occupants])

  const addHire = useCallback(
    (input: {
      name: string
      role: string
      team: string
      startDate: string
      preferredZone?: ZoneId
    }) => {
      const hire: Hire = {
        id: `h-${crypto.randomUUID().slice(0, 8)}`,
        ...input,
      }
      setHires((prev) => [...prev, hire])
      setSelectedHireId(hire.id)
      setToast(`${hire.name} added to queue`)
    },
    [],
  )

  const resetDemo = useCallback(() => {
    setDesks(SEED_DESKS)
    setHires(SEED_HIRES)
    setOccupants(SEED_OCCUPANTS)
    setSelectedHireId(null)
    setSelectedDeskId(null)
    setFilter('all')
    setQuery('')
    setToast('Demo data restored')
  }, [])

  const selectedDesk = desks.find((d) => d.id === selectedDeskId) ?? null
  const selectedHire =
    hires.find((h) => h.id === selectedHireId) ??
    occupants.find((h) => h.id === selectedHireId) ??
    null

  return {
    desks,
    visibleDesks,
    hires,
    occupants,
    peopleById,
    unassignedHires,
    assignedNewHires,
    stats,
    selectedHireId,
    selectedDeskId,
    selectedDesk,
    selectedHire,
    filter,
    query,
    toast,
    setFilter,
    setQuery,
    selectHire,
    selectDesk,
    unassignDesk,
    assignHireToDesk,
    addHire,
    resetDemo,
  }
}

export type SeatStore = ReturnType<typeof useSeatStore>
