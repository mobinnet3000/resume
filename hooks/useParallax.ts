'use client'

import { useRef, useMemo } from 'react'
import { useMousePosition } from './useMousePosition'
import { useReducedMotion } from './useReducedMotion'

const LAYERS = {
  background: 0.005,
  gradient: 0.01,
  fog: 0.015,
  stars: 0.02,
  particles: 0.03,
  glass: 0.04,
  avatar: 0.06,
  cards: 0.05,
  cursor: 0.08,
} as const

type LayerName = keyof typeof LAYERS

export function useParallax(layer: LayerName = 'glass') {
  const ref = useRef<HTMLDivElement>(null!)
  const mouse = useMousePosition()
  const reduce = useReducedMotion()

  const factor = LAYERS[layer] || 0.03

  const style = useMemo(() => {
    if (reduce) return {}
    const x = (mouse.nx - 0.5) * factor * 200
    const y = (mouse.ny - 0.5) * factor * 200
    return {
      transform: `translate(${x}px, ${y}px)`,
    } as React.CSSProperties
  }, [mouse.nx, mouse.ny, factor, reduce])

  return { ref, style }
}
