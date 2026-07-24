'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SKILLS } from '@/constants'

export function SkillTags() {
  const tags = useMemo(
    () =>
      SKILLS.map((skill, i) => ({
        skill,
        delay: i * 0.08,
      })),
    []
  )

  return (
    <div className="flex flex-wrap gap-2 mt-4 justify-center max-w-lg mx-auto">
      {tags.map(({ skill, delay }) => (
        <motion.span
          key={skill}
          className="px-3 py-1 text-[11px] rounded-lg cursor-default transition-colors duration-300"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            color: 'var(--text-muted)',
            border: '1px solid var(--surface-border)',
          }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 + delay }}
          whileHover={{
            scale: 1.05,
            borderColor: 'var(--accent)',
            color: 'var(--accent)',
          }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  )
}
