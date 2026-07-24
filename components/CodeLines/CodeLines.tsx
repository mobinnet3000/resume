'use client'

import { useEffect, useRef, useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function rnd(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const ROW_H = 24
const VISIBLE = 5
const COLORS = ['var(--syntax-keyword)', 'var(--syntax-function)', 'var(--syntax-string)', 'var(--syntax-variable)', 'var(--syntax-comment)']
const INDENTS = [0, 1, 2, 1, 0]

let globalId = 100

function makeRow() {
  const idx = globalId % 5
  const isDouble = rnd(globalId * 3) > 0.55
  return {
    id: globalId++,
    indent: INDENTS[idx],
    color: COLORS[idx],
    w1: 25 + rnd(globalId * 7) * 55,
    w2: isDouble ? 15 + rnd(globalId * 11) * 30 : 0,
  }
}

export function CodeLines() {
  const trackRef = useRef<HTMLDivElement>(null!)
  const reduce = useReducedMotion()
  const initial = useMemo(() => Array.from({ length: VISIBLE }, () => makeRow()), [])

  useEffect(() => {
    if (reduce) return
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let animId: number
    const items: { el: HTMLDivElement }[] = []

    const animBar = (el: HTMLDivElement, w: number, delay: number) => {
      el.animate(
        [{ width: '0%', opacity: 0 }, { width: `${w}%`, opacity: 1 }],
        { duration: 450, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay }
      )
    }

    for (const r of initial) {
      const wrap = document.createElement('div')
      wrap.style.cssText = 'display:flex;align-items:center;flex-shrink:0;'
      const el1 = document.createElement('div')
      el1.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;margin-left:${r.indent * 24}px;`
      animBar(el1, r.w1, r.id * 120)
      wrap.appendChild(el1)
      if (r.w2 > 0) {
        const el2 = document.createElement('div')
        el2.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;margin-left:6px;`
        animBar(el2, r.w2, r.id * 120)
        wrap.appendChild(el2)
      }
      track.appendChild(wrap)
      items.push({ el: wrap })
    }

    let last = performance.now()

    const tick = (now: number) => {
      const dt = Math.min(now - last, 32)
      last = now
      pos += 0.35 * (dt / 16)

      if (pos >= ROW_H) {
        pos -= ROW_H
        // Remove first row
        const first = items.shift()!
        first.el.remove()
        // Add new row at bottom
        const nr = makeRow()
        const wrap = document.createElement('div')
        wrap.style.cssText = 'display:flex;align-items:center;flex-shrink:0;'
        const el1 = document.createElement('div')
        el1.style.cssText = `height:8px;border-radius:4px;background:${nr.color};width:0%;margin-left:${nr.indent * 24}px;`
        animBar(el1, nr.w1, 0)
        wrap.appendChild(el1)
        if (nr.w2 > 0) {
          const el2 = document.createElement('div')
          el2.style.cssText = `height:8px;border-radius:4px;background:${nr.color};width:0%;margin-left:6px;`
          animBar(el2, nr.w2, 0)
          wrap.appendChild(el2)
        }
        track.appendChild(wrap)
        items.push({ el: wrap })
      }

      track.style.transform = `translateY(${-pos}px)`
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(animId)
  }, [reduce, initial])

  if (reduce) {
    return (
      <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {initial.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', marginLeft: r.indent * 24 }}>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.w1}%` }} />
              {r.w2 > 0 && <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.w2}%`, marginLeft: 6 }} />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: ROW_H * VISIBLE + 16, position: 'relative' }}>
        <div ref={trackRef} style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0', position: 'absolute', left: 0, right: 0 }} />
      </div>
    </div>
  )
}
