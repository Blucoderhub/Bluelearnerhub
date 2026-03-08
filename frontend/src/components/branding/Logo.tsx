import React from 'react'
import { brandConfig } from '@/config/theme'

interface LogoProps {
  variant?: 'default' | 'white'
  className?: string
  showText?: boolean
}

export function Logo({ variant = 'default', className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="32" height="32" rx="8" fill={variant === 'white' ? '#fff' : '#22c55e'} />
        <path
          d="M8 12h8v8H8z"
          fill={variant === 'white' ? '#22c55e' : '#fff'}
          opacity="0.8"
        />
        <path
          d="M12 8h8v8h-8z"
          fill={variant === 'white' ? '#22c55e' : '#fff'}
        />
      </svg>

      {showText && (
        <span className={`text-xl font-bold ${variant === 'white' ? 'text-white' : 'text-foreground'}`}>
          {brandConfig.name}
        </span>
      )}
    </div>
  )
}

export function PoweredByBadge({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/60 ${className}`}>
      <span className="font-medium whitespace-nowrap">Powered by</span>
      <span className="font-bold text-primary/80 tracking-normal normal-case text-xs">{brandConfig.poweredBy}</span>
    </div>
  )
}
