'use client'

import { useEffect, useRef } from 'react'

export function GlowingBlobs() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const blobs = Array.from({ length: 4 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: 100 + Math.random() * 200,
      phase: i * 1.5,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const b of blobs) {
        b.x += b.vx
        b.y += b.vy
        if (b.x < -200 || b.x > canvas.width + 200) b.vx *= -1
        if (b.y < -200 || b.y > canvas.height + 200) b.vy *= -1

        const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r)
        gradient.addColorStop(0, 'rgba(59, 130, 246, 0.06)')
        gradient.addColorStop(0.5, 'rgba(139, 92, 246, 0.03)')
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.fill()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-7 pointer-events-none"
    />
  )
}
