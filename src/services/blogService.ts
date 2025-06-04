import instance from '@/lib/axios'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const blogService = {
  // 모든 카테고리 가져오기
  getBlogCount: async (subcategoryId: number, recentDays: number | 'all'): Promise<number> => {
    try {
      // 실제 API 호출
      const response = await instance.get<number>(`/blog-case/${subcategoryId}/${recentDays}/count`)

      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
