'use client'

import React from 'react'
import { LoginLayout } from '@/components/auth/LoginLayout'
import { LoginForm } from '@/components/auth/LoginForm'
import { School } from 'lucide-react'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

export default function UniversityLogin() {
  const { login, isAuthenticated } = useAuth()
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (data: any) => {
    setError(null)
    try {
      await login(data.email, data.password)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to initialize secure session.')
    }
  }

  return (
    <LoginLayout
      title="University Hub"
      subtitle="Academic Path Coordination"
      icon={<School size={32} />}
    >
      <LoginForm onSubmit={handleSubmit} error={error} />
    </LoginLayout>
  )
}
