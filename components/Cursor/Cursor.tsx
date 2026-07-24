'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null!)
  const ringRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mx = -100, my = -100, rx = -100, ry = -100, raf: number

    document.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`
    })

    const anim = () => {
      rx += (mx - rx) * 0.2; ry += (my - ry) * 0.2
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`
      raf = requestAnimationFrame(anim)
    }
    raf = requestAnimationFrame(anim)

    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[9999]" style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#f78b1c', transform: 'translate3d(-100px,-100px,0)', boxShadow: '0 0 12px #f78b1c' }} />
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[9998]" style={{ width: 26, height: 26, borderRadius: '50%', border: '1px solid rgba(247,139,28,0.4)', transform: 'translate3d(-100px,-100px,0)' }} />
      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) { * { cursor: auto !important; } }
      `}</style>
    </>
  )
}
