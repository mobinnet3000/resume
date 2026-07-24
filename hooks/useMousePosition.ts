'use client'

import { useState, useEffect, RefObject } from 'react'

interface MousePosition {
  x: number
  y: number
  nx: number
  ny: number
}

export function useMousePosition(): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, nx: 0.5, ny: 0.5 })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      setPos({
        x: e.clientX,
        y: e.clientY,
        nx: e.clientX / window.innerWidth,
        ny: e.clientY / window.innerHeight,
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [])

  return pos
}

export function useMousePositionRelative(ref: RefObject<HTMLElement | null>): MousePosition {
  const [pos, setPos] = useState<MousePosition>({ x: 0, y: 0, nx: 0.5, ny: 0.5 })

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setPos({
        x,
        y,
        nx: x / rect.width,
        ny: y / rect.height,
      })
    }
    window.addEventListener('mousemove', handle)
    return () => window.removeEventListener('mousemove', handle)
  }, [ref])

  return pos
}
