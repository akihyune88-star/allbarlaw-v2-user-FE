import instance from '@/lib/axios'
import { BannerResponse } from '@/types/banner'

export const bannerService = {
  // 모든 카테고리 가져오기
  getMainBanners: async (): Promise<BannerResponse> => {
    try {
      const response = await instance.get<BannerResponse>('/banner/main')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
  getSubBanners: async (subcategoryId: number): Promise<BannerResponse> => {
    try {
      const response = await instance.get<BannerResponse>(`/banner/sub-main/${subcategoryId}`)
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
