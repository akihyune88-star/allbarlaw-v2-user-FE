import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useRef, useCallback } from 'react'
import { LOCAL } from '@/constants/local'
import { UserInfo } from '@/types/authTypes'

interface AuthContextType {
  isLoggedIn: boolean
  isLawyer: boolean
  userInfo: UserInfo | null
  isLoading: boolean
  logout: () => void
  checkLoginStatus: () => void
  setUserInfo: (_userInfo: UserInfo) => void
  getDisplayLoginStatus: (_isMainLayout: boolean) => boolean
  getUserIdFromToken: () => number | null
  getLawyerIdFromToken: () => number | null
  userKeyId: number | null // 추가된 캐싱된 userKeyId
}

const AuthContext = createContext<AuthContextType | null>(null)

// BroadcastChannel 메시지 타입
type SessionSyncMessage =
  | { type: 'REQUEST_SESSION' }
  | { type: 'SESSION_DATA'; token: string; userInfo: UserInfo }
  | { type: 'LOGOUT' }

const SESSION_CHANNEL_NAME = 'allbarlaw_session_sync'

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
  const channelRef = useRef<BroadcastChannel | null>(null)

  // userKeyId를 useMemo로 캐싱
  const userKeyId = useMemo(() => {
    return getUserIdFromToken()
  }, [isLoggedIn]) // 로그인 상태가 변경될 때만 재계산

  // 세션 브로드캐스트 (다른 탭에 세션 전송)
  const broadcastSession = useCallback((token: string, userInfo: UserInfo) => {
    if (channelRef.current) {
      const message: SessionSyncMessage = { type: 'SESSION_DATA', token, userInfo }
      channelRef.current.postMessage(message)
    }
  }, [])

  // 로그아웃 브로드캐스트
  const broadcastLogout = useCallback(() => {
    if (channelRef.current) {
      const message: SessionSyncMessage = { type: 'LOGOUT' }
      channelRef.current.postMessage(message)
    }
  }, [])

  const checkLoginStatus = useCallback(() => {
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
      console.log('- 로그인 상태 아님')
      setIsLoggedIn(false)
      setIsLawyer(false)
      setUserInfo(null)
    }
    setIsLoading(false)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(LOCAL.TOKEN)
    sessionStorage.removeItem(LOCAL.TOKEN)
    localStorage.removeItem(LOCAL.USER_INFO)
    setIsLoggedIn(false)
    setIsLawyer(false)
    setUserInfo(null)
    setIsLoading(false)
    broadcastLogout()
  }, [broadcastLogout])

  const handleSetUserInfo = useCallback((userInfo: UserInfo) => {
    setUserInfo(userInfo)
    setIsLoggedIn(true)
    setIsLawyer(userInfo.userType === 'lawyer')
    localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(userInfo))
    setIsLoading(false)

    // sessionStorage에 토큰이 있으면 다른 탭에 브로드캐스트
    const sessionToken = sessionStorage.getItem(LOCAL.TOKEN)
    if (sessionToken) {
      broadcastSession(sessionToken, userInfo)
    }
  }, [broadcastSession])

  // 메인 레이아웃에서 사용할 함수
  // 변경: 변호사도 메인 레이아웃에서 로그인 상태 표시 (요구사항 3번)
  const getDisplayLoginStatus = (_isMainLayout: boolean) => {
    return isLoggedIn // 변호사와 일반 유저 모두 로그인 상태 표시
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
    // BroadcastChannel 초기화
    channelRef.current = new BroadcastChannel(SESSION_CHANNEL_NAME)

    const handleMessage = (event: MessageEvent<SessionSyncMessage>) => {
      const message = event.data

      switch (message.type) {
        case 'REQUEST_SESSION': {
          // 다른 탭에서 세션 요청 시, 현재 탭에 세션이 있으면 전송
          const token = sessionStorage.getItem(LOCAL.TOKEN)
          const storedUserInfo = localStorage.getItem(LOCAL.USER_INFO)
          if (token && storedUserInfo) {
            try {
              const parsedUserInfo: UserInfo = JSON.parse(storedUserInfo)
              broadcastSession(token, parsedUserInfo)
            } catch (error) {
              console.error('Failed to broadcast session:', error)
            }
          }
          break
        }
        case 'SESSION_DATA': {
          // 다른 탭에서 세션 데이터 수신 시, 현재 탭에 저장
          if (!sessionStorage.getItem(LOCAL.TOKEN)) {
            sessionStorage.setItem(LOCAL.TOKEN, message.token)
            localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(message.userInfo))
            setUserInfo(message.userInfo)
            setIsLoggedIn(true)
            setIsLawyer(message.userInfo.userType === 'lawyer')
            setIsLoading(false)
          }
          break
        }
        case 'LOGOUT': {
          // 다른 탭에서 로그아웃 시, 현재 탭도 로그아웃
          sessionStorage.removeItem(LOCAL.TOKEN)
          localStorage.removeItem(LOCAL.USER_INFO)
          setIsLoggedIn(false)
          setIsLawyer(false)
          setUserInfo(null)
          break
        }
      }
    }

    channelRef.current.addEventListener('message', handleMessage)

    // 초기 로딩
    checkLoginStatus()

    // 현재 탭에 세션이 없으면 다른 탭에 요청
    const hasLocalToken = localStorage.getItem(LOCAL.TOKEN)
    const hasSessionToken = sessionStorage.getItem(LOCAL.TOKEN)
    if (!hasLocalToken && !hasSessionToken) {
      const requestMessage: SessionSyncMessage = { type: 'REQUEST_SESSION' }
      channelRef.current.postMessage(requestMessage)
    }

    const handleStorageChange = () => {
      checkLoginStatus()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      channelRef.current?.removeEventListener('message', handleMessage)
      channelRef.current?.close()
    }
  }, [checkLoginStatus, broadcastSession])

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
        userKeyId,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// 토큰 디코드 유틸리티 함수들을 별도 파일로 이동해야 함
// export { decodeToken, getUserIdFromToken, getLawyerIdFromToken }

export { useAuth }
