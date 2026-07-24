'use client'

import { useEffect, useRef } from 'react'

const COLORS = ['#f78b1c', '#f4ce23', '#ffffff', '#ff9f43']
const COUNT = 35

interface Ball { x: number; y: number; vx: number; vy: number; r: number; c: string }

export function SimpleParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const cvs = canvasRef.current
    if (!cvs) return
    const ctx = cvs.getContext('2d')!
    let raf: number
    const mouse = { x: -1000, y: -1000, px: -1000, py: -1000 }

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    const balls: Ball[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * cvs.width, y: Math.random() * cvs.height,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: 2 + Math.random() * 3, c: COLORS[Math.floor(Math.random() * COLORS.length)],
    }))

    // Trail history for cursor comet
    const trail: { x: number; y: number }[] = []

    const onMove = (e: MouseEvent) => {
      mouse.px = mouse.x; mouse.py = mouse.y
      mouse.x = e.clientX; mouse.y = e.clientY
      trail.push({ x: mouse.x, y: mouse.y })
      if (trail.length > 10) trail.shift()
    }
    window.addEventListener('mousemove', onMove)

    const tick = () => {
      ctx.clearRect(0, 0, cvs.width, cvs.height)

      // Comet trail
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]; const j = i / trail.length
        ctx.globalAlpha = j * 0.5; ctx.fillStyle = '#f78b1c'; ctx.shadowColor = '#f78b1c'; ctx.shadowBlur = 6 * j
        ctx.beginPath(); ctx.arc(p.x, p.y, 2 * j + 0.5, 0, Math.PI * 2); ctx.fill()
      }

      ctx.shadowBlur = 0
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i]
        const dx = mouse.x - b.x; const dy = mouse.y - b.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < 200 && dist > 0) {
          const s = (1 - dist / 200) * 0.06
          b.vx += (-dy / dist * s * 1.2 + dx / dist * s * 0.4)
          b.vy += (dx / dist * s * 1.2 + dy / dist * s * 0.4)
        }

        b.x += b.vx; b.y += b.vy; b.vx *= 0.97; b.vy *= 0.97
        if (b.x < -20) b.x = cvs.width + 20
        if (b.x > cvs.width + 20) b.x = -20
        if (b.y < -20) b.y = cvs.height + 20
        if (b.y > cvs.height + 20) b.y = -20

        const near = dist < 200
        const scale = near ? 1 + (1 - dist / 200) * 2 : 1
        ctx.globalAlpha = near ? 0.7 : 0.5
        ctx.fillStyle = b.c
        ctx.shadowColor = b.c
        ctx.shadowBlur = near ? 10 : 4
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r * scale, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove) }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ display: 'block', width: '100%', height: '100%' }} />
}
