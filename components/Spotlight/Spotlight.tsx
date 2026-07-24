'use client'

import { useEffect, useState } from 'react'
import { useMousePosition } from '@/hooks/useMousePosition'

export function Spotlight() {
  const mouse = useMousePosition()
  const [breath, setBreath] = useState(0)

  useEffect(() => {
    let animId: number
    let time = 0
    const animate = () => {
      time += 0.005
      setBreath(Math.sin(time) * 0.05 + 1)
      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div
      className="fixed inset-0 -z-5 pointer-events-none"
      style={{
        background: `radial-gradient(600px at ${mouse.x}px ${mouse.y}px, rgba(59,130,246,${0.04 * breath}), transparent 50%),
                     radial-gradient(300px at ${mouse.x}px ${mouse.y}px, rgba(139,92,246,${0.02 * breath}), transparent 40%)`,
        transition: 'background 0.15s ease-out',
        maskImage: `radial-gradient(800px at ${mouse.x}px ${mouse.y}px, black 30%, transparent 70%)`,
        WebkitMaskImage: `radial-gradient(800px at ${mouse.x}px ${mouse.y}px, black 30%, transparent 70%)`,
      }}
    />
  )
}
