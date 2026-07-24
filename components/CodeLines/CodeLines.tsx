'use client'

import { useMemo } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

function rnd(i: number) {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const ROW_H = 24
const VISIBLE = 5
const COLORS = ['var(--syntax-keyword)', 'var(--syntax-function)', 'var(--syntax-string)', 'var(--syntax-variable)', 'var(--syntax-comment)']
const INDENTS = [0, 1, 2, 1, 0]

let gid = 0

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
  const reduce = useReducedMotion()
  const rows = useMemo(() => Array.from({ length: VISIBLE * 4 }, () => makeRow()), [])

  const renderRow = (r: ReturnType<typeof makeRow>, i: number) => (
    <div key={r.id} style={{ display: 'flex', alignItems: 'center', marginLeft: r.indent * 24, height: 24 }}>
      <div style={{
        height: 8, borderRadius: 4, backgroundColor: r.color,
        width: `${r.w1}%`,
        animation: reduce ? 'none' : `bar-in 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s forwards`,
        transform: reduce ? 'none' : 'scaleX(0)', transformOrigin: 'left',
      }} />
      {r.w2 > 0 && <div style={{
        height: 8, borderRadius: 4, backgroundColor: r.color,
        width: `${r.w2}%`, marginLeft: 6,
        animation: reduce ? 'none' : `bar-in 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s forwards`,
        transform: reduce ? 'none' : 'scaleX(0)', transformOrigin: 'left',
      }} />}
    </div>
  )

  return (
    <div style={{ width: '100%', padding: '12px 16px', backgroundColor: 'var(--surface)', border: '1px solid var(--accent)', borderRadius: 10, overflow: 'hidden' }}>
      <div style={{ height: ROW_H * VISIBLE, overflow: 'hidden' }}>
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 16, padding: '8px 0',
          animation: reduce ? 'none' : `scroll-up 12s linear infinite`,
        }}>
          {/* Duplicate rows for seamless loop — unique keys via index */}
          {[...rows, ...rows.map((r) => ({ ...r, id: r.id + 1000 }))].map((r, i) => renderRow(r, i))}
        </div>
      </div>
      <style>{`
        @keyframes bar-in { to { transform: scaleX(1); } }
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-${VISIBLE * ROW_H}px); }
        }
      `}</style>
    </div>
  )
}
