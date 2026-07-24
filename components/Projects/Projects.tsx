'use client'

import { motion } from 'framer-motion'
import { ProjectCard } from './ProjectCard'
import { PROJECTS } from '@/constants'
import { staggerContainer } from '@/animations/variants'

export function Projects() {
  return (
    <motion.div
      className="flex gap-4 mt-8 justify-center flex-wrap"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {PROJECTS.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </motion.div>
  )
}
