import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { videoService } from '@/services/videoService'
import { VideoDetailRequest } from '@/types/videoTypes'

export const useGetVideoDetail = (request: VideoDetailRequest) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: [QUERY_KEY.BLOG_DETAIL, request.videoCaseId],
    queryFn: () => videoService.getVideoDetail(request),
    enabled: request.videoCaseId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })

  return {
    data,
    isError,
    isLoading,
  }
}
