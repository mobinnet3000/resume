'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

interface Ripple {
  x: number
  y: number
  time: number
}

export function RippleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)
  const ripplesRef = useRef<Ripple[]>([])
  const reduce = useReducedMotion()

  const addRipple = useCallback((e: MouseEvent) => {
    ripplesRef.current.push({ x: e.clientX, y: e.clientY, time: performance.now() })
  }, [])

  useEffect(() => {
    if (reduce) return
    window.addEventListener('click', addRipple)
    return () => window.removeEventListener('click', addRipple)
  }, [addRipple, reduce])

  useEffect(() => {
    if (reduce) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const now = performance.now()

      ripplesRef.current = ripplesRef.current.filter((r) => now - r.time < 1200)

      for (const r of ripplesRef.current) {
        const age = (now - r.time) / 1000
        const radius = age * 300
        const opacity = Math.max(0, 1 - age / 1.2)

        ctx.beginPath()
        ctx.arc(r.x, r.y, radius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.3})`
        ctx.lineWidth = 1.5 * opacity
        ctx.stroke()
      }

      animId = requestAnimationFrame(animate)
    }
    animId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [reduce])

  if (reduce) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
