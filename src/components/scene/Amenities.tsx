export function Amenities() {
  return (
    <group>
      {/* Cafe / break area */}
      <RoundTable position={[7.5, 0, 3.5]} />
      <RoundTable position={[9.6, 0, 4.8]} />
      <Plant position={[11.2, 0, 2.2]} />
      <Plant position={[5.8, 0, 5.5]} />
      <Plant position={[-12.2, 0, -8.2]} />
      <Plant position={[9.2, 0, -8]} />

      {/* Meeting rooms */}
      <MeetingRoom position={[8.5, 0, -2.5]} />
      <MeetingRoom position={[11.8, 0, -2.5]} w={2.4} d={3.2} />
    </group>
  )
}

function RoundTable({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.38, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.08, 24]} />
        <meshStandardMaterial color="#3a4558" />
      </mesh>
      <mesh position={[0, 0.18, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.14, 0.36, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * 1.05, 0.22, Math.sin(a) * 1.05]}
            castShadow
          >
            <boxGeometry args={[0.35, 0.08, 0.35]} />
            <meshStandardMaterial color="#2a3447" />
          </mesh>
        )
      })}
    </group>
  )
}

function Plant({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.14, 0.3, 12]} />
        <meshStandardMaterial color="#6b4f3a" />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial color="#2f7a55" />
      </mesh>
    </group>
  )
}

function MeetingRoom({
  position,
  w = 2.8,
  d = 3.2,
}: {
  position: [number, number, number]
  w?: number
  d?: number
}) {
  return (
    <group position={position}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, 1.4, d]} />
        <meshStandardMaterial
          color="#243044"
          transparent
          opacity={0.55}
          roughness={0.35}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[w + 0.1, 0.04, d + 0.1]} />
        <meshStandardMaterial color="#1b2433" />
      </mesh>
    </group>
  )
}
