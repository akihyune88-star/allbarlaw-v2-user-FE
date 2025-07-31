import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'
import { CheckResponse } from '@/types/authTypes'

interface UseIdCheckOptions {
  onSuccess?: (_data: CheckResponse) => void
  onError?: (_message: string) => void
}

export const useIdCheck = (options?: UseIdCheckOptions) => {
  return useMutation<CheckResponse, Error, { userAccount: string }>({
    mutationFn: async ({ userAccount }) => {
      const response = await authService.checkId(userAccount)
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
