import { authService } from '@/services/authService'
import { useMutation } from '@tanstack/react-query'

type UseSendVerificationCodeOptions = {
  onSuccess?: (data: unknown) => void
}

// 휴대폰 인증번호 발송 뮤테이션 훅
export const useSendVerificationCode = (options?: UseSendVerificationCodeOptions) => {
  return useMutation({
    mutationFn: (phone: string) => authService.sendVerificationCode(phone),
    onSuccess: data => {
      console.log('인증번호 발송 성공:', data)
      options?.onSuccess?.(data)
    },
    onError: (error, variables) => {
      console.error(`인증번호 발송 실패: ${variables}`, error)
    },
  })
}
