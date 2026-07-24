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

interface Row {
  id: number
  indent: number
  color: string
  width: number
  width2?: number
}

let globalId = 100

function makeRow(): Row {
  const idx = globalId % 5
  const isDouble = rnd(globalId * 3) > 0.6
  return {
    id: globalId++,
    indent: INDENTS[idx],
    color: COLORS[idx],
    width: 25 + rnd(globalId * 7) * 55,
    width2: isDouble ? 15 + rnd(globalId * 11) * 30 : undefined,
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
    const rows: (Row & { els: HTMLDivElement[] })[] = []
    let lastTime = performance.now()

    for (const r of initial) {
      const els: HTMLDivElement[] = []
      const el = document.createElement('div')
      el.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;opacity:0;flex-shrink:0;margin-left:${r.indent * 24}px;`
      el.animate([{ width: '0%', opacity: 0 }, { width: `${r.width}%`, opacity: 1 }], { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 150 })
      track.appendChild(el)
      els.push(el)
      if (r.width2) {
        const el2 = document.createElement('div')
        el2.style.cssText = `height:8px;border-radius:4px;background:${r.color};width:0%;opacity:0;flex-shrink:0;margin-left:6px;`
        el2.animate([{ width: '0%', opacity: 0 }, { width: `${r.width2}%`, opacity: 1 }], { duration: 500, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards', delay: r.id * 150 })
        track.appendChild(el2)
        els.push(el2)
      }
      rows.push({ ...r, els })
    }

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 32)
      lastTime = now

      pos += 0.3 * (dt / 16)
      track.style.transform = `translateY(${-pos}px)`

      if (pos >= ROW_H) {
        pos -= ROW_H
        track.style.transform = `translateY(0px)`
        const first = rows.shift()!
        first.els.forEach(el => el.remove())
        const nr = makeRow()
        const els: HTMLDivElement[] = []
        const el = document.createElement('div')
        el.style.cssText = `height:8px;border-radius:4px;background:${nr.color};width:0%;opacity:0;flex-shrink:0;margin-left:${nr.indent * 24}px;`
        track.appendChild(el)
        el.animate([{ width: '0%', opacity: 0 }, { width: `${nr.width}%`, opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' })
        els.push(el)
        if (nr.width2) {
          const el2 = document.createElement('div')
          el2.style.cssText = `height:8px;border-radius:4px;background:${nr.color};width:0%;opacity:0;flex-shrink:0;margin-left:6px;`
          track.appendChild(el2)
          el2.animate([{ width: '0%', opacity: 0 }, { width: `${nr.width2}%`, opacity: 1 }], { duration: 400, easing: 'cubic-bezier(0.22,1,0.36,1)', fill: 'forwards' })
          els.push(el2)
        }
        rows.push({ ...nr, els })
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
            <div key={r.id} style={{ display: 'flex', alignItems: 'center', marginLeft: r.indent * 24 }}>
              <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.width}%` }} />
              {r.width2 && <div style={{ height: 8, borderRadius: 4, backgroundColor: r.color, width: `${r.width2}%`, marginLeft: 6 }} />}
            </div>
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
