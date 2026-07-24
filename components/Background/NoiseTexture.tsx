'use client'

import { useEffect, useRef } from 'react'

export function NoiseTexture() {
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let animationId: number

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const imageData = ctx.createImageData(canvas.width, canvas.height)
      const data = imageData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = 8
      }
      ctx.putImageData(imageData, 0, 0)
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-8 pointer-events-none"
      style={{ mixBlendMode: 'overlay', opacity: 0.3 }}
    />
  )
}
