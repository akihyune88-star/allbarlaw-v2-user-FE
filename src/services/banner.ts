import instance from '@/lib/axios'
import { BannerResponse } from '@/types/banner'

export const bannerService = {
  // 모든 카테고리 가져오기
  getBanners: async (): Promise<BannerResponse> => {
    try {
      const response = await instance.get<BannerResponse>('/banner')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
