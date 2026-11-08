import type { Desk, FloorId, Person, Pod } from '../types'

const FIRST = [
  'Alex',
  'Zoe',
  'Priya',
  'Noah',
  'Mia',
  'Leo',
  'Ava',
  'Kai',
  'Elena',
  'Sam',
  'Jordan',
  'Riley',
  'Chris',
  'Nina',
  'Tom',
  'Maya',
  'Omar',
  'Ivy',
  'Ben',
  'Lara',
  'Dev',
  'Skye',
  'Jon',
  'Tess',
  'Quin',
  'Ash',
  'Remy',
  'Eden',
  'Hugo',
  'Vera',
  'Felix',
  'Nora',
  'Miles',
  'Cora',
  'Owen',
  'Jade',
]

const ROLES = [
  'Engineer',
  'Designer',
  'PM',
  'Analyst',
  'Recruiter',
  'Writer',
  'CSM',
  'Finance',
]

function hue(i: number) {
  return (i * 47) % 360
}

export const PODS: Pod[] = [
  // Floor 4
  { id: 'p4-design', name: 'Design', team: 'Design', floor: 4, x: -10, z: -6, cols: 3, rows: 2 },
  { id: 'p4-platform', name: 'Platform', team: 'Platform', floor: 4, x: -2, z: -6, cols: 3, rows: 2 },
  { id: 'p4-product', name: 'Product', team: 'Product', floor: 4, x: 6, z: -6, cols: 3, rows: 2 },
  { id: 'p4-cx', name: 'CX', team: 'CX', floor: 4, x: -10, z: 2, cols: 3, rows: 2 },
  { id: 'p4-ops', name: 'Ops', team: 'Ops', floor: 4, x: -2, z: 2, cols: 2, rows: 2 },
  // Floor 5
  { id: 'p5-mkt', name: 'Marketing', team: 'Marketing', floor: 5, x: -10, z: -6, cols: 3, rows: 2 },
  { id: 'p5-people', name: 'People', team: 'People', floor: 5, x: -2, z: -6, cols: 3, rows: 2 },
  { id: 'p5-insights', name: 'Insights', team: 'Insights', floor: 5, x: 6, z: -6, cols: 3, rows: 2 },
  { id: 'p5-eng', name: 'Engineering', team: 'Engineering', floor: 5, x: -10, z: 2, cols: 3, rows: 2 },
  { id: 'p5-lead', name: 'Leadership', team: 'Leadership', floor: 5, x: -2, z: 2, cols: 2, rows: 2 },
]

function buildDesks(): { desks: Desk[]; seated: Person[] } {
  const desks: Desk[] = []
  const seated: Person[] = []
  let personIdx = 0
  let deskSerial = 1

  for (const pod of PODS) {
    for (let r = 0; r < pod.rows; r++) {
      for (let c = 0; c < pod.cols; c++) {
        const id = `d-${pod.id}-${r}-${c}`
        const label = `${pod.floor === 4 ? 'A' : 'B'}${String(deskSerial).padStart(2, '0')}`
        deskSerial++

        // ~64% occupied among non-reserved seats
        const shouldOccupy = (personIdx + r * 3 + c) % 5 !== 0 && personIdx < 36
        let personId: string | null = null
        if (shouldOccupy && personIdx < FIRST.length) {
          const p: Person = {
            id: `emp-${personIdx}`,
            name: FIRST[personIdx],
            role: ROLES[personIdx % ROLES.length],
            team: pod.team,
            isNewHire: false,
            avatarHue: hue(personIdx),
          }
          seated.push(p)
          personId = p.id
          personIdx++
        }

        desks.push({
          id,
          label,
          floor: pod.floor,
          podId: pod.id,
          localX: (c - (pod.cols - 1) / 2) * 1.35,
          localZ: (r - (pod.rows - 1) / 2) * 1.45,
          personId,
        })
      }
    }
  }

  return { desks, seated }
}

const built = buildDesks()

export const SEED_OCCUPANTS: Person[] = built.seated

export const SEED_HIRES: Person[] = [
  {
    id: 'nh-1',
    name: 'Priya Shah',
    role: 'Product Designer',
    team: 'Design',
    startDate: '2026-11-09',
    isNewHire: true,
    avatarHue: 12,
  },
  {
    id: 'nh-2',
    name: 'Jordan Blake',
    role: 'Software Engineer',
    team: 'Platform',
    startDate: '2026-11-10',
    isNewHire: true,
    avatarHue: 200,
  },
  {
    id: 'nh-3',
    name: 'Sam Okonkwo',
    role: 'Customer Success',
    team: 'CX',
    startDate: '2026-11-12',
    isNewHire: true,
    avatarHue: 140,
  },
  {
    id: 'nh-4',
    name: 'Riley Park',
    role: 'Data Analyst',
    team: 'Insights',
    startDate: '2026-11-12',
    isNewHire: true,
    avatarHue: 280,
  },
  {
    id: 'nh-5',
    name: 'Avery Nguyen',
    role: 'Recruiter',
    team: 'People',
    startDate: '2026-11-17',
    isNewHire: true,
    avatarHue: 40,
  },
  {
    id: 'nh-6',
    name: 'Casey Moore',
    role: 'Engineer',
    team: 'Engineering',
    startDate: '2026-11-17',
    isNewHire: true,
    avatarHue: 320,
  },
  {
    id: 'nh-7',
    name: 'Harper Lin',
    role: 'PM',
    team: 'Product',
    startDate: '2026-11-19',
    isNewHire: true,
    avatarHue: 90,
  },
  {
    id: 'nh-8',
    name: 'Drew Patel',
    role: 'Marketing',
    team: 'Marketing',
    startDate: '2026-11-20',
    isNewHire: true,
    avatarHue: 170,
  },
  {
    id: 'nh-9',
    name: 'Quinn Ellis',
    role: 'Finance',
    team: 'Ops',
    startDate: '2026-11-24',
    isNewHire: true,
    avatarHue: 220,
  },
  {
    id: 'nh-10',
    name: 'Taylor Kim',
    role: 'Designer',
    team: 'Design',
    startDate: '2026-11-24',
    isNewHire: true,
    avatarHue: 30,
  },
]

/** Mark a couple free desks as suggested for the next hire. */
export function withSuggestions(desks: Desk[], floor: FloorId, team?: string): Desk[] {
  const free = desks.filter((d) => {
    if (d.personId || d.floor !== floor) return false
    if (!team || team === 'all') return true
    const pod = PODS.find((p) => p.id === d.podId)
    return pod?.team === team
  })
  const suggestedIds = new Set(free.slice(0, 3).map((d) => d.id))
  return desks.map((d) => ({ ...d, suggested: suggestedIds.has(d.id) }))
}

export const SEED_DESKS: Desk[] = withSuggestions(built.desks, 4)

export const STORAGE_KEY = 'seatmap-office-v2'

export const TEAMS = [
  'all',
  ...Array.from(new Set(PODS.map((p) => p.team))),
]
