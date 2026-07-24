'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SITE_CONFIG } from '@/constants'

export function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          timeZone: 'Asia/Tehran',
        })
      )
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      className="flex items-center gap-4 mt-8 text-xs"
      style={{ color: 'var(--text-muted)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2 }}
    >
      <span className="flex items-center gap-1.5">
        <motion.span
          className="w-[6px] h-[6px] rounded-full"
          style={{ backgroundColor: 'var(--syntax-string)' }}
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        Available
      </span>
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--surface-border)' }} />
      <span>{SITE_CONFIG.location}</span>
      <span className="w-1 h-1 rounded-full" style={{ backgroundColor: 'var(--surface-border)' }} />
      <span>{time} IRST</span>
    </motion.div>
  )
}
