import { z } from 'zod'

export const accountEditSchema = z
  .object({
    // 현재 비밀번호
    currentPassword: z.string().optional(),

    // 새 비밀번호
    newPassword: z
      .string()
      .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, {
        message: '8자~16자 영문 소문자, 숫자, 특수문자만 가능합니다.',
      })
      .optional()
      .or(z.literal('')),
    confirmNewPassword: z.string().optional().or(z.literal('')),

    // 휴대폰 인증
    phoneNumber: z
      .string()
      .regex(/^010[0-9]{8}$/, { message: '올바른 휴대폰 번호 11자리를 입력해주세요.' })
      .optional()
      .or(z.literal('')),
    verificationCode: z
      .string()
      .length(6, { message: '인증번호는 6자리여야 합니다.' })
      .optional()
      .or(z.literal('')),

    // 이메일
    email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }).optional().or(z.literal('')),

    // 변호사 휴대폰 인증
    lawyerPhone: z
      .string()
      .regex(/^010[0-9]{8}$/, { message: '올바른 휴대폰 번호 11자리를 입력해주세요.' })
      .optional()
      .or(z.literal('')),
    lawyerVerificationCode: z
      .string()
      .length(6, { message: '인증번호는 6자리여야 합니다.' })
      .optional()
      .or(z.literal('')),

    // 변호사 인증정보
    lawyerFirm: z.string().optional(),
    lawyerFirmContact: z.string().optional(),
    lawyerBarExamType: z.string().optional(),
    lawyerBarExamNumber: z.string().optional(),
  })
  .superRefine(({ confirmNewPassword, newPassword, currentPassword }, ctx) => {
    // 비밀번호 변경 시 검증
    if (newPassword || confirmNewPassword || currentPassword) {
      if (!currentPassword) {
        ctx.addIssue({
          code: 'custom',
          message: '현재 비밀번호를 입력해주세요.',
          path: ['currentPassword'],
        })
      }
      if (!newPassword) {
        ctx.addIssue({
          code: 'custom',
          message: '새 비밀번호를 입력해주세요.',
          path: ['newPassword'],
        })
      }
      if (!confirmNewPassword) {
        ctx.addIssue({
          code: 'custom',
          message: '새 비밀번호 확인을 입력해주세요.',
          path: ['confirmNewPassword'],
        })
      }
      if (newPassword && confirmNewPassword && newPassword !== confirmNewPassword) {
        ctx.addIssue({
          code: 'custom',
          message: '비밀번호가 일치하지 않습니다.',
          path: ['confirmNewPassword'],
        })
      }
    }
  })

// 스키마로부터 TypeScript 타입을 자동으로 생성
export type AccountEditFormData = z.infer<typeof accountEditSchema>
