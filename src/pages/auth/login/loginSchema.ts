import { z } from 'zod'

export const loginSchema = z.object({
  id: z.string().min(1, { message: '아이디를 입력해주세요.' }),
  password: z.string().min(1, { message: '비밀번호를 입력해주세요.' }),
  rememberMe: z.boolean(),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const defaultValues: LoginFormData = {
  id: '',
  password: '',
  rememberMe: false,
}
