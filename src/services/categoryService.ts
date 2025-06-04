import { CategoryList } from '@/types/categoryTypes'
import { mockupCategoryList } from '@/constants/category'
import instance from '@/lib/axios'

// API 응답 타입 정의 (실제 API 사용 시 활성화)
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

// 현재는 목업 데이터를 사용하지만, 실제 API로 교체 가능
export const categoryService = {
  // 모든 카테고리 가져오기
  getCategories: async (): Promise<CategoryList> => {
    try {
      // 실제 API 호출
      const response = await instance.get<ApiResponse<CategoryList>>('/category')
      console.log(response)
      // return response.data.data

      // 현재는 목업 데이터 반환 (API 호출 시뮬레이션을 위한 딜레이)
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockupCategoryList
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      throw error
    }
  },

  // 특정 카테고리 가져오기
  getCategoryById: async (id: number) => {
    try {
      // 실제 API 호출
      // const response = await apiClient.get<ApiResponse<CategoryList[0]>>(`/categories/${id}`)
      // return response.data.data

      await new Promise(resolve => setTimeout(resolve, 500))
      const category = mockupCategoryList.find(cat => cat.id === id)
      if (!category) throw new Error('Category not found')
      return category
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error)
      throw error
    }
  },
}
