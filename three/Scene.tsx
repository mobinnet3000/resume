/* eslint-disable react-hooks/immutability */

'use client'

import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, Noise, ToneMapping, ChromaticAberration, DepthOfField } from '@react-three/postprocessing'
import { ParticleField } from './ParticleField'
import { StarField } from './StarField'
import { useMousePosition } from '@/hooks/useMousePosition'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import * as THREE from 'three'

function CameraController({ shaking, isIdle }: { shaking: boolean; isIdle: boolean }) {
  const { camera } = useThree()
  const mouse = useMousePosition()
  const reduce = useReducedMotion()
  const target = useRef({ yaw: 0, pitch: 0, roll: 0, zoom: 8 })
  const current = useRef({ yaw: 0, pitch: 0, roll: 0, zoom: 8 })
  const shakeRef = useRef({ x: 0, y: 0, intensity: 0 })
  const breatheRef = useRef(0)

  useFrame((_, delta) => {
    const speed = 1 - Math.pow(0.001, delta)

    breatheRef.current += delta * 0.3

    if (shaking) {
      shakeRef.current.intensity = Math.min(shakeRef.current.intensity + delta * 2, 0.05)
    } else {
      shakeRef.current.intensity *= 0.92
    }

    if (shakeRef.current.intensity > 0.001) {
      shakeRef.current.x = (Math.random() - 0.5) * shakeRef.current.intensity
      shakeRef.current.y = (Math.random() - 0.5) * shakeRef.current.intensity
    } else {
      shakeRef.current.x = 0
      shakeRef.current.y = 0
    }

    if (!reduce) {
      const breatheOffset = isIdle ? 0.015 : 0
      const idleYaw = Math.sin(breatheRef.current) * breatheOffset
      const idlePitch = Math.cos(breatheRef.current * 0.7) * breatheOffset * 0.5

      target.current.yaw = (mouse.nx - 0.5) * 0.05 + shakeRef.current.x + idleYaw
      target.current.pitch = (mouse.ny - 0.5) * -0.03 + shakeRef.current.y + idlePitch
      target.current.roll = (mouse.nx - 0.5) * -0.01
    }

    current.current.yaw += (target.current.yaw - current.current.yaw) * speed
    current.current.pitch += (target.current.pitch - current.current.pitch) * speed
    current.current.roll += (target.current.roll - current.current.roll) * speed
    current.current.zoom += (target.current.zoom - current.current.zoom) * speed * 0.5

    camera.position.x = Math.sin(current.current.yaw) * current.current.zoom
    camera.position.z = Math.cos(current.current.yaw) * current.current.zoom
    camera.position.y = Math.sin(current.current.pitch) * current.current.zoom * 0.5
    camera.lookAt(0, 0, 0)
    camera.rotation.z = current.current.roll
  })

  return null
}

export function Scene() {
  const mouse = useMousePosition()
  const reduce = useReducedMotion()
  const [clicks, setClicks] = useState<{ pos: THREE.Vector2; time: number }[]>([])
  const [explosions, setExplosions] = useState<{ pos: THREE.Vector2; time: number; strength: number }[]>([])
  const [shaking, setShaking] = useState(false)
  const [isIdle, setIsIdle] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastClick = useRef(0)
  const shakeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const now = performance.now() / 1000
      if (now - lastClick.current < 0.3) {
        const pos = new THREE.Vector2(e.clientX, e.clientY)
        setExplosions((prev) => [...prev.slice(-3), { pos, time: now, strength: 1 }])
        setShaking(true)
        if (shakeTimer.current) clearTimeout(shakeTimer.current)
        shakeTimer.current = setTimeout(() => setShaking(false), 300)
        lastClick.current = 0
      } else {
        setClicks((prev) => [...prev.slice(-5), { pos: new THREE.Vector2(e.clientX, e.clientY), time: now }])
      }
      lastClick.current = now
    }

    const handleMove = () => {
      setIsIdle(false)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setIsIdle(true), 5000)
    }

    window.addEventListener('click', handleClick)
    window.addEventListener('mousemove', handleMove)
    handleMove()

    return () => {
      window.removeEventListener('click', handleClick)
      window.removeEventListener('mousemove', handleMove)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (shakeTimer.current) clearTimeout(shakeTimer.current)
    }
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={reduce ? 1 : [1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <fog attach="fog" args={['#040404', 12, 30]} />
        <CameraController shaking={shaking} isIdle={isIdle} />
        <StarField />
        <ParticleField
          mouse={new THREE.Vector2(mouse.x, mouse.y)}
          clicks={clicks}
          explosions={explosions}
          isIdle={isIdle}
        />

        {!reduce && (
          <EffectComposer multisampling={0}>
            <Bloom luminanceThreshold={0.3} luminanceSmoothing={0.9} intensity={0.4} mipmapBlur />
            <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} radialModulation={false} />
            <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={0.5} />
            <Vignette eskil={false} offset={0.3} darkness={0.5} />
            <Noise opacity={0.015} />
            <ToneMapping mode={THREE.ACESFilmicToneMapping} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  )
}
