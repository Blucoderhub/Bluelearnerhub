'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Users, Clock, Star, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface LearningPathCardProps {
  id: number
  title: string
  description: string
  domain: string
  difficulty: string
  coursesCount: number
  lessonsCount: number
  duration: number // hours
  enrolledCount: number
  rating: number
  reviewsCount: number
  thumbnail?: string
  progress?: number
  isEnrolled?: boolean
  prerequisites?: string[]
}

export default function LearningPathCard({
  id,
  title,
  description,
  domain,
  difficulty,
  coursesCount,
  lessonsCount,
  duration,
  enrolledCount,
  rating,
  reviewsCount,
  thumbnail,
  progress = 0,
  isEnrolled = false,
  prerequisites = [],
}: LearningPathCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="group overflow-hidden bg-gray-800 border-gray-700 hover:border-blue-500 transition-all h-full flex flex-col">
        {/* Thumbnail */}
        <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-600 to-primary">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-white/30" />
            </div>
          )}

          {/* Overlay Badges */}
          <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
            <Badge className="bg-white/90 text-gray-900 border-0">
              {domain}
            </Badge>
            <div className="flex items-center gap-1 bg-black/60 px-2 py-1 rounded">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-semibold">{rating}</span>
              <span className="text-gray-300 text-xs">({reviewsCount})</span>
            </div>
          </div>

          {/* Progress Indicator (if enrolled) */}
          {isEnrolled && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2">
              <div className="flex items-center justify-between mb-1">
                <span className="text-white text-xs font-medium">{progress}% Complete</span>
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <Progress value={progress} className="h-1" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-6 space-y-4">
          {/* Title & Description */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span>{coursesCount} courses</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>{enrolledCount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-yellow-400" />
              <span>{duration}h total</span>
            </div>
            <div>
              <Badge variant="outline" className="text-xs capitalize">
                {difficulty}
              </Badge>
            </div>
          </div>

          {/* Prerequisites */}
          {prerequisites.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2">Prerequisites:</div>
              <div className="flex flex-wrap gap-1">
                {prerequisites.slice(0, 2).map((prereq, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {prereq}
                  </Badge>
                ))}
                {prerequisites.length > 2 && (
                  <Badge variant="secondary" className="text-xs">
                    +{prerequisites.length - 2}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Action Button */}
          <Link href={`/learn/paths/${id}`} className="w-full">
            <Button className="w-full" variant={isEnrolled ? 'outline' : 'default'}>
              {isEnrolled ? 'Continue Learning' : 'Start Learning'}
            </Button>
          </Link>
        </div>
      </Card>
    </motion.div>
  )
}
