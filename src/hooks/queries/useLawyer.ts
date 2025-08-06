import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { lawyerService } from '@/services/lawyerService'
import { LawyerListRequest } from '@/types/lawyerTypes'

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
