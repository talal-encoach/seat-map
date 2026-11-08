export type DeskStatus = 'available' | 'occupied' | 'reserved'

export type ZoneId = 'windows' | 'core' | 'quiet'

export interface Desk {
  id: string
  label: string
  zone: ZoneId
  row: number
  col: number
  hireId: string | null
}

export interface Hire {
  id: string
  name: string
  role: string
  startDate: string
  team: string
  preferredZone?: ZoneId
}

export interface SeatState {
  desks: Desk[]
  hires: Hire[]
  selectedHireId: string | null
  selectedDeskId: string | null
  filter: 'all' | 'available' | 'occupied'
  query: string
}

export const ZONE_META: Record<
  ZoneId,
  { label: string; blurb: string }
> = {
  windows: { label: 'Window line', blurb: 'Natural light, open desks' },
  core: { label: 'Core bay', blurb: 'Near collaboration rooms' },
  quiet: { label: 'Quiet corner', blurb: 'Focus seating, low foot traffic' },
}
