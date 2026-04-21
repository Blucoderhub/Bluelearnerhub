'use client'

import { motion } from 'framer-motion'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <Card className="glass-morphism relative w-full max-w-md space-y-8 overflow-hidden border-red-500/30 bg-card/60 p-10 text-center">
        <div className="absolute left-0 top-0 h-1 w-full bg-red-600" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-red-600/20 bg-red-600/10"
        >
          <AlertCircle className="h-12 w-12 text-red-600" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="font-mono text-3xl font-black uppercase italic tracking-tighter text-white">
            SEQUENCE_ABORTED
          </h1>
          <p className="text-[10px] font-bold uppercase leading-relaxed tracking-widest text-muted-foreground">
            The payment transaction was cancelled. No charges were processed.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/premium">
            <Button className="h-12 w-full bg-red-600 font-black uppercase italic tracking-widest text-white hover:bg-red-700">
              RETRY_ACQUISITION <RotateCcw className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/student/dashboard">
            <Button
              variant="ghost"
              className="h-12 w-full text-[10px] font-black uppercase italic tracking-widest text-muted-foreground hover:text-white"
            >
              RETURN_TO_BASE
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
