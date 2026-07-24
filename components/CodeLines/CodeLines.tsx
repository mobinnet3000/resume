'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function rnd(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const ROW_H = 24
const VISIBLE = 5
const BUFFER = 20
const SCROLL_SPEED = 0.3
const COLORS = ['var(--syntax-keyword)', 'var(--syntax-function)', 'var(--syntax-string)', 'var(--syntax-variable)', 'var(--syntax-comment)']
const INDENTS = [0, 1, 2, 1, 0]

let gid = 100

function makeRow() {
  const idx = gid % 5
  const dbl = rnd(gid * 3) > 0.55
  return {
    id: gid++, indent: INDENTS[idx], color: COLORS[idx],
    w1: 25 + rnd(gid * 7) * 55,
    w2: dbl ? 15 + rnd(gid * 11) * 30 : 0,
  }
}

export function CodeLines() {
  const trackRef = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()
  const rows = useMemo(() => Array.from({ length: BUFFER }, () => makeRow()), [])

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let animId: number
    let last = performance.now()

    // Pre-create all row elements
    const els: HTMLDivElement[] = []
    for (const r of rows) {
      const wrap = document.createElement('div')
      wrap.style.cssText = 'display:flex;align-items:center;flex-shrink:0;height:24px;'
      const e1 = document.createElement('div')
      e1.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;margin-left:${r.indent * 24}px;`
      e1.animate([{ width: '0%' }, { width: `${r.w1}%` }], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 60 })
      wrap.appendChild(e1)
      if (r.w2 > 0) {
        const e2 = document.createElement('div')
        e2.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;margin-left:6px;`
        e2.animate([{ width: '0%' }, { width: `${r.w2}%` }], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 60 })
        wrap.appendChild(e2)
      }
      track.appendChild(wrap)
      els.push(wrap)
    }

    const tick = (now: number) => {
      const dt = Math.min(now - last, 32)
      last = now
      pos += SCROLL_SPEED * (dt / 16)

      if (pos >= VISIBLE * ROW_H) {
        pos -= VISIBLE * ROW_H
        // Move first VISIBLE elements to bottom — batch DOM changes
        for (let i = 0; i < VISIBLE; i++) {
          const el = els.shift()!
          track.appendChild(el)
          els.push(el)
        }
        // Force reflow so DOM shift is applied before transform change
        void track.offsetHeight
        track.style.transform = `translateY(${-pos}px)`
      } else {
        track.style.transform = `translateY(${-pos}px)`
      }

      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animId)
  }, [reduce, rows])

  const renderRow = (r: ReturnType<typeof makeRow>) => (
    <div key={r.id} style={{ display: 'flex', alignItems: 'center', marginLeft: r.indent * 24, height: 24 }}>
      <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.w1}%` }} />
      {r.w2 > 0 && <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.w2}%`, marginLeft: 6 }} />}
    </div>
  )

  if (reduce) {
    return (
      <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{rows.slice(0, VISIBLE).map(renderRow)}</div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: ROW_H * VISIBLE, position: 'relative', overflow: 'hidden' }}>
        <div ref={trackRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', position: 'absolute', left: 0, right: 0, willChange: 'transform' }} />
      </div>
    </div>
  )
}
