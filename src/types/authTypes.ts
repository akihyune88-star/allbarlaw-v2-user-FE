export type VerifyVerificationCodeRequest = {
  phone: string
  certNumber: string
}

export type VerifyVerificationCodeResponse = {
  isValid: boolean
  message: string
  verificationToken: string
}

export type SignUpRequest = {
  account: string
  password: string
  passwordRepeat: string
  email: string
  phone: string
  verificationToken: string
}

export type SignUpResponse = {
  userId: number
  userAccount: string
  userEmail: string
  message: string
}

export type LoginRequest = {
  userAccount: string
  userPassword: string
  rememberMe: boolean
}

export type LoginResponse = {
  userAccessToken: string
  userType: 'user' | 'lawyer' // 사용자 타입 추가
  userId: number
  lawyerId?: number
  lawyerName?: string
  lawFirmName?: string
}

export type LawyerLoginRequest = {
  lawyerAccount: string
  lawyerPassword: string
  rememberMe: boolean
}

export type LawyerLoginResponse = {
  lawyerAccessToken: string
  lawyerId: number
  lawyerName: string
  lawFirmName?: string
}

export type SocialLoginRequest = {
  userProvider: string
  userAccessToken: string
}

export type CheckResponse = {
  isAvailable: true
  isValid: true
}

// 사용자 정보 타입
export type UserInfo = {
  userId: number
  userAccount: string
  userEmail: string
  userType: 'user' | 'lawyer'
  lawyerId?: number
  lawyerName?: string
  lawFirmName?: string
}
