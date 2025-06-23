import { useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { LawfirmListRequest } from '@/types/lawfirmType'
import { lawfirmService } from '@/services/lawfirmService'

// 무한 스크롤용 훅
export const useInfiniteLawfirmList = (request: Omit<LawfirmListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.LAWFIRM_LIST, 'infinite', request.subcategoryId, request.orderBy, request.recentDays],
    queryFn: ({ pageParam }) =>
      lawfirmService.getLawfirmList({
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
    placeholderData: previousData => previousData,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  const lawfirmList = data?.pages.flatMap(page => page.data) ?? []

  return {
    lawfirmList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
