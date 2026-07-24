'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Props {
  texts?: string[]
}

const DEFAULT_TEXTS = ['Full Stack Developer', 'Flutter Developer', 'AI Engineer', 'Backend Developer', 'Open Source Enthusiast']

export function TypingAnimation({ texts = DEFAULT_TEXTS }: Props) {
  const [index, setIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [visible, setVisible] = useState(true)

  const current = texts[index]

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
        setIndex((p) => (p + 1) % texts.length)
      }
    }
  }, [charIndex, deleting, current, texts.length])

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
      className="mt-3 h-6 flex items-center justify-center"
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 'clamp(14px, 2.4vw, 17px)',
        color: 'var(--text-secondary)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
    >
      <span style={{ color: 'var(--accent)' }} className="mr-2">&gt;</span>
      <span>{current.slice(0, charIndex)}</span>
      <motion.span
        className="w-[2px] h-4 ml-0.5 inline-block"
        style={{ backgroundColor: 'var(--accent)' }}
        animate={{ opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  )
}
