import { ReactNode, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTER } from '@/routes/routerConstant'

interface ProtectedRouteProps {
  children: ReactNode
  requireLawyer?: boolean
  requireUser?: boolean // 일반 유저만 접근 가능
  redirectTo?: string
}

export const ProtectedRoute = ({
  children,
  requireLawyer = false,
  requireUser = false,
  redirectTo = ROUTER.AUTH,
}: ProtectedRouteProps) => {
  const { isLoggedIn, isLawyer, userInfo, isLoading } = useAuth()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  // 부드러운 리다이렉트를 위한 useEffect
  useEffect(() => {
    if (requireUser && !isLoggedIn) {
      const timer = setTimeout(() => {
        setShouldRedirect(true)
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [requireUser, isLoggedIn])

  // 로딩 중이 아닐 때만 로그 출력 (깜빡거림 방지)
  if (!isLoading) {
    console.log('🔒 ProtectedRoute 실행됨!')
    console.log('ProtectedRoute Debug:', {
      isLoggedIn,
      isLawyer,
      userInfo,
      requireLawyer,
      requireUser,
      isLoading,
      pathname: window.location.pathname,
    })
  }

  // 일반 유저만 접근 가능한 페이지인 경우
  if (requireUser && !isLoggedIn) {
    console.log('❌ 로그인하지 않음! 로그인 페이지로 리다이렉트')

    if (shouldRedirect) {
      return <Navigate to={ROUTER.AUTH} replace />
    }

    // 로딩 스피너 표시
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          background: 'rgba(255, 255, 255, 0.9)',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // 로딩 중인 경우 아무것도 렌더링하지 않음 (깜빡거림 방지)
  if (isLoading) {
    return null
  }

  // 변호사 권한이 필요한 페이지인데 변호사가 아닌 경우
  if (requireLawyer && !isLawyer) {
    console.log('Not a lawyer, redirecting to main')
    return <Navigate to={ROUTER.MAIN} replace />
  }

  console.log('✅ 접근 허용!')
  return <>{children}</>
}
