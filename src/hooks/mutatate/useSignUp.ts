import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { SignUpRequest } from '@/types/authTypes'

export const useSignUp = () => {
  return useMutation({
    mutationFn: (inputValue: SignUpRequest) => authService.signUp(inputValue),
    onSuccess: (_, variables) => {
      console.log(`회원가입 성공: ID ${variables}`)
    },
    onError: error => {
      throw error
    },
  })
}
