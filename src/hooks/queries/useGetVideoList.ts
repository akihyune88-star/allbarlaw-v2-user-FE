import { useQuery, useInfiniteQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { VideoKeepResponse, VideoListRequest } from '@/types/videoTypes'
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
    queryKey: [
      QUERY_KEY.VIDEO_LIST,
      'infinite',
      request.subcategoryId,
      request.orderBy,
      request.search,
      request.lawyerId,
    ],
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

export const useVideoKeep = ({
  onSuccess,
  onError,
}: {
  onSuccess: (_data: VideoKeepResponse) => void
  onError: () => void
}) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (videoCaseId: number) => videoService.changeVideoKeep(videoCaseId),
    onSuccess: (data: VideoKeepResponse, videoCaseId: number) => {
      // 무한 스크롤 쿼리 캐시 업데이트
      queryClient.setQueriesData({ queryKey: [QUERY_KEY.VIDEO_LIST, 'infinite'] }, (oldData: any) => {
        if (!oldData || !oldData.pages) return oldData
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            data:
              page.data?.map((video: any) =>
                video.videoCaseId === videoCaseId ? { ...video, isKeep: data.isKeep } : video
              ) || [],
          })),
        }
      })

      // 일반 리스트 쿼리 캐시 업데이트
      queryClient.setQueriesData({ queryKey: [QUERY_KEY.VIDEO_LIST] }, (oldData: any) => {
        if (!oldData || !oldData.data) return oldData
        return {
          ...oldData,
          data: oldData.data.map((video: any) =>
            video.videoCaseId === videoCaseId ? { ...video, isKeep: data.isKeep } : video
          ),
        }
      })

      onSuccess(data)
    },
    onError: () => {
      console.error('Failed to change video keep')
      onError?.()
    },
  })
}
