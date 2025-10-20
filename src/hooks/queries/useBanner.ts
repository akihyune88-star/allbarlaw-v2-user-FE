import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/constants/queryKey'
import { bannerService } from '@/services/banner'
import { Banner, MainBanner, SubBanner } from '@/types/banner'

export const useMainBanner = () => {
  return useQuery({
    queryKey: [QUERY_KEY.MAIN_BANNER],
    queryFn: bannerService.getMainBanners,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (response): Banner[] => {
      if (!response || !Array.isArray(response)) return []
      return (response as MainBanner[]).map(banner => ({
        bannerId: banner.mainBannerId,
        bannerImageUrl: banner.mainBannerImageUrl,
        bannerMobileImageUrl: banner.mainBannerMobileImageUrl,
        bannerStartedAt: banner.mainBannerStartedAt,
        bannerFinishedAt: banner.mainBannerFinishedAt,
        bannerLink: banner.mainBannerLink,
      }))
    },
    placeholderData: previousData => previousData,
  })
}

export const useSubBanner = (subcategoryId: number) => {
  return useQuery({
    queryKey: [QUERY_KEY.SUB_BANNER, subcategoryId],
    queryFn: () => bannerService.getSubBanners(subcategoryId),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
    select: (response): Banner[] => {
      if (!response || !Array.isArray(response)) return []
      return (response as SubBanner[]).map(banner => ({
        bannerId: banner.subMainBannerId,
        bannerImageUrl: banner.subMainBannerImageUrl,
        bannerMobileImageUrl: banner.subMainBannerMobileImageUrl,
        bannerStartedAt: banner.subMainBannerStartedAt,
        bannerFinishedAt: banner.subMainBannerFinishedAt,
        bannerLink: banner.subMainBannerLink,
      }))
    },
    placeholderData: previousData => previousData,
    enabled: subcategoryId !== 0,
  })
}
