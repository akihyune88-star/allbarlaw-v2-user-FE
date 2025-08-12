import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginResponse, SocialLoginRequest } from '@/types/authTypes'
import { LOCAL } from '@/constants/local'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'

interface UseSocialLoginOptions {
  onSuccess?: () => void
  onError?: (_message: string) => void
}

export const useSocialLogin = (options?: UseSocialLoginOptions) => {
  const { setUserInfo } = useAuth()

  return useMutation<LoginResponse, Error, SocialLoginRequest>({
    mutationFn: async (inputValue: SocialLoginRequest) => {
      const response = await authService.socialLogin(inputValue)
      return response
    },
    onSuccess: (data, _variables) => {
      console.log('소셜 로그인 성공:', data)
      console.log('LOCAL.USER_INFO 키:', LOCAL.USER_INFO)

      // 1. 토큰 저장
      localStorage.setItem(LOCAL.TOKEN, data.accessToken)
      console.log('토큰 저장 완료')

      // 2. 사용자 정보 생성 및 저장
      const userInfo = {
        userId: data.userId,
        userAccount: '', // 소셜 로그인은 계정명이 없을 수 있음
        userEmail: '', // 소셜 로그인은 이메일이 없을 수 있음
        userType: data.userType || 'user',
        lawyerId: data.lawyerId,
        lawyerName: data.lawyerName,
        lawFirmName: data.lawFirmName,
      }
      console.log('저장할 userInfo:', userInfo)
      
      localStorage.setItem(LOCAL.USER_INFO, JSON.stringify(userInfo))
      console.log('localStorage 저장 후 확인:', localStorage.getItem(LOCAL.USER_INFO))

      // 3. AuthContext 상태 업데이트
      setUserInfo(userInfo)
      console.log('setUserInfo 호출 완료')

      // 4. 성공 콜백 실행
      setTimeout(() => {
        console.log('onSuccess 콜백 실행')
        options?.onSuccess?.()
      }, 100)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        options?.onError?.(errorMessage)
      }
    },
  })
}
