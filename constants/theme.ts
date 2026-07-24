export type ThemeId = 'cyber-blue' | 'cyber-purple' | 'cyber-green' | 'monochrome'

export interface ThemeConfig {
  id: ThemeId
  label: string
  primary: string
  secondary: string
  tertiary: string
  glow: string
  css: Record<string, string>
}

export const THEMES: ThemeConfig[] = [
  {
    id: 'cyber-blue',
    label: 'Cyber Blue',
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    tertiary: '#06b6d4',
    glow: 'rgba(59,130,246,0.3)',
    css: { '--primary': '#3b82f6', '--secondary': '#8b5cf6', '--tertiary': '#06b6d4' },
  },
  {
    id: 'cyber-purple',
    label: 'Cyber Purple',
    primary: '#8b5cf6',
    secondary: '#ec4899',
    tertiary: '#a78bfa',
    glow: 'rgba(139,92,246,0.3)',
    css: { '--primary': '#8b5cf6', '--secondary': '#ec4899', '--tertiary': '#a78bfa' },
  },
  {
    id: 'cyber-green',
    label: 'Cyber Green',
    primary: '#10b981',
    secondary: '#34d399',
    tertiary: '#6ee7b7',
    glow: 'rgba(16,185,129,0.3)',
    css: { '--primary': '#10b981', '--secondary': '#34d399', '--tertiary': '#6ee7b7' },
  },
  {
    id: 'monochrome',
    label: 'Monochrome',
    primary: '#ffffff',
    secondary: '#a3a3a3',
    tertiary: '#737373',
    glow: 'rgba(255,255,255,0.15)',
    css: { '--primary': '#ffffff', '--secondary': '#a3a3a3', '--tertiary': '#737373' },
  },
]
