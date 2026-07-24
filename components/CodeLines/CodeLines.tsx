'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const ROWS = [
  { indent: 0, color: 'var(--syntax-keyword)' },
  { indent: 1, color: 'var(--syntax-function)' },
  { indent: 2, color: 'var(--syntax-string)' },
  { indent: 1, color: 'var(--syntax-variable)' },
  { indent: 0, color: 'var(--syntax-comment)' },
]

const ROW_HEIGHT = 24
const VISIBLE_COUNT = 5

function makeRow(id: number, indent: number, color: string, width: number) {
  return { id, indent, color, width }
}

export function CodeLines() {
  const trackRef = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()
  const idRef = useRef(5)

  const initialRows = useMemo(
    () => ROWS.map((r, i) => makeRow(i, r.indent, r.color, 30 + seeded(i * 7) * 50)),
    []
  )

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let animId: number
    const rows = initialRows.map((r) => {
      const el = document.createElement('div')
      el.style.cssText = `height:8px;margin-left:${r.indent * 24}px;border-radius:4px;background:${r.color};width:${r.width}%;opacity:0;`
      track.appendChild(el)
      // Animate in
      el.animate(
        [{ width: '0%', opacity: 0 }, { width: `${r.width}%`, opacity: 1 }],
        { duration: 550, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 300 }
      )
      return { ...r, el }
    })

    const animate = () => {
      pos += 0.15
      track.style.transform = `translateY(${-pos}px)`

      if (pos >= ROW_HEIGHT) {
        pos -= ROW_HEIGHT
        track.style.transform = `translateY(0px)`
        track.style.transition = 'none'
        requestAnimationFrame(() => { track.style.transition = '' })

        // Remove first bar, shift all up
        const first = rows.shift()!
        first.el.remove()

        // Add new bar at bottom
        const colorSet = ROWS[rows.length % ROWS.length]
        const newId = idRef.current++
        const newWidth = 30 + seeded(newId * 7) * 50
        const el = document.createElement('div')
        el.style.cssText = `height:8px;margin-left:${colorSet.indent * 24}px;border-radius:4px;background:${colorSet.color};width:0%;opacity:0;`
        track.appendChild(el)
        el.animate(
          [{ width: '0%', opacity: 0 }, { width: `${newWidth}%`, opacity: 1 }],
          { duration: 550, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' }
        )
        rows.push({ id: newId, indent: colorSet.indent, color: colorSet.color, width: newWidth, el })
      }

      animId = requestAnimationFrame(animate)
    }

    animId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animId)
  }, [reduce, initialRows])

  if (reduce) {
    return (
      <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          {initialRows.map((r) => (
            <div key={r.id} style={{ height: 8, marginLeft: r.indent * 24, borderRadius: 4, backgroundColor: r.color, width: `${r.width}%`, opacity: 1 }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: ROW_HEIGHT * 5, position: 'relative' }}>
        <div
          ref={trackRef}
          style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', position: 'absolute', left: 0, right: 0, transition: 'none' }}
        />
      </div>
    </div>
  )
}
