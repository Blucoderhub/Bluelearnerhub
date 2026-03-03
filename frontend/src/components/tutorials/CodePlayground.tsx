'use client'

import { useState } from 'react'
import CodeEditor from '@/components/domain-specific/computer-science/CodeEditor'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Play, RotateCcw, Download } from 'lucide-react'

interface CodePlaygroundProps {
  initialCode?: string
  language?: string
  height?: string
}

export default function CodePlayground({
  initialCode = '// Start coding here...',
  language: initialLanguage = 'javascript',
}: CodePlaygroundProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)
    setOutput(['Running...'])

    try {
      // Simulate code execution (replace with actual API call)
      setTimeout(() => {
        if (initialLanguage === 'javascript') {
          try {
            // DANGEROUS: Only for demo purposes
            // In production, use a sandboxed environment
            const result = eval(code)
            setOutput([String(result)])
          } catch (error: any) {
            setOutput([`Error: ${error.message}`])
          }
        } else {
          setOutput(['Code executed successfully!'])
        }
        setIsRunning(false)
      }, 1000)
    } catch (error) {
      setOutput(['Execution failed'])
      setIsRunning(false)
    }
  }

  const handleReset = () => {
    setCode(initialCode)
    setOutput([])
  }

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `code.${initialLanguage}`
    a.click()
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-white text-sm font-semibold">Code Playground</span>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={handleRun}
            disabled={isRunning}
            size="sm"
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-1" />
            {isRunning ? 'Running...' : 'Run'}
          </Button>
          <Button onClick={handleReset} variant="outline" size="sm">
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Editor & Output */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Tabs defaultValue="editor" className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b border-gray-700">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>

          <TabsContent value="editor" className="flex-1 m-0">
            <CodeEditor
              initialCode={code}
              language={initialLanguage}
              onSave={setCode}
              showToolbar={false}
              height="100%"
            />
          </TabsContent>

          <TabsContent value="output" className="flex-1 m-0 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
            {output.length > 0 ? (
              <div className="space-y-2">
                {output.map((line, i) => (
                  <div key={i}>{line}</div>
                ))}
              </div>
            ) : (
              <div className="text-gray-600">
                Click "Run" to see output...
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
