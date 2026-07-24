'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function CustomCursor() {
  const reduce = useReducedMotion()
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const prevX = useRef(-100)
  const prevY = useRef(-100)
  const [hovering, setHovering] = useState(false)
  const [clicking, setClicking] = useState(false)
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([])
  const rippleId = useRef(0)

  const springConfig = { stiffness: 150, damping: 15 }
  const trailConfig = { stiffness: 80, damping: 20 }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)
  const trailX = useSpring(cursorX, trailConfig)
  const trailY = useSpring(cursorY, trailConfig)

  const velocityX = useMotionValue(0)
  const velocityY = useMotionValue(0)

  const stretchX = useTransform(velocityX, [-2, 0, 2], [0.8, 1, 1.2])
  const stretchY = useTransform(velocityY, [-2, 0, 2], [1.2, 1, 0.8])

  const handleMove = useCallback((e: MouseEvent) => {
    const vx = e.clientX - prevX.current
    const vy = e.clientY - prevY.current
    velocityX.set(vx * 0.1)
    velocityY.set(vy * 0.1)
    prevX.current = e.clientX
    prevY.current = e.clientY
    cursorX.set(e.clientX)
    cursorY.set(e.clientY)
  }, [cursorX, cursorY, velocityX, velocityY])

  const handleOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    if (
      target.tagName === 'A' || target.tagName === 'BUTTON' ||
      target.closest('a') || target.closest('button') ||
      target.getAttribute('role') === 'button' ||
      target.closest('[role="button"]')
    ) {
      setHovering(true)
    }
  }, [])

  const handleOut = useCallback(() => setHovering(false), [])

  const handleClick = useCallback((e: MouseEvent) => {
    setClicking(true)
    setTimeout(() => setClicking(false), 200)
    const id = rippleId.current++
    setRipples((prev) => [...prev.slice(-3), { id, x: e.clientX, y: e.clientY }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 800)
  }, [])

  useEffect(() => {
    if (reduce) return
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)
    document.addEventListener('click', handleClick)
    return () => {
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
      document.removeEventListener('click', handleClick)
    }
  }, [reduce, handleMove, handleOver, handleOut, handleClick])

  if (reduce) return null

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference"
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          scaleX: stretchX,
          scaleY: stretchY,
        }}
      >
        <motion.div
          className="rounded-full bg-white"
          animate={{
            width: hovering ? 24 : 12,
            height: hovering ? 24 : 12,
            opacity: clicking ? 0.6 : 1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998]"
        style={{ x: trailX, y: trailY, translateX: '-50%', translateY: '-50%' }}
      >
        <motion.div
          className="rounded-full border"
          animate={{
            width: hovering ? 44 : 32,
            height: hovering ? 44 : 32,
            borderColor: hovering ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.15)',
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {ripples.map((r) => (
        <motion.div
          key={r.id}
          className="fixed top-0 left-0 pointer-events-none z-[9997] rounded-full border border-blue-400/30"
          style={{ x: r.x, y: r.y, translateX: '-50%', translateY: '-50%' }}
          initial={{ width: 4, height: 4, opacity: 0.5 }}
          animate={{ width: 60, height: 60, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      ))}

      <style jsx global>{`
        * { cursor: none !important; }
        @media (hover: none) and (pointer: coarse) {
          * { cursor: auto !important; }
        }
      `}</style>
    </>
  )
}
