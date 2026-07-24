'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { FiGithub, FiLinkedin, FiSend, FiInstagram, FiMail, FiFileText } from 'react-icons/fi'
import { staggerContainer } from '@/animations/variants'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const iconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  GitHub: FiGithub,
  LinkedIn: FiLinkedin,
  Telegram: FiSend,
  Instagram: FiInstagram,
  Email: FiMail,
  Resume: FiFileText,
}

interface Props {
  links?: { name: string; url: string }[]
}

const DEFAULT_LINKS = [
  { name: 'GitHub', url: '#' },
  { name: 'LinkedIn', url: '#' },
  { name: 'Telegram', url: '#' },
  { name: 'Instagram', url: '#' },
  { name: 'Email', url: '#' },
  { name: 'Resume', url: '#' },
]

function SocialIcon({ name, url }: { name: string; url: string }) {
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
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.3)
    my.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }

  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false) }

  const Icon = iconMap[name] || FiGithub

  return (
    <motion.a
      ref={ref}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={name}
      onMouseMove={handleMouse}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      className="flex items-center justify-center rounded-xl transition-colors duration-200 w-[40px] h-[40px] md:w-[48px] md:h-[48px]"
      style={{
        backgroundColor: hovered ? 'var(--accent-soft)' : 'var(--surface)',
        border: '1px solid',
        borderColor: hovered ? 'var(--accent-yellow)' : 'var(--surface-border)',
        x: springX, y: springY,
      }}
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
    >
      <Icon className="w-[18px] h-[18px] md:w-5 md:h-5 transition-colors duration-200" style={{ color: hovered ? 'var(--accent-yellow)' : 'var(--text-secondary)' }} />
    </motion.a>
  )
}

export function SocialButtons({ links = DEFAULT_LINKS }: Props) {
  return (
    <motion.div className="flex items-center gap-2 md:gap-4 mt-6 md:mt-8 justify-center flex-wrap" variants={staggerContainer} initial="hidden" animate="visible">
      {links.map((link) => (
        <SocialIcon key={link.name} name={link.name} url={link.url} />
      ))}
    </motion.div>
  )
}
