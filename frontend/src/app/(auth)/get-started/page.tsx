'use client'

import React from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { StudentSignupForm } from '@/components/auth/StudentSignupForm'
import { StudentLoginForm } from '@/components/auth/StudentLoginForm'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

export default function GetStartedPage() {
  const { login, register, isAuthenticated } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/student/dashboard')
    }
  }, [isAuthenticated, router])

  const handleAuth = async (data: any) => {
    setError(null)
    try {
      if (data.name) {
        await register({ ...data, role: 'student' })
      } else {
        await login(data.email, data.password)
      }
      router.push('/student/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Protocol initialization failed.')
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-4 py-4 text-foreground">
      <div className="bg-noise pointer-events-none opacity-50" />

      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-[-5%] top-[-5%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-2"
      >
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back
            to Matrix
          </Link>

          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <h1 className="font-serif text-2xl font-medium tracking-tight text-black">
                Initialize Identity.
              </h1>
              <p className="mx-auto max-w-md font-serif text-sm text-muted-foreground">
                Join the hub
              </p>
            </div>
          </div>
        </div>

        <div className="shadow-3xl relative overflow-hidden rounded-2xl border border-border/50 bg-card/40 p-1 backdrop-blur-2xl">
          <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <Tabs defaultValue="signup" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="grid h-10 w-full grid-cols-2 gap-2 rounded-xl bg-secondary/50 p-1 ring-1 ring-white/5">
                <TabsTrigger
                  value="signup"
                  className="rounded-xl font-serif text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  New Identity
                </TabsTrigger>
                <TabsTrigger
                  value="login"
                  className="rounded-xl font-serif text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  Existing User
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-4 pt-4">
              <TabsContent value="signup" className="mt-0 focus-visible:outline-none">
                <StudentSignupForm onSubmit={handleAuth} error={error} />
              </TabsContent>

              <TabsContent value="login" className="mt-0 focus-visible:outline-none">
                <StudentLoginForm onSubmit={handleAuth} error={error} />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <p className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground/40">
          Node Authorization required for system entry
        </p>
      </motion.div>
    </div>
  )
}
