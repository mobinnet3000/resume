'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FiGithub, FiLinkedin, FiSend, FiInstagram, FiMail, FiFileText } from 'react-icons/fi'
import { SOCIAL_LINKS } from '@/constants'
import { staggerContainer } from '@/animations/variants'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  FaGithub: FiGithub,
  FaLinkedin: FiLinkedin,
  FaTelegram: FiSend,
  FaInstagram: FiInstagram,
  FaEnvelope: FiMail,
  FaFileAlt: FiFileText,
}

function MagneticSocial({ link }: { link: typeof SOCIAL_LINKS[0] }) {
  const ref = useRef<HTMLAnchorElement>(null!)
  const reduce = useReducedMotion()
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const springX = useSpring(mx, { stiffness: 200, damping: 12 })
  const springY = useSpring(my, { stiffness: 200, damping: 12 })
  const [hovered, setHovered] = useState(false)

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current || reduce) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    mx.set((e.clientX - cx) * 0.3)
    my.set((e.clientY - cy) * 0.3)
  }

  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false) }

  const Icon = iconMap[link.icon] || FiGithub

  return (
    <motion.a
      ref={ref}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={link.label}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="group relative w-11 h-11 rounded-xl flex items-center justify-center
                 border border-white/[0.06] bg-white/[0.03]
                 hover:border-[var(--theme-primary)]/30 transition-colors duration-300
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-primary)]"
      style={{ x: springX, y: springY }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-[18px] h-[18px] text-gray-400 group-hover:text-[var(--theme-primary)] transition-colors duration-300" />
      <motion.div
        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(120% 120% at 50% 0%, color-mix(in srgb, var(--theme-primary, #3b82f6) 15%, transparent) 0%, transparent 100%)`,
        }}
      />
      {hovered && (
        <motion.div
          className="absolute -inset-2 rounded-xl -z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(100% 100% at 50% 50%, var(--theme-glow, rgba(59,130,246,0.15)) 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.a>
  )
}

import { useState } from 'react'

export function SocialButtons() {
  return (
    <motion.div
      className="flex items-center gap-3 mt-6 flex-wrap justify-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {SOCIAL_LINKS.map((link) => (
        <MagneticSocial key={link.name} link={link} />
      ))}
    </motion.div>
  )
}
