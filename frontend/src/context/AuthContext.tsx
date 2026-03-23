'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { User } from '@/types'
import api from '@/lib/api'

// ─────────────────────────────────────────────────────────────────────────────
// Auth hint cookie — lives on the FRONTEND domain (Vercel) so the Next.js
// middleware can read it.  It carries NO sensitive data; it is purely a
// presence signal.  The real security is enforced by the Express backend
// (HttpOnly signed JWT) on every API call.
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_HINT_COOKIE = 'auth_hint'
const AUTH_HINT_MAX_AGE = 7 * 24 * 60 * 60 // 7 days, same as accessToken TTL

function setAuthHintCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_HINT_COOKIE}=1; path=/; max-age=${AUTH_HINT_MAX_AGE}; SameSite=Lax`
}

function clearAuthHintCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_HINT_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

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
  /** Full profile refresh.  Pass silent=true to skip clearing user on failure
   *  (used for background hydration after login where user is already set). */
  refreshUser: (silent?: boolean) => Promise<void>
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

  const refreshUser = useCallback(async (silent = false) => {
    try {
      const response = await api.get('/auth/me')
      // Backend: { success, data: userObject }
      const fetchedUser = response.data?.data ?? response.data ?? null
      setUser(fetchedUser)
      // Keep the frontend-domain hint cookie in sync
      if (fetchedUser) setAuthHintCookie()
      else clearAuthHintCookie()
    } catch {
      if (!silent) {
        // Only wipe user on the initial mount check, not during background hydration
        setUser(null)
        clearAuthHintCookie()
      }
    } finally {
      if (!silent) setLoading(false)
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
    // Set the frontend-domain hint cookie so Next.js middleware allows navigation
    setAuthHintCookie()
    // Hydrate full profile in the background (silent — don't wipe user on failure)
    refreshUser(true).catch(() => {})
    return loggedInUser
  }

  const logout = () => {
    // Always clear local state — API call is best-effort
    clearAuthHintCookie()
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
