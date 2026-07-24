import { SocialLink, Project } from '@/types'

export const SITE_CONFIG = {
  name: 'Mobin Bastai',
  title: 'Full Stack Developer',
  email: 'hello@mobinbastai.dev',
  location: 'Tehran, Iran',
  avatar: null,
}

export const TITLES = [
  'Full Stack Developer',
  'Flutter Developer',
  'AI Engineer',
  'Backend Developer',
  'Open Source Enthusiast',
]

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'GitHub', icon: 'FaGithub', url: '#', label: 'Visit GitHub' },
  { name: 'LinkedIn', icon: 'FaLinkedin', url: '#', label: 'Visit LinkedIn' },
  { name: 'Telegram', icon: 'FaTelegram', url: '#', label: 'Visit Telegram' },
  { name: 'Instagram', icon: 'FaInstagram', url: '#', label: 'Visit Instagram' },
  { name: 'Email', icon: 'FaEnvelope', url: '#', label: 'Send Email' },
  { name: 'Resume', icon: 'FaFileAlt', url: '#', label: 'View Resume' },
]

export const PROJECTS: Project[] = [
  { id: '1', name: 'AI Platform', description: 'Next-gen AI inference platform with real-time streaming and edge deployment', tech: ['Next.js', 'Python', 'TensorFlow', 'Redis', 'Kubernetes'], url: '#' },
  { id: '2', name: 'FlutterFlow', description: 'Cross-platform mobile app framework with visual drag-and-drop builder and real-time preview', tech: ['Flutter', 'Dart', 'Firebase', 'Stripe', 'Riverpod'], url: '#' },
  { id: '3', name: 'DevOps Dashboard', description: 'Real-time infrastructure monitoring with predictive alerting and automated remediation', tech: ['React', 'Go', 'Docker', 'PostgreSQL', 'Grafana'], url: '#' },
]

export const TECH_STACK = [
  'Next.js', 'React', 'Flutter', 'Laravel', 'Node.js',
  'Docker', 'Redis', 'PostgreSQL', 'Python', 'TypeScript',
]

export const SKILLS = [
  'System Design', 'Cloud Architecture', 'CI/CD', 'Microservices',
  'REST APIs', 'GraphQL', 'WebSockets', 'Kubernetes',
]

export const LOADING_COMMANDS = [
  { text: 'Initializing...', delay: 200 },
  { text: 'Loading modules...', delay: 300 },
  { text: 'Loading UI...', delay: 250 },
  { text: 'Loading shaders...', delay: 400 },
  { text: 'Loading particles...', delay: 350 },
  { text: 'Connecting...', delay: 300 },
  { text: 'Portfolio Ready.', delay: 500 },
]
