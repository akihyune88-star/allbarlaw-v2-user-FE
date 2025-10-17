import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { LoginRequest, LoginResponse, UserInfo } from '@/types/authTypes'
import { LOCAL } from '@/constants/local'
import { useAuth } from '@/contexts/AuthContext'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'

interface UseLoginOptions {
  onSuccess?: (_accessToken: string) => void
  onError?: (_message: string) => void
}

export const useLogin = (options?: UseLoginOptions) => {
  const { checkLoginStatus, setUserInfo } = useAuth()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (inputValue: LoginRequest) => {
      const response = await authService.login(inputValue)
      return response
    },
    onSuccess: (data, _variables) => {
      console.log('userLoginData', data)

      const storage = _variables.rememberMe ? localStorage : sessionStorage
      storage.setItem(LOCAL.TOKEN, data.accessToken)

      // 사용자 정보 저장
      const userInfo: UserInfo = {
        userId: data.userId,
        userAccount: _variables.userAccount,
        userEmail: '', // API에서 이메일 정보를 받아와야 함
        userType: data.userType,
        lawyerId: data.lawyerId,
        lawyerName: data.lawyerName,
        lawFirmName: data.lawFirmName,
      }

      setUserInfo(userInfo)

      // 토큰 저장 후 로그인 상태 체크
      checkLoginStatus()
      options?.onSuccess?.(data.accessToken)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        options?.onError?.(errorMessage)
      }
    },
  })
}

export const useLawyerLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_accessToken: string, _isFirstLogin?: boolean) => void
  onError: (_message: string) => void
}) => {
  const { checkLoginStatus, setUserInfo } = useAuth()

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (inputValue: LoginRequest) => {
      const response = await authService.lawyerLogin(inputValue)
      return response
    },
    onSuccess: (data, _variables) => {
      const storage = _variables.rememberMe ? localStorage : sessionStorage
      storage.setItem(LOCAL.TOKEN, data.accessToken)

      // 사용자 정보 저장
      const userInfo: UserInfo = {
        userId: data.userId,
        userAccount: _variables.userAccount,
        userEmail: '', // API에서 이메일 정보를 받아와야 함
        userType: 'lawyer', // 변호사 로그인이므로 항상 'lawyer'
        lawyerId: data.lawyerId,
        lawyerName: data.lawyerName,
        lawFirmName: data.lawFirmName,
      }

      setUserInfo(userInfo)

      // 토큰 저장 후 로그인 상태 체크
      checkLoginStatus()
      onSuccess?.(data.accessToken, data.isFirstLogin)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        onError?.(errorMessage)
      }
    },
  })
}
