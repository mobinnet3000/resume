'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiGithub, FiUsers } from 'react-icons/fi'

interface GitHubData {
  publicRepos: number
  followers: number
  stars: number
  latestCommit: string
}

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || ''
        if (!username) {
          setError(true)
          return
        }
        const res = await fetch(`https://api.github.com/users/${username}`)
        if (!res.ok) throw new Error('Failed')
        const user = await res.json()
        setData({
          publicRepos: user.public_repos,
          followers: user.followers,
          stars: 0,
          latestCommit: '',
        })
      } catch {
        setError(true)
      }
    }
    fetchGitHub()
  }, [])

  if (error || !data) return null

  return (
    <motion.div
      className="flex items-center gap-4 mt-4 text-xs text-gray-500"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 2.2 }}
    >
      <span className="flex items-center gap-1">
        <FiGithub className="w-3 h-3" />
        {data.publicRepos} repos
      </span>
      <span className="flex items-center gap-1">
        <FiUsers className="w-3 h-3" />
        {data.followers} followers
      </span>
    </motion.div>
  )
}
