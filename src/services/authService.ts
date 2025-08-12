import instance from '@/lib/axios'
import { LoginRequest, SignUpRequest, SocialLoginRequest, VerifyVerificationCodeRequest } from '@/types/authTypes'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const authService = {
  checkId: async (userAccount: string) => {
    try {
      const response = await instance.post('/user/check-account', { userAccount })
      return response.data
    } catch (error) {
      console.error('Failed to check id:', error)
      throw error
    }
  },
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
  checkEmail: async (userEmail: string) => {
    try {
      const response = await instance.post('/user/check-email', { userEmail })
      return response.data
    } catch (error) {
      console.error('Failed to check email:', error)
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
      console.log('🚀 서버에 소셜 로그인 요청:', inputValue)
      const response = await instance.post('/user/social-auth', inputValue)
      console.log('✅ 서버 응답:', response.data)
      return response.data
    } catch (error) {
      console.error('❌ 소셜 로그인 실패:', error)
      throw error
    }
  },
  lawyerLogin: async (inputValue: LoginRequest) => {
    try {
      const response = await instance.post('/lawyer/login', {
        lawyerAccount: inputValue.userAccount,
        lawyerPassword: inputValue.userPassword,
      })
      return response.data
    } catch (error) {
      console.error('Failed to lawyer login:', error)
      throw error
    }
  },
}
