'use client'

import { useState, useRef, useEffect } from 'react'
import { Terminal as TerminalIcon, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TerminalProps {
  output?: string[]
  onCommand?: (command: string) => Promise<string>
  height?: string
  showHeader?: boolean
}

export default function Terminal({
  output: initialOutput = [],
  onCommand,
  height = '400px',
  showHeader = true,
}: TerminalProps) {
  const [output, setOutput] = useState<string[]>(initialOutput)
  const [input, setInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const terminalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Auto-scroll to bottom
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [output])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    // Add command to output
    setOutput(prev => [...prev, `$ ${input}`])
    
    // Add to history
    setHistory(prev => [...prev, input])
    setHistoryIndex(-1)

    // Execute command
    if (onCommand) {
      const result = await onCommand(input)
      setOutput(prev => [...prev, result])
    } else {
      // Default commands
      handleDefaultCommand(input)
    }

    setInput('')
  }

  const handleDefaultCommand = (cmd: string) => {
    const [command, ...args] = cmd.trim().split(' ')

    switch (command) {
      case 'clear':
        setOutput([])
        break
      
      case 'help':
        setOutput(prev => [
          ...prev,
          'Available commands:',
          '  clear  - Clear terminal',
          '  help   - Show this help',
          '  echo   - Echo text',
        ])
        break
      
      case 'echo':
        setOutput(prev => [...prev, args.join(' ')])
        break
      
      default:
        setOutput(prev => [...prev, `Command not found: ${command}`])
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Arrow up - previous command
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (history.length === 0) return
      
      const newIndex = historyIndex === -1 
        ? history.length - 1 
        : Math.max(0, historyIndex - 1)
      
      setHistoryIndex(newIndex)
      setInput(history[newIndex])
    }

    // Arrow down - next command
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex === -1) return

      const newIndex = historyIndex + 1
      
      if (newIndex >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(newIndex)
        setInput(history[newIndex])
      }
    }
  }

  const handleClear = () => {
    setOutput([])
  }

  return (
    <div 
      className={`flex flex-col bg-gray-900 rounded-lg overflow-hidden border border-gray-700 ${
        isFullscreen ? 'fixed inset-4 z-50' : ''
      }`}
      style={{ height: isFullscreen ? 'auto' : height }}
    >
      {/* Header */}
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
          <div className="flex items-center gap-2 text-white">
            <TerminalIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">Terminal</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleClear}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              Clear
            </Button>
            <Button
              onClick={() => setIsFullscreen(!isFullscreen)}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Terminal Output */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-4 font-mono text-sm text-blue-400 bg-black"
        onClick={() => inputRef.current?.focus()}
      >
        {output.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {line}
          </div>
        ))}

        {/* Input Line */}
        <form onSubmit={handleSubmit} className="flex items-center mt-2">
          <span className="text-blue-400 mr-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent outline-none text-blue-400"
            autoFocus
            spellCheck={false}
          />
        </form>
      </div>
    </div>
  )
}
