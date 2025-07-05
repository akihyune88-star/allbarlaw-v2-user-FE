import instance from '@/lib/axios'
import { LoginRequest, SignUpRequest, SocialLoginRequest, VerifyVerificationCodeRequest } from '@/types/authTypes'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const authService = {
  sendVerificationCode: async (phone: string) => {
    try {
      const response = await instance.post('/user/send-verification', { phone })
      return response.data
    } catch (error) {
      console.error('Failed to send verification code:', error)
      throw error
    }
  },
  verifyVerificationCode: async (inputValue: VerifyVerificationCodeRequest) => {
    try {
      const response = await instance.post('/user/verify-phone', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to verify verification code:', error)
      throw error
    }
  },
  signUp: async (inputValue: SignUpRequest) => {
    try {
      const response = await instance.post('/user/signup', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to sign up:', error)
      throw error
    }
  },
  login: async (inputValue: LoginRequest) => {
    try {
      const response = await instance.post('/user/login', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to login:', error)
      throw error
    }
  },
  socialLogin: async (inputValue: SocialLoginRequest) => {
    try {
      const response = await instance.post('/user/social-auth', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to social login:', error)
      throw error
    }
  },
}
