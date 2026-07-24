'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)
  const trailRef=useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    const cvs = trailRef.current
    if (!dot || !ring || !cvs) return
    const ctx = cvs.getContext('2d')!
    let mx = -100, my = -100, rx = -100, ry = -100
    let px = -100, py = -100
    let raf: number

    const handleMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
    }

    const animate = () => {
      rx += (mx - rx) * 0.18
      ry += (my - ry) * 0.18
      ring.style.transform = `translate(${rx}px, ${ry}px)`

      // Trail line
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      const dx = mx - px, dy = my - py, dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 2) {
        px = mx; py = my
      }
      if (px > 0 && py > 0) {
        ctx.beginPath()
        ctx.moveTo(mx, my)
        ctx.lineTo(px, py)
        ctx.strokeStyle = 'rgba(247, 139, 28, 0.4)'
        ctx.lineWidth = 1
        ctx.stroke()
      }

      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const resize = () => { cvs.width = window.innerWidth; cvs.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    document.addEventListener('mousemove', handleMove)

    return () => {
      document.removeEventListener('mousemove', handleMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <canvas ref={trailRef} className="fixed inset-0 pointer-events-none z-[9997]" style={{ display: 'block' }} />
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', transform: 'translate(-100px, -100px)', boxShadow: '0 0 10px var(--accent)' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--accent)', transform: 'translate(-100px, -100px)', opacity: 0.3 }} />
      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
    </>
  )
}
