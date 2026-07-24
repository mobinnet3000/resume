'use client'

import { useEffect, useRef } from 'react'

const TRAIL_LENGTH = 12

interface Point { x: number; y: number; t: number }

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)
  const cvsRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const cvs = cvsRef.current
    if (!dot || !ring || !cvs) return
    const ctx = cvs.getContext('2d')!
    let raf: number
    let mx = -100, my = -100
    let rx = -100, ry = -100
    const trail: Point[] = []

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
      trail.push({ x: mx, y: my, t: performance.now() })
      if (trail.length > TRAIL_LENGTH) trail.shift()
    })

    const animate = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px)`

      ctx.clearRect(0, 0, cvs.width, cvs.height)

      // Draw comet trail
      const now = performance.now()
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i]
        const age = (now - p.t) / 200
        const alpha = Math.max(0, 0.7 - age * 0.7)
        const radius = Math.max(0.5, 3 - age * 2.5)
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(247, 139, 28, ${alpha})`
        ctx.shadowColor = '#f78b1c'
        ctx.shadowBlur = 8 * alpha
        ctx.fill()
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <>
      <canvas ref={cvsRef} className="fixed inset-0 pointer-events-none z-[9997]" style={{ display: 'block' }} />
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#f78b1c', transform: 'translate(-100px, -100px)', boxShadow: '0 0 12px #f78b1c' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(247,139,28,0.4)', transform: 'translate(-100px, -100px)' }} />
      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
    </>
  )
}
