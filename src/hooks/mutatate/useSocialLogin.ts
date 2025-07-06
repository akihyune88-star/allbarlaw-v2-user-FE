import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginResponse, SocialLoginRequest } from '@/types/authTypes'
import { LOCAL } from '@/constants/local'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'

interface UseSocialLoginOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export const useSocialLogin = (options?: UseSocialLoginOptions) => {
  const { checkLoginStatus } = useAuth()

  return useMutation<LoginResponse, Error, SocialLoginRequest>({
    mutationFn: async (inputValue: SocialLoginRequest) => {
      const response = await authService.socialLogin(inputValue)
      return response
    },
    onSuccess: (data, _variables) => {
      localStorage.setItem(LOCAL.TOKEN, data.userAccessToken)

      // 토큰 저장 후 로그인 상태 체크
      checkLoginStatus()
      options?.onSuccess?.()
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        options?.onError?.(errorMessage)
      }
    },
  })
}
