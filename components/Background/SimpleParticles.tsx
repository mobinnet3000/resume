'use client'

import { useEffect, useRef } from 'react'

interface Ball {
  x: number; y: number
  vx: number; vy: number
  radius: number; color: string
}

const COLORS = ['#f78b1c', '#f4ce23', '#ffffff', '#ff9f43', '#ffd43b']
const COUNT = 55

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
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: 2 + Math.random() * 4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of balls) {
        const dx = mouse.x - b.x
        const dy = mouse.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 220 && dist > 0) {
          const str = (1 - dist / 220) * 0.07
          b.vx += (-dy / dist * str * 1.3 + dx / dist * str * 0.5)
          b.vy += (dx / dist * str * 1.3 + dy / dist * str * 0.5)
        }

        b.x += b.vx
        b.y += b.vy
        b.vx *= 0.97
        b.vy *= 0.97

        if (b.x < -20) b.x = canvas.width + 20
        if (b.x > canvas.width + 20) b.x = -20
        if (b.y < -20) b.y = canvas.height + 20
        if (b.y > canvas.height + 20) b.y = -20

        const near = dist < 220
        const scale = near ? 1 + (1 - dist / 220) * 2.5 : 1
        const alpha = near ? 0.6 + (1 - dist / 220) * 0.4 : 0.6
        const blur = near ? 12 + (1 - dist / 220) * 15 : 6

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.fillStyle = b.color
        ctx.shadowColor = b.color
        ctx.shadowBlur = blur
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.radius * scale, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ display: 'block', width: '100%', height: '100%' }} />
}
