import { useQuery } from '@tanstack/react-query'
import { videoService } from '@/services/videoService'
import { QUERY_KEY } from '@/constants/queryKey'
import { VideoCase, RandomVideoListRequest } from '@/types/videoTypes'

export const useRandomVideoList = ({ subcategoryId, take, excludeIds }: RandomVideoListRequest) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEY.RANDOM_VIDEO_LIST, subcategoryId, take, excludeIds],
    queryFn: () => videoService.getRandomVideoList({ subcategoryId, take, excludeIds }),
    placeholderData: previousData => previousData, // 이전 데이터 유지로 깜빡임 방지
  })

  return {
    videoList: (data?.data || []) as VideoCase[],
    isLoading,
    hasNextPage: data?.hasNextPage ?? true,
    refetch,
  }
}
