import { CategoryList } from '@/types/categoryTypes'
import instance from '@/lib/axios'

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const categoryService = {
  // 모든 카테고리 가져오기
  getCategories: async (): Promise<CategoryList> => {
    try {
      // 실제 API 호출
      const response = await instance.get<CategoryList>('/category')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
