import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { bannerService } from '@/services/banner'

export const useGetBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.BANNER],
    queryFn: bannerService.getBanners,
    // 추가 옵션들
    staleTime: 1000 * 60 * 10, // 10분간 fresh 상태 유지
    gcTime: 1000 * 60 * 30, // 30분간 캐시 보관
  })
}
