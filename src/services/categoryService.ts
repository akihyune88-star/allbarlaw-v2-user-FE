import { CategoryList } from '@/types/categoryTypes'
import instance from '@/lib/axios'

export const categoryService = {
  // 모든 카테고리 가져오기
  getCategories: async (): Promise<CategoryList> => {
    try {
      const response = await instance.get<CategoryList>('/category')
      return response.data
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },
}
