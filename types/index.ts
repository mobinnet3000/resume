export interface SocialLink {
  name: string
  icon: string
  url: string
  label: string
}

export interface Project {
  id: string
  name: string
  description: string
  tech: string[]
  url: string
}

export interface TerminalCommand {
  text: string
  delay: number
}

export interface ParticleData {
  x: number
  y: number
  z: number
  size: number
  speed: number
  opacity: number
  targetX: number
  targetY: number
  vx: number
  vy: number
}
