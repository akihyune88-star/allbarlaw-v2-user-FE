import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { VideoListRequest } from '@/types/videoTypes'
import { videoService } from '@/services/videoService'

export const useGetVideoList = (request: VideoListRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.VIDEO_LIST, request.subcategoryId, request.cursorId, request.orderBy],
    queryFn: () => videoService.getVideoList(request),
    enabled: request.subcategoryId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    videoList: data?.data ?? [],
    isLoading,
    isError,
    hasNextPage: data?.hasNextPage ?? false,
    nextCursor: data?.nextCursor,
    nextCursorId: data?.nextCursorId,
  }
}

// 무한 스크롤용 훅
export const useInfiniteVideoList = (request: Omit<VideoListRequest, 'cursor' | 'cursorId'>) => {
  const { data, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: [QUERY_KEY.VIDEO_LIST, 'infinite', request.subcategoryId, request.orderBy],
    queryFn: ({ pageParam }) =>
      videoService.getVideoList({
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
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  // 모든 페이지의 데이터를 하나의 배열로 합치기
  const videoList = data?.pages.flatMap(page => page.data) ?? []

  return {
    videoList,
    isLoading,
    isError,
    hasNextPage: hasNextPage ?? false,
    fetchNextPage,
    isFetchingNextPage,
  }
}
