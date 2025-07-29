import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTER } from '@/routes/routerConstant'

interface ProtectedRouteProps {
  children: ReactNode
  requireLawyer?: boolean
  redirectTo?: string
}

export const ProtectedRoute = ({ children, requireLawyer = false, redirectTo = ROUTER.AUTH }: ProtectedRouteProps) => {
  const { isLoggedIn, isLawyer, userInfo, isLoading } = useAuth()

  console.log('ProtectedRoute Debug:', {
    isLoggedIn,
    isLawyer,
    userInfo,
    requireLawyer,
    isLoading,
  })

  // 로딩 중인 경우 아무것도 렌더링하지 않음
  if (isLoading) {
    console.log('Still loading, waiting...')
    return null
  }

  // 로그인하지 않은 경우
  if (!isLoggedIn) {
    console.log('Not logged in, redirecting to:', redirectTo)
    return <Navigate to={redirectTo} replace />
  }

  // 변호사 권한이 필요한 페이지인데 변호사가 아닌 경우
  if (requireLawyer && !isLawyer) {
    console.log('Not a lawyer, redirecting to main')
    return <Navigate to={ROUTER.MAIN} replace />
  }

  console.log('Access granted')
  return <>{children}</>
}
