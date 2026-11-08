import type { Desk, Hire } from '../types'

function desk(
  id: string,
  label: string,
  zone: Desk['zone'],
  row: number,
  col: number,
  hireId: string | null = null,
): Desk {
  return { id, label, zone, row, col, hireId }
}

export const SEED_HIRES: Hire[] = [
  {
    id: 'h1',
    name: 'Maya Chen',
    role: 'Product Designer',
    startDate: '2026-11-10',
    team: 'Design',
    preferredZone: 'windows',
  },
  {
    id: 'h2',
    name: 'Jordan Blake',
    role: 'Software Engineer',
    startDate: '2026-11-12',
    team: 'Platform',
    preferredZone: 'core',
  },
  {
    id: 'h3',
    name: 'Sam Okonkwo',
    role: 'Customer Success',
    startDate: '2026-11-17',
    team: 'CX',
    preferredZone: 'quiet',
  },
  {
    id: 'h4',
    name: 'Riley Park',
    role: 'Data Analyst',
    startDate: '2026-11-17',
    team: 'Insights',
    preferredZone: 'core',
  },
  {
    id: 'h5',
    name: 'Avery Nguyen',
    role: 'Recruiter',
    startDate: '2026-11-24',
    team: 'People',
    preferredZone: 'windows',
  },
]

export const SEED_DESKS: Desk[] = [
  // Window line — 3 cols × 3 rows
  desk('d-w-1', 'W-01', 'windows', 0, 0, 'seed-a'),
  desk('d-w-2', 'W-02', 'windows', 0, 1),
  desk('d-w-3', 'W-03', 'windows', 0, 2),
  desk('d-w-4', 'W-04', 'windows', 1, 0),
  desk('d-w-5', 'W-05', 'windows', 1, 1),
  desk('d-w-6', 'W-06', 'windows', 1, 2, 'seed-b'),
  desk('d-w-7', 'W-07', 'windows', 2, 0),
  desk('d-w-8', 'W-08', 'windows', 2, 1),
  desk('d-w-9', 'W-09', 'windows', 2, 2),

  // Core bay — 4 cols × 3 rows
  desk('d-c-1', 'C-01', 'core', 0, 0, 'seed-c'),
  desk('d-c-2', 'C-02', 'core', 0, 1),
  desk('d-c-3', 'C-03', 'core', 0, 2),
  desk('d-c-4', 'C-04', 'core', 0, 3, 'seed-d'),
  desk('d-c-5', 'C-05', 'core', 1, 0),
  desk('d-c-6', 'C-06', 'core', 1, 1),
  desk('d-c-7', 'C-07', 'core', 1, 2),
  desk('d-c-8', 'C-08', 'core', 1, 3),
  desk('d-c-9', 'C-09', 'core', 2, 0),
  desk('d-c-10', 'C-10', 'core', 2, 1, 'seed-e'),
  desk('d-c-11', 'C-11', 'core', 2, 2),
  desk('d-c-12', 'C-12', 'core', 2, 3),

  // Quiet corner — 2 cols × 3 rows
  desk('d-q-1', 'Q-01', 'quiet', 0, 0),
  desk('d-q-2', 'Q-02', 'quiet', 0, 1, 'seed-f'),
  desk('d-q-3', 'Q-03', 'quiet', 1, 0),
  desk('d-q-4', 'Q-04', 'quiet', 1, 1),
  desk('d-q-5', 'Q-05', 'quiet', 2, 0),
  desk('d-q-6', 'Q-06', 'quiet', 2, 1),
]

/** Existing teammates already seated (not in the new-hire queue). */
export const SEED_OCCUPANTS: Hire[] = [
  {
    id: 'seed-a',
    name: 'Priya Shah',
    role: 'Eng Manager',
    startDate: '2024-03-01',
    team: 'Platform',
  },
  {
    id: 'seed-b',
    name: 'Leo Martins',
    role: 'Designer',
    startDate: '2025-01-15',
    team: 'Design',
  },
  {
    id: 'seed-c',
    name: 'Nina Vogel',
    role: 'PM',
    startDate: '2023-09-12',
    team: 'Product',
  },
  {
    id: 'seed-d',
    name: 'Chris Ortiz',
    role: 'Engineer',
    startDate: '2025-06-02',
    team: 'Platform',
  },
  {
    id: 'seed-e',
    name: 'Elena Rossi',
    role: 'Finance',
    startDate: '2024-11-04',
    team: 'Ops',
  },
  {
    id: 'seed-f',
    name: 'Tom Hughes',
    role: 'Writer',
    startDate: '2025-08-18',
    team: 'Marketing',
  },
]

export const STORAGE_KEY = 'desklane-seat-state-v1'
