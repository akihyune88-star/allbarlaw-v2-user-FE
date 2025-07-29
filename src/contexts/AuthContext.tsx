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
  getDisplayLoginStatus: (isMainLayout: boolean) => boolean
  getUserIdFromToken: () => number | null
  getLawyerIdFromToken: () => number | null
}

const AuthContext = createContext<AuthContextType | null>(null)

// JWT 토큰 디코드 함수
const decodeToken = (token: string) => {
  try {
    // JWT 토큰의 payload 부분 추출 (두 번째 부분)
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('토큰 디코드 실패:', error)
    return null
  }
}

// 토큰에서 유저 ID 추출
const getUserIdFromToken = (): number | null => {
  const token = localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN)
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  // 토큰에서 유저 ID 추출 (API 응답 구조에 따라 필드명 조정 필요)
  return decoded.userId || decoded.sub || decoded.id || null
}

// 토큰에서 변호사 ID 추출
const getLawyerIdFromToken = (): number | null => {
  const token = localStorage.getItem(LOCAL.TOKEN) || sessionStorage.getItem(LOCAL.TOKEN)
  if (!token) return null

  const decoded = decodeToken(token)
  if (!decoded) return null

  // 토큰에서 변호사 ID 추출 (API 응답 구조에 따라 필드명 조정 필요)
  return decoded.lawyerId || decoded.lawyer_id || null
}

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
      // 로그인 상태가 아닌 경우 즉시 로딩 완료
      setIsLoggedIn(false)
      setIsLawyer(false)
      setUserInfo(null)
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

  // 토큰에서 유저 ID 추출 함수
  const getUserIdFromTokenContext = () => {
    return getUserIdFromToken()
  }

  // 토큰에서 변호사 ID 추출 함수
  const getLawyerIdFromTokenContext = () => {
    return getLawyerIdFromToken()
  }

  useEffect(() => {
    // 초기 로딩을 더 빠르게 처리
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
        getUserIdFromToken: getUserIdFromTokenContext,
        getLawyerIdFromToken: getLawyerIdFromTokenContext,
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

// 토큰 디코드 유틸리티 함수들 export
export { decodeToken, getUserIdFromToken, getLawyerIdFromToken }
