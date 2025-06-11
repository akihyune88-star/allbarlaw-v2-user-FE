import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { VideoCountRequest } from '@/types/videoTypes'
import { videoService } from '@/services/videoService'

export const useGetVideoCount = (request: VideoCountRequest) => {
  const { subcategoryId, recentDays } = request

  return useQuery({
    queryKey: [QUERY_KEY.BLOG_COUNT, subcategoryId, recentDays],
    queryFn: () => videoService.getVideoCount(subcategoryId!, recentDays),
    enabled: subcategoryId !== undefined,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  })
}
