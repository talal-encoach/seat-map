import { Canvas } from '@react-three/fiber'
import { Suspense, useState } from 'react'
import type { Desk, Person, Pod } from '../types'
import { OfficeScene } from './scene/OfficeScene'

type Props = {
  pods: Pod[]
  desks: Desk[]
  peopleById: Map<string, Person>
  selectedDeskId: string | null
  selectedHireId: string | null
  onSelectDesk: (id: string) => void
}

export function OfficeCanvas({
  pods,
  desks,
  peopleById,
  selectedDeskId,
  selectedHireId,
  onSelectDesk,
}: Props) {
  const [resetToken, setResetToken] = useState(0)

  return (
    <div className="canvas-wrap">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [14, 14, 14], fov: 42, near: 0.1, far: 120 }}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <OfficeScene
            pods={pods}
            desks={desks}
            peopleById={peopleById}
            selectedDeskId={selectedDeskId}
            selectedHireId={selectedHireId}
            onSelectDesk={onSelectDesk}
            resetToken={resetToken}
          />
        </Suspense>
      </Canvas>

      <div className="map-legend">
        <span>
          <i className="dot free" /> Free
        </span>
        <span>
          <i className="dot occupied" /> Occupied
        </span>
        <span>
          <i className="dot newhire" /> New hire
        </span>
        <span>
          <i className="dot suggested" /> Suggested
        </span>
      </div>

      <div className="map-hint">
        <span>Drag to orbit</span>
        <span>Shift-drag to pan</span>
        <span>Scroll to zoom</span>
      </div>

      <div className="zoom-controls">
        <button type="button" aria-label="Reset camera" onClick={() => setResetToken((n) => n + 1)}>
          ⟲
        </button>
      </div>
    </div>
  )
}
