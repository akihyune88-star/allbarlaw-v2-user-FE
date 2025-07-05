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
}

export type SocialLoginRequest = {
  userProvider: string
  userAccessToken: string
}

export type CheckResponse = {
  isAvailable: true
  isValid: true
}
