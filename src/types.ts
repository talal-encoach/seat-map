export type DeskStatus = 'free' | 'occupied' | 'new-hire' | 'suggested'

export type FloorId = 4 | 5

export interface Person {
  id: string
  name: string
  role: string
  team: string
  startDate?: string
  isNewHire: boolean
  avatarHue: number
}

export interface Desk {
  id: string
  label: string
  floor: FloorId
  podId: string
  /** Local position inside the pod (desk grid). */
  localX: number
  localZ: number
  personId: string | null
  suggested?: boolean
}

export interface Pod {
  id: string
  name: string
  team: string
  floor: FloorId
  /** World position of pod origin on the floor. */
  x: number
  z: number
  cols: number
  rows: number
}

export type HireFilter = 'all' | 'unseated' | 'seated'
