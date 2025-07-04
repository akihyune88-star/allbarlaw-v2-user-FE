import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginRequest, LoginResponse } from '@/types/authTypes'
import { LOCAL } from '@/constants/local'
import { isAxiosError } from 'axios'

interface UseLoginOptions {
  onSuccess?: () => void
}

export const useLogin = (options?: UseLoginOptions) => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (inputValue: LoginRequest) => {
      console.log('로그인 요청:', inputValue)
      const response = await authService.login(inputValue)
      console.log('로그인 응답:', response)
      return response
    },
    onSuccess: (data, variables) => {
      const storage = variables.rememberMe ? localStorage : sessionStorage
      storage.setItem(LOCAL.TOKEN, data.userAccessToken)
      options?.onSuccess?.()
    },
    onError: error => {
      if (isAxiosError(error)) {
        console.error('로그인 실패:', error.response?.data || error.message)
      } else {
        console.error('로그인 실패:', error)
      }
      throw error
    },
  })
}
