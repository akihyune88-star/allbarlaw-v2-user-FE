import { z } from 'zod'

export const lawyerSignupSchema = z
  .object({
    // 로그인 계정
    id: z
      .string()
      .min(1, { message: '아이디는 필수입력 입니다.' })
      .regex(/^[a-zA-Z]/, {
        message: '아이디는 영문으로 시작해야 합니다.',
      })
      .min(5, { message: '아이디는 5자 이상 입력해주세요.' })
      .regex(/^[a-zA-Z][a-zA-Z0-9]*$/, {
        message: '아이디는 영문과 숫자만 입력 가능합니다.',
      }),
    password: z
      .string()
      .min(1, { message: '필수 정보입니다.' })
      .regex(/^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/, {
        message: '8자~16자 영문 소문자, 숫자, 특수문자만 가능합니다.',
      }),
    confirmPassword: z.string().min(1, { message: '필수 정보입니다.' }),

    // 변호사 인증
    lawyerName: z
      .string()
      .min(1, { message: '이름은 한글만 입력 가능합니다.' })
      .regex(/^[가-힣\s]+$/, {
        message: '이름은 한글만 입력 가능합니다.',
      }),
    lawyerContact: z.string().min(1, { message: '연락처는 숫자만 입력 가능합니다.' }),
    lawyerFirm: z.string().min(1, { message: '소속(법인,회사)을 입력해주세요.' }),
    lawyerBarExamType: z.string().min(1, { message: '출신시험 유형을 선택해주세요.' }),
    lawyerBarExamNumber: z.string().min(1, { message: '출신시험 기수를 선택해주세요.' }),

    // 이메일
    email: z
      .string()
      .min(1, { message: '이메일은 영문으로 등록 가능합니다.' })
      .email({ message: '이메일 형식에 맞지 않습니다.' }),

    // 약관동의
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

export type LawyerSignupFormData = z.infer<typeof lawyerSignupSchema>
