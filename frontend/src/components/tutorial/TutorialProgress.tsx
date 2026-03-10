'use client';

import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TutorialProgressProps {
  completed: number;
  total: number;
  percent: number;
  xpReward: number;
}

export default function TutorialProgress({ completed, total, percent, xpReward }: TutorialProgressProps) {
  return (
    <div className="flex items-center gap-4">
      {/* XP badge */}
      <div className="flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700 dark:bg-amber-900 dark:text-amber-300">
        <Zap className="h-3 w-3" />
        {xpReward} XP
      </div>

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              percent === 100 ? 'bg-emerald-500' : 'bg-blue-500',
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        <span className="text-xs text-gray-500 tabular-nums">
          {completed}/{total}
        </span>
      </div>
    </div>
  );
}
