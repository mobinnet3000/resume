'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const ROWS = [
  { indent: 0, width: 55, color: 'var(--syntax-keyword)', delay: 0 },
  { indent: 1, width: 78, color: 'var(--syntax-function)', delay: 0.6 },
  { indent: 2, width: 44, color: 'var(--syntax-string)', delay: 1.2 },
  { indent: 1, width: 66, color: 'var(--syntax-variable)', delay: 1.8 },
  { indent: 0, width: 38, color: 'var(--syntax-comment)', delay: 2.4 },
]

function animateBar(el: HTMLElement, width: number, delay: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const anim = el.animate(
        [{ width: '0%', opacity: 0 }, { width: `${width}%`, opacity: 1 }],
        { duration: 550, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'forwards' }
      )
      anim.onfinish = () => resolve()
      setTimeout(resolve, 600)
    }, delay * 1000)
  })
}

export function CodeLines() {
  const trackRef = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return
    const bars = track.querySelectorAll<HTMLElement>('.code-bar')
    if (bars.length === 0) return

    let cancelled = false
    const run = async () => {
      for (let i = 0; i < bars.length; i++) {
        if (cancelled) break
        const row = ROWS[i % ROWS.length]
        await animateBar(bars[i], row.width, 0)
        await new Promise((r) => setTimeout(r, 600))
      }
    }
    run()
    return () => { cancelled = true }
  }, [reduce])

  return (
    <div
      style={{
        width: '100%',
        padding: '12px 16px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--accent)',
        borderRadius: 10,
      }}
    >
      <div ref={trackRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
        {ROWS.map((row, i) => (
          <div
            key={i}
            className="code-bar"
            style={{
              height: 8,
              marginLeft: row.indent * 24,
              borderRadius: 4,
              backgroundColor: row.color,
              width: reduce ? `${row.width}%` : '0%',
              opacity: reduce ? 1 : 0,
            }}
          />
        ))}
      </div>
    </div>
  )
}
