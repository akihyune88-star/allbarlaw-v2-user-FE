import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LOCAL } from '@/constants/local'

interface AuthContextType {
  isLoggedIn: boolean
  logout: () => void
  checkLoginStatus: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const checkLoginStatus = () => {
    const hasToken = !!(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN))
    setIsLoggedIn(hasToken)
  }

  const logout = () => {
    localStorage.removeItem(LOCAL.TOKEN)
    sessionStorage.removeItem(LOCAL.TOKEN)
    setIsLoggedIn(false)
  }

  useEffect(() => {
    checkLoginStatus()

    const handleStorageChange = () => {
      checkLoginStatus()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return <AuthContext.Provider value={{ isLoggedIn, logout, checkLoginStatus }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
