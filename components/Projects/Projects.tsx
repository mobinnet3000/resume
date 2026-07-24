'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from '@/components/ProjectModal/ProjectModal'
import { PROJECTS } from '@/constants'
import { staggerContainer } from '@/animations/variants'
import { Project } from '@/types'

export function Projects() {
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <>
      <motion.div
        className="flex gap-4 mt-8 justify-center flex-wrap"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {PROJECTS.map((project) => (
          <ProjectCard key={project.id} project={project} onSelect={setSelected} />
        ))}
      </motion.div>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}
