import { ContactShadows, Environment, OrbitControls } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { Desk, Person, Pod } from '../../types'
import { Amenities } from './Amenities'
import { PodGroup } from './PodGroup'

type Props = {
  pods: Pod[]
  desks: Desk[]
  peopleById: Map<string, Person>
  selectedDeskId: string | null
  selectedHireId: string | null
  onSelectDesk: (id: string) => void
  resetToken: number
}

export function OfficeScene({
  pods,
  desks,
  peopleById,
  selectedDeskId,
  selectedHireId,
  onSelectDesk,
  resetToken,
}: Props) {
  const { camera, controls } = useThree() as {
    camera: { position: { set: (x: number, y: number, z: number) => void }; lookAt: (x: number, y: number, z: number) => void }
    controls: { target: { set: (x: number, y: number, z: number) => void }; update: () => void } | null
  }

  useEffect(() => {
    camera.position.set(14, 14, 14)
    camera.lookAt(0, 0, 0)
    if (controls) {
      controls.target.set(0, 0, 0)
      controls.update()
    }
  }, [camera, controls, resetToken])

  return (
    <>
      <color attach="background" args={['#0b1220']} />
      <fog attach="fog" args={['#0b1220', 28, 55]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        castShadow
        position={[12, 18, 8]}
        intensity={1.35}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-8, 10, -6]} intensity={0.35} color="#8ec5ff" />
      <Environment preset="city" />

      {/* Floor slab */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[36, 28]} />
        <meshStandardMaterial color="#121a28" roughness={0.95} />
      </mesh>
      {/* Subtle grid lines via thin bars */}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`gx-${i}`} position={[-12 + i * 2, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.03, 24]} />
          <meshBasicMaterial color="#1c2740" transparent opacity={0.7} />
        </mesh>
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <mesh key={`gz-${i}`} position={[0, 0.01, -12 + i * 2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[0.03, 24]} />
          <meshBasicMaterial color="#1c2740" transparent opacity={0.7} />
        </mesh>
      ))}

      {pods.map((pod) => (
        <PodGroup
          key={pod.id}
          pod={pod}
          desks={desks}
          peopleById={peopleById}
          selectedDeskId={selectedDeskId}
          selectedHireId={selectedHireId}
          onSelectDesk={onSelectDesk}
        />
      ))}

      <Amenities />
      <ContactShadows position={[0, 0.01, 0]} opacity={0.45} scale={40} blur={2.5} far={12} />

      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={8}
        maxDistance={32}
        maxPolarAngle={Math.PI / 2.15}
        target={[0, 0, 0]}
      />
    </>
  )
}
