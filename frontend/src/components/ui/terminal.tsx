'use client';

import React from 'react';

interface TerminalProps {
  commands?: string[];
  output?: string[];
  height?: string;
  className?: string;
}

const Terminal: React.FC<TerminalProps> = ({ commands = [], output = [], height, className = '' }) => {
  const lines = output.length > 0 ? output : commands;

  return (
    <div className={`bg-gray-900 rounded-lg shadow-lg overflow-hidden font-mono text-sm ${className}`} style={{ height }}>
      <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-blue-500" />
        </div>
        <span className="text-gray-400 text-xs ml-2">terminal</span>
      </div>
      <div className="p-4 text-blue-400 space-y-2 overflow-auto" style={{ maxHeight: height ? `calc(${height} - 40px)` : undefined }}>
        {lines.map((cmd, idx) => (
          <div key={idx}>
            <span className="text-blue-400">$</span> {cmd}
          </div>
        ))}
        {lines.length === 0 && (
          <div>
            <span className="text-blue-400">$</span> <span className="animate-pulse">_</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
