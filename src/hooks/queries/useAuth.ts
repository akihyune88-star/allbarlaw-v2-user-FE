import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useUserFindId = ({ onSuccess, onError }: { onSuccess: () => void; onError: () => void }) => {
  return useMutation({
    mutationFn: authService.userFindId,
    onSuccess,
    onError,
  })
}
