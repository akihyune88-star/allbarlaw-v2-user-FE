import { z } from 'zod'

export const signUpSchema = z
  .object({
    // AccountInfo 섹션
    id: z
      .string()
      .min(1, { message: '아이디는 필수입력 입니다.' })
      .regex(/^[a-zA-Z0-9]+$/, {
        message: '아이디는 영문 대/소문자와 숫자만 입력 가능합니다.',
      }),
    password: z
      .string()
      .min(1, { message: '필수 정보입니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, {
        message: '8자~16자 영문 소문자, 숫자, 특수문자만 가능합니다.',
      }),
    confirmPassword: z.string().min(1, { message: '필수 정보입니다.' }),

    // PhoneVerification 섹션
    phoneNumber: z
      .string()
      .min(1, { message: '전화번호를 입력해주세요.' })
      .regex(/^010[0-9]{8}$/, { message: '올바른 휴대폰 번호 11자리를 입력해주세요.' }),
    verificationCode: z.string().length(6, { message: '인증번호는 6자리여야 합니다.' }),

    // EmailInput 섹션
    email: z.string().email({ message: '이메일 형식에 맞지 않습니다.' }),

    // TermsAgreement 섹션
    agreeToTerms: z.boolean().refine(val => val === true, { message: '서비스 이용약관에 동의해주세요.' }),
    agreeToPrivacy: z.boolean().refine(val => val === true, { message: '개인정보 처리방침에 동의해주세요.' }),
    agreeToMarketing: z.boolean().optional(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: 'custom',
        message: '비밀번호가 일치하지 않습니다.',
        path: ['confirmPassword'],
      })
    }
  })

// 스키마로부터 TypeScript 타입을 자동으로 생성
export type SignUpFormData = z.infer<typeof signUpSchema>
