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
          className="px-3 py-1 text-[11px] rounded-lg
                     bg-gradient-to-r from-blue-500/5 to-purple-500/5
                     border border-blue-500/10
                     text-gray-400 cursor-default"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.5 + delay }}
          whileHover={{
            scale: 1.05,
            borderColor: 'rgba(59,130,246,0.3)',
            color: 'rgba(191,219,254,0.9)',
          }}
        >
          {skill}
        </motion.span>
      ))}
    </div>
  )
}
