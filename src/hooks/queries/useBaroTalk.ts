import { useMutation, useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { baroTalkServices } from '@/services/baroTalkServices'
import { useAuth } from '@/contexts/AuthContext'
import { CreateBaroTalkRequest } from '@/types/baroTalkTypes'
import { BaroTalkLawyerListRequest } from '@/types/baroTalkTypes'

interface UseCreateBaroTalkOptions {
  onSuccess?: () => void
  onError?: (error: Error) => void
}

export const useCreateBaroTalk = (options?: UseCreateBaroTalkOptions) => {
  const { getUserIdFromToken } = useAuth()
  const userId = getUserIdFromToken()
  console.log('userId', userId)

  return useMutation({
    mutationFn: (request: CreateBaroTalkRequest) => baroTalkServices.createBaroTalk(userId!, request),
    onSuccess: () => {
      options?.onSuccess?.()
    },
    onError: (error: Error) => {
      options?.onError?.(error)
    },
  })
}

export const useGetBaroTalkLawyerList = (request: BaroTalkLawyerListRequest) => {
  return useInfiniteQuery({
    queryKey: ['baroTalkLawyerList', request],
    queryFn: ({ pageParam = 1 }) =>
      baroTalkServices.getBaroTalkLawyerList({
        ...request,
        take: 10, // 한 번에 10개씩 로드
        page: pageParam,
      }),
    getNextPageParam: (lastPage, allPages) => {
      // 마지막 페이지에 변호사가 10명 미만이면 더 이상 페이지가 없음
      if (lastPage.lawyers.length < 10) {
        return undefined
      }
      return allPages.length + 1
    },
    initialPageParam: 1,
  })
}
