import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mobin Bastai | Full Stack Developer',
  description: 'Premium interactive developer portfolio. Full Stack Developer, Flutter Developer, AI Engineer, and Open Source Enthusiast.',
  keywords: ['developer', 'portfolio', 'full stack', 'next.js', 'flutter', 'ai engineer'],
  authors: [{ name: 'Mobin Bastai' }],
  openGraph: {
    title: 'Mobin Bastai | Full Stack Developer',
    description: 'Premium interactive developer portfolio.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mobin Bastai | Full Stack Developer',
    description: 'Premium interactive developer portfolio.',
  },
  robots: 'index, follow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  )
}
