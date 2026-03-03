import { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  imageUrl?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  imageUrl,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon or Image */}
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="w-64 h-64 mb-6 opacity-50" />
      ) : Icon ? (
        <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-gray-600" />
        </div>
      ) : null}

      {/* Title */}
      <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>

      {/* Description */}
      <p className="text-gray-400 max-w-md mb-6">{description}</p>

      {/* Action Button */}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  )
}
