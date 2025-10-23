import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import {
  LawyerProfileUpdateRequest,
  LawyerProfileUpdateResponse,
  UserProfileUpdateRequest,
  UserProfileUpdateResponse,
} from '@/types/authTypes'
import { QUERY_KEY } from '@/constants/queryKey'
import { getErrorMessage } from '@/utils/errorHandler'
import { isAxiosError } from 'axios'

export const useUserFindId = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: { userAccount: string }) => void
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
  onSuccess: (_data: { message: string }) => void
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
  onSuccess: (_data: { lawyerAccount: string }) => void
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
  onSuccess: (_data: { message: string }) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: authService.lawyerResetPassword,
    onSuccess,
    onError,
  })
}

export const useGetUserProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEY.USER_PROFILE],
    queryFn: authService.userProfile,
  })
}

export const useUpdateUserProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: UserProfileUpdateResponse) => void
  onError: (_message: string) => void
}) => {
  return useMutation({
    mutationFn: async (inputValue: UserProfileUpdateRequest) => {
      const response = await authService.updateUserProfile(inputValue)
      return response
    },
    onSuccess: (data: UserProfileUpdateResponse) => {
      onSuccess?.(data)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        onError?.(errorMessage)
      }
    },
  })
}

export const usePasswordCheck = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: { isValid: boolean }) => void
  onError: (_message: string) => void
}) => {
  return useMutation<{ isValid: boolean }, Error, { password: string }>({
    mutationFn: async ({ password }) => {
      const response = await authService.passwordCheck(password)
      return response
    },
    onSuccess: (data, _variables) => {
      onSuccess?.(data)
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        onError?.(errorMessage)
      }
    },
  })
}

export const useGetLawyerProfile = () => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_PROFILE],
    queryFn: () => authService.lawyerProfile(),
  })
}

export const useUpdateLawyerProfile = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: LawyerProfileUpdateResponse) => void
  onError: (_message: string) => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (inputValue: LawyerProfileUpdateRequest) => {
      const response = await authService.updateLawyerProfile(inputValue)
      return response
    },
    onSuccess: (data: LawyerProfileUpdateResponse) => {
      onSuccess?.(data)
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.LAWYER_PROFILE] })
    },
    onError: error => {
      if (isAxiosError(error)) {
        const errorMessage = getErrorMessage(error.response?.data.code)
        onError?.(errorMessage)
      }
    },
  })
}

// export const useGetLawyerAccount = () => {
//   return useQuery({
//     queryKey: [QUERY_KEY.LAWYER_ACCOUNT],
//     queryFn: () => lawyerService.getLawyerAccount(),
//   })
// }
