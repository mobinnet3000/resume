'use client'

import dynamic from 'next/dynamic'
import { ShaderBackground } from './ShaderBackground'
import { NoiseTexture } from './NoiseTexture'
import { GlowingBlobs } from './GlowingBlobs'
import { DepthFog } from './DepthFog'

const Scene = dynamic(
  () => import('@/three/Scene').then((m) => ({ default: m.Scene })),
  { ssr: false }
)

export function Background() {
  return (
    <>
      <ShaderBackground />
      <NoiseTexture />
      <GlowingBlobs />
      <DepthFog />
      <Scene />
    </>
  )
}
