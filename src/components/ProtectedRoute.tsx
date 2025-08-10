import { ReactNode, useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTER } from '@/routes/routerConstant'

interface ProtectedRouteProps {
  children: ReactNode
  requireLawyer?: boolean // 변호사만 접근 가능
  requireUser?: boolean // 일반 유저만 접근 가능 (변호사는 접근 가능)
  requireUserOnly?: boolean // 일반 유저만 접근 가능 (변호사는 접근 불가)
}

export const ProtectedRoute = ({ children, requireLawyer = false, requireUser = false, requireUserOnly = false }: ProtectedRouteProps) => {
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
    return undefined
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
  if (requireUser) {
    // 로그인하지 않은 경우
    if (!isLoggedIn) {
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
    
    // 변호사는 일반 유저 페이지에 접근 가능 (요구사항: 변호사는 모든 페이지 접근 가능)
    // 일반 유저만 접근 가능한 페이지는 변호사를 차단하지 않음
  }

  // 로딩 중인 경우 아무것도 렌더링하지 않음 (깜빡거림 방지)
  if (isLoading) {
    return null
  }

  // 일반 유저만 접근 가능한 페이지 (변호사 접근 불가)
  if (requireUserOnly && isLawyer) {
    console.log('❌ 변호사는 일반 유저 전용 페이지에 접근할 수 없습니다!')
    return <Navigate to={ROUTER.LAWYER_ADMIN} replace />
  }

  // 변호사 권한이 필요한 페이지인데 변호사가 아닌 경우 (일반 유저는 변호사 어드민 접근 불가)
  if (requireLawyer && !isLawyer) {
    console.log('❌ 일반 유저는 변호사 어드민 페이지에 접근할 수 없습니다!')
    return <Navigate to={ROUTER.MAIN} replace />
  }

  console.log('✅ 접근 허용!')
  return <>{children}</>
}
