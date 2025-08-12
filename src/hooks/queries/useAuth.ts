import { useMutation } from '@tanstack/react-query'
import { authService } from '@/services/authService'

export const useUserFindId = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { userAccount: string }) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: authService.userFindId,
    onSuccess,
    onError,
  })
}

export const useUserResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { message: string }) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: authService.userResetPassword,
    onSuccess,
    onError,
  })
}

export const useLawyerFindId = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { lawyerAccount: string }) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: authService.lawyerFindId,
    onSuccess,
    onError,
  })
}

export const useLawyerResetPassword = ({
  onSuccess,
  onError,
}: {
  onSuccess: (data: { message: string }) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: authService.lawyerResetPassword,
    onSuccess,
    onError,
  })
}
