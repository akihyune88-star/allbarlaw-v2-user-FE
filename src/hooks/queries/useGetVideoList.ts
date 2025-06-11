import { useQuery } from '@tanstack/react-query'
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
