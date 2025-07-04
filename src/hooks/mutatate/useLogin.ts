import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginRequest, LoginResponse } from '@/types/authTypes'
import { LOCAL } from '@/constants/local'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'

interface UseLoginOptions {
  onSuccess?: () => void
  onError?: (message: string) => void
}

export const useLogin = (options?: UseLoginOptions) => {
  const { checkLoginStatus } = useAuth()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (inputValue: LoginRequest) => {
      const response = await authService.login(inputValue)
      return response
    },
    onSuccess: (data, variables) => {
      const storage = variables.rememberMe ? localStorage : sessionStorage
      storage.setItem(LOCAL.TOKEN, data.userAccessToken)

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
