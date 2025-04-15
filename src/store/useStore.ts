import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface StoreState {
  // User related states
  isLoggedIn: boolean
  userInfo: {
    id: string | null
    name: string | null
    email: string | null
  }

  // UI related states
  isMobileMenuOpen: boolean
  theme: 'light' | 'dark'

  // Actions
  setLoggedIn: (status: boolean) => void
  setUserInfo: (info: { id: string | null; name: string | null; email: string | null }) => void
  toggleMobileMenu: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      // Initial states
      isLoggedIn: false,
      userInfo: {
        id: null,
        name: null,
        email: null,
      },
      isMobileMenuOpen: false,
      theme: 'light',

      // Actions
      setLoggedIn: status => set({ isLoggedIn: status }),
      setUserInfo: info => set({ userInfo: info }),
      toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setTheme: theme => set({ theme }),
    }),
    {
      name: 'app-storage', // unique name for localStorage
    }
  )
)
