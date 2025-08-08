import { useQuery, useInfiniteQuery, useMutation } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { lawyerService } from '@/services/lawyerService'
import { LawyerKeepResponse, LawyerListRequest, RandomLawyerListRequest } from '@/types/lawyerTypes'

export const useLawyerList = (request: LawyerListRequest) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, ...Object.values(request)],
    queryFn: () => lawyerService.getLawyerList(request),
    enabled: request.subcategoryId !== undefined,
  })
}

export const useInfiniteLawyerList = (request: Omit<LawyerListRequest, 'cursor' | 'cursorId'>) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) =>
      lawyerService.getLawyerList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
    select: data => ({
      pages: data.pages,
      pageParams: data.pageParams,
      lawyerList: data.pages.flatMap(page => page.data),
    }),
  })
}

export const useRandomLawyerList = (request: RandomLawyerListRequest) => {
  const { data, isLoading, isPlaceholderData, refetch } = useQuery({
    queryKey: [QUERY_KEY.LAWYER_LIST, 'random', request.subcategoryId, request.take, request.excludeIds],
    queryFn: () => lawyerService.getRandomLawyerList(request),
    placeholderData: previousData => previousData, // 이전 데이터 유지로 깜빡임 방지
  })

  return {
    lawyerList: data?.data || [],
    isLoading,
    isPlaceholderData,
    hasNextPage: data?.hasNextPage ?? true,
    refetch,
  }
}

export const useLawyerDetail = (lawyerId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.LAWYER_DETAIL, lawyerId],
    queryFn: () => lawyerService.getLawyerDetail(lawyerId),
  })
}

export const useLawyerKeep = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: LawyerKeepResponse) => void
  onError: () => void
}) => {
  return useMutation({
    mutationFn: (lawyerId: number) => lawyerService.changeLawyerKeep(lawyerId),
    onSuccess: (data: LawyerKeepResponse, lawyerId: number) => {
      onSuccess(data)
    },
    onError: () => {
      onError()
    },
  })
}
