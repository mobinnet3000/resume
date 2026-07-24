'use client'

import { motion } from 'framer-motion'

interface Props {
  firstNameColor?: string
  lastNameColor?: string
}

export function Name({ firstNameColor = 'var(--accent)', lastNameColor = 'var(--accent-yellow)' }: Props) {
  return (
    <motion.h1
      className="font-sans tracking-tight text-center"
      style={{
        fontFamily: 'var(--font-sans)',
        letterSpacing: '-1.5px',
        fontSize: 'clamp(32px, 7.5vw, 56px)',
        fontWeight: 700,
        lineHeight: 1.05,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <span style={{ color: firstNameColor }}>Mobin</span>{' '}
      <span style={{ color: lastNameColor }}>Bastai</span>
    </motion.h1>
  )
}
