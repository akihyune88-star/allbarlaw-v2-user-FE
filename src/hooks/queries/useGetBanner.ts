import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { bannerService } from '@/services/banner'

export const useGetBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.BANNER],
    queryFn: bannerService.getBanners,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    placeholderData: previousData => previousData,
  })
}
