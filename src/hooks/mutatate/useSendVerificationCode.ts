import { authService } from '@/services/authService'
import { getErrorMessage } from '@/utils/errorHandler'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'

interface UseSendVerificationCodeOptions {
  onSuccess?: () => void
  onError?: (_message: string) => void
}

// 휴대폰 인증번호 발송 뮤테이션 훅
export const useSendVerificationCode = (options?: UseSendVerificationCodeOptions) => {
  return useMutation({
    mutationFn: async ({ phone, purpose }: { phone: string; purpose?: 'recovery' | 'signup' }) => {
      const response = await authService.sendVerificationCode(phone, purpose)
      return response
    },
    onSuccess: () => {
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
