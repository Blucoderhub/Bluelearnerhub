import { useEffect, useState } from 'react'
import { User } from '@/types'
import api from '@/lib/api'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // No need to check localStorage - cookies are sent automatically
      const response = await api.get('/auth/me')
      setUser(response.data)
    } catch (error) {
      console.error('Auth check failed:', error)
      // Cookies will be cleared by backend on 401
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password })
    const { user } = response.data
    // Cookies are set automatically by backend - no localStorage needed
    setUser(user)
    return user
  }

  const logout = () => {
    // Backend will clear cookies
    api.post('/auth/logout').then(() => {
      setUser(null)
      window.location.href = '/login'
    })
  }

  const register = async (data: { email: string; password: string; name: string; role: string }) => {
    const response = await api.post('/auth/register', data)
    const { user } = response.data
    // Cookies are set automatically by backend - no localStorage needed
    setUser(user)
    return user
  }

  return {
    user,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  }
}
