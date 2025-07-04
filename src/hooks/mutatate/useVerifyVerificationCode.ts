import { LOCAL } from '@/constants/local'
import { authService } from '@/services/authService'
import { VerifyVerificationCodeRequest } from '@/types/authTypes'
import { useMutation } from '@tanstack/react-query'

// 휴대폰 인증번호 발송 뮤테이션 훅
export const useVerifyVerificationCode = () => {
  return useMutation({
    mutationFn: async (inputValue: VerifyVerificationCodeRequest) => {
      console.log('인증번호 검증 요청:', inputValue)
      const response = await authService.verifyVerificationCode(inputValue)
      console.log('인증번호 검증 응답:', response)
      return response
    },
    onSuccess: data => {
      console.log('인증 성공:', data)
      sessionStorage.setItem(LOCAL.VERIFICATION_TOKEN, data.verificationToken)
    },
    onError: error => {
      console.error('인증 실패:', error)
      throw error
    },
  })
}
