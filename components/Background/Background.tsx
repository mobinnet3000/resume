'use client'

import { useReducedMotion } from '@/hooks/useReducedMotion'
import { SimpleParticles } from './SimpleParticles'

export function Background() {
  const reduce = useReducedMotion()

  return (
    <>
      {!reduce && <SimpleParticles />}
    </>
  )
}
