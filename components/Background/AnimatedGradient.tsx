'use client'

import { useEffect, useRef } from 'react'

export function AnimatedGradient() {
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

    const colors = [
      { r: 4, g: 4, b: 4 },
      { r: 9, g: 9, b: 9 },
      { r: 13, g: 13, b: 13 },
      { r: 8, g: 4, b: 20 },
      { r: 4, g: 8, b: 20 },
    ]
    let time = 0

    const animate = () => {
      time += 0.002
      ctx.fillStyle = '#040404'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const numBlobs = 3
      for (let i = 0; i < numBlobs; i++) {
        const cx = canvas.width * (0.3 + 0.4 * Math.sin(time * 0.3 + i * 2.1))
        const cy = canvas.height * (0.3 + 0.4 * Math.cos(time * 0.4 + i * 1.7))
        const rx = canvas.width * (0.3 + 0.2 * Math.sin(time * 0.2 + i))
        const ry = canvas.height * (0.3 + 0.2 * Math.cos(time * 0.25 + i))

        const c = colors[i % colors.length]
        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(rx, ry))
        gradient.addColorStop(0, `rgba(${c.r + 5}, ${c.g + 5}, ${c.b + 10}, 0.3)`)
        gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b + 5}, 0.15)`)
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
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
      className="fixed inset-0 -z-9 pointer-events-none"
      style={{ opacity: 0.6 }}
    />
  )
}
