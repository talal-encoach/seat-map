import { Html } from '@react-three/drei'
import type { Desk, Person, Pod } from '../../types'
import { DeskMesh } from './DeskMesh'

type Props = {
  pod: Pod
  desks: Desk[]
  peopleById: Map<string, Person>
  selectedDeskId: string | null
  selectedHireId: string | null
  onSelectDesk: (id: string) => void
}

export function PodGroup({
  pod,
  desks,
  peopleById,
  selectedDeskId,
  selectedHireId,
  onSelectDesk,
}: Props) {
  const podDesks = desks.filter((d) => d.podId === pod.id)
  const seated = podDesks.filter((d) => d.personId).length
  const width = pod.cols * 1.45 + 0.8
  const depth = pod.rows * 1.55 + 0.9

  return (
    <group position={[pod.x, 0, pod.z]}>
      {/* Raised carpet / platform */}
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[width, 0.04, depth]} />
        <meshStandardMaterial color="#1a2333" roughness={0.9} />
      </mesh>
      {/* Soft rim */}
      <mesh position={[0, 0.04, 0]} receiveShadow>
        <boxGeometry args={[width - 0.15, 0.01, depth - 0.15]} />
        <meshStandardMaterial color="#222c3f" />
      </mesh>

      {/* Low partition walls */}
      <mesh position={[0, 0.35, -depth / 2 + 0.08]} castShadow>
        <boxGeometry args={[width - 0.2, 0.55, 0.08]} />
        <meshStandardMaterial color="#2b364a" />
      </mesh>
      <mesh position={[-width / 2 + 0.08, 0.35, 0]} castShadow>
        <boxGeometry args={[0.08, 0.55, depth - 0.2]} />
        <meshStandardMaterial color="#2b364a" />
      </mesh>

      <Html position={[0, 1.7, -depth / 2 + 0.2]} center distanceFactor={12}>
        <div className="pod-label">
          <strong>{pod.name}</strong>
          <span>
            {seated}/{podDesks.length} seated
          </span>
        </div>
      </Html>

      {podDesks.map((desk) => (
        <DeskMesh
          key={desk.id}
          desk={desk}
          person={desk.personId ? peopleById.get(desk.personId) ?? null : null}
          selected={selectedDeskId === desk.id}
          assignMode={Boolean(selectedHireId)}
          onSelect={onSelectDesk}
        />
      ))}
    </group>
  )
}
