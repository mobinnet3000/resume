'use client'

import { useRef, useCallback } from 'react'
import { useMousePosition } from './useMousePosition'

export function useParallax(factor = 0.02) {
  const ref = useRef<HTMLDivElement>(null!)
  const mouse = useMousePosition()

  const style = useCallback(() => {
    const x = (mouse.nx - 0.5) * factor * 100
    const y = (mouse.ny - 0.5) * factor * 100
    return {
      transform: `translate(${x}px, ${y}px)`,
    } as React.CSSProperties
  }, [mouse.nx, mouse.ny, factor])

  return { ref, style: style() }
}
