'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, Award, Play } from 'lucide-react'
import { motion } from 'framer-motion'

interface TutorialCardProps {
  id: number
  title: string
  description: string
  domain: string
  difficulty: 'easy' | 'medium' | 'hard' | 'expert'
  duration: number // in minutes
  lessonsCount: number
  enrolledCount: number
  thumbnail?: string
  progress?: number // 0-100
  isEnrolled?: boolean
  tags?: string[]
}

export default function TutorialCard({
  id,
  title,
  description,
  domain,
  difficulty,
  duration,
  lessonsCount,
  enrolledCount,
  thumbnail,
  progress = 0,
  isEnrolled = false,
  tags = [],
}: TutorialCardProps) {
  const difficultyColors = {
    easy: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    hard: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    expert: 'bg-red-500/10 text-red-500 border-red-500/20',
  }

  const domainColors: Record<string, string> = {
    'computer-science': 'bg-blue-600',
    'mechanical': 'bg-orange-500',
    'electrical': 'bg-yellow-500',
    'civil': 'bg-blue-500',
    'chemical': 'bg-purple-500',
    'management': 'bg-violet-500',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Link href={`/tutorials/${id}`}>
        <Card className="group overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-500 transition-all cursor-pointer h-full">
          {/* Thumbnail */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800">
            {thumbnail ? (
              <img
                src={thumbnail}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <BookOpen className="w-16 h-16 text-gray-600" />
              </div>
            )}
            
            {/* Domain Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${domainColors[domain] || 'bg-gray-600'} text-white border-0`}>
                {domain.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </Badge>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-3 right-3">
              <Badge className={`${difficultyColors[difficulty]} border`}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Badge>
            </div>

            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center">
                <Play className="w-8 h-8 text-white ml-1" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <h3 className="text-lg font-semibold text-white line-clamp-2 group-hover:text-blue-400 transition-colors">
              {title}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-400 line-clamp-2">
              {description}
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {tags.slice(0, 3).map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="text-xs bg-gray-900 border-gray-600 text-gray-400"
                  >
                    {tag}
                  </Badge>
                ))}
                {tags.length > 3 && (
                  <Badge variant="outline" className="text-xs bg-gray-900 border-gray-600 text-gray-400">
                    +{tags.length - 3}
                  </Badge>
                )}
              </div>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                <span>{lessonsCount} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{duration}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Award className="w-4 h-4" />
                <span>{enrolledCount.toLocaleString()}</span>
              </div>
            </div>

            {/* Progress Bar (if enrolled) */}
            {isEnrolled && (
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Progress</span>
                  <span className="font-semibold text-blue-400">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
