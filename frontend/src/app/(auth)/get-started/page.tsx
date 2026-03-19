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
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-background px-4 py-20 text-foreground overflow-hidden">
      <div className="bg-noise pointer-events-none opacity-50" />
      
      {/* Background Decor */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-[-5%] right-[-5%] h-[600px] w-[600px] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg space-y-12"
      >
        <div className="space-y-8 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground transition-all hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" /> Back to Matrix
          </Link>
          
          <div className="flex flex-col items-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-primary shadow-2xl shadow-primary/40">
              <ShieldCheck className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-3">
              <Badge variant="outline" className="rounded-full border-primary/30 bg-primary/10 px-4 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-primary">
                Ecosystem Initialization
              </Badge>
              <h1 className="font-serif text-5xl font-medium tracking-tight text-white">
                Initialize Identity.
              </h1>
              <p className="max-w-md mx-auto font-serif text-lg text-muted-foreground">
                Join the elite engineering network to access advanced courses, labs, and collaborative systems.
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-border/50 bg-card/40 p-2 shadow-3xl backdrop-blur-2xl">
          <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <Tabs defaultValue="signup" className="w-full">
            <div className="px-10 pt-10">
              <TabsList className="grid h-14 w-full grid-cols-2 gap-2 rounded-2xl bg-secondary/50 p-1.5 ring-1 ring-white/5">
                <TabsTrigger value="signup" className="rounded-xl font-serif text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                  New Identity
                </TabsTrigger>
                <TabsTrigger value="login" className="rounded-xl font-serif text-sm font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg">
                  Existing User
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-10 pt-12">
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
