import instance from '@/lib/axios'
import { ApiResponse } from '@/types/axios'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const blogService = {
  // 모든 카테고리 가져오기
  getBlogCount: async (subcategoryId: number | 'all', recentDays: number): Promise<number> => {
    try {
      // 실제 API 호출
      const response = await instance.get<ApiResponse<number>>(`/blog-case/${subcategoryId}/${recentDays}/count`)
      console.log(response)
      return response.data.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
