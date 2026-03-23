'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@/types'
import api from '@/lib/api'

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface AuthContextValue {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  register: (data: {
    email: string
    password: string
    name: string
    role: string
    fullName?: string
  }) => Promise<User>
  refreshUser: () => Promise<void>
}

// ─────────────────────────────────────────────────────────────────────────────
// Context
// ─────────────────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const response = await api.get('/auth/me')
      // Backend: { success, data: userObject }
      setUser(response.data?.data ?? response.data ?? null)
    } catch {
      // Cookies will be cleared by backend on 401
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Single auth-check on mount — shared across the entire app
  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = async (email: string, password: string): Promise<User> => {
    const response = await api.post('/auth/login', { email, password })
    // Backend: { success, data: { user } }
    const loggedInUser = response.data?.data?.user ?? response.data?.user
    if (!loggedInUser) throw new Error('Invalid login response from server')
    setUser(loggedInUser)
    // Hydrate full profile (totalPoints, level, streak, stats, skills)
    refreshUser().catch(() => {})
    return loggedInUser
  }

  const logout = () => {
    // Always clear local state — API call is best-effort
    api.post('/auth/logout').finally(() => {
      setUser(null)
      window.location.href = '/login'
    })
  }

  const register = async (data: {
    email: string
    password: string
    name: string
    role: string
  }): Promise<User> => {
    // Backend expects `fullName` — map from the frontend `name` field
    const { name, ...rest } = data
    const response = await api.post('/auth/register', { ...rest, fullName: name })
    // Backend: { success, data: { user } }
    const registeredUser = response.data?.data?.user ?? response.data?.user
    if (!registeredUser) throw new Error('Invalid registration response from server')
    setUser(registeredUser)
    return registeredUser
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (ctx === undefined) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
