'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FiGithub, FiLinkedin, FiSend, FiInstagram, FiMail, FiFileText } from 'react-icons/fi'
import { SOCIAL_LINKS } from '@/constants'
import { staggerContainer } from '@/animations/variants'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  FaGithub: FiGithub,
  FaLinkedin: FiLinkedin,
  FaTelegram: FiSend,
  FaInstagram: FiInstagram,
  FaEnvelope: FiMail,
  FaFileAlt: FiFileText,
}

function SocialIcon({ link }: { link: typeof SOCIAL_LINKS[0] }) {
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
      className="flex items-center justify-center rounded-xl transition-colors duration-200"
      style={{
        width: 48,
        height: 48,
        backgroundColor: hovered ? 'var(--accent-soft)' : 'var(--surface)',
        border: '1px solid',
        borderColor: hovered ? 'var(--accent-yellow)' : 'var(--surface-border)',
        x: springX,
        y: springY,
      }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon
        className="w-5 h-5 transition-colors duration-200"
        style={{ color: hovered ? 'var(--accent-yellow)' : 'var(--text-secondary)' }}
      />
    </motion.a>
  )
}

export function SocialButtons() {
  return (
    <motion.div
      className="flex items-center gap-4 mt-8 justify-center"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {SOCIAL_LINKS.map((link) => (
        <SocialIcon key={link.name} link={link} />
      ))}
    </motion.div>
  )
}
