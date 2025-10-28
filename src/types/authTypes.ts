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
  accessToken: string
  isFirstLogin?: boolean
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

export type UserProfileResponse = {
  userAccount: string
  userPhone: string
  userEmail: string
}

export type UserProfileUpdateRequest = {
  currentPassword?: string
  newPassword?: string
  newPasswordConfirm?: string
  newPhone?: string
  verificationToken?: string
  newEmail?: string
}

export type UserProfileUpdateResponse = {
  updatedFields: string[]
}

export type LawyerProfileResponse = {
  lawyerAccount: string
  lawyerEmail: string
  lawyerContact: string
  lawyerLawfirmName: string
  lawyerLawfirmContact: string
  lawyerBarExamNumber: number
}

export type LawyerProfileUpdateRequest = {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
  newEmail: string
  newContact: string
  verificationToken: string
  newLawfirmName: string
  newLawfirmContact: string
  newBarExamNumber: number
}

export type LawyerProfileUpdateResponse = {
  updatedFields: string[]
}

export type WithdrawRequest = {
  reason: string
}

export type WithdrawResponse = {
  withdrawalRequestId: number
  withdrawalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  withdrawalRequestedAt: string
}
