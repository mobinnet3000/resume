'use client'

import { useEffect, useRef } from 'react'

export function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null!)
  const trailRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const cursor = cursorRef.current
    const trail = trailRef.current
    if (!cursor || !trail) return

    let mouseX = -100, mouseY = -100
    let trailX = -100, trailY = -100

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`
    }

    const animate = () => {
      trailX += (mouseX - trailX) * 0.15
      trailY += (mouseY - trailY) * 0.15
      trail.style.transform = `translate(${trailX}px, ${trailY}px)`
      requestAnimationFrame(animate)
    }

    document.addEventListener('mousemove', handleMove)
    requestAnimationFrame(animate)

    return () => document.removeEventListener('mousemove', handleMove)
  }, [])

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999]"
        style={{
          width: 8,
          height: 8,
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          transform: 'translate(-100px, -100px)',
          transition: 'width 0.15s, height 0.15s',
          boxShadow: '0 0 12px var(--accent), 0 0 24px var(--accent)',
        }}
      />
      <div
        ref={trailRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{
          width: 32,
          height: 32,
          border: '1px solid var(--accent)',
          borderRadius: '50%',
          transform: 'translate(-100px, -100px)',
          opacity: 0.4,
        }}
      />
      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}
