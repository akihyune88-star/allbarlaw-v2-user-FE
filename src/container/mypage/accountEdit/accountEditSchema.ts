import { z } from 'zod'

export const accountEditSchema = z
  .object({
    // 현재 비밀번호
    currentPassword: z.string().min(1, { message: '현재 비밀번호를 입력해주세요.' }),

    // 새 비밀번호
    newPassword: z
      .string()
      .min(1, { message: '필수 정보입니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, {
        message: '8자~16자 영문 소문자, 숫자, 특수문자만 가능합니다.',
      }),
    confirmNewPassword: z.string().min(1, { message: '필수 정보입니다.' }),

    // 휴대폰 인증
    phoneNumber: z
      .string()
      .min(1, { message: '전화번호를 입력해주세요.' })
      .regex(/^010[0-9]{8}$/, { message: '올바른 휴대폰 번호 11자리를 입력해주세요.' }),
    verificationCode: z.string().length(6, { message: '인증번호는 6자리여야 합니다.' }),

    // 이메일
    email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }),
  })
  .superRefine(({ confirmNewPassword, newPassword }, ctx) => {
    if (confirmNewPassword !== newPassword) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmNewPassword'],
      })
    }
  })

// 스키마로부터 TypeScript 타입을 자동으로 생성
export type AccountEditFormData = z.infer<typeof accountEditSchema>
