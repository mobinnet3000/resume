'use client'

import { useEffect, useRef } from 'react'

interface Ball {
  x: number; y: number
  vx: number; vy: number
  radius: number; color: string
}

const COLORS = ['#f78b1c', '#f4ce23', '#ffffff']
const COUNT = 30

export function SimpleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number
    const mouse = { x: -1000, y: -1000 }

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const balls: Ball[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: 0.5 + Math.random() * 1.5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of balls) {
        const dx = mouse.x - b.x
        const dy = mouse.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 150 && dist > 0) {
          const str = (1 - dist / 150) * 0.04
          b.vx += -dy / dist * str + dx / dist * str * 0.3
          b.vy += dx / dist * str + dy / dist * str * 0.3
        }

        b.vx *= 0.98
        b.vy *= 0.98
        b.x += b.vx
        b.y += b.vy

        if (b.x < -10) b.x = canvas.width + 10
        if (b.x > canvas.width + 10) b.x = -10
        if (b.y < -10) b.y = canvas.height + 10
        if (b.y > canvas.height + 10) b.y = -10

        ctx.globalAlpha = 0.7
        ctx.fillStyle = b.color
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius * (dist < 150 ? 1 + (1 - dist / 150) * 2 : 1), 0, Math.PI * 2)
        ctx.fill()
      }

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ display: 'block', width: '100%', height: '100%' }} />
}
