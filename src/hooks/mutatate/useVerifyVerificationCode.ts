import { LOCAL } from '@/constants/local'
import { authService } from '@/services/authService'
import { VerifyVerificationCodeRequest } from '@/types/authTypes'
import { useMutation } from '@tanstack/react-query'

// 휴대폰 인증번호 발송 뮤테이션 훅
export const useVerifyVerificationCode = () => {
  return useMutation({
    mutationFn: (inputValue: VerifyVerificationCodeRequest) => authService.verifyVerificationCode(inputValue),
    onSuccess: data => {
      sessionStorage.setItem(LOCAL.VERIFICATION_TOKEN, data.verificationToken)
    },
    onError: error => {
      throw error
    },
  })
}
