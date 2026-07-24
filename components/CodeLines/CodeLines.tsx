'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function rnd(i: number) { return (Math.sin(i * 12.9898) * 43758.5453) - Math.floor(Math.sin(i * 12.9898) * 43758.5453) }

const ROW_H = 24
const VISIBLE = 5

const COLORS = ['var(--syntax-keyword)', 'var(--syntax-function)', 'var(--syntax-string)', 'var(--syntax-variable)', 'var(--syntax-comment)']
const INDENTS = [0, 1, 2, 1, 0]

interface Row { id: number; indent: number; color: string; width: number }

function makeRow(id: number): Row {
  return { id, indent: INDENTS[id % 5], color: COLORS[id % 5], width: 25 + rnd(id * 7) * 55 }
}

export function CodeLines() {
  const trackRef = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()
  const idRef = useRef(100)

  const initial = useMemo(() => Array.from({ length: VISIBLE }, (_, i) => makeRow(i)), [])

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let animId: number
    const rows: (Row & { el: HTMLDivElement })[] = []

    // Create initial elements
    for (const r of initial) {
      const el = document.createElement('div')
      el.style.cssText = `height:8px;margin-left:${r.indent * 24}px;border-radius:4px;background:${r.color};width:0%;opacity:0;flex-shrink:0;`
      // Animate in with stagger
      el.animate([{ width: '0%', opacity: 0 }, { width: `${r.width}%`, opacity: 1 }], { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 200 })
      track.appendChild(el)
      rows.push({ ...r, el })
    }

    const tick = () => {
      pos += 0.2
      track.style.transform = `translateY(${-pos}px)`

      if (pos >= ROW_H) {
        pos -= ROW_H
        track.style.transform = `translateY(0px)`
        // Remove first
        const first = rows.shift()!
        first.el.remove()
        // Add new at bottom
        const newRow = makeRow(idRef.current++)
        const el = document.createElement('div')
        el.style.cssText = `height:8px;margin-left:${newRow.indent * 24}px;border-radius:4px;background:${newRow.color};width:0%;opacity:0;flex-shrink:0;`
        track.appendChild(el)
        el.animate([{ width: '0%', opacity: 0 }, { width: `${newRow.width}%`, opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' })
        rows.push({ ...newRow, el })
      }

      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animId)
  }, [reduce, initial])

  if (reduce) {
    return (
      <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0' }}>
          {initial.map((r) => (
            <div key={r.id} style={{ height: 8, marginLeft: r.indent * 24, borderRadius: 4, backgroundColor: r.color, width: `${r.width}%` }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: ROW_H * VISIBLE, position: 'relative' }}>
        <div ref={trackRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', position: 'absolute', left: 0, right: 0 }} />
      </div>
    </div>
  )
}
