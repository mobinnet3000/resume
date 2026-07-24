'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function StarField({ count = 1500 }) {
  const ref = useRef<THREE.Points>(null!)
  const speedRef = useRef(0.00005)

  const { positions, sizes, phases } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const ph = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      const layer = 0.5 + seededRandom(i * 3) * 2
      pos[i * 3] = (seededRandom(i * 7) - 0.5) * 80 * layer
      pos[i * 3 + 1] = (seededRandom(i * 11) - 0.5) * 80 * layer
      pos[i * 3 + 2] = (seededRandom(i * 13) - 0.5) * 40 * layer
      sz[i] = 0.05 + seededRandom(i * 17) * 0.15
      ph[i] = seededRandom(i * 19) * Math.PI * 2
    }
    return { positions: pos, sizes: sz, phases: ph }
  }, [count])

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    g.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return g
  }, [positions, sizes])

  useFrame(({ clock }) => {
    if (!ref.current) return
    speedRef.current += 0.000001
    ref.current.rotation.y += speedRef.current
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.02) * 0.03

    const sizes = ref.current.geometry.attributes.size.array as Float32Array
    for (let i = 0; i < count; i++) {
      const twinkle = 0.5 + 0.5 * Math.sin(clock.elapsedTime * (0.5 + seededRandom(i * 31) * 2) + phases[i])
      sizes[i] = (0.05 + seededRandom(i * 17) * 0.15) * (0.6 + 0.4 * twinkle)
    }
    // eslint-disable-next-line react-hooks/immutability
    ref.current.geometry.attributes.size.needsUpdate = true
  })

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.15}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}
