import { LOCAL } from '@/constants/local'
import { authService } from '@/services/authService'
import { VerifyVerificationCodeRequest } from '@/types/authTypes'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { getErrorMessage } from '@/utils/errorHandler'

interface UseVerifyVerificationCodeOptions {
  onSuccess?: () => void
  onError?: (_message: string) => void
}

// 휴대폰 인증번호 발송 뮤테이션 훅
export const useVerifyVerificationCode = (options?: UseVerifyVerificationCodeOptions) => {
  return useMutation({
    mutationFn: async (inputValue: VerifyVerificationCodeRequest) => {
      const response = await authService.verifyVerificationCode(inputValue)
      return response
    },
    onSuccess: data => {
      console.log('인증 성공')
      sessionStorage.setItem(LOCAL.VERIFICATION_TOKEN, data.verificationToken)
      options?.onSuccess?.()
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        options?.onError?.(errorMessage)
      }
      throw error
    },
  })
}
