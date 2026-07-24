'use client'

import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/constants'

export function Name() {
  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold tracking-tight text-white mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {SITE_CONFIG.name.split(' ').map((word, i) => (
        <span key={i} className="inline-block mr-[0.1em]">
          {word.split('').map((char, j) => (
            <motion.span
              key={j}
              className="inline-block"
              initial={{ opacity: 0, y: 40, rotateX: -90 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.5 + i * 0.15 + j * 0.04,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}
