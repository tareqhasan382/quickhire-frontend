import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '../types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token?: string) => void
  logout: () => void
  updateUser: (partial: Partial<User>) => void
  hasRole: (roles: Role[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token = 'mock-token') => set({ user, token, isAuthenticated: true }),
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
      updateUser: (partial) =>
        set((state) => (state.user ? { user: { ...state.user, ...partial } } : state)),
      hasRole: (roles) => {
        const user = get().user
        return user !== null && roles.includes(user.role)
      },
    }),
    { name: 'quickhire-auth' },
  ),
)
