'use client'

import { useEffect, useRef } from 'react'

interface Ball {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseRadius: number
  color: string
  opacity: number
}

const COLORS = ['#f78b1c', '#f4ce23', '#ffffff']
const COUNT = 45
const INTERACTION_RADIUS = 200

export function SimpleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const mouse = { x: -1000, y: -1000, vx: 0, vy: 0, prevX: -1000, prevY: -1000 }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const balls: Ball[] = []
    for (let i = 0; i < COUNT; i++) {
      const r = 0.5 + Math.random() * 2
      balls.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: r,
        baseRadius: r,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        opacity: 0.4 + Math.random() * 0.5,
      })
    }

    const handleMouse = (e: MouseEvent) => {
      mouse.vx = e.clientX - mouse.prevX
      mouse.vy = e.clientY - mouse.prevY
      mouse.prevX = e.clientX
      mouse.prevY = e.clientY
      mouse.x = e.clientX
      mouse.y = e.clientY
    }
    window.addEventListener('mousemove', handleMouse)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of balls) {
        const dx = mouse.x - b.x
        const dy = mouse.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        const mouseSpeed = Math.sqrt(mouse.vx * mouse.vx + mouse.vy * mouse.vy)

        // Mouse interaction
        if (dist < INTERACTION_RADIUS && dist > 0) {
          const strength = (1 - dist / INTERACTION_RADIUS)

          // Attract toward cursor
          b.vx += (dx / dist) * strength * 0.03
          b.vy += (dy / dist) * strength * 0.03

          // Orbit around cursor
          const orbitX = -dy / dist
          const orbitY = dx / dist
          b.vx += orbitX * strength * 0.04
          b.vy += orbitY * strength * 0.04

          // Scale up when close
          b.radius = b.baseRadius * (1 + strength * 3)

          // Particle trail behind fast mouse
          if (mouseSpeed > 1) {
            b.vx += (mouse.vx * 0.001)
            b.vy += (mouse.vy * 0.001)
          }
        } else {
          b.radius += (b.baseRadius - b.radius) * 0.05
        }

        // Slow wander
        b.vx += (Math.random() - 0.5) * 0.01
        b.vy += (Math.random() - 0.5) * 0.01

        // Apply velocity with limit
        const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy)
        if (speed > 3) {
          b.vx = (b.vx / speed) * 3
          b.vy = (b.vy / speed) * 3
        }
        b.vx *= 0.99
        b.vy *= 0.99

        b.x += b.vx
        b.y += b.vy

        // Bounce edges
        if (b.x < -10) b.x = canvas.width + 10
        if (b.x > canvas.width + 10) b.x = -10
        if (b.y < -10) b.y = canvas.height + 10
        if (b.y > canvas.height + 10) b.y = -10

        // Draw
        ctx.save()
        ctx.globalAlpha = b.opacity
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = b.radius * 4
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2)
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
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
