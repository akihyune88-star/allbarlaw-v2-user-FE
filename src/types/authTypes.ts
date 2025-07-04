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
