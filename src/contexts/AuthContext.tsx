import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { LOCAL } from '@/constants/local'
import { UserInfo } from '@/types/authTypes'

interface AuthContextType {
  isLoggedIn: boolean
  isLawyer: boolean
  userInfo: UserInfo | null
  isLoading: boolean
  logout: () => void
  checkLoginStatus: () => void
  setUserInfo: (userInfo: UserInfo) => void
  // 메인 레이아웃에서 사용할 함수 추가
  getDisplayLoginStatus: (isMainLayout: boolean) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLawyer, setIsLawyer] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const checkLoginStatus = () => {
    const hasToken = !!(localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN))
    const storedUserInfo = localStorage.getItem(LOCAL.USER_INFO)

    if (hasToken && storedUserInfo) {
      try {
        const parsedUserInfo: UserInfo = JSON.parse(storedUserInfo)
        setUserInfo(parsedUserInfo)
        setIsLoggedIn(true)
        setIsLawyer(parsedUserInfo.userType === 'lawyer')
      } catch (error) {
        console.error('Failed to parse user info:', error)
        logout()
      }
    } else {
      logout()
    }
    setIsLoading(false)
  }

  const logout = () => {
    localStorage.removeItem(LOCAL.TOKEN)
    sessionStorage.removeItem(LOCAL.TOKEN)
    localStorage.removeItem(LOCAL.USER_INFO)
    setIsLoggedIn(false)
    setIsLawyer(false)
    setUserInfo(null)
    setIsLoading(false)
  }

  const handleSetUserInfo = (userInfo: UserInfo) => {
    setUserInfo(userInfo)
    setIsLoggedIn(true)
    setIsLawyer(userInfo.userType === 'lawyer')
    localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(userInfo))
    setIsLoading(false)
  }

  // 메인 레이아웃에서 사용할 함수
  const getDisplayLoginStatus = (isMainLayout: boolean) => {
    return isMainLayout ? isLoggedIn && !isLawyer : isLoggedIn
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

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isLawyer,
        userInfo,
        isLoading,
        logout,
        checkLoginStatus,
        setUserInfo: handleSetUserInfo,
        getDisplayLoginStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
