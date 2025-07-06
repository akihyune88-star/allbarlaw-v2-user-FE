import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'
import { CheckResponse } from '@/types/authTypes'

interface UseEmailCheckOptions {
  onSuccess?: (data: CheckResponse) => void
  onError?: (message: string) => void
}

export const useEmailCheck = (options?: UseEmailCheckOptions) => {
  return useMutation<CheckResponse, Error, { userEmail: string }>({
    mutationFn: async ({ userEmail }) => {
      const response = await authService.checkEmail(userEmail)
      return response
    },
    onSuccess: (data, _variables) => {
      options?.onSuccess?.(data)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        options?.onError?.(errorMessage)
      }
    },
  })
}
