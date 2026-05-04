// No-op auth hook - all pages are now publicly accessible
// This provides dummy values so existing code continues to work
import { User } from '@/types'

interface UseAuthResult {
  user: null
  loading: false
  isAuthenticated: false
  login: (email: string, password: string) => Promise<User>
  logout: () => void
  register: (data: { email: string; password: string; name: string }) => Promise<User>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthResult {
  return {
    user: null,
    loading: false,
    isAuthenticated: false,
    login: async () => {
      throw new Error('Login disabled - all pages are public')
    },
    logout: () => {
      // No-op
    },
    register: async () => {
      throw new Error('Registration disabled - all pages are public')
    },
    refreshUser: async () => {
      // No-op
    },
  }
}
