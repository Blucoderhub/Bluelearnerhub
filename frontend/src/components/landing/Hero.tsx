'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white dark:from-neutral-950 dark:to-neutral-900 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
          BlueLearner Hub
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          The comprehensive platform for learning, skill development, and career advancement.
        </p>
        <div className="flex gap=4 justify-center">
          <Button size="lg">Get Started</Button>
          <Button variant="outline" size="lg">Learn More</Button>
        </div>
      </div>
    </section>
  );
};
