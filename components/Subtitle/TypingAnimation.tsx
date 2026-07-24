'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TITLES } from '@/constants'

export function TypingAnimation() {
  const [index, setIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [visible, setVisible] = useState(true)

  const current = TITLES[index]

  const tick = useCallback(() => {
    if (!deleting) {
      if (charIndex < current.length) {
        setCharIndex((p) => p + 1)
      } else {
        setTimeout(() => setDeleting(true), 2000)
      }
    } else {
      if (charIndex > 0) {
        setCharIndex((p) => p - 1)
      } else {
        setDeleting(false)
        setIndex((p) => (p + 1) % TITLES.length)
      }
    }
  }, [charIndex, deleting, current])

  useEffect(() => {
    const speed = deleting ? 30 : 60
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, deleting, charIndex])

  useEffect(() => {
    const iv = setInterval(() => setVisible((p) => !p), 530)
    return () => clearInterval(iv)
  }, [])

  return (
    <motion.div
      className="text-lg md:text-xl text-gray-400 mt-3 h-8 flex items-center justify-center font-light tracking-wide"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.8 }}
    >
      <span className="text-blue-400 mr-2">&gt;</span>
      <AnimatePresence mode="popLayout">
        <motion.span
          key={current}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {current.slice(0, charIndex)}
        </motion.span>
      </AnimatePresence>
      <motion.span
        className="w-[2px] h-5 bg-blue-400 ml-1 inline-block"
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}
