'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100, rx = -100, ry = -100
    let raf: number

    const handleMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      dot.style.transform = `translate(${mx}px, ${my}px)`
    }

    const animate = () => {
      rx += (mx - rx) * 0.2
      ry += (my - ry) * 0.2
      ring.style.transform = `translate(${rx}px, ${ry}px)`
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    document.addEventListener('mousemove', handleMove)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', transform: 'translate(-100px, -100px)', boxShadow: '0 0 10px var(--accent)' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ width: 28, height: 28, borderRadius: '50%', border: '1px solid var(--accent)', transform: 'translate(-100px, -100px)', opacity: 0.3 }} />
      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
    </>
  )
}
