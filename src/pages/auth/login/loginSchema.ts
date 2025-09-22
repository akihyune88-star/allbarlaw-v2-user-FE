import { z } from 'zod'

export const loginSchema = z.object({
  id: z
    .string()
    .min(1, { message: '아이디를 입력해주세요.' })
    .regex(/^[a-zA-Z0-9_-]*$/, { message: '아이디는 영문, 숫자, 특수문자(-, _)만 입력 가능합니다.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
  rememberMe: z.boolean(),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const defaultValues: LoginFormData = {
  id: '',
  password: '',
  rememberMe: false,
}
