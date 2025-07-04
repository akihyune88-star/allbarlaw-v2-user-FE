import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LOCAL } from '@/constants/local'

// 토큰 존재 여부로 로그인 상태 확인
const getInitialLoginState = () => {
  return !!(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN))
}

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
  logout: () => void
  toggleMobileMenu: () => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useStore = create<StoreState>()(
  persist(
    set => ({
      // Initial states
      isLoggedIn: getInitialLoginState(),
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
      logout: () => {
        localStorage.removeItem(LOCAL.TOKEN)
        sessionStorage.removeItem(LOCAL.TOKEN)
        set({
          isLoggedIn: false,
          userInfo: {
            id: null,
            name: null,
            email: null,
          },
        })
      },
      toggleMobileMenu: () => set(state => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setTheme: theme => set({ theme }),
    }),
    {
      name: 'app-storage',
      partialize: state => ({
        userInfo: state.userInfo,
        theme: state.theme,
      }),
    }
  )
)
