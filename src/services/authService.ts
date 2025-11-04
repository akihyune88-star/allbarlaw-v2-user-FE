import instance from '@/lib/axios'
import {
  LawyerProfileResponse,
  LawyerProfileUpdateRequest,
  LawyerProfileUpdateResponse,
  LoginRequest,
  SignUpRequest,
  SocialLoginRequest,
  UserProfileResponse,
  UserProfileUpdateRequest,
  UserProfileUpdateResponse,
  VerifyVerificationCodeRequest,
  WithdrawRequest,
  WithdrawResponse,
} from '@/types/authTypes'

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
  sendVerificationCode: async (phone: string, purpose?: 'recovery' | 'signup' | 'profile_update') => {
    try {
      const response = await instance.post('/user/send-verification', { phone, purpose })
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
  userFindId: async (inputValue: { phone: string; certNumber: string }) => {
    try {
      const response = await instance.post<{ userAccount: string }>('/user/find-account', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to find id:', error)
      throw error
    }
  },
  userResetPassword: async (inputValue: { account: string; phone: string; certNumber: string }) => {
    try {
      const response = await instance.post<{ message: string }>('/user/reset-password', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to find password:', error)
      throw error
    }
  },

  lawyerFindId: async (inputValue: { lawyerEmail: string; lawyerName: string; lawyerContact: string }) => {
    try {
      const response = await instance.post<{ lawyerAccount: string }>('/lawyer/find-account', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to find id:', error)
      throw error
    }
  },
  lawyerResetPassword: async (inputValue: {
    lawyerAccount: string
    lawyerEmail: string
    lawyerName: string
    lawyerContact: string
  }) => {
    try {
      const response = await instance.post<{ message: string }>('/lawyer/reset-password', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to find password:', error)
      throw error
    }
  },
  userProfile: async () => {
    try {
      const response = await instance.get<UserProfileResponse>('/user/profile')
      return response.data
    } catch (error) {
      console.error('Failed to get user profile:', error)
      throw error
    }
  },
  updateUserProfile: async (inputValue: UserProfileUpdateRequest) => {
    try {
      const response = await instance.put<UserProfileUpdateResponse>('/user/profile', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  },
  passwordCheck: async (password: string) => {
    try {
      const response = await instance.post<{ isValid: boolean }>('/user/check-password', { password })
      return response.data
    } catch (error) {
      console.error('Failed to check password:', error)
      throw error
    }
  },
  lawyerPasswordCheck: async (password: string) => {
    try {
      const response = await instance.post<{ isValid: boolean }>('/lawyer/check-password', { password })
      return response.data
    } catch (error) {
      console.error('Failed to check lawyer password:', error)
      throw error
    }
  },
  lawyerProfile: async () => {
    try {
      const response = await instance.get<LawyerProfileResponse>('/lawyer/profile')
      return response.data
    } catch (error) {
      console.error('Failed to get lawyer profile:', error)
      throw error
    }
  },
  updateLawyerProfile: async (inputValue: LawyerProfileUpdateRequest) => {
    try {
      const response = await instance.put<LawyerProfileUpdateResponse>('/lawyer/profile', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to update user profile:', error)
      throw error
    }
  },
  withdrawUser: async (inputValue: WithdrawRequest) => {
    try {
      const response = await instance.post<WithdrawResponse>('/user/withdrawal', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to withdraw user:', error)
      throw error
    }
  },
  withdrawLawyer: async (inputValue: WithdrawRequest) => {
    try {
      const response = await instance.post<WithdrawResponse>('/lawyer/withdrawal', inputValue)
      return response.data
    } catch (error) {
      console.error('Failed to withdraw lawyer:', error)
      throw error
    }
  },
}
