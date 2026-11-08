import { Html } from '@react-three/drei'
import { useMemo, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { Desk, Person } from '../../types'

type Props = {
  desk: Desk
  person: Person | null
  selected: boolean
  assignMode: boolean
  onSelect: (id: string) => void
}

function statusColor(
  desk: Desk,
  person: Person | null,
  selected: boolean,
  assignMode: boolean,
) {
  if (selected) return '#5b8cff'
  if (assignMode && !desk.personId) return '#7cf0c2'
  if (desk.suggested && !desk.personId) return '#a78bfa'
  if (person?.isNewHire) return '#f5b942'
  if (desk.personId) return '#4f8cff'
  return '#3dd68c'
}

export function DeskMesh({ desk, person, selected, assignMode, onSelect }: Props) {
  const [hovered, setHovered] = useState(false)
  const color = statusColor(desk, person, selected, assignMode)
  const emissive = useMemo(() => color, [color])

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    onSelect(desk.id)
  }

  return (
    <group position={[desk.localX, 0, desk.localZ]}>
      {/* Large invisible hit target for reliable picking */}
      <mesh
        position={[0, 0.55, 0.1]}
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      {/* Desk surface */}
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.05, 0.08, 0.7]} />
        <meshStandardMaterial color="#2a3344" roughness={0.55} metalness={0.15} />
      </mesh>
      {/* Legs */}
      {[
        [-0.42, 0.2, -0.25],
        [0.42, 0.2, -0.25],
        [-0.42, 0.2, 0.25],
        [0.42, 0.2, 0.25],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.06, 0.4, 0.06]} />
          <meshStandardMaterial color="#1b2230" />
        </mesh>
      ))}
      {/* Monitor */}
      <mesh position={[0, 0.68, -0.18]} castShadow>
        <boxGeometry args={[0.55, 0.36, 0.05]} />
        <meshStandardMaterial color="#111827" emissive="#1e3a5f" emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[0, 0.48, -0.18]}>
        <boxGeometry args={[0.12, 0.12, 0.08]} />
        <meshStandardMaterial color="#1b2230" />
      </mesh>
      {/* Chair */}
      <mesh position={[0, 0.22, 0.48]} castShadow>
        <boxGeometry args={[0.42, 0.08, 0.42]} />
        <meshStandardMaterial color="#243044" />
      </mesh>
      <mesh position={[0, 0.42, 0.62]} castShadow>
        <boxGeometry args={[0.42, 0.4, 0.08]} />
        <meshStandardMaterial color="#243044" />
      </mesh>

      {/* Status beacon */}
      <mesh position={[0, 1.05, 0]}>
        <sphereGeometry args={[hovered || selected ? 0.12 : 0.09, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={selected || assignMode ? 1.1 : 0.65}
        />
      </mesh>

      {(person || hovered || selected) && (
        <Html
          position={[0, 1.35, 0]}
          center
          distanceFactor={10}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div className={`desk-tag${person?.isNewHire ? ' new' : ''}`}>
            {person ? person.name.split(' ')[0] : desk.label}
          </div>
        </Html>
      )}
    </group>
  )
}
