import { QUERY_KEY } from '@/constants/queryKey'
import { noticeService } from '@/services/noticeService'
import { NoticeListRequest } from '@/types/noticeTypes'
import { useInfiniteQuery } from '@tanstack/react-query'

export const useInfiniteNoticeList = (request: NoticeListRequest) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.NOTICE_LIST, 'infinite', request.cursor, request.cursorId],
    queryFn: ({ pageParam }) =>
      noticeService.getNoticeList({
        ...request,
        cursor: pageParam?.cursor,
        cursorId: pageParam?.cursorId,
      }),
    // enabled: request.subcategoryId !== undefined,
    initialPageParam: undefined as { cursor?: number; cursorId?: number } | undefined,
    getNextPageParam: lastPage => {
      if (!lastPage.hasNextPage) return undefined
      return {
        cursor: lastPage.nextCursor,
        cursorId: lastPage.nextCursorId,
      }
    },
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const noticeList = data?.pages.flatMap(page => page.data) ?? []

  return {
    noticeList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
