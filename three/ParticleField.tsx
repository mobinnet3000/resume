'use client'

/* eslint-disable react-hooks/immutability, react-hooks/refs */

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 1000
const CONNECTION_DIST = 2.5

interface Particle {
  pos: THREE.Vector3
  vel: THREE.Vector3
  acc: THREE.Vector3
  target: THREE.Vector3
  mass: number
  size: number
  phase: number
  life: number
  layer: number
  color: THREE.Color
}

interface Props {
  mouse: THREE.Vector2
  clicks: { pos: THREE.Vector2; time: number }[]
  explosions: { pos: THREE.Vector2; time: number; strength: number }[]
  isIdle: boolean
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function ParticleField({ mouse, clicks, explosions, isIdle }: Props) {
  const meshRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)
  const particlesRef = useRef<Particle[]>([])
  const clockRef = useRef(0)
  const { viewport } = useThree()

  const { particleData, linePositions, lineOpacities } = useMemo(() => {
    const count = PARTICLE_COUNT
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    const particles: Particle[] = []

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const s = i * 7 + 42
      const layer = [0.5, 1.0, 1.5, 2.0][i % 4]
      const radius = 2 + seededRandom(s * 3) * 6 * layer
      const theta = seededRandom(s * 7) * Math.PI * 2
      const phi = Math.acos(2 * seededRandom(s * 11) - 1)

      const x = Math.sin(phi) * Math.cos(theta) * radius
      const y = Math.sin(phi) * Math.sin(theta) * radius
      const z = Math.cos(phi) * radius * 0.5 * layer

      pos[i3] = x; pos[i3 + 1] = y; pos[i3 + 2] = z

      const shade = 0.2 + seededRandom(s * 23) * 0.5
      const tint = seededRandom(s * 29)
      const c = new THREE.Color()
      if (tint > 0.7) c.setHSL(0.55, 0.6, shade)
      else if (tint > 0.4) c.setHSL(0.75, 0.5, shade * 0.8)
      else c.setHSL(0.6, 0.4, shade)
      col[i3] = c.r; col[i3 + 1] = c.g; col[i3 + 2] = c.b

      sz[i] = 0.01 + seededRandom(s * 19) * 0.04 * layer

      particles.push({
        pos: new THREE.Vector3(x, y, z),
        vel: new THREE.Vector3(0, 0, 0),
        acc: new THREE.Vector3(0, 0, 0),
        target: new THREE.Vector3(x, y, z),
        mass: 0.5 + seededRandom(s * 31) * 1.5,
        size: sz[i],
        phase: seededRandom(s * 37) * Math.PI * 2,
        life: seededRandom(s * 41),
        layer,
        color: c,
      })
    }

    const pairs: [number, number][] = []
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < Math.min(i + 15, count); j++) {
        if (seededRandom(i * 1000 + j) > 0.97) pairs.push([i, j])
      }
    }

    const lPos = new Float32Array(pairs.length * 6)
    const lOp = new Float32Array(pairs.length)

    particlesRef.current = particles

    return {
      particleData: { positions: pos, colors: col, sizes: sz, pairs },
      linePositions: lPos,
      lineOpacities: lOp,
    }
  }, [])

  const pairs = particleData.pairs

  useFrame((_, delta) => {
    clockRef.current += delta
    const particles = particlesRef.current
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    const time = clockRef.current

    const mx = (mouse.x / window.innerWidth) * 2 * viewport.width - viewport.width
    const my = -(mouse.y / window.innerHeight) * 2 * viewport.height + viewport.height

    const MOUSE_INFLUENCE_RADIUS = 4
    const ORBIT_STRENGTH = 0.03
    const RETURN_STRENGTH = 0.002
    const FRICTION = 0.97
    const MAX_SPEED = 0.08
    const IDLE_WANDER = 0.0003

    for (const exp of explosions) {
      const ex = (exp.pos.x / window.innerWidth) * 2 * viewport.width - viewport.width
      const ey = -(exp.pos.y / window.innerHeight) * 2 * viewport.height + viewport.height
      const age = time - exp.time
      if (age < 1.5) {
        const strength = exp.strength * Math.max(0, 1 - age / 1.5)
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.pos.x - ex; const dy = p.pos.y - ey
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist > 0.1 && dist < 6) {
            const force = strength / (dist + 0.5)
            p.vel.x += (dx / dist) * force * delta * 5
            p.vel.y += (dy / dist) * force * delta * 5
            p.vel.z += (dy / dist) * force * delta * 2
          }
        }
      }
    }

    for (const click of clicks) {
      const cx = (click.pos.x / window.innerWidth) * 2 * viewport.width - viewport.width
      const cy = -(click.pos.y / window.innerHeight) * 2 * viewport.height + viewport.height
      const age = time - click.time
      if (age < 1.0) {
        const ringRadius = age * 4; const ringWidth = 0.3
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i]
          const dx = p.pos.x - cx; const dy = p.pos.y - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const ringDist = Math.abs(dist - ringRadius)
          if (ringDist < ringWidth) {
            const force = (1 - ringDist / ringWidth) * 0.02
            const nx = dx / (dist || 1); const ny = dy / (dist || 1)
            p.vel.x += nx * force; p.vel.y += ny * force
          }
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.acc.x += Math.sin(time * 0.3 + p.phase) * IDLE_WANDER * p.layer
      p.acc.y += Math.cos(time * 0.4 + p.phase * 1.3) * IDLE_WANDER * p.layer

      const dx = p.pos.x - mx; const dy = p.pos.y - my
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.1) {
        const strength = isIdle ? 0 : 1 - dist / MOUSE_INFLUENCE_RADIUS
        const orbitX = -dy / dist; const orbitY = dx / dist
        p.acc.x += orbitX * strength * ORBIT_STRENGTH / p.mass
        p.acc.y += orbitY * strength * ORBIT_STRENGTH / p.mass
        p.acc.x -= (dx / dist) * strength * 0.005 / p.mass
        p.acc.y -= (dy / dist) * strength * 0.005 / p.mass
      }

      p.acc.x += (p.target.x - p.pos.x) * RETURN_STRENGTH * (isIdle ? 0.5 : 1)
      p.acc.y += (p.target.y - p.pos.y) * RETURN_STRENGTH * (isIdle ? 0.5 : 1)
      p.acc.z += (p.target.z - p.pos.z) * RETURN_STRENGTH * 0.5

      p.vel.x += p.acc.x; p.vel.y += p.acc.y; p.vel.z += p.acc.z
      p.vel.x *= FRICTION; p.vel.y *= FRICTION; p.vel.z *= FRICTION

      const speed = Math.sqrt(p.vel.x ** 2 + p.vel.y ** 2 + p.vel.z ** 2)
      if (speed > MAX_SPEED) {
        const scale = MAX_SPEED / speed
        p.vel.x *= scale; p.vel.y *= scale; p.vel.z *= scale
      }

      p.pos.x += p.vel.x; p.pos.y += p.vel.y; p.pos.z += p.vel.z
      p.pos.z += Math.sin(time * 0.2 + p.phase) * 0.001
      p.acc.set(0, 0, 0)

      const i3 = i * 3
      pos[i3] = p.pos.x; pos[i3 + 1] = p.pos.y; pos[i3 + 2] = p.pos.z
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true

    if (linesRef.current) {
      let idx = 0
      for (let pi = 0; pi < pairs.length; pi++) {
        const [i, j] = pairs[pi]
        const pi3 = i * 3; const pj3 = j * 3
        const dx = pos[pi3] - pos[pj3]; const dy = pos[pi3 + 1] - pos[pj3 + 1]
        const dz = pos[pi3 + 2] - pos[pj3 + 2]
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)
        const opacity = Math.max(0, 1 - dist / CONNECTION_DIST)
        lineOpacities[pi] = opacity * 0.5

        const li = idx * 6
        linePositions[li] = pos[pi3]; linePositions[li + 1] = pos[pi3 + 1]; linePositions[li + 2] = pos[pi3 + 2]
        linePositions[li + 3] = pos[pj3]; linePositions[li + 4] = pos[pj3 + 1]; linePositions[li + 5] = pos[pj3 + 2]
        idx++
      }
      linesRef.current.geometry.attributes.position.needsUpdate = true
    }
  })

  const particleGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(particleData.positions, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(particleData.sizes, 1))
    return geo
  }, [particleData])

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 32; canvas.height = 32
    const ctx = canvas.getContext('2d')!
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.2, 'rgba(255,255,255,0.8)')
    g.addColorStop(0.5, 'rgba(255,255,255,0.3)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 32, 32)
    return new THREE.CanvasTexture(canvas)
  }, [])

  return (
    <>
      <points ref={meshRef}>
        <bufferGeometry {...particleGeo} />
        <pointsMaterial
          size={0.045}
          map={texture}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          transparent
          opacity={0.9}
          vertexColors
          sizeAttenuation
        />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linePositions, 3]}
            count={linePositions.length / 3}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          transparent
          opacity={0.3}
          color="#3b82f6"
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </>
  )
}
