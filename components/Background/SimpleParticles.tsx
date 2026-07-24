'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  color: string
  scaleX: number
  scaleY: number
}

const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#ffffff']
const COUNT = 45
const INTERACTION_RADIUS = 150
const MAX_SPEED = 0.6

export function SimpleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const mouse = { x: -1000, y: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const balls: Ball[] = []
    for (let i = 0; i < COUNT; i++) {
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        radius: 0.5 + Math.random() * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        scaleX: 1,
        scaleY: 1,
      })
    }

    const handleMouse = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouse)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of balls) {
        b.x += b.vx
        b.y += b.vy

        if (b.x + b.radius > canvas.width) { b.x = canvas.width - b.radius; b.vx *= -1 }
        if (b.x - b.radius < 0) { b.x = b.radius; b.vx *= -1 }
        if (b.y + b.radius > canvas.height) { b.y = canvas.height - b.radius; b.vy *= -1 }
        if (b.y - b.radius < 0) { b.y = b.radius; b.vy *= -1 }

        const dx = mouse.x - b.x
        const dy = mouse.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < INTERACTION_RADIUS && dist > 0) {
          const force = (1 - dist / INTERACTION_RADIUS) * 0.02
          const orbitX = -dy / dist
          const orbitY = dx / dist
          b.vx += orbitX * force + (dx / dist) * force * 0.3
          b.vy += orbitY * force + (dy / dist) * force * 0.3
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
          if (speed > MAX_SPEED * 3) {
            b.vx = (b.vx / speed) * MAX_SPEED * 3
            b.vy = (b.vy / speed) * MAX_SPEED * 3
          }
        }

        ctx.save()
        ctx.translate(b.x, b.y)
        ctx.scale(b.scaleX, b.scaleY)
        ctx.fillStyle = b.color
        ctx.globalAlpha = 0.5
        ctx.beginPath()
        ctx.arc(0, 0, b.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouse)
    }
  }, [reduce])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-8 pointer-events-none"
    />
  )
}
