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
            setUser(response.data)
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
        const { user: loggedInUser } = response.data
        setUser(loggedInUser)
        return loggedInUser
    }

    const logout = () => {
        api.post('/auth/logout').then(() => {
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
        const response = await api.post('/auth/register', data)
        const { user: registeredUser } = response.data
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
